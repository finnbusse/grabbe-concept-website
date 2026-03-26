import { createClient } from "@/lib/supabase/server"
import { getUserRoleSlugs } from "@/lib/permissions"
import { NextResponse, type NextRequest } from "next/server"
import { validateBufferToken } from "@/lib/buffer"

// ============================================================================
// Helpers
// ============================================================================

async function requireAdmin() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { error: "Unauthorized", status: 401 }

  const roleSlugs = await getUserRoleSlugs(user.id)
  if (!roleSlugs.includes("administrator")) {
    return { error: "Forbidden – Nur Administratoren können diese Einstellung ändern.", status: 403 }
  }

  return { user }
}

// ============================================================================
// GET – Fetch current Buffer API key status (masked)
// ============================================================================

export async function GET() {
  const auth = await requireAdmin()
  if ("error" in auth) {
    return NextResponse.json({ error: auth.error }, { status: auth.status })
  }

  const token = process.env.BUFFER_ACCESS_TOKEN?.trim() ?? ""
  const isConfigured = token.length > 0

  return NextResponse.json({
    configured: isConfigured,
    masked_key: isConfigured ? "••••••••" + token.slice(-4) : "",
  })
}

// ============================================================================
// PUT – Save or update the Buffer API key
// ============================================================================

export async function PUT(request: NextRequest) {
  const auth = await requireAdmin()
  if ("error" in auth) {
    return NextResponse.json({ error: auth.error }, { status: auth.status })
  }

  const body = await request.json()
  const { access_token } = body as { access_token?: string }

  if (typeof access_token !== "string" || access_token.trim().length === 0) {
    return NextResponse.json(
      { error: "Ein gültiger Access Token wird benötigt." },
      { status: 400 }
    )
  }

  // 1. Validate the token with Buffer's GraphQL API FIRST.
  //    Only save if the token is actually valid – prevents garbage tokens.
  let accountInfo: { organizations: Array<{ id: string; name: string }> }
  try {
    accountInfo = await validateBufferToken(access_token.trim())
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unbekannter Validierungsfehler"
    return NextResponse.json(
      { error: `Token ungültig: ${message}` },
      { status: 400 }
    )
  }

  const orgName = accountInfo.organizations[0]?.name ?? "Unbekannt"
  return NextResponse.json({
    success: true,
    persisted: false,
    message: "Token ist gültig. Bitte BUFFER_ACCESS_TOKEN als geschütztes Deployment-Secret setzen.",
    buffer_account: {
      organization_name: orgName,
      organization_count: accountInfo.organizations.length,
    },
  })
}

// ============================================================================
// DELETE – Remove the Buffer API key
// ============================================================================

export async function DELETE() {
  const auth = await requireAdmin()
  if ("error" in auth) {
    return NextResponse.json({ error: auth.error }, { status: auth.status })
  }

  return NextResponse.json({
    success: true,
    persisted: false,
    message: "Bitte BUFFER_ACCESS_TOKEN aus der Secret-Verwaltung entfernen.",
  })
}
