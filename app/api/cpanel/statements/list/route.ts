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
  const user = await verifyAdmin();
  if (!user) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { searchParams } = new URL(request.url);
  const accountId = searchParams.get("accountId");
  const userId    = searchParams.get("userId");

  if (!accountId && !userId)
    return NextResponse.json({ error: "accountId or userId required" }, { status: 400 });

  const db = createAdminClient();
  let query = db
    .from("statements")
    .select("id,account_id,user_id,reference_id,period_start,period_end,generated_by,generated_at,opening_balance,closing_balance,total_credits,total_debits,transaction_count")
    .order("generated_at", { ascending: false })
    .limit(100);

  if (accountId) query = query.eq("account_id", accountId);
  else if (userId) query = query.eq("user_id", userId);

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ statements: data ?? [] });
}
