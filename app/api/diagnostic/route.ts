import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { checkPermission, getUserPermissions } from "@/lib/permissions"

export const dynamic = "force-dynamic"

export async function GET() {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Nicht authentifiziert" }, { status: 401 })
    }

    const permissions = await getUserPermissions(user.id)
    if (!checkPermission(permissions, "diagnostic")) {
      return NextResponse.json({ error: "Keine Berechtigung" }, { status: 403 })
    }

    const tables = [
      "posts",
      "pages",
      "events",
      "documents",
      "navigation_items",
      "site_settings",
      "contact_submissions",
      "anmeldung_submissions",
    ]

    const checks: Record<string, { status: "ok" | "error" }> = {}
    for (const table of tables) {
      const { error } = await supabase.from(table).select("id", { head: true, count: "exact" })
      checks[table] = { status: error ? "error" : "ok" }
    }

    const blobConfigured = Boolean(process.env.BLOB_READ_WRITE_TOKEN)

    return NextResponse.json({
      status: "ok",
      timestamp: new Date().toISOString(),
      checks,
      blob: { configured: blobConfigured },
    })
  } catch {
    return NextResponse.json({ error: "Diagnose fehlgeschlagen" }, { status: 500 })
  }
}
