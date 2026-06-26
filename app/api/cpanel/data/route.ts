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
  ] = await Promise.all([
    admin.from("profiles").select("id,email,first_name,last_name,phone,member_since,role,kyc_status"),
    admin.from("accounts").select("id,user_id,account_type,account_name,account_number_last4,balance,status,credit_limit"),
    admin.from("transactions").select("id,user_id,account_id,merchant,category,amount,posted_at").eq("status", "posted").order("posted_at", { ascending: false }).limit(50),
    admin.from("transactions").select("id,user_id,account_id,merchant,category,amount,transaction_type,memo,submitted_at,posted_at").eq("status", "pending").order("submitted_at", { ascending: false }),
    admin.from("applications").select("*").order("submitted_at", { ascending: false }),
  ]);

  return NextResponse.json({ profiles, accounts, transactions, pendingTransactions, applications });
}
