import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import { EDITABLE_PAGES } from "@/lib/page-content"
import { PageContentEditor } from "@/components/cms/page-content-editor"
import { PageEditor } from "@/components/cms/page-editor"

export default async function PageEditPage({ params }: { params: Promise<{ pageId: string }> }) {
  const { pageId } = await params

  // Check if it's the special "homepage" aggregate
  if (pageId === "homepage") {
    // Redirect to the first homepage section
    const first = EDITABLE_PAGES.find((p) => p.route === "/")
    if (!first) notFound()
    return <PageContentEditor page={first} />
  }

  // Check if it's a static editable page
  const staticPage = EDITABLE_PAGES.find((p) => p.id === pageId)
  if (staticPage) {
    return <PageContentEditor page={staticPage} />
  }

  // Otherwise, load from the pages table (custom page)
  const supabase = await createClient()
  const { data: page } = await supabase.from("pages").select("*").eq("id", pageId).single()

  if (!page) notFound()

  return <PageEditor page={page as unknown as {
    id: string
    title: string
    slug: string
    content: string
    section: string | null
    sort_order: number
    published: boolean
    route_path?: string | null
    hero_image_url?: string | null
    meta_description?: string | null
    seo_og_image?: string | null
  }} />
}
