import { Suspense } from "react"
import { SiteLayout } from "@/components/site-layout"
import { PageHero } from "@/components/page-hero"
import { Breadcrumbs } from "@/components/breadcrumbs"
import { createStaticClient as createClient } from "@/lib/supabase/static"
import { getPageContent, PAGE_DEFAULTS } from "@/lib/page-content"
import type { PostListItem } from "@/lib/types/database.types"
import { AktuellesContent } from "@/components/aktuelles-content"
import type { ContentItem } from "@/components/aktuelles-content"
import { generatePageMetadata } from "@/lib/seo"
import type { Metadata } from "next"
import { enrichPostsWithAuthors } from "@/lib/author-enricher"

export const revalidate = 300

export async function generateMetadata(): Promise<Metadata> {
  return generatePageMetadata({
    title: "Aktuelles",
    description: "Neuigkeiten und aktuelle Meldungen vom Grabbe-Gymnasium Detmold.",
    path: "/aktuelles",
  })
}

export default async function AktuellesPage() {
  const [heroContent] = await Promise.all([
    getPageContent('aktuelles', PAGE_DEFAULTS['aktuelles']),
  ])
  const supabase = createClient()
  const heroImageUrl = (heroContent.hero_image_url as string) || undefined

  // Fetch posts, presentations, and parent letters in parallel
  // Supabase returns { data: null } for non-existent tables — handled below
  const [postsResult, presentationsResult, parentLettersResult] = await Promise.all([
    supabase
      .from("posts")
      .select("id, title, slug, excerpt, category, author_name, user_id, event_date, created_at")
      .eq("status", "published")
      .order("event_date", { ascending: false, nullsFirst: false })
      .order("created_at", { ascending: false })
      .returns<PostListItem[]>(),
    supabase
      .from("presentations")
      .select("id, title, slug, subtitle, cover_image_url, created_at")
      .eq("status", "published")
      .eq("show_on_aktuelles", true)
      .order("created_at", { ascending: false }),
    supabase
      .from("parent_letters")
      .select("id, number, title, slug, date_from, date_to, created_at")
      .eq("status", "published")
      .order("created_at", { ascending: false }),
  ])

  const rawPosts = postsResult.data || []
  const presentations = presentationsResult.data || []
  const parentLetters = parentLettersResult.data || []

  // Task 99: Fetch author profiles for posts via shared enricher
  const enrichedPostsData = await enrichPostsWithAuthors(rawPosts)

  // Build unified content items
  const newsItems: ContentItem[] = enrichedPostsData.map((post) => {
    const profile = post.author_profile
    const authorName = post.author_name || (profile ? [profile.title, profile.first_name, profile.last_name].filter(Boolean).join(" ") : null)
    return {
      type: "news",
      id: post.id,
      title: post.title,
      slug: post.slug,
      href: `/aktuelles/${post.slug}`,
      date: post.event_date || post.created_at,
      excerpt: post.excerpt,
      category: post.category,
      authorName: authorName || null,
      authorAvatar: profile?.avatar_url ?? null,
      authorInitials: profile
        ? `${profile.first_name?.charAt(0) || ""}${profile.last_name?.charAt(0) || ""}`
        : undefined,
    }
  })

  const presentationItems: ContentItem[] = presentations.map((p) => ({
    type: "presentation",
    id: p.id,
    title: p.title,
    slug: p.slug,
    href: `/p/${p.slug}`,
    date: p.created_at,
    subtitle: p.subtitle,
    coverImageUrl: p.cover_image_url,
  }))

  const parentLetterItems: ContentItem[] = parentLetters.map((pl) => {
    const period = pl.date_from && pl.date_to
      ? `${new Date(pl.date_from).toLocaleDateString("de-DE")} – ${new Date(pl.date_to).toLocaleDateString("de-DE")}`
      : pl.date_from
        ? new Date(pl.date_from).toLocaleDateString("de-DE")
        : null
    return {
      type: "parent_letter",
      id: pl.id,
      title: pl.title,
      slug: pl.slug,
      href: `/aktuelles/${pl.slug}`,
      date: pl.created_at,
      number: pl.number,
      datePeriod: period,
    }
  })

  const items: ContentItem[] = [...newsItems, ...presentationItems, ...parentLetterItems]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  return (
    <SiteLayout>
      <main>
        <PageHero
          title="Aktuelles"
          label="Neuigkeiten"
          subtitle="Bleiben Sie informiert über Veranstaltungen, Projekte und Neuigkeiten am Grabbe-Gymnasium."
          imageUrl={heroImageUrl}
        />
        <Breadcrumbs items={[{ name: "Aktuelles", href: "/aktuelles" }]} />

        <Suspense fallback={null}>
          <AktuellesContent items={items} />
        </Suspense>
      </main>
    </SiteLayout>
  )
}
