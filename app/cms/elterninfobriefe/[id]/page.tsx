import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import { ParentLetterWizardProvider } from "@/components/cms/parent-letter-wizard-context"
import { ParentLetterWizard } from "@/components/cms/parent-letter-wizard"

export default async function EditParentLetterPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data: letter } = await supabase.from("parent_letters").select("*").eq("id", id).single()

  if (!letter) notFound()

  const l = letter as unknown as {
    id: string
    title: string
    slug: string
    content: unknown
    number: number
    status: string
    date_from: string | null
    date_to: string | null
  }

  const blocks = Array.isArray(l.content) ? l.content : []

  return (
    <ParentLetterWizardProvider initialState={{
      title: l.title,
      dateFrom: l.date_from || "",
      dateTo: l.date_to || "",
      coverImageUrl: null,
      blocks,
      currentStep: 2,
      isSaving: false,
      isPublished: l.status === "published",
      letterId: l.id,
      letterNumber: l.number,
      lastAutoSaved: null,
    }}>
      <ParentLetterWizard editMode />
    </ParentLetterWizardProvider>
  )
}
