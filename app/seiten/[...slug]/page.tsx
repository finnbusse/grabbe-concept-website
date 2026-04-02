import { createStaticClient as createClient } from "@/lib/supabase/static"
import { SiteLayout } from "@/components/site-layout"
import { PageHero } from "@/components/page-hero"
import { Breadcrumbs } from "@/components/breadcrumbs"
import { MarkdownContent } from "@/components/markdown-content"
import { BlockContentRenderer } from "@/components/block-content-renderer"
import { notFound } from "next/navigation"
import type { Metadata } from "next"
import { generatePageMetadata, getSEOSettings, generateWebPageJsonLd, JsonLd } from "@/lib/seo"

export const revalidate = 3600

interface Props {
  params: Promise<{ slug: string[] }>
}

export async function generateStaticParams() {
  const supabase = createClient()
  const { data } = await supabase
    .from("pages")
    .select("slug, route_path")
    .eq("status", "published")
    .returns<Array<{ slug: string; route_path: string | null }>>()

  // Exclude pages served by known filesystem routes (unsere-schule, schulleben)
  const knownPrefixes = ["/unsere-schule", "/schulleben"]
  return (data ?? [])
    .filter((page) => !knownPrefixes.some((p) => page.route_path?.startsWith(p)))
    .map((page) => {
      const prefix = page.route_path ? page.route_path.replace(/^\//, '').split('/') : []
      return { slug: [...prefix, page.slug] }
    })
}

/**
 * Resolves a page from the URL segments.
 * Supports strict route mapping:
 *   /my-page          -> slug = "my-page", route_path = "/"
 *   /category/my-page -> slug = "my-page", route_path = "/category"
 */
async function resolvePage(segments: string[]) {
  const supabase = createClient()

  const pageSlug = segments[segments.length - 1]
  const routePath = segments.length > 1 ? "/" + segments.slice(0, -1).join("/") : "/"

  // Point 55: Removed fallback for arbitrary slug matching to enforce uniqueness and canonical safety.
  const { data } = await supabase
    .from("pages")
    .select("*")
    .eq("slug", pageSlug)
    .eq("route_path", routePath)
    .eq("status", "published")
    .single()

  return data
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const page = await resolvePage(slug)
  if (!page) return {}
  const routePrefix = page.route_path || ""
  const canonicalPath = routePrefix
    ? `${routePrefix}/${page.slug}`
    : `/seiten/${page.slug}`
  return generatePageMetadata({
    title: page.seo_title || page.title,
    seoTitleOverride: page.seo_title || undefined,
    description: page.meta_description || undefined,
    ogImage: page.seo_og_image || undefined,
    path: canonicalPath,
    canonicalOverride: page.seo_canonical_override || undefined,
    noIndex: page.seo_no_index || false,
    ogType: (page.og_type as "website" | "article") || "website",
  })
}

import { DynamicPageRenderer } from "@/lib/dynamic-page-renderer"

export default async function DynamicPage({ params }: Props) {
  const { slug } = await params
  const page = await resolvePage(slug)

  if (!page) notFound()

  return <DynamicPageRenderer page={page} />
}
