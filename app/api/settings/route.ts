import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import { NextResponse, type NextRequest } from "next/server"

function revalidateSettingsPages() {
  revalidatePath("/", "layout")
  revalidatePath("/kontakt")
  revalidatePath("/impressum")
}

function normalizeSettingRow(item: {
  key: string
  value?: unknown
  type?: string
  label?: string
  category?: string
}) {
  return {
    key: item.key,
    value: typeof item.value === "string" ? item.value : "",
    type: item.type ?? "text",
    label: item.label ?? item.key,
    category: item.category ?? "allgemein",
    updated_at: new Date().toISOString(),
  }
}

function isValidSettingItem(item: { key?: unknown; value?: unknown }) {
  return typeof item?.key === "string" &&
    item.key.trim().length > 0 &&
    (item.value === undefined || typeof item.value === "string")
}

export async function GET() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("site_settings")
    .select("*")
    .order("category, key")
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function PUT(request: NextRequest) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const body = await request.json()

  if (Array.isArray(body)) {
    if (body.some((item) => !isValidSettingItem(item))) {
      return NextResponse.json({ error: "Invalid payload: each item requires a non-empty key" }, { status: 400 })
    }
    const keys = body.map((item) => item.key.trim())
    const { data: existing, error: existingError } = await supabase
      .from("site_settings")
      .select("key, protected")
      .in("key", keys)
    if (existingError) return NextResponse.json({ error: existingError.message }, { status: 500 })
    const existingRows = (existing as Array<{ key: string; protected: boolean | null }> | null) ?? []

    const protectedKeys = new Set(
      existingRows.filter((row) => row.protected).map((row) => row.key)
    )
    const requestedKeys = new Set(keys)
    const skippedProtectedKeys = Array.from(protectedKeys).filter((key) => requestedKeys.has(key))
    const rows = body
      .filter((item) => !protectedKeys.has(item.key.trim()))
      .map((item) => normalizeSettingRow(item))

    if (rows.length > 0) {
      const { error } = await supabase
        .from("site_settings")
        .upsert(rows as never, { onConflict: "key" })
      if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    }

    revalidateSettingsPages()
    return NextResponse.json({ success: true, skippedProtectedKeys })
  }

  const { key, value, type, label, category } = body
  if (typeof key !== "string" || key.trim().length === 0) {
    return NextResponse.json({ error: "Invalid payload: key is required" }, { status: 400 })
  }
  if (value !== undefined && typeof value !== "string") {
    return NextResponse.json({ error: "Invalid payload: value must be a string" }, { status: 400 })
  }
  const { data: existingSetting, error: existingError } = await supabase
    .from("site_settings")
    .select("protected")
    .eq("key", key)
    .maybeSingle()
  if (existingError) return NextResponse.json({ error: existingError.message }, { status: 500 })
  const existingSettingRow = existingSetting as { protected: boolean | null } | null
  if (existingSettingRow?.protected) {
    return NextResponse.json({ error: `Setting '${key}' ist geschützt und kann nicht geändert werden.` }, { status: 403 })
  }

  const { error } = await supabase
    .from("site_settings")
    .upsert(normalizeSettingRow({ key, value, type, label, category }) as never, { onConflict: "key" })
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  revalidateSettingsPages()
  return NextResponse.json({ success: true })
}

export async function POST(request: NextRequest) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { key, value, type, label, category } = await request.json()
  if (typeof key !== "string" || key.trim().length === 0) {
    return NextResponse.json({ error: "Invalid payload: key is required" }, { status: 400 })
  }
  if (value !== undefined && typeof value !== "string") {
    return NextResponse.json({ error: "Invalid payload: value must be a string" }, { status: 400 })
  }
  const { error } = await supabase.from("site_settings").insert({
    key,
    value: typeof value === "string" ? value : "",
    type: type ?? "text",
    label: label ?? key,
    category: category ?? "allgemein",
  } as never)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  revalidateSettingsPages()
  return NextResponse.json({ success: true })
}
