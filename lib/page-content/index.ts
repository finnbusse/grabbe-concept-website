// Re-export registry for backward compatibility (Tasks 101-106)
export { EDITABLE_PAGES, HERO_IMAGE_SECTION, DEFAULT_CATEGORIES, SYSTEM_ROUTES } from './registry'
export { PAGE_DEFAULTS } from './defaults'
export type { EditablePage, PageSection, PageSectionField } from './types'

import { createStaticClient } from "@/lib/supabase/static"
import { PAGE_DEFAULTS } from './defaults'

/**
 * Fetch a single page content block, applying defaults
 */
export async function getPageContent(pageId: string, defaultValues: Record<string, string> = {}) {
  const supabase = createStaticClient()
  const { data, error } = await supabase
    .from('site_settings')
    .select('value')
    .eq('key', `page_content:${pageId}`)
    .single()

  if (error || !data) return defaultValues

  try {
    const parsed = JSON.parse(data.value)
    return { ...defaultValues, ...parsed }
  } catch {
    return defaultValues
  }
}

/**
 * Fetch multiple page content blocks at once, applying defaults
 */
export async function getMultiplePageContents(pageIds: string[], defaultsMap: Record<string, Record<string, string>>) {
  if (pageIds.length === 0) return {}

  const keys = pageIds.map(id => `page_content:${id}`)
  const supabase = createStaticClient()
  const { data, error } = await supabase
    .from('site_settings')
    .select('key, value')
    .in('key', keys)

  const result: Record<string, Record<string, string>> = {}

  for (const id of pageIds) {
    result[id] = { ...(defaultsMap[id] || {}) }
  }

  if (!error && data) {
    for (const row of data) {
      const id = row.key.replace('page_content:', '')
      try {
        const parsed = JSON.parse(row.value)
        result[id] = { ...result[id], ...parsed }
      } catch {
        // keep defaults
      }
    }
  }

  return result
}
