import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

async function verifyAdmin() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  if ((profile as Record<string, string> | null)?.role !== "admin") return null;
  return user;
}

export async function GET(request: Request) {
  const admin_user = await verifyAdmin();
  if (!admin_user) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { searchParams } = new URL(request.url);
  const accountId = searchParams.get("accountId");
  const start     = searchParams.get("start");
  const end       = searchParams.get("end");

  if (!accountId || !start || !end)
    return NextResponse.json({ error: "accountId, start, and end are required" }, { status: 400 });

  const db = createAdminClient();

  // Account + owner profile
  const { data: account } = await db
    .from("accounts")
    .select("id,user_id,account_type,account_name,account_number_last4,balance,credit_limit,interest_rate,opened_at")
    .eq("id", accountId)
    .single();

  if (!account) return NextResponse.json({ error: "Account not found" }, { status: 404 });

  const acct = account as Record<string, unknown>;

  const { data: profile } = await db
    .from("profiles")
    .select("first_name,last_name,email,phone,address_line1,address_line2,city,state,zip")
    .eq("id", acct.user_id as string)
    .single();

  // Transactions in the statement period (posted only, sorted by date asc)
  const startISO = new Date(start + "T00:00:00.000Z").toISOString();
  const endISO   = new Date(end   + "T23:59:59.999Z").toISOString();

  const { data: periodTxs } = await db
    .from("transactions")
    .select("id,merchant,category,amount,transaction_type,posted_at")
    .eq("account_id", accountId)
    .eq("status", "posted")
    .gte("posted_at", startISO)
    .lte("posted_at", endISO)
    .order("posted_at", { ascending: true });

  // Transactions posted AFTER end date — used to back-calculate closing balance
  const { data: afterTxs } = await db
    .from("transactions")
    .select("amount")
    .eq("account_id", accountId)
    .eq("status", "posted")
    .gt("posted_at", endISO);

  const currentBalance   = Number(acct.balance ?? 0);
  const afterSum         = ((afterTxs ?? []) as { amount: number }[]).reduce((s, t) => s + t.amount, 0);
  const closingBalance   = currentBalance - afterSum;

  const txList = ((periodTxs ?? []) as { id: string; merchant: string; category: string; amount: number; transaction_type: string; posted_at: string }[]);
  const periodNet      = txList.reduce((s, t) => s + t.amount, 0);
  const openingBalance = closingBalance - periodNet;

  const totalCredits   = txList.filter(t => t.amount > 0).reduce((s, t) => s + t.amount, 0);
  const totalDebits    = txList.filter(t => t.amount < 0).reduce((s, t) => s + t.amount, 0);

  // Running balance per transaction
  let runningBal = openingBalance;
  const transactions = txList.map(t => {
    runningBal += t.amount;
    return { ...t, balance: runningBal };
  });

  return NextResponse.json({
    account: {
      id:          acct.id,
      type:        acct.account_type,
      name:        acct.account_name,
      last4:       acct.account_number_last4,
      creditLimit: acct.credit_limit,
      interestRate:acct.interest_rate,
      openedAt:    acct.opened_at,
    },
    profile: profile ?? {},
    period: { start, end },
    summary: { openingBalance, closingBalance, totalCredits, totalDebits, transactionCount: txList.length },
    transactions,
  });
}
