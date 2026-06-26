import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  const body = await request.json();

  const referenceId = `APP-${Date.now()}`;

  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();

  const { error } = await supabase.from("applications").insert({
    user_id:       user?.id ?? null,
    reference_id:  referenceId,
    account_type:  body.account   ?? "",
    account_name:  body.accountName ?? body.account ?? "",
    category:      body.category  ?? "personal",
    first_name:    body.firstName ?? "",
    last_name:     body.lastName  ?? "",
    email:         body.email     ?? "",
    phone:         body.phone     || null,
    date_of_birth: body.dob       || null,
    status:        "pending",
    submitted_at:  new Date().toISOString(),
  });

  if (error) {
    console.error("[applications] insert error:", error.message);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true, referenceId });
}
