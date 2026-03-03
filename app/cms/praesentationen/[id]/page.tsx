import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import { PresentationWizardProvider } from "@/components/cms/presentation-wizard-context"
import { PresentationWizard } from "@/components/cms/presentation-wizard"
import type { PresentationBlock } from "@/lib/types/presentation-blocks"

export default async function EditPresentationPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data: presentation } = await supabase.from("presentations").select("*").eq("id", id).single()

  if (!presentation) notFound()

  const p = presentation as unknown as {
    id: string
    title: string
    slug: string
    subtitle: string | null
    blocks: PresentationBlock[] | string
    status: string
    show_on_aktuelles: boolean
    tag_ids: string[] | null
    cover_image_url: string | null
    meta_description: string | null
    seo_og_image: string | null
  }

  const blocks: PresentationBlock[] =
    typeof p.blocks === "string" ? JSON.parse(p.blocks) : Array.isArray(p.blocks) ? p.blocks : []

  return (
    <PresentationWizardProvider
      initialState={{
        title: p.title,
        slug: p.slug,
        subtitle: p.subtitle || "",
        coverImageUrl: p.cover_image_url,
        tagIds: p.tag_ids || [],
        blocks,
        showOnAktuelles: p.show_on_aktuelles ?? false,
        metaDescription: p.meta_description || "",
        seoOgImage: p.seo_og_image,
        currentStep: 2,
        isSaving: false,
        isPublished: p.status === "published",
        presentationId: p.id,
        lastAutoSaved: null,
      }}
    >
      <PresentationWizard editMode />
    </PresentationWizardProvider>
  )
}
