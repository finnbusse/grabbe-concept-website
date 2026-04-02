import { createStaticClient } from "@/lib/supabase/static"
import type { Database } from "@/lib/types/database.types"

// Task 108: Consolidate navigation helpers
// Task 109: Shared DTOs for navigation
export type NavItem = Database["public"]["Tables"]["navigation_items"]["Row"]

export interface NavigationTreeItem extends NavItem {
  children?: NavigationTreeItem[]
}

/**
 * Builds a hierarchical tree from a flat array of navigation items
 */
export function buildNavigationTree(items: NavItem[], parentId: string | null = null): NavigationTreeItem[] {
  return items
    .filter(item => item.parent_id === parentId)
    .sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0))
    .map(item => ({
      ...item,
      children: buildNavigationTree(items, item.id)
    }))
}

/**
 * Fetches navigation items for a specific location (header, footer, etc.)
 */
export async function getNavigationItems(location: string): Promise<NavigationTreeItem[]> {
  const supabase = createStaticClient()
  const { data, error } = await supabase
    .from("navigation_items")
    .select("*")
    .eq("location", location)
    .order("sort_order", { ascending: true })

  if (error || !data) return []
  return buildNavigationTree(data)
}
