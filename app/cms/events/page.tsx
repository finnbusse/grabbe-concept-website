import { createClient } from "@/lib/supabase/server"
import Link from "next/link"
import { Plus, CalendarDays, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DeleteEventButton } from "@/components/cms/delete-event-button"

export default async function CmsEventsPage() {
  const supabase = await createClient()
  const { data: events } = await supabase
    .from("events")
    .select("*")
    .order("event_date", { ascending: true })

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold text-foreground">Termine</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Verwalten Sie schulische Veranstaltungen und Termine.
          </p>
        </div>
        <Button asChild>
          <Link href="/cms/events/new">
            <Plus className="mr-2 h-4 w-4" />
            Neuer Termin
          </Link>
        </Button>
      </div>

      <div className="mt-8 space-y-3">
        {events && events.length > 0 ? (
          events.map((event) => (
            <div
              key={event.id}
              className="flex items-center justify-between rounded-xl border border-border bg-card p-4"
            >
              <div className="flex items-start gap-4">
                <div className="flex h-14 w-14 shrink-0 flex-col items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <span className="text-xs font-medium uppercase">
                    {new Date(event.event_date).toLocaleDateString("de-DE", { month: "short" })}
                  </span>
                  <span className="font-display text-lg font-bold leading-tight">
                    {new Date(event.event_date).getDate()}
                  </span>
                </div>
                <div>
                  <Link
                    href={`/cms/events/${event.id}`}
                    className="font-display text-sm font-semibold text-card-foreground hover:text-primary"
                  >
                    {event.title}
                  </Link>
                  <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <CalendarDays className="h-3 w-3" />
                      {new Date(event.event_date).toLocaleDateString("de-DE", {
                        weekday: "long",
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                      {event.event_time && `, ${event.event_time}`}
                    </span>
                    {event.location && (
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {event.location}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" asChild>
                  <Link href={`/cms/events/${event.id}`}>Bearbeiten</Link>
                </Button>
                <DeleteEventButton eventId={event.id} />
              </div>
            </div>
          ))
        ) : (
          <div className="rounded-2xl border border-dashed border-border py-16 text-center">
            <p className="text-muted-foreground">Noch keine Termine vorhanden.</p>
            <Button asChild className="mt-4">
              <Link href="/cms/events/new">
                <Plus className="mr-2 h-4 w-4" />
                Ersten Termin erstellen
              </Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
