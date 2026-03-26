import { createClient } from "@/lib/supabase/server"
import { checkActionRateLimit, recordActionAttempt } from "@/lib/rate-limiter"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      request.headers.get("x-real-ip") ||
      "unknown"
    const rateLimit = await checkActionRateLimit(ip, "anmeldung_submit", 10, 10 * 60 * 1000)
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: "Zu viele Anfragen. Bitte warten Sie.", retryAfterSeconds: rateLimit.retryAfterSeconds },
        { status: 429, headers: { "Retry-After": String(rateLimit.retryAfterSeconds) } }
      )
    }

    const body = await request.json()
    const { child_name, child_birthday, parent_name, parent_email, parent_phone, grundschule, anmeldung_type, wunschpartner, profilprojekt, message } = body

    if (!child_name || !parent_name || !parent_email) {
      return NextResponse.json({ error: "Name des Kindes, Name und E-Mail des Erziehungsberechtigten sind erforderlich." }, { status: 400 })
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(parent_email)) {
      return NextResponse.json({ error: "Bitte geben Sie eine gueltige E-Mail-Adresse ein." }, { status: 400 })
    }

    const supabase = await createClient()
    await recordActionAttempt(ip, "anmeldung_submit")
    const { error } = await supabase.from("anmeldung_submissions").insert({
      child_name: child_name.trim(),
      child_birthday: child_birthday || null,
      parent_name: parent_name.trim(),
      parent_email: parent_email.trim(),
      parent_phone: parent_phone?.trim() || null,
      grundschule: grundschule?.trim() || null,
      anmeldung_type: anmeldung_type || "klasse5",
      wunschpartner: wunschpartner?.trim() || null,
      profilprojekt: profilprojekt?.trim() || null,
      message: message?.trim() || null,
    } as never)

    if (error) {
      console.error("Anmeldung submission error:", error)
      return NextResponse.json({ error: "Fehler beim Speichern der Anmeldung." }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: "Ungueltiger Request." }, { status: 400 })
  }
}
