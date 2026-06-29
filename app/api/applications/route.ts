import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  const body = await request.json();
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ success: false, error: "Not authenticated" }, { status: 401 });
  }

  // Update profile with any fields provided in the form
  const profileUpdate: Record<string, string | null> = {};
  if (body.dob)    profileUpdate.date_of_birth = body.dob;
  if (body.phone)  profileUpdate.phone         = body.phone;
  if (body.street) profileUpdate.address       = body.street;
  if (body.city)   profileUpdate.city          = body.city;
  if (body.state)  profileUpdate.state         = body.state;
  if (body.zip)    profileUpdate.zip           = body.zip;
  if (Object.keys(profileUpdate).length > 0) {
    await supabase.from("profiles").update(profileUpdate).eq("id", user.id);
  }

  const referenceId = `APP-${Date.now()}`;

  const { error } = await supabase.from("applications").insert({
    user_id:       user.id,
    reference_id:  referenceId,
    account_type:  body.account     ?? "",
    account_name:  (body.category === "business" && body.businessName) ? body.businessName : (body.accountName ?? body.account ?? ""),
    category:      body.category    ?? "personal",
    first_name:    body.firstName   ?? "",
    last_name:     body.lastName    ?? "",
    email:         body.email       ?? "",
    phone:         body.phone       || null,
    date_of_birth: body.dob         || null,
    status:        "pending",
    submitted_at:  new Date().toISOString(),
  });

  if (error) {
    console.error("[applications] insert error:", error.message);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true, referenceId });
}
