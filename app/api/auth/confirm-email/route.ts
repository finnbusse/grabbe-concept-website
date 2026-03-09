import { createAdminClient } from "@/lib/supabase/admin"
import { NextResponse, type NextRequest } from "next/server"
import { createHmac } from "crypto"

export const dynamic = "force-dynamic"

function validateToken(token: string): boolean {
  const secret = process.env.INVITATION_HMAC_SECRET || process.env.SUPABASE_SERVICE_ROLE_KEY || ""
  const parts = token.split("-")
  if (parts.length !== 6) return false

  const id = parts.slice(0, 5).join("-")
  const providedSignature = parts[5]
  const expectedSignature = createHmac("sha256", secret)
    .update(id)
    .digest("hex")
    .slice(0, 16)

  if (providedSignature.length !== expectedSignature.length) return false
  let result = 0
  for (let i = 0; i < providedSignature.length; i++) {
    result |= providedSignature.charCodeAt(i) ^ expectedSignature.charCodeAt(i)
  }
  return result === 0
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => null)
    const { token, uid, password } = body || {}

    if (!token || !uid || !password) {
      return NextResponse.json({ error: "Ungültige Anfrage." }, { status: 400 })
    }

    if (!validateToken(token)) {
      return NextResponse.json({ error: "Der Bestätigungslink ist ungültig." }, { status: 400 })
    }

    const adminClient = createAdminClient()

    // Fetch user
    const { data: userData, error: fetchError } = await adminClient.auth.admin.getUserById(uid)
    if (fetchError || !userData?.user) {
      return NextResponse.json({ error: "Der Bestätigungslink ist ungültig." }, { status: 400 })
    }

    const user = userData.user
    const storedToken = user.app_metadata?.email_change_token
    const storedNewEmail = user.app_metadata?.email_change_new_email
    const storedExpiry = user.app_metadata?.email_change_expires

    // Verify token
    if (!storedToken || storedToken !== token || !storedNewEmail) {
      return NextResponse.json(
        { error: "Der Bestätigungslink ist ungültig oder wurde bereits verwendet." },
        { status: 400 }
      )
    }

    // Verify not expired
    if (storedExpiry && new Date(storedExpiry) < new Date()) {
      await adminClient.auth.admin.updateUserById(uid, {
        app_metadata: {
          ...user.app_metadata,
          email_change_token: null,
          email_change_new_email: null,
          email_change_expires: null,
        },
      })
      return NextResponse.json(
        { error: "Der Bestätigungslink ist abgelaufen." },
        { status: 400 }
      )
    }

    // Verify password
    const { error: signInError } = await adminClient.auth.signInWithPassword({
      email: user.email!,
      password,
    })

    if (signInError) {
      return NextResponse.json({ error: "Das Passwort ist falsch." }, { status: 400 })
    }

    // Update email and clear tokens
    const { error: updateError } = await adminClient.auth.admin.updateUserById(uid, {
      email: storedNewEmail,
      app_metadata: {
        ...user.app_metadata,
        email_change_token: null,
        email_change_new_email: null,
        email_change_expires: null,
      },
    })

    if (updateError) {
      console.error("Email change error:", updateError)
      return NextResponse.json({ error: "Die E-Mail-Adresse konnte nicht geändert werden." }, { status: 500 })
    }

    return NextResponse.json({ success: true, newEmail: storedNewEmail })
  } catch (error) {
    console.error("Confirm email API error:", error)
    return NextResponse.json({ error: "Ein Fehler ist aufgetreten." }, { status: 500 })
  }
}
