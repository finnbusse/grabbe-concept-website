import { createClient } from "@/lib/supabase/server"
import { createAdminClient } from "@/lib/supabase/admin"
import { NextResponse } from "next/server"

export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: "Nicht angemeldet" }, { status: 401 })

  // Fetch all users from the profiles approach - we list via auth admin if available
  // Fallback: list from contact_submissions authors or just show current user
  // For a simple approach, we store user info in a lightweight query
  const { data, error } = await supabase.rpc("get_all_users").select()

  // Also fetch profiles for all users
  const { data: profiles } = await supabase.from("user_profiles").select("*")
  const profileMap = new Map(
    (profiles || []).map((p: { user_id: string }) => [p.user_id, p])
  )

  if (error) {
    // Fallback - just return current user
    const currentProfile = profileMap.get(user.id)
    return NextResponse.json({
      users: [{
        id: user.id,
        email: user.email || "",
        created_at: user.created_at || new Date().toISOString(),
        last_sign_in_at: user.last_sign_in_at || null,
        profile: currentProfile || null,
      }]
    })
  }

  // Attach profiles to users
  const usersWithProfiles = (data || []).map((u: { id: string }) => ({
    ...u,
    profile: profileMap.get(u.id) || null,
  }))

  return NextResponse.json({ users: usersWithProfiles })
}

export async function POST(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: "Nicht angemeldet" }, { status: 401 })

  const body = await request.json()
  const { email, password, first_name, last_name, title: userTitle } = body

  if (!email || !password) {
    return NextResponse.json({ error: "E-Mail und Passwort erforderlich" }, { status: 400 })
  }

  // Use the Supabase admin client to create users without email confirmation
  const adminClient = createAdminClient()
  const { data, error } = await adminClient.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }

  // Create profile for the new user if name data provided
  if (data.user && (first_name || last_name)) {
    await supabase.from("user_profiles").insert({
      user_id: data.user.id,
      first_name: first_name || "",
      last_name: last_name || "",
      title: userTitle || "",
    } as never)
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
