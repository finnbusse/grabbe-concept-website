import { SiteLayout } from "@/components/site-layout"
import { PageHero } from "@/components/page-hero"
import { Breadcrumbs } from "@/components/breadcrumbs"
import { MarkdownContent } from "@/components/markdown-content"
import { BlockContentRenderer } from "@/components/block-content-renderer"
import { JsonLd, generateWebPageJsonLd, getSEOSettings } from "@/lib/seo"
import { isBlockContent } from "@/lib/format-helpers"

// Task 60: Centralized Template Renderer for dynamic pages.
export async function DynamicPageRenderer({ page }: { page: any }) {
  const useBlocks = isBlockContent(page.content)
  const routePrefix = page.route_path || ""
  const fullPath = routePrefix ? `${routePrefix}/${page.slug}` : `/seiten/${page.slug}`

  const seo = await getSEOSettings()
  const webPageJsonLd = generateWebPageJsonLd({
    seo,
    title: page.seo_title || page.title,
    description: page.meta_description || seo.defaultDescription,
    url: `${seo.siteUrl}${fullPath}`,
    breadcrumbs: [{ name: page.title, href: fullPath }],
  })

  return (
    <SiteLayout>
      <main>
        <JsonLd data={webPageJsonLd} />
        <PageHero
          title={page.title}
          label={page.section || undefined}
          subtitle={page.hero_subtitle || undefined}
          imageUrl={page.hero_image_url || undefined}
        />
        <Breadcrumbs items={[{ name: page.title, href: fullPath }]} />

        <section className="mx-auto max-w-6xl px-4 py-28 lg:py-36 lg:px-8">
          {useBlocks ? (
            <BlockContentRenderer content={page.content} />
          ) : (
            <MarkdownContent content={page.content} />
          )}
        </section>
      </main>
    </SiteLayout>
  )
}
