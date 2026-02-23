import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"
import {
  getAllRoles,
  createCustomRole,
  updateCustomRole,
  deleteCustomRole,
  getUserRoleSlugs,
  isAdmin,
  coercePermissions,
} from "@/lib/permissions"
import type { CmsPermissions } from "@/lib/permissions"

export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: "Nicht angemeldet" }, { status: 401 })

  try {
    const roles = await getAllRoles()
    return NextResponse.json({ roles })
  } catch {
    return NextResponse.json({ roles: [] })
  }
}

export async function POST(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: "Nicht angemeldet" }, { status: 401 })

  const roleSlugs = await getUserRoleSlugs(user.id)
  if (!isAdmin(roleSlugs)) {
    return NextResponse.json({ error: "Keine Berechtigung" }, { status: 403 })
  }

  try {
    const body = await request.json()
    const { name, slug, permissions } = body as { name: string; slug: string; permissions: CmsPermissions }

    if (!name || !slug) {
      return NextResponse.json({ error: "Name und Slug erforderlich" }, { status: 400 })
    }

    const sanitizedSlug = slug.toLowerCase().replace(/[^a-z0-9-]/g, "-")
    const result = await createCustomRole(name, sanitizedSlug, coercePermissions(permissions))

    if (result.error) {
      return NextResponse.json({ error: result.error }, { status: 400 })
    }

    return NextResponse.json({ id: result.id })
  } catch {
    return NextResponse.json({ error: "Ungültiger Request" }, { status: 400 })
  }
}

export async function PUT(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: "Nicht angemeldet" }, { status: 401 })

  const roleSlugs = await getUserRoleSlugs(user.id)
  if (!isAdmin(roleSlugs)) {
    return NextResponse.json({ error: "Keine Berechtigung" }, { status: 403 })
  }

  try {
    const body = await request.json()
    const { id, name, permissions } = body as { id: string; name: string; permissions: CmsPermissions }

    if (!id || !name) {
      return NextResponse.json({ error: "ID und Name erforderlich" }, { status: 400 })
    }

    const result = await updateCustomRole(id, name, coercePermissions(permissions))
    if (result.error) {
      return NextResponse.json({ error: result.error }, { status: 400 })
    }

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: "Ungültiger Request" }, { status: 400 })
  }
}

export async function DELETE(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: "Nicht angemeldet" }, { status: 401 })

  const roleSlugs = await getUserRoleSlugs(user.id)
  if (!isAdmin(roleSlugs)) {
    return NextResponse.json({ error: "Keine Berechtigung" }, { status: 403 })
  }

  try {
    const body = await request.json()
    const { id } = body as { id: string }

    if (!id) {
      return NextResponse.json({ error: "Rollen-ID erforderlich" }, { status: 400 })
    }

    const result = await deleteCustomRole(id)
    if (result.error) {
      return NextResponse.json({ error: result.error }, { status: 400 })
    }

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: "Ungültiger Request" }, { status: 400 })
  }
}
