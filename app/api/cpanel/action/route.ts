import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { CREDIT } from "@/lib/bankConstants";

async function verifyAdmin() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  if ((profile as Record<string, string> | null)?.role !== "admin") return null;
  return user;
}

export async function POST(request: Request) {
  const admin_user = await verifyAdmin();
  if (!admin_user) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const body = await request.json();
  const { action } = body;
  const admin = createAdminClient();

  if (action === "freezeToggle") {
    const { acctId, nowFrozen } = body;
    const { error } = await admin.from("accounts").update({ status: nowFrozen ? "frozen" : "active" }).eq("id", acctId);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ success: true });
  }

  if (action === "rejectApplication") {
    const { applicationId } = body;
    const { error } = await admin.from("applications").update({ status: "rejected" }).eq("id", applicationId);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ success: true });
  }

  if (action === "approveTransaction") {
    const { txId, accountId, amount, date } = body;

    const { data: tx, error: fetchErr } = await admin
      .from("transactions")
      .select("transaction_type, user_id, submitted_at")
      .eq("id", txId)
      .single();
    if (fetchErr) return NextResponse.json({ error: fetchErr.message }, { status: 500 });

    const { error: txErr } = await admin.from("transactions").update({ status: "posted", posted_at: date }).eq("id", txId);
    if (txErr) return NextResponse.json({ error: txErr.message }, { status: 500 });

    const { data: acct } = await admin.from("accounts").select("balance").eq("id", accountId).single();
    if (acct) {
      const newBal = (acct as Record<string, number>).balance + amount;
      await admin.from("accounts").update({ balance: newBal }).eq("id", accountId);
    }

    // Auto-approve the paired credit/debit for internal transfers
    let pairedTxId: string | null = null;
    const txRecord = tx as Record<string, unknown>;
    if (txRecord.transaction_type === "transfer") {
      const { data: pair } = await admin
        .from("transactions")
        .select("id, account_id, amount")
        .eq("user_id", txRecord.user_id as string)
        .eq("submitted_at", txRecord.submitted_at as string)
        .eq("transaction_type", "transfer")
        .eq("status", "pending")
        .neq("id", txId)
        .maybeSingle();
      if (pair) {
        const p = pair as { id: string; account_id: string; amount: number };
        await admin.from("transactions").update({ status: "posted", posted_at: date }).eq("id", p.id);
        const { data: pAcct } = await admin.from("accounts").select("balance").eq("id", p.account_id).single();
        if (pAcct) {
          await admin.from("accounts")
            .update({ balance: (pAcct as Record<string, number>).balance + p.amount })
            .eq("id", p.account_id);
        }
        pairedTxId = p.id;
      }
    }

    return NextResponse.json({ success: true, pairedTxId });
  }

  if (action === "rejectTransaction") {
    const { txId } = body;

    const { data: tx } = await admin
      .from("transactions")
      .select("transaction_type, user_id, submitted_at")
      .eq("id", txId)
      .single();

    const { error } = await admin.from("transactions").update({ status: "rejected" }).eq("id", txId);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    // Auto-reject the paired credit/debit for internal transfers
    let pairedTxId: string | null = null;
    if (tx) {
      const txRecord = tx as Record<string, unknown>;
      if (txRecord.transaction_type === "transfer") {
        const { data: pair } = await admin
          .from("transactions")
          .select("id")
          .eq("user_id", txRecord.user_id as string)
          .eq("submitted_at", txRecord.submitted_at as string)
          .eq("transaction_type", "transfer")
          .eq("status", "pending")
          .neq("id", txId)
          .maybeSingle();
        if (pair) {
          await admin.from("transactions").update({ status: "rejected" }).eq("id", (pair as { id: string }).id);
          pairedTxId = (pair as { id: string }).id;
        }
      }
    }

    return NextResponse.json({ success: true, pairedTxId });
  }

  if (action === "manualTransaction") {
    const { accountId, userId, amount, merchant, category, date } = body;
    const { error: txErr } = await admin.from("transactions").insert({
      account_id:       accountId,
      user_id:          userId,
      merchant,
      category,
      amount,
      transaction_type: amount >= 0 ? "credit" : "debit",
      status:           "posted",
      posted_at:        date,
    });
    if (txErr) return NextResponse.json({ error: txErr.message }, { status: 500 });
    const { data: acct } = await admin.from("accounts").select("balance, account_type, credit_limit").eq("id", accountId).single();
    if (acct) {
      const a = acct as Record<string, unknown>;
      const newBal = Number(a.balance) + amount;
      const updates: Record<string, unknown> = { balance: newBal };
      if (a.account_type === "credit_card") {
        updates.available_balance = Number(a.credit_limit) + newBal;
      }
      await admin.from("accounts").update(updates).eq("id", accountId);
    }
    return NextResponse.json({ success: true });
  }

  if (action === "kycUpdate") {
    const { userId, kycStatus } = body;
    const { error } = await admin.from("profiles").update({ kyc_status: kycStatus, kyc_updated_at: new Date().toISOString() }).eq("id", userId);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ success: true });
  }

  if (action === "setCreditLimit") {
    const { acctId, limit } = body;
    const limitNum = Number(limit);
    if (!Number.isFinite(limitNum) || limitNum < 0)
      return NextResponse.json({ error: "Invalid limit amount." }, { status: 400 });
    if (limitNum > CREDIT.maxLimit)
      return NextResponse.json({ error: `Limit cannot exceed ${new Intl.NumberFormat("en-US",{style:"currency",currency:"USD"}).format(CREDIT.maxLimit)}.` }, { status: 400 });
    const { data: acct } = await admin.from("accounts").select("balance, account_type").eq("id", acctId).single();
    if (!acct || (acct as Record<string,unknown>).account_type !== "credit_card")
      return NextResponse.json({ error: "Account not found or not a credit card." }, { status: 400 });
    const balance = Number((acct as Record<string,number>).balance);
    const outstanding = balance < 0 ? Math.abs(balance) : 0;
    if (limitNum < outstanding)
      return NextResponse.json({ error: `Limit cannot be less than the outstanding balance of ${new Intl.NumberFormat("en-US",{style:"currency",currency:"USD"}).format(outstanding)}.` }, { status: 400 });
    const { error } = await admin.from("accounts").update({ credit_limit: limitNum }).eq("id", acctId);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ success: true });
  }

  return NextResponse.json({ error: "Unknown action" }, { status: 400 });
}
