import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import { EventEditor } from "@/components/cms/event-editor"

export default async function EditEventPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data: event } = await supabase.from("events").select("*").eq("id", id).single()

  if (!event) notFound()

  return <EventEditor event={event} />
}
