import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

const LARGE_AMOUNT       = 5000;
const ROUND_AMOUNTS      = new Set([500, 1000, 2000, 5000, 10000]);
const VELOCITY_1H_MIN    = 3;
const VELOCITY_24H_MIN   = 5;

async function verifyAdmin() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  if ((profile as Record<string, string> | null)?.role !== "admin") return null;
  return user;
}

type TxRow = {
  id: string; account_id: string; user_id: string;
  amount: number; posted_at: string; merchant: string; category: string;
};

type NewAlert = {
  account_id: string; user_id: string;
  transaction_id?: string;
  rule: string; severity: string;
  details: Record<string, unknown>;
  status: string;
};

export async function POST() {
  const admin_user = await verifyAdmin();
  if (!admin_user) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const db = createAdminClient();

  // Pull posted transactions from the last 30 days
  const since = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
  const { data: rawTxs } = await db
    .from("transactions")
    .select("id,account_id,user_id,amount,posted_at,merchant,category")
    .eq("status", "posted")
    .gte("posted_at", since)
    .order("posted_at", { ascending: true });

  const txs: TxRow[] = (rawTxs ?? []) as TxRow[];

  // Pull existing alerts so we can deduplicate
  const { data: existing } = await db
    .from("fraud_alerts")
    .select("transaction_id,rule,account_id,created_at,status");

  const existingList = (existing ?? []) as Array<{
    transaction_id: string | null; rule: string;
    account_id: string; created_at: string; status: string;
  }>;

  // Deduplicate per-transaction rules: any prior alert for same (tx_id, rule) → skip
  const txRuleSeen = new Set(
    existingList
      .filter(a => a.transaction_id)
      .map(a => `${a.transaction_id}:${a.rule}`)
  );

  // Deduplicate velocity rules: open alert for (account_id, rule) created in last 24h → skip
  const h24ago = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
  const acctVelocitySeen = new Set(
    existingList
      .filter(a => !a.transaction_id && a.status === "open" && a.created_at >= h24ago)
      .map(a => `${a.account_id}:${a.rule}`)
  );

  const newAlerts: NewAlert[] = [];

  /* ── Per-transaction rules ── */
  for (const tx of txs) {
    const abs = Math.abs(tx.amount);

    if (abs >= LARGE_AMOUNT && !txRuleSeen.has(`${tx.id}:large_transaction`)) {
      newAlerts.push({
        account_id: tx.account_id, user_id: tx.user_id,
        transaction_id: tx.id,
        rule: "large_transaction", severity: "high",
        details: { amount: tx.amount, merchant: tx.merchant, category: tx.category, date: tx.posted_at },
        status: "open",
      });
      txRuleSeen.add(`${tx.id}:large_transaction`);
    }

    if (ROUND_AMOUNTS.has(abs) && !txRuleSeen.has(`${tx.id}:round_amount`)) {
      newAlerts.push({
        account_id: tx.account_id, user_id: tx.user_id,
        transaction_id: tx.id,
        rule: "round_amount", severity: "medium",
        details: { amount: tx.amount, merchant: tx.merchant, category: tx.category, date: tx.posted_at },
        status: "open",
      });
      txRuleSeen.add(`${tx.id}:round_amount`);
    }
  }

  /* ── Velocity rules (group by account) ── */
  const now = Date.now();
  const ms1h  = 60 * 60 * 1000;
  const ms24h = 24 * ms1h;

  const byAccount = new Map<string, TxRow[]>();
  for (const tx of txs) {
    const list = byAccount.get(tx.account_id) ?? [];
    list.push(tx);
    byAccount.set(tx.account_id, list);
  }

  for (const [accountId, acctTxs] of byAccount) {
    const userId = acctTxs[0].user_id;

    const last24h = acctTxs.filter(t => now - new Date(t.posted_at).getTime() < ms24h);
    if (last24h.length >= VELOCITY_24H_MIN && !acctVelocitySeen.has(`${accountId}:velocity_24h`)) {
      newAlerts.push({
        account_id: accountId, user_id: userId,
        rule: "velocity_24h", severity: "medium",
        details: { count: last24h.length, window: "24h", txIds: last24h.map(t => t.id) },
        status: "open",
      });
      acctVelocitySeen.add(`${accountId}:velocity_24h`);
    }

    const last1h = acctTxs.filter(t => now - new Date(t.posted_at).getTime() < ms1h);
    if (last1h.length >= VELOCITY_1H_MIN && !acctVelocitySeen.has(`${accountId}:velocity_1h`)) {
      newAlerts.push({
        account_id: accountId, user_id: userId,
        rule: "velocity_1h", severity: "high",
        details: { count: last1h.length, window: "1h", txIds: last1h.map(t => t.id) },
        status: "open",
      });
      acctVelocitySeen.add(`${accountId}:velocity_1h`);
    }
  }

  let created = 0;
  if (newAlerts.length > 0) {
    const { data, error } = await db.from("fraud_alerts").insert(newAlerts).select("id");
    if (!error) created = data?.length ?? 0;
  }

  // Return the full updated alert list so the client can refresh state without a full reload
  const { data: allAlerts } = await db
    .from("fraud_alerts")
    .select("id,account_id,user_id,transaction_id,rule,severity,details,status,created_at")
    .order("created_at", { ascending: false })
    .limit(300);

  return NextResponse.json({ created, alerts: allAlerts ?? [] });
}
