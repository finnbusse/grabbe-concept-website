import { createClient } from "@/lib/supabase/server"

/**
 * Resolves a custom (user-created) page from the database by slug and optional route_path.
 * Used by dynamic route handlers across the site to serve CMS-created pages.
 * 
 * @param slug - The page slug (last segment of the URL)
 * @param routePath - Optional route path prefix (e.g., "/unsere-schule")
 * @returns The page data or null if not found
 */
export async function resolveCustomPage(slug: string, routePath: string = "/") {
  const supabase = await createClient()

  // Security/Correctness Point 54: Removed arbitrary slug-only fallback to enforce strict
  // routing contracts based on route_path + slug uniqueness.
  const { data, error } = await supabase
    .from("pages")
    .select("*")
    .eq("slug", slug)
    .eq("route_path", routePath)
    .eq("status", "published")
    .single()

  if (error || !data) return null

  return data
}
