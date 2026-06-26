import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password, firstName, lastName, phone, dob, account, accountName, category } = body;

    if (!email || !password || !firstName || !lastName) {
      return NextResponse.json({ success: false, error: "Missing required fields." }, { status: 400 });
    }

    const admin = createAdminClient();

    // Create auth user — email already confirmed so no verification email is sent.
    // We ban immediately so they can't log in until admin approves.
    const { data: created, error: createError } = await admin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { first_name: firstName, last_name: lastName },
    });

    if (createError) {
      return NextResponse.json({ success: false, error: createError.message }, { status: 400 });
    }

    if (!created?.user) {
      return NextResponse.json({ success: false, error: "Failed to create user." }, { status: 500 });
    }

    const userId = created.user.id;

    // Ban until admin approves
    await admin.auth.admin.updateUserById(userId, { ban_duration: "876000h" });

    // Upsert profile — handles both cases: trigger already created the row, or no trigger
    await admin.from("profiles").upsert({
      id:           userId,
      email,
      first_name:   firstName,
      last_name:    lastName,
      phone:        phone || null,
      role:         "user",
      kyc_status:   "pending",
      member_since: new Date().toISOString().split("T")[0],
    }, { onConflict: "id" });

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
      await admin.auth.admin.deleteUser(userId);
      return NextResponse.json({ success: false, error: appError.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, referenceId });

  } catch (err) {
    console.error("[register] unexpected error:", err);
    return NextResponse.json({ success: false, error: "An unexpected error occurred." }, { status: 500 });
  }
}
