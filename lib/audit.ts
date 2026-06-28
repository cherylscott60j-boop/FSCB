import { createAdminClient } from "@/lib/supabase/admin";

export async function logAction({
  adminId,
  adminEmail,
  action,
  entityType,
  entityId,
  details = {},
}: {
  adminId: string;
  adminEmail: string;
  action: string;
  entityType: string;
  entityId?: string;
  details?: Record<string, unknown>;
}) {
  const db = createAdminClient();
  await db.from("audit_logs").insert({
    admin_id:    adminId,
    admin_email: adminEmail,
    action,
    entity_type: entityType,
    entity_id:   entityId ?? null,
    details,
  });
}
