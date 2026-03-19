import { SiteLayout } from "@/components/site-layout"
import { Breadcrumbs } from "@/components/breadcrumbs"
import { ShareButton } from "@/components/share-button"
import { createStaticClient as createClient } from "@/lib/supabase/static"
import { notFound } from "next/navigation"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { Metadata } from "next"
import type { PresentationBlock } from "@/lib/types/presentation-blocks"
import {
  generatePageMetadata,
  getSEOSettings,
  generateWebPageJsonLd,
  JsonLd,
} from "@/lib/seo"
import { AnimateOnScroll } from "@/components/animate-on-scroll"
import { CinematicHeroFrame, DepthLayer, EditorialReveal, SplitRevealHeadline } from "@/components/cinematic-primitives"

export const revalidate = 300

// ============================================================================
// Data helpers
// ============================================================================

async function getPresentation(slug: string) {
  const supabase = createClient()
  const { data } = await supabase
    .from("presentations")
    .select("*")
    .eq("slug", slug)
    .eq("status", "published")
    .single()
  return data
}

export async function generateStaticParams() {
  try {
    const supabase = createClient()
    const { data } = await supabase
      .from("presentations")
      .select("slug")
      .eq("status", "published")
      .returns<Array<{ slug: string }>>()
    return (data ?? []).map((p) => ({ slug: p.slug }))
  } catch {
    return []
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const pres = await getPresentation(slug)
  if (!pres) return {}

  return generatePageMetadata({
    title: pres.title,
    description: pres.meta_description || pres.subtitle || undefined,
    ogImage: pres.seo_og_image || pres.cover_image_url || undefined,
    path: `/p/${pres.slug}`,
    type: "article",
    publishedTime: pres.created_at,
    modifiedTime: pres.updated_at,
  })
}

// ============================================================================
// Video URL helpers
// ============================================================================

function extractEmbedUrl(url: string): string | null {
  // YouTube
  const ytMatch = url.match(
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/
  )
  if (ytMatch) return `https://www.youtube-nocookie.com/embed/${ytMatch[1]}`

  // Vimeo
  const vimeoMatch = url.match(/vimeo\.com\/(?:video\/)?(\d+)/)
  if (vimeoMatch) return `https://player.vimeo.com/video/${vimeoMatch[1]}`

  return null
}

// ============================================================================
// Hero section (homepage-style large image with text overlay)
// ============================================================================

function PresentationHero({ block, title, subtitle }: {
  block?: PresentationBlock & { type: "hero" }
  title: string
  subtitle?: string | null
}) {
  const imageUrl = block?.backgroundImageUrl
  const heading = block?.heading || title
  const sub = block?.subtitle || subtitle || ""
  const ctaLabel = block?.ctaLabel
  const ctaUrl = block?.ctaUrl

  return (
    <section className="relative overflow-hidden bg-background">
      <CinematicHeroFrame contentClassName="flex h-full flex-col justify-end">
        <div className="absolute inset-0">
          {imageUrl ? (
            <DepthLayer speed={0.14} className="absolute inset-0 h-full w-full">
              <img src={imageUrl} alt="" className="h-full w-full object-cover" />
            </DepthLayer>
          ) : (
            <div
              className="absolute inset-0"
              style={{
                background: "linear-gradient(135deg, hsl(var(--primary)) 0%, hsl(var(--primary) / 0.7) 50%, hsl(var(--primary) / 0.4) 100%)",
              }}
            />
          )}
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(6,14,28,0.14),rgba(6,14,28,0.6))]" />
        </div>

        <div className="relative z-10 max-w-4xl">
          <EditorialReveal className="mb-4 inline-flex rounded-full border border-white/15 bg-white/10 px-4 py-2 text-[11px] uppercase tracking-[0.3em] text-white/76 backdrop-blur-md">
            Präsentation
          </EditorialReveal>
          <h1 className="font-display text-4xl leading-[0.96] tracking-[-0.05em] text-white sm:text-5xl lg:text-7xl">
            <SplitRevealHeadline text={heading} />
          </h1>
          {sub && (
            <EditorialReveal delay={200} className="mt-5 max-w-2xl text-sm leading-7 text-white/84 sm:text-base">
              {sub}
            </EditorialReveal>
          )}
          {ctaLabel && ctaUrl && (
            <EditorialReveal delay={320} className="mt-7">
              <Link
                href={ctaUrl}
                className="hover-lift inline-flex items-center gap-2 rounded-full bg-white/95 px-5 py-3 text-sm font-medium text-primary shadow-lg transition-all hover:bg-white hover:shadow-xl"
              >
                {ctaLabel}
              </Link>
            </EditorialReveal>
          )}
        </div>
      </CinematicHeroFrame>
    </section>
  )
}

// ============================================================================
// Block renderer (non-hero blocks)
// ============================================================================

function PresentationBlockRenderer({ block }: { block: PresentationBlock }) {
  switch (block.type) {
    case "hero":
      // Hero is rendered separately at the top
      return null

    case "text": {
      const alignClass =
        block.alignment === "center" ? "text-center mx-auto" : ""
      const Tag =
        block.size === "h1"
          ? "h1"
          : block.size === "h2"
            ? "h2"
            : block.size === "h3"
              ? "h3"
              : "p"
      const sizeClass =
        block.size === "h1"
          ? "font-display text-3xl font-bold md:text-5xl"
          : block.size === "h2"
            ? "font-display text-2xl font-semibold md:text-4xl"
            : block.size === "h3"
              ? "font-display text-xl font-semibold md:text-2xl"
              : block.isLead
                ? "text-lg leading-relaxed text-muted-foreground md:text-xl"
                : "text-base leading-relaxed text-muted-foreground"

      return (
        <AnimateOnScroll>
          <Tag className={`${sizeClass} ${alignClass}`}>
            {block.content}
          </Tag>
        </AnimateOnScroll>
      )
    }

    case "image_full":
      return (
        <AnimateOnScroll>
          <figure>
            <img
              src={block.imageUrl}
              alt={block.alt || "Bild"}
              className="h-auto w-full rounded-lg object-cover"
            />
            {block.caption && (
              <figcaption className="mt-3 text-sm text-muted-foreground">
                {block.caption}
              </figcaption>
            )}
          </figure>
        </AnimateOnScroll>
      )

    case "gallery": {
      const colsClass =
        block.columns === 4
          ? "grid-cols-2 md:grid-cols-4"
          : block.columns === 3
            ? "grid-cols-2 md:grid-cols-3"
            : "grid-cols-2"
      return (
        <div className={`grid gap-4 ${colsClass}`}>
          {block.images.map((img, i) => (
            <AnimateOnScroll key={i}>
              <figure>
                <img
                  src={img.imageUrl}
                  alt={img.alt || "Galeriebild"}
                  className="h-auto w-full rounded-lg object-cover"
                />
                {img.caption && (
                  <figcaption className="mt-2 text-sm text-muted-foreground">
                    {img.caption}
                  </figcaption>
                )}
              </figure>
            </AnimateOnScroll>
          ))}
        </div>
      )
    }

    case "quote":
      return (
        <AnimateOnScroll>
          <blockquote className="border-l-4 border-primary pl-6">
            <p
              className="font-display text-xl font-medium italic leading-relaxed md:text-2xl"
              style={
                block.accentColor
                  ? { color: block.accentColor }
                  : undefined
              }
            >
              &ldquo;{block.text}&rdquo;
            </p>
            {block.attribution && (
              <footer className="mt-4 text-sm font-medium text-muted-foreground">
                — {block.attribution}
              </footer>
            )}
          </blockquote>
        </AnimateOnScroll>
      )

    case "video": {
      const embedUrl = extractEmbedUrl(block.url)
      if (!embedUrl) return null
      return (
        <AnimateOnScroll>
          <div className="aspect-video overflow-hidden rounded-xl">
            <iframe
              src={embedUrl}
              className="h-full w-full"
              allowFullScreen
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              title={block.caption || "Video"}
            />
          </div>
          {block.caption && (
            <p className="mt-3 text-center text-sm text-muted-foreground">
              {block.caption}
            </p>
          )}
        </AnimateOnScroll>
      )
    }

    case "feature_cards":
      return (
        <AnimateOnScroll>
          <div className="cinematic-card-grid grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {block.cards.map((card, i) => (
              <div
                key={i}
                className="cinematic-panel hover-lift p-6"
              >
                <h3 className="font-display text-lg font-semibold text-card-foreground">
                  {card.heading}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {card.text}
                </p>
              </div>
            ))}
          </div>
        </AnimateOnScroll>
      )

    case "divider": {
      const styleClass =
        block.style === "dots"
          ? "border-none text-center before:content-['···'] before:text-2xl before:tracking-[0.5em] before:text-muted-foreground"
          : block.style === "wave"
            ? "border-none h-px bg-gradient-to-r from-transparent via-border to-transparent"
            : "border-border"
      return <hr className={styleClass} />
    }

    case "stats":
      return (
        <AnimateOnScroll>
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            {block.items.map((stat, i) => (
              <div key={i} className="text-center">
                <p className="font-display text-4xl font-bold text-primary md:text-5xl">
                  {stat.value}
                </p>
                <p className="mt-2 text-sm text-muted-foreground">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </AnimateOnScroll>
      )

    case "two_column": {
      const splitClass =
        block.split === "60/40"
          ? "lg:grid-cols-[3fr_2fr]"
          : block.split === "40/60"
            ? "lg:grid-cols-[2fr_3fr]"
            : "lg:grid-cols-2"
      const textEl = (
        <div
          className="prose prose-neutral max-w-none dark:prose-invert"
          dangerouslySetInnerHTML={{ __html: block.textContent }}
        />
      )
      const imageEl = (
        <img
          src={block.imageUrl}
          alt={block.imageAlt || "Bild"}
          className="h-auto w-full rounded-lg object-cover"
        />
      )
      return (
        <AnimateOnScroll>
          <div className={`grid items-center gap-8 ${splitClass}`}>
            {block.imagePosition === "left" ? (
              <>
                {imageEl}
                {textEl}
              </>
            ) : (
              <>
                {textEl}
                {imageEl}
              </>
            )}
          </div>
        </AnimateOnScroll>
      )
    }

    default:
      return null
  }
}

// ============================================================================
// Page
// ============================================================================

export default async function PresentationPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const supabase = createClient()

  const { data: pres } = await supabase
    .from("presentations")
    .select("*")
    .eq("slug", slug)
    .eq("status", "published")
    .single()

  if (!pres) notFound()

  const blocks = (pres.blocks ?? []) as unknown as PresentationBlock[]

  // Find the hero block (first one)
  const heroBlock = blocks.find((b) => b.type === "hero") as (PresentationBlock & { type: "hero" }) | undefined
  const nonHeroBlocks = blocks.filter((b) => b.type !== "hero")

  // JSON-LD
  const seo = await getSEOSettings()
  const pageUrl = `${seo.siteUrl}/p/${slug}`

  const creativeWorkJsonLd = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: pres.title,
    description: pres.meta_description || pres.subtitle || "",
    url: pageUrl,
    ...(pres.cover_image_url ? { image: pres.cover_image_url } : {}),
    datePublished: pres.created_at,
    dateModified: pres.updated_at,
    inLanguage: "de-DE",
    publisher: {
      "@type": seo.schemaType || "EducationalOrganization",
      name: seo.orgName,
    },
  }

  const webPageJsonLd = generateWebPageJsonLd({
    seo,
    title: pres.title,
    description: pres.meta_description || pres.subtitle || seo.defaultDescription,
    url: pageUrl,
    breadcrumbs: [
      { name: "Aktuelles", href: "/aktuelles" },
      { name: pres.title, href: `/p/${slug}` },
    ],
  })

  return (
    <SiteLayout>
      <main className="cinematic-shell">
        <JsonLd data={creativeWorkJsonLd} />
        <JsonLd data={webPageJsonLd} />

        {/* Homepage-style hero with large image */}
        <PresentationHero
          block={heroBlock}
          title={pres.title}
          subtitle={pres.subtitle}
        />

        <Breadcrumbs
          items={[
            { name: "Aktuelles", href: "/aktuelles" },
            { name: pres.title, href: `/p/${slug}` },
          ]}
        />

        {/* Content blocks */}
        <article className="cinematic-container space-y-12 py-12 lg:py-16 max-w-4xl">
          {nonHeroBlocks.map((block) => (
            <PresentationBlockRenderer key={block.id} block={block} />
          ))}
        </article>

        {/* Footer actions */}
        <div className="cinematic-container max-w-4xl border-t border-border/60 py-6">
          <div className="flex items-center justify-between">
            <Button variant="outline" size="sm" asChild>
              <Link href="/aktuelles">
                <ArrowLeft className="mr-2 h-4 w-4" />
                {"Zurück zu Aktuelles"}
              </Link>
            </Button>
            <ShareButton title={pres.title} text={pres.subtitle || undefined} />
          </div>
        </div>
      </main>
    </SiteLayout>
  )
}
