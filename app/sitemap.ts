import type { MetadataRoute } from "next"
import { createClient } from "@/lib/supabase/server"
import { getSEOSettings } from "@/lib/seo"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const seo = await getSEOSettings()
  const baseUrl = seo.siteUrl

  if (!baseUrl) return []

  const supabase = await createClient()

  // Fetch all published posts
  const { data: posts } = await supabase
    .from("posts")
    .select("slug, updated_at, created_at")
    .eq("published", true)
    .order("created_at", { ascending: false })

  // Fetch all published custom pages
  const { data: pages } = await supabase
    .from("pages")
    .select("slug, route_path, updated_at")
    .eq("published", true)

  const entries: MetadataRoute.Sitemap = []

  // Homepage
  entries.push({
    url: baseUrl,
    lastModified: new Date(),
    changeFrequency: "daily",
    priority: 1.0,
  })

  // Static pages
  const staticPages = [
    { path: "/aktuelles", priority: 0.9, changeFrequency: "daily" as const },
    { path: "/termine", priority: 0.8, changeFrequency: "weekly" as const },
    { path: "/kontakt", priority: 0.7, changeFrequency: "monthly" as const },
    { path: "/downloads", priority: 0.6, changeFrequency: "weekly" as const },
    { path: "/impressum", priority: 0.3, changeFrequency: "yearly" as const },
    { path: "/datenschutz", priority: 0.3, changeFrequency: "yearly" as const },
    { path: "/unsere-schule/erprobungsstufe", priority: 0.7, changeFrequency: "monthly" as const },
    { path: "/unsere-schule/oberstufe", priority: 0.7, changeFrequency: "monthly" as const },
    { path: "/unsere-schule/profilprojekte", priority: 0.7, changeFrequency: "monthly" as const },
    { path: "/unsere-schule/anmeldung", priority: 0.8, changeFrequency: "monthly" as const },
    { path: "/schulleben/faecher-ags", priority: 0.6, changeFrequency: "monthly" as const },
    { path: "/schulleben/nachmittag", priority: 0.6, changeFrequency: "monthly" as const },
    { path: "/schulleben/netzwerk", priority: 0.6, changeFrequency: "monthly" as const },
  ]

  for (const page of staticPages) {
    entries.push({
      url: `${baseUrl}${page.path}`,
      lastModified: new Date(),
      changeFrequency: page.changeFrequency,
      priority: page.priority,
    })
  }

  // Dynamic posts
  if (posts) {
    for (const post of posts) {
      entries.push({
        url: `${baseUrl}/aktuelles/${post.slug}`,
        lastModified: new Date(post.updated_at || post.created_at),
        changeFrequency: "weekly",
        priority: 0.7,
      })
    }
  }

  // Dynamic custom pages
  if (pages) {
    for (const page of pages) {
      const routePrefix = page.route_path || ""
      const fullPath = routePrefix
        ? `${routePrefix}/${page.slug}`
        : `/seiten/${page.slug}`
      entries.push({
        url: `${baseUrl}${fullPath}`,
        lastModified: new Date(page.updated_at),
        changeFrequency: "monthly",
        priority: 0.5,
      })
    }
  }

  return entries
}
