import { createStaticClient as createClient } from "@/lib/supabase/static"
import { getSecret, setSecret, deleteSecret } from "@/lib/secrets"

// Task 107: Consolidate `lib/db-helpers.ts` settings functions with `lib/settings.ts`.
// Here we define the single clear path to read settings.

export interface SiteSettings {
  [key: string]: string
}

/**
 * Fetch a single setting from site_settings.
 */
export async function getSetting(key: string, defaultValue: string = ""): Promise<string> {
  const supabase = createClient()
  const { data } = await supabase
    .from("site_settings")
    .select("value")
    .eq("key", key)
    .single()

  return data?.value || defaultValue
}

/**
 * Fetch multiple settings by category.
 */
export async function getSettingsByCategory(category: string): Promise<SiteSettings> {
  const supabase = createClient()
  const { data } = await supabase
    .from("site_settings")
    .select("key, value")
    .eq("category", category)

  if (!data) return {}

  return data.reduce((acc, row) => {
    acc[row.key] = row.value
    return acc
  }, {} as SiteSettings)
}

/**
 * Fetch all settings.
 */
export async function getAllSettings(): Promise<SiteSettings> {
  const supabase = createClient()
  const { data } = await supabase
    .from("site_settings")
    .select("key, value")

  if (!data) return {}

  return data.reduce((acc, row) => {
    acc[row.key] = row.value
    return acc
  }, {} as SiteSettings)
}

// Re-export secrets to keep API consistent
export { getSecret, setSecret, deleteSecret }
