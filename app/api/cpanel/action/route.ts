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
    const { error: txErr } = await admin.from("transactions").update({ status: "posted", posted_at: date }).eq("id", txId);
    if (txErr) return NextResponse.json({ error: txErr.message }, { status: 500 });
    const { data: acct } = await admin.from("accounts").select("balance").eq("id", accountId).single();
    if (acct) {
      const newBal = (acct as Record<string, number>).balance + amount;
      await admin.from("accounts").update({ balance: newBal }).eq("id", accountId);
    }
    return NextResponse.json({ success: true });
  }

  if (action === "rejectTransaction") {
    const { txId } = body;
    const { error } = await admin.from("transactions").update({ status: "rejected" }).eq("id", txId);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ success: true });
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
    const { data: acct } = await admin.from("accounts").select("balance").eq("id", accountId).single();
    if (acct) {
      const newBal = (acct as Record<string, number>).balance + amount;
      await admin.from("accounts").update({ balance: newBal }).eq("id", accountId);
    }
    return NextResponse.json({ success: true });
  }

  if (action === "kycUpdate") {
    const { userId, kycStatus } = body;
    const { error } = await admin.from("profiles").update({ kyc_status: kycStatus, kyc_updated_at: new Date().toISOString() }).eq("id", userId);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ success: true });
  }

  return NextResponse.json({ error: "Unknown action" }, { status: 400 });
}
