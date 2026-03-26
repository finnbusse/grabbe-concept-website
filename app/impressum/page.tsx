import { SiteLayout } from "@/components/site-layout"
import { PageHero } from "@/components/page-hero"
import { getPageContent, PAGE_DEFAULTS } from "@/lib/page-content"
import { getSettings } from "@/lib/settings"
import { createStaticClient } from "@/lib/supabase/static"
import { MarkdownContent } from "@/components/markdown-content"
import { BlockContentRenderer } from "@/components/block-content-renderer"
import { isBlockContent } from "@/lib/format-helpers"
import { generatePageMetadata } from "@/lib/seo"
import type { Metadata } from "next"

export const revalidate = 3600

export async function generateMetadata(): Promise<Metadata> {
  return generatePageMetadata({
    title: "Impressum",
    description: "Impressum des Grabbe-Gymnasium Detmold.",
    path: "/impressum",
  })
}

export default async function ImpressumPage() {
  const supabase = createStaticClient()
  const { data: publishedImpressumRows, error: publishedImpressumError } = await supabase
    .from("pages")
    .select("title, content, hero_image_url, hero_subtitle")
    .eq("section", "impressum")
    .eq("status", "published")
    .order("updated_at", { ascending: false })
    .limit(1)

  const publishedImpressum = publishedImpressumError ? undefined : publishedImpressumRows?.[0]

  if (publishedImpressum) {
    const content = publishedImpressum.content || ""
    const useBlocks = isBlockContent(content)

    return (
      <SiteLayout>
        <main>
          <PageHero
            title={publishedImpressum.title || "Impressum"}
            subtitle={publishedImpressum.hero_subtitle || undefined}
            imageUrl={publishedImpressum.hero_image_url || undefined}
          />
          <section className="mx-auto max-w-6xl px-4 py-28 lg:py-36 lg:px-8">
            {useBlocks ? (
              <BlockContentRenderer content={content} />
            ) : (
              <MarkdownContent content={content} />
            )}
          </section>
        </main>
      </SiteLayout>
    )
  }

  const [content, settings] = await Promise.all([
    getPageContent('impressum', PAGE_DEFAULTS['impressum']),
    getSettings(),
  ])
  const schoolName = settings.school_name_full || settings.school_name
  const schoolAddress = settings.school_address
  let anschrift = content.anschrift as string
  if (schoolAddress) {
    anschrift = schoolName ? `${schoolName}, ${schoolAddress}` : schoolAddress
  }
  const kontaktParts = [
    settings.school_phone ? `Telefon: ${settings.school_phone}` : "",
    settings.school_fax ? `Telefax: ${settings.school_fax}` : "",
    settings.school_email ? `E-Mail: ${settings.school_email}` : "",
  ].filter(Boolean)
  const kontaktInfo = kontaktParts.length > 0 ? kontaktParts.join(", ") : (content.kontakt_info as string)

  return (
    <SiteLayout>
      <main>
        <PageHero title={content.page_title as string} imageUrl={(content.hero_image_url as string) || undefined} />

        <section className="mx-auto max-w-3xl px-4 py-16 lg:px-8">
          <div className="space-y-8">
            <div>
              <h2 className="font-display text-xl font-semibold text-foreground">Verantwortlich</h2>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                {content.verantwortlich}
              </p>
            </div>
            <div>
              <h2 className="font-display text-xl font-semibold text-foreground">Anschrift</h2>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                {anschrift}
              </p>
            </div>
            <div>
              <h2 className="font-display text-xl font-semibold text-foreground">Kontakt</h2>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                {kontaktInfo}
              </p>
            </div>
            <div>
              <h2 className="font-display text-xl font-semibold text-foreground">Schulträger</h2>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                {content.schultraeger}
              </p>
            </div>
            <div>
              <h2 className="font-display text-xl font-semibold text-foreground">Aufsichtsbehörde</h2>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                {content.aufsichtsbehoerde}
              </p>
            </div>
          </div>
        </section>
      </main>
    </SiteLayout>
  )
}
