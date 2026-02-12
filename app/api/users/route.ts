import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: "Nicht angemeldet" }, { status: 401 })

  // Fetch all users from the profiles approach - we list via auth admin if available
  // Fallback: list from contact_submissions authors or just show current user
  // For a simple approach, we store user info in a lightweight query
  const { data, error } = await supabase.rpc("get_all_users").select()

  if (error) {
    // Fallback - just return current user
    return NextResponse.json({
      users: [{
        id: user.id,
        email: user.email || "",
        created_at: user.created_at || new Date().toISOString(),
        last_sign_in_at: user.last_sign_in_at || null,
      }]
    })
  }

  return NextResponse.json({ users: data })
}

export async function POST(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: "Nicht angemeldet" }, { status: 401 })

  const body = await request.json()
  const { email, password } = body

  if (!email || !password) {
    return NextResponse.json({ error: "E-Mail und Passwort erforderlich" }, { status: 400 })
  }

  // Use the Supabase admin client to create users
  // Since we don't have admin access from client, we use signUp
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL || `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/cms`,
    }
  })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }

  return NextResponse.json({ user: data.user })
}

export async function DELETE(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: "Nicht angemeldet" }, { status: 401 })

  // Note: Deleting users requires admin API - return info message
  return NextResponse.json({ message: "Benutzer-Loeschung erfordert Admin-Zugang. Bitte im Supabase-Dashboard deaktivieren." })
}
