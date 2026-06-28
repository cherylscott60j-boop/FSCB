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

export async function GET() {
  const user = await verifyAdmin();
  if (!user) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const admin = createAdminClient();

  // Fetch all transactions with abs(amount) >= 10,000
  const [{ data: large }, { data: largeDebit }] = await Promise.all([
    admin.from("transactions").select("id,user_id,account_id,merchant,amount,posted_at").eq("status", "posted").gte("amount", 10000).order("posted_at", { ascending: false }).limit(200),
    admin.from("transactions").select("id,user_id,account_id,merchant,amount,posted_at").eq("status", "posted").lte("amount", -10000).order("posted_at", { ascending: false }).limit(200),
  ]);

  const allLarge = [...(large ?? []), ...(largeDebit ?? [])] as Record<string, unknown>[];

  // Get already-filed CTR transaction IDs
  const { data: existingCTRs } = await admin
    .from("compliance_reports")
    .select("transaction_id")
    .eq("report_type", "CTR")
    .not("transaction_id", "is", null);

  const filedTxIds = new Set((existingCTRs ?? []).map((c: Record<string, unknown>) => String(c.transaction_id)));

  const eligible = allLarge.filter(tx => !filedTxIds.has(String(tx.id)));

  return NextResponse.json({ eligible, count: eligible.length });
}
