import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"
import { getUserRoleSlugs, isAdminOrSchulleitung, isAdmin, setUserRoles } from "@/lib/permissions"
import { revalidatePath } from "next/cache"

export async function POST(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: "Nicht angemeldet" }, { status: 401 })

  const currentRoleSlugs = await getUserRoleSlugs(user.id)
  if (!isAdminOrSchulleitung(currentRoleSlugs)) {
    return NextResponse.json({ error: "Keine Berechtigung" }, { status: 403 })
  }

  try {
    const body = await request.json()
    const { userId, roleIds } = body as { userId: string; roleIds: string[] }

    if (!userId || !Array.isArray(roleIds)) {
      return NextResponse.json({ error: "userId und roleIds erforderlich" }, { status: 400 })
    }

    // Schulleitung cannot assign admin or schulleitung roles
    if (!isAdmin(currentRoleSlugs)) {
      // Fetch role slugs for the roles being assigned
      const { data: roles } = await supabase
        .from("cms_roles")
        .select("id, slug")
        .in("id", roleIds)

      const restrictedSlugs = ["administrator", "schulleitung"]
      const roleList = (roles ?? []) as Array<{ id: string; slug: string }>
      const hasRestricted = roleList.some((r) => restrictedSlugs.includes(r.slug))
      if (hasRestricted) {
        return NextResponse.json({ error: "Schulleitung kann keine Administrator- oder Schulleitungs-Rollen zuweisen" }, { status: 403 })
      }
    }

    const result = await setUserRoles(userId, roleIds)
    if (result.error) {
      return NextResponse.json({ error: result.error }, { status: 400 })
    }

    revalidatePath("/cms", "layout")
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: "Ungültiger Request" }, { status: 400 })
  }
}
