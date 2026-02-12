import { createClient } from "@/lib/supabase/server"
import { FileText, CalendarDays, BookOpen } from "lucide-react"
import Link from "next/link"

export default async function CmsDashboardPage() {
  const supabase = await createClient()
  const [postsRes, pagesRes, eventsRes] = await Promise.all([
    supabase.from("posts").select("id", { count: "exact", head: true }),
    supabase.from("pages").select("id", { count: "exact", head: true }),
    supabase.from("events").select("id", { count: "exact", head: true }),
  ])

  const stats = [
    { icon: FileText, label: "Beitraege", count: postsRes.count ?? 0, href: "/cms/posts", color: "bg-primary/10 text-primary" },
    { icon: BookOpen, label: "Seiten", count: pagesRes.count ?? 0, href: "/cms/pages", color: "bg-emerald-500/10 text-emerald-600" },
    { icon: CalendarDays, label: "Termine", count: eventsRes.count ?? 0, href: "/cms/events", color: "bg-amber-500/10 text-amber-600" },
  ]

  return (
    <div>
      <h1 className="font-display text-3xl font-bold text-foreground">Dashboard</h1>
      <p className="mt-2 text-muted-foreground">
        Willkommen im Content-Management-System des Grabbe-Gymnasiums.
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        {stats.map((stat) => (
          <Link
            key={stat.label}
            href={stat.href}
            className="group rounded-2xl border border-border bg-card p-6 transition-all hover:border-primary/30 hover:shadow-md"
          >
            <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${stat.color}`}>
              <stat.icon className="h-5 w-5" />
            </div>
            <p className="mt-4 font-display text-3xl font-bold text-card-foreground">{stat.count}</p>
            <p className="mt-1 text-sm text-muted-foreground">{stat.label}</p>
          </Link>
        ))}
      </div>

      <div className="mt-10 rounded-2xl border border-border bg-card p-6">
        <h2 className="font-display text-lg font-semibold text-card-foreground">Schnellstart</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Erstellen Sie neue Inhalte fuer die Website.
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link
            href="/cms/posts/new"
            className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Neuer Beitrag
          </Link>
          <Link
            href="/cms/events/new"
            className="rounded-lg border border-border bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted"
          >
            Neuer Termin
          </Link>
        </div>
      </div>
    </div>
  )
}
