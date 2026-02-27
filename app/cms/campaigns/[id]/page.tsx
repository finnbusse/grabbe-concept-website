import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import { CampaignEditor } from "@/components/cms/campaign-editor"

export default async function EditCampaignPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data: campaign } = await supabase.from("campaigns").select("*").eq("id", id).single()

  if (!campaign) notFound()

  return <CampaignEditor campaign={campaign as never} />
}
