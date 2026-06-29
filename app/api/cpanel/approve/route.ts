import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { logAction } from "@/lib/audit";

const ACCT_TYPE_MAP: Record<string, string> = {
  "free-checking": "checking", "premium-checking": "checking",
  "regular-savings": "savings", "high-yield-savings": "savings",
  "money-market": "money_market", "cd-6": "cd", "cd-12": "cd", "cd-24": "cd",
  "rewards-card": "credit_card", "cash-back-card": "credit_card", "secured-card": "credit_card",
  "community-card": "credit_card",
  "biz-credit-card": "business_credit_card",
  "business-checking": "business_checking", "business-savings": "business_savings",
  "biz-basic-checking": "business_checking", "biz-premium-checking": "business_checking",
  "biz-savings": "business_savings", "biz-money-market": "money_market",
};

export async function POST(request: Request) {
  // Verify the caller is an admin
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  if ((profile as Record<string, string> | null)?.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { applicationId } = await request.json();
  const admin = createAdminClient();

  // Fetch the application
  const { data: app } = await admin.from("applications").select("*").eq("id", applicationId).single();
  if (!app) return NextResponse.json({ error: "Application not found" }, { status: 404 });

  const appRow = app as Record<string, string>;

  // Mark application approved
  await admin.from("applications").update({ status: "approved" }).eq("id", applicationId);

  // Unban the user and mark KYC verified
  if (appRow.user_id) {
    await admin.auth.admin.updateUserById(appRow.user_id, { ban_duration: "none" });
    await admin.from("profiles").update({ kyc_status: "verified", kyc_updated_at: new Date().toISOString() }).eq("id", appRow.user_id);

    // Create the account
    const dbType = ACCT_TYPE_MAP[appRow.account_type] ?? "checking";
    const displayName = appRow.account_name || appRow.account_type;
    const accountNumber = String(4_000_000_000 + Math.floor(Math.random() * 999_999_999));
    const last4 = accountNumber.slice(-4);

    const isBusinessCC = dbType === "business_credit_card";
    const isPersonalCC = dbType === "credit_card";

    const { error: acctErr } = await admin.from("accounts").insert({
      user_id:              appRow.user_id,
      account_type:         dbType,
      account_name:         `FSCB ${displayName}`,
      account_number:       accountNumber,
      account_number_last4: last4,
      balance:              0,
      available_balance:    0,
      credit_limit:         isBusinessCC ? 50000 : isPersonalCC ? 5000 : null,
      interest_rate:        isBusinessCC ? 0.1999 : isPersonalCC ? 0.2199 : 0,
      status:               "active",
      opened_at:            new Date().toISOString(),
    });
    if (acctErr) {
      console.error("[approve] account insert failed:", acctErr.message);
      return NextResponse.json({ error: `Account creation failed: ${acctErr.message}` }, { status: 500 });
    }

    // Notify the user their account is ready
    await admin.from("notifications").insert({
      user_id: appRow.user_id,
      type:    "success",
      title:   "Account Approved",
      message: `Your ${displayName} has been approved and is now active. You can start using it right away.`,
      read:    false,
    }).catch(() => {/* non-critical */});
  }

  logAction({ adminId: user.id, adminEmail: user.email ?? "", action: "application.approve", entityType: "application", entityId: applicationId, details: { accountType: appRow.account_type, userId: appRow.user_id } });
  return NextResponse.json({ success: true });
}
