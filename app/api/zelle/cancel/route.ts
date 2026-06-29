import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { txId } = await request.json();
  if (!txId) return NextResponse.json({ error: "Missing txId" }, { status: 400 });

  const admin = createAdminClient();

  const { data: tx, error: fetchErr } = await admin
    .from("transactions")
    .select("id, user_id, status, merchant")
    .eq("id", txId)
    .single();

  if (fetchErr || !tx) return NextResponse.json({ error: "Transaction not found" }, { status: 404 });

  const t = tx as { id: string; user_id: string; status: string; merchant: string };

  if (t.user_id !== user.id)
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  if (t.status !== "pending")
    return NextResponse.json({ error: "Only pending transactions can be cancelled" }, { status: 400 });
  if (!t.merchant.startsWith("Zelle®"))
    return NextResponse.json({ error: "Only Zelle transactions can be cancelled here" }, { status: 400 });

  const { error } = await admin
    .from("transactions")
    .update({ status: "cancelled" })
    .eq("id", txId);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ success: true });
}
