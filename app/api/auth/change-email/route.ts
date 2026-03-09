import { createClient } from "@/lib/supabase/server"
import { createAdminClient } from "@/lib/supabase/admin"
import { getUserRoleSlugs } from "@/lib/permissions"
import { isAdmin } from "@/lib/permissions-shared"
import { sendEmail } from "@/lib/email"
import { emailChangeConfirmationTemplate } from "@/lib/email-templates/email-change"
import { NextResponse, type NextRequest } from "next/server"
import { createHmac, randomUUID } from "crypto"

export const dynamic = "force-dynamic"

function generateEmailChangeToken(): string {
  const secret = process.env.INVITATION_HMAC_SECRET || process.env.SUPABASE_SERVICE_ROLE_KEY || ""
  const id = randomUUID()
  const signature = createHmac("sha256", secret)
    .update(id)
    .digest("hex")
    .slice(0, 16)
  return `${id}-${signature}`
}

function getBaseUrl(): string {
  return process.env.NEXT_PUBLIC_SITE_URL || "https://grabbe.site"
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Nicht authentifiziert." }, { status: 401 })
    }

    // Only admins can change email
    const roleSlugs = await getUserRoleSlugs(user.id)
    if (!isAdmin(roleSlugs)) {
      return NextResponse.json({ error: "Nur Administratoren können die E-Mail-Adresse ändern." }, { status: 403 })
    }

    const body = await request.json().catch(() => null)
    const newEmail = body?.newEmail?.trim()?.toLowerCase()

    if (!newEmail || !newEmail.includes("@")) {
      return NextResponse.json({ error: "Bitte geben Sie eine gültige E-Mail-Adresse ein." }, { status: 400 })
    }

    if (newEmail === user.email?.toLowerCase()) {
      return NextResponse.json({ error: "Die neue E-Mail-Adresse ist identisch mit der aktuellen." }, { status: 400 })
    }

    const adminClient = createAdminClient()

    // Check if email is already in use
    const { data: existingUsers } = await adminClient.auth.admin.listUsers()
    const emailInUse = existingUsers?.users?.some(
      (u) => u.email?.toLowerCase() === newEmail && u.id !== user.id
    )
    if (emailInUse) {
      return NextResponse.json({ error: "Diese E-Mail-Adresse wird bereits verwendet." }, { status: 409 })
    }

    // Generate confirmation token
    const token = generateEmailChangeToken()
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000).toISOString() // 1 hour

    // Store email change request in app_metadata
    await adminClient.auth.admin.updateUserById(user.id, {
      app_metadata: {
        ...user.app_metadata,
        email_change_token: token,
        email_change_new_email: newEmail,
        email_change_expires: expiresAt,
      },
    })

    // Send confirmation email to the NEW address
    const confirmUrl = `${getBaseUrl()}/auth/email-bestaetigen?token=${token}&uid=${user.id}`
    const template = emailChangeConfirmationTemplate({ confirmUrl, newEmail })

    const emailResult = await sendEmail({
      to: newEmail,
      subject: template.subject,
      html: template.html,
    })

    if (!emailResult.success) {
      return NextResponse.json(
        { error: `Bestätigungsmail konnte nicht gesendet werden: ${emailResult.error}` },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Email change API error:", error)
    return NextResponse.json({ error: "Ein Fehler ist aufgetreten." }, { status: 500 })
  }
}
