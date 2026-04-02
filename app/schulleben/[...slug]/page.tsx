import { resolveCustomPage } from "@/lib/resolve-page"
import { createStaticClient } from "@/lib/supabase/static"
import { SiteLayout } from "@/components/site-layout"
import { PageHero } from "@/components/page-hero"
import { Breadcrumbs } from "@/components/breadcrumbs"
import { MarkdownContent } from "@/components/markdown-content"
import { BlockContentRenderer } from "@/components/block-content-renderer"
import { notFound } from "next/navigation"
import type { Metadata } from "next"
import { generatePageMetadata } from "@/lib/seo"

export const revalidate = 3600

interface Props {
  params: Promise<{ slug: string[] }>
}

export async function generateStaticParams() {
  const supabase = createStaticClient()
  const { data } = await supabase
    .from("pages")
    .select("slug, route_path")
    .eq("status", "published")
    .like("route_path", "/schulleben%")
    .returns<Array<{ slug: string; route_path: string | null }>>()
  return (data ?? []).map((page) => {
    const segments = page.route_path
      ? page.route_path.replace(/^\/schulleben\/?/, '').split('/').filter(Boolean)
      : []
    return { slug: [...segments, page.slug] }
  })
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const pageSlug = slug[slug.length - 1]
  const routePath = "/schulleben" + (slug.length > 1 ? "/" + slug.slice(0, -1).join("/") : "")
  const page = await resolveCustomPage(pageSlug, routePath)
  if (!page) return {}
  return generatePageMetadata({
    title: page.title,
    description: page.meta_description || undefined,
    ogImage: page.seo_og_image || undefined,
    path: `/schulleben/${slug.join("/")}`,
  })
}

import { DynamicPageRenderer } from "@/lib/dynamic-page-renderer"

export default async function SchullebenDynamicPage({ params }: Props) {
  const { slug } = await params
  const pageSlug = slug[slug.length - 1]
  const routePath = "/schulleben" + (slug.length > 1 ? "/" + slug.slice(0, -1).join("/") : "")
  const page = await resolveCustomPage(pageSlug, routePath)

  if (!page) notFound()

  return <DynamicPageRenderer page={page} />
}
