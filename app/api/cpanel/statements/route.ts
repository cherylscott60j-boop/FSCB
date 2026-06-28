import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { logAction } from "@/lib/audit";

async function verifyAdmin() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  if ((profile as Record<string, string> | null)?.role !== "admin") return null;
  return user;
}

// Shared: fetch statement data for a given account + date range
async function buildStatementData(accountId: string, start: string, end: string) {
  const db = createAdminClient();

  const { data: account } = await db
    .from("accounts")
    .select("id,user_id,account_type,account_name,account_number_last4,balance,credit_limit,interest_rate,opened_at")
    .eq("id", accountId)
    .single();

  if (!account) return null;

  const acct = account as Record<string, unknown>;

  const { data: profile } = await db
    .from("profiles")
    .select("first_name,last_name,email,phone,address_line1,address_line2,city,state,zip")
    .eq("id", acct.user_id as string)
    .single();

  const startISO = new Date(start + "T00:00:00.000Z").toISOString();
  const endISO   = new Date(end   + "T23:59:59.999Z").toISOString();

  const [{ data: periodTxs }, { data: afterTxs }] = await Promise.all([
    db.from("transactions")
      .select("id,merchant,category,amount,transaction_type,posted_at")
      .eq("account_id", accountId).eq("status", "posted")
      .gte("posted_at", startISO).lte("posted_at", endISO)
      .order("posted_at", { ascending: true }),
    db.from("transactions")
      .select("amount")
      .eq("account_id", accountId).eq("status", "posted")
      .gt("posted_at", endISO),
  ]);

  const currentBalance   = Number(acct.balance ?? 0);
  const afterSum         = ((afterTxs ?? []) as { amount: number }[]).reduce((s, t) => s + t.amount, 0);
  const closingBalance   = currentBalance - afterSum;
  const txList = (periodTxs ?? []) as { id: string; merchant: string; category: string; amount: number; transaction_type: string; posted_at: string }[];
  const periodNet      = txList.reduce((s, t) => s + t.amount, 0);
  const openingBalance = closingBalance - periodNet;
  const totalCredits   = txList.filter(t => t.amount > 0).reduce((s, t) => s + t.amount, 0);
  const totalDebits    = txList.filter(t => t.amount < 0).reduce((s, t) => s + t.amount, 0);

  let runningBal = openingBalance;
  const transactions = txList.map(t => {
    runningBal += t.amount;
    return { ...t, balance: runningBal };
  });

  return {
    acct,
    profile: profile ?? {},
    openingBalance,
    closingBalance,
    totalCredits,
    totalDebits,
    txList,
    transactions,
  };
}

// ── GET: render statement data (admin or account owner) ────────
export async function GET(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  const isAdmin = (profile as Record<string, string> | null)?.role === "admin";

  const { searchParams } = new URL(request.url);
  const accountId = searchParams.get("accountId");
  const start     = searchParams.get("start");
  const end       = searchParams.get("end");

  if (!accountId || !start || !end)
    return NextResponse.json({ error: "accountId, start, and end are required" }, { status: 400 });

  const data = await buildStatementData(accountId, start, end);
  if (!data) return NextResponse.json({ error: "Account not found" }, { status: 404 });

  // Non-admin must own the account
  if (!isAdmin && data.acct.user_id !== user.id)
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { acct, openingBalance, closingBalance, totalCredits, totalDebits, txList, transactions } = data;

  return NextResponse.json({
    account: {
      id:           acct.id,
      type:         acct.account_type,
      name:         acct.account_name,
      last4:        acct.account_number_last4,
      creditLimit:  acct.credit_limit,
      interestRate: acct.interest_rate,
      openedAt:     acct.opened_at,
    },
    profile: data.profile,
    period: { start, end },
    summary: { openingBalance, closingBalance, totalCredits, totalDebits, transactionCount: txList.length },
    transactions,
  });
}

// ── POST: save statement record to DB ─────────────────────────
export async function POST(request: Request) {
  const admin_user = await verifyAdmin();
  if (!admin_user) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { accountId, start, end } = await request.json() as { accountId: string; start: string; end: string };
  if (!accountId || !start || !end)
    return NextResponse.json({ error: "accountId, start, and end are required" }, { status: 400 });

  const data = await buildStatementData(accountId, start, end);
  if (!data) return NextResponse.json({ error: "Account not found" }, { status: 404 });

  const { acct, openingBalance, closingBalance, totalCredits, totalDebits, txList } = data;

  const refId = `STMT-${start.replace(/-/g, "")}-${end.replace(/-/g, "")}-${Date.now().toString(36).slice(-4).toUpperCase()}`;
  const db = createAdminClient();

  const { data: saved, error } = await db.from("statements").insert({
    account_id:        accountId,
    user_id:           acct.user_id,
    reference_id:      refId,
    period_start:      start,
    period_end:        end,
    generated_by:      admin_user.email ?? "admin",
    opening_balance:   openingBalance,
    closing_balance:   closingBalance,
    total_credits:     totalCredits,
    total_debits:      Math.abs(totalDebits),
    transaction_count: txList.length,
  }).select("*").single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  await logAction({
    adminId:    admin_user.id,
    adminEmail: admin_user.email ?? "",
    action:     "statement.generate",
    entityType: "account",
    entityId:   accountId,
    details:    { reference_id: refId, period_start: start, period_end: end, account_name: acct.account_name },
  });

  return NextResponse.json({ statement: saved });
}
