import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function GET() {
  // Verify caller is admin
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: me } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  if ((me as Record<string, string> | null)?.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const admin = createAdminClient();

  const [
    { data: profiles },
    { data: accounts },
    { data: transactions },
    { data: pendingTransactions },
    { data: applications },
    { data: fraudAlerts },
    { data: disputes },
  ] = await Promise.all([
    admin.from("profiles").select("id,email,first_name,last_name,phone,member_since,role,kyc_status"),
    admin.from("accounts").select("id,user_id,account_type,account_name,account_number_last4,balance,status,credit_limit"),
    admin.from("transactions").select("id,user_id,account_id,merchant,category,amount,posted_at").eq("status", "posted").order("posted_at", { ascending: false }).limit(50),
    admin.from("transactions").select("id,user_id,account_id,merchant,category,amount,transaction_type,memo,submitted_at,posted_at").eq("status", "pending").order("submitted_at", { ascending: false }),
    admin.from("applications").select("*").order("submitted_at", { ascending: false }),
    admin.from("fraud_alerts").select("id,account_id,user_id,transaction_id,rule,severity,details,status,created_at").order("created_at", { ascending: false }).limit(300),
    admin.from("disputes").select("id,user_id,account_id,transaction_id,reference_id,dispute_type,amount,merchant,description,status,admin_notes,credit_tx_id,opened_at,resolved_at,created_at").order("opened_at", { ascending: false }).limit(300),
  ]);

  return NextResponse.json({ profiles, accounts, transactions, pendingTransactions, applications, fraudAlerts: fraudAlerts ?? [], disputes: disputes ?? [] });
}
