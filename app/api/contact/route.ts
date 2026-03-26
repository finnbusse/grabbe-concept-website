import { createClient } from "@/lib/supabase/server"
import { checkActionRateLimit, recordActionAttempt } from "@/lib/rate-limiter"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      request.headers.get("x-real-ip") ||
      "unknown"
    const rateLimit = await checkActionRateLimit(ip, "contact_submit", 10, 10 * 60 * 1000)
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: "Zu viele Anfragen. Bitte warten Sie.", retryAfterSeconds: rateLimit.retryAfterSeconds },
        { status: 429, headers: { "Retry-After": String(rateLimit.retryAfterSeconds) } }
      )
    }

    const body = await request.json()
    const { name, email, subject, message } = body

    if (!name || !email || !message) {
      return NextResponse.json({ error: "Name, E-Mail und Nachricht sind erforderlich." }, { status: 400 })
    }

    // Basic email validation
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "Bitte geben Sie eine gueltige E-Mail-Adresse ein." }, { status: 400 })
    }

    const supabase = await createClient()
    await recordActionAttempt(ip, "contact_submit")
    const { error } = await supabase.from("contact_submissions").insert({
      name: name.trim(),
      email: email.trim(),
      subject: subject?.trim() || null,
      message: message.trim(),
    } as never)

    if (error) {
      console.error("Contact submission error:", error)
      return NextResponse.json({ error: "Fehler beim Speichern der Nachricht." }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: "Ungueltiger Request." }, { status: 400 })
  }
}
