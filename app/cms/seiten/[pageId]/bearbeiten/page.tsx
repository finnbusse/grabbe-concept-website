import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import { EDITABLE_PAGES, PAGE_DEFAULTS } from "@/lib/page-content"
import { PageContentEditor } from "@/components/cms/page-content-editor"
import { HomepageEditor } from "@/components/cms/homepage-editor"
import { PageWizardProvider } from "@/components/cms/page-wizard-context"
import { PageWizard } from "@/components/cms/page-wizard"
import { isBlockContent } from "@/lib/format-helpers"

export default async function PageEditPage({ params }: { params: Promise<{ pageId: string }> }) {
  const { pageId } = await params

  // Check if it's the special "homepage" aggregate — show all homepage sections
  if (pageId === "homepage") {
    const homepageSections = EDITABLE_PAGES.filter((p) => p.route === "/")
    if (homepageSections.length === 0) notFound()
    return <HomepageEditor sections={homepageSections} />
  }

  // Special case: Impressum should be edited like a normal dynamic subpage (wizard/texteditor)
  if (pageId === "impressum") {
    const supabase = await createClient()
    const { data: impressumPages } = await supabase
      .from("pages")
      .select("*")
      .eq("section", "impressum")
      .order("updated_at", { ascending: false })
      .limit(1)

    const page = impressumPages?.[0]

    const defaultImpressum = PAGE_DEFAULTS["impressum"] as Record<string, string>
    const legacyMarkdown = [
      "## Verantwortlich",
      defaultImpressum.verantwortlich || "",
      "",
      "## Anschrift",
      defaultImpressum.anschrift || "",
      "",
      "## Kontakt",
      defaultImpressum.kontakt_info || "",
      "",
      "## Schulträger",
      defaultImpressum.schultraeger || "",
      "",
      "## Aufsichtsbehörde",
      defaultImpressum.aufsichtsbehoerde || "",
    ].join("\n")

    const p = page as
      | {
          id: string
          title: string
          slug: string
          content: string
          section: string | null
          sort_order: number
          status: string
          route_path: string | null
          hero_image_url: string | null
          hero_subtitle: string | null
          meta_description: string | null
          seo_og_image: string | null
        }
      | undefined

    return (
      <PageWizardProvider
        initialState={{
          title: p?.title || "Impressum",
          slug: p?.slug || "impressum",
          routePath: p?.route_path || "",
          heroImageUrl: p?.hero_image_url ?? defaultImpressum.hero_image_url ?? null,
          heroSubtitle: p?.hero_subtitle || "",
          tagIds: [],
          contentMode: p?.content && isBlockContent(p.content) ? "blocks" : "markdown",
          blocks: p?.content && isBlockContent(p.content) ? JSON.parse(p.content) : [],
          markdownContent: p?.content
            ? isBlockContent(p.content)
              ? ""
              : p.content
            : legacyMarkdown,
          metaDescription: p?.meta_description || "",
          seoTitle: "",
          ogImageUrl: p?.seo_og_image ?? null,
          currentStep: 2,
          isSaving: false,
          isPublished: p?.status === "published",
          pageId: p?.id || null,
          savedPageId: null,
          lastAutoSaved: null,
          section: "impressum",
          sortOrder: p?.sort_order || 0,
        }}
      >
        <PageWizard editMode />
      </PageWizardProvider>
    )
  }

  // Check if it's a static editable page
  const staticPage = EDITABLE_PAGES.find((p) => p.id === pageId)
  if (staticPage) {
    return <PageContentEditor page={staticPage} />
  }

  // Otherwise, load from the pages table (custom page) — use the three-step wizard
  const supabase = await createClient()
  const { data: page } = await supabase.from("pages").select("*").eq("id", pageId).single()

  if (!page) notFound()

  const p = page as unknown as {
    id: string
    title: string
    slug: string
    content: string
    section: string | null
    sort_order: number
    status: string
    route_path: string | null
    hero_image_url: string | null
    hero_subtitle: string | null
    meta_description: string | null
    seo_og_image: string | null
    created_at: string
  }

  return (
    <PageWizardProvider initialState={{
      title: p.title,
      slug: p.slug,
      routePath: p.route_path || "",
      heroImageUrl: p.hero_image_url,
      heroSubtitle: p.hero_subtitle || "",
      tagIds: [],
      contentMode: isBlockContent(p.content) ? "blocks" : "markdown",
      blocks: isBlockContent(p.content) ? JSON.parse(p.content) : [],
      markdownContent: isBlockContent(p.content) ? "" : p.content,
      metaDescription: p.meta_description || "",
      seoTitle: "",
      ogImageUrl: p.seo_og_image,
      currentStep: 2,
      isSaving: false,
      isPublished: p.status === "published",
      pageId: p.id,
      savedPageId: null,
      lastAutoSaved: null,
      section: p.section || "allgemein",
      sortOrder: p.sort_order || 0,
    }}>
      <PageWizard editMode />
    </PageWizardProvider>
  )
}
