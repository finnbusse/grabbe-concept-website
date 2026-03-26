import { createClient } from "@/lib/supabase/server"
import { revalidatePath, revalidateTag } from "next/cache"
import { NextResponse, type NextRequest } from "next/server"
import { checkPermission, getUserPermissions } from "@/lib/permissions"

async function requireNavigationPermission() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    return { error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) }
  }
  const permissions = await getUserPermissions(user.id)
  if (!checkPermission(permissions, "navigation")) {
    return { error: NextResponse.json({ error: "Keine Berechtigung" }, { status: 403 }) }
  }
  return { supabase }
}

export async function GET(request: NextRequest) {
  const auth = await requireNavigationPermission()
  if (auth.error) return auth.error
  const location = request.nextUrl.searchParams.get("location")
  const supabase = auth.supabase
  let query = supabase
    .from("navigation_items")
    .select("*")
    .order("sort_order")
  if (location) query = query.eq("location", location)
  const { data, error } = await query
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function POST(request: NextRequest) {
  const auth = await requireNavigationPermission()
  if (auth.error) return auth.error
  const supabase = auth.supabase

  const body = await request.json()
  const { data, error } = await supabase
    .from("navigation_items")
    .insert(body)
    .select()
    .single()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  revalidateTag("navigation", "max")
  revalidatePath("/", "layout")
  return NextResponse.json(data)
}

export async function PUT(request: NextRequest) {
  const auth = await requireNavigationPermission()
  if (auth.error) return auth.error
  const supabase = auth.supabase

  const body = await request.json()
  const { id, ...updates } = body
  updates.updated_at = new Date().toISOString()
  const { error } = await supabase
    .from("navigation_items")
    .update(updates)
    .eq("id", id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  revalidateTag("navigation", "max")
  revalidatePath("/", "layout")
  return NextResponse.json({ success: true })
}

export async function DELETE(request: NextRequest) {
  const auth = await requireNavigationPermission()
  if (auth.error) return auth.error
  const supabase = auth.supabase

  const { id } = await request.json()
  const { error } = await supabase
    .from("navigation_items")
    .delete()
    .eq("id", id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  revalidateTag("navigation", "max")
  revalidatePath("/", "layout")
  return NextResponse.json({ success: true })
}
