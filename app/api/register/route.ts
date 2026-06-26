import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(request: Request) {
  const body = await request.json();
  const { email, password, firstName, lastName, phone, dob, account, accountName, category } = body;

  if (!email || !password || !firstName || !lastName) {
    return NextResponse.json({ success: false, error: "Missing required fields." }, { status: 400 });
  }

  const admin = createAdminClient();

  // Create auth user — email_confirm: true so no verification email is sent,
  // but we immediately ban so they can't log in until admin approves.
  const { data: created, error: createError } = await admin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { first_name: firstName, last_name: lastName },
  });

  if (createError) {
    return NextResponse.json({ success: false, error: createError.message }, { status: 400 });
  }

  const userId = created.user.id;

  // Ban the user until admin approves their application
  await admin.auth.admin.updateUserById(userId, { ban_duration: "876000h" });

  // Create profile
  await admin.from("profiles").insert({
    id:           userId,
    email,
    first_name:   firstName,
    last_name:    lastName,
    phone:        phone || null,
    role:         "user",
    kyc_status:   "pending",
    member_since: new Date().toISOString(),
  });

  // Create application
  const referenceId = `APP-${Date.now()}`;
  const { error: appError } = await admin.from("applications").insert({
    user_id:       userId,
    reference_id:  referenceId,
    account_type:  account     ?? "",
    account_name:  accountName ?? account ?? "",
    category:      category    ?? "personal",
    first_name:    firstName,
    last_name:     lastName,
    email,
    phone:         phone || null,
    date_of_birth: dob   || null,
    status:        "pending",
    submitted_at:  new Date().toISOString(),
  });

  if (appError) {
    // Clean up the auth user if application insert fails
    await admin.auth.admin.deleteUser(userId);
    return NextResponse.json({ success: false, error: appError.message }, { status: 500 });
  }

  return NextResponse.json({ success: true, referenceId });
}
