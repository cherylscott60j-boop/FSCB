import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const admin = createAdminClient();

  // Freeze all non-closed accounts for this user
  await admin
    .from("accounts")
    .update({ status: "frozen", freeze_reason: "transfer_hold" })
    .eq("user_id", user.id)
    .neq("status", "closed");

  // Notify the user
  await admin.from("notifications").insert({
    user_id: user.id,
    type: "warning",
    title: "Account Frozen — Security Hold",
    message: "Your transaction is on hold and your account is frozen for security reasons. Please contact Customer Care for verification and to restore access.",
  });

  // Audit log (system-triggered freeze, using user's own identity)
  await admin.from("audit_logs").insert({
    admin_id:    user.id,
    admin_email: user.email ?? "unknown",
    action:      "account.transfer_freeze",
    entity_type: "account",
    entity_id:   user.id,
    details:     { reason: "external_transfer_initiated", userId: user.id },
  });

  return NextResponse.json({ success: true });
}
