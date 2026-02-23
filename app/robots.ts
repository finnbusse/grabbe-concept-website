import { getSEOSettings } from "@/lib/seo"

export default async function robots() {
  const seo = await getSEOSettings()
  const sitemapUrl = seo.siteUrl ? `${seo.siteUrl}/sitemap.xml` : undefined

  // Parse the robots.txt content from settings
  const lines = seo.robotsTxt.split("\n").filter(Boolean)
  const rules: { userAgent: string; allow?: string[]; disallow?: string[] }[] = []
  let current: { userAgent: string; allow: string[]; disallow: string[] } | null = null

  for (const line of lines) {
    const trimmed = line.trim()
    if (trimmed.toLowerCase().startsWith("user-agent:")) {
      if (current) rules.push(current)
      current = { userAgent: trimmed.slice(11).trim(), allow: [], disallow: [] }
    } else if (current && trimmed.toLowerCase().startsWith("allow:")) {
      current.allow.push(trimmed.slice(6).trim())
    } else if (current && trimmed.toLowerCase().startsWith("disallow:")) {
      current.disallow.push(trimmed.slice(9).trim())
    }
  }
  if (current) rules.push(current)

  // Fallback if no rules parsed
  if (rules.length === 0) {
    rules.push({
      userAgent: "*",
      allow: ["/"],
      disallow: ["/cms/", "/auth/", "/api/"],
    })
  }

  return {
    rules,
    ...(sitemapUrl ? { sitemap: sitemapUrl } : {}),
  }
}
