import { createAdminClient } from "@/lib/supabase/admin"

type AuditLogPayload = {
  action: string
  actorUserId: string
  targetType?: string | null
  targetId?: string | null
  metadata?: Record<string, unknown> | null
}

export async function writeAuditLog(payload: AuditLogPayload): Promise<void> {
  try {
    const admin = createAdminClient()
    await admin.from("audit_logs").insert({
      action: payload.action,
      actor_user_id: payload.actorUserId,
      target_type: payload.targetType ?? null,
      target_id: payload.targetId ?? null,
      metadata: payload.metadata ?? null,
    } as never)
  } catch (error) {
    console.error("[audit-log] failed to persist audit event", error)
  }
}
