import { createClient } from "@/lib/supabase/server"
import { getUserRoleSlugs } from "@/lib/permissions"
import { NextResponse } from "next/server"
import { getBufferChannels } from "@/lib/buffer"

// ============================================================================
// GET – Fetch connected Buffer channels (social media profiles)
// ============================================================================

export async function GET() {
  // Auth check
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const roleSlugs = await getUserRoleSlugs(user.id)
  if (!roleSlugs.includes("administrator")) {
    return NextResponse.json(
      { error: "Forbidden – Nur Administratoren können auf Social-Media-Profile zugreifen." },
      { status: 403 }
    )
  }

  const token = process.env.BUFFER_ACCESS_TOKEN?.trim() ?? ""
  if (!token) {
    return NextResponse.json(
      { error: "Kein Buffer Access Token konfiguriert. Bitte BUFFER_ACCESS_TOKEN als Secret setzen." },
      { status: 400 }
    )
  }

  try {
    const result = await getBufferChannels(token)
    return NextResponse.json({
      channels: result.channels,
      errors: result.errors.length > 0 ? result.errors : undefined,
    })
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unbekannter Fehler"
    console.error("[social-media/profiles] Fehler beim Abrufen der Kanäle:", err)
    return NextResponse.json(
      { error: `Fehler beim Abrufen der Kanäle: ${message}` },
      { status: 502 }
    )
  }
}
