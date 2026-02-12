import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { createClient } from "@/lib/supabase/server"
import { CalendarDays, ArrowRight } from "lucide-react"
import Link from "next/link"

export const metadata = {
  title: "Aktuelles - Grabbe-Gymnasium Detmold",
  description: "Neuigkeiten und aktuelle Meldungen vom Grabbe-Gymnasium Detmold.",
}

export default async function AktuellesPage() {
  const supabase = await createClient()
  const { data: posts } = await supabase
    .from("posts")
    .select("*")
    .eq("published", true)
    .order("created_at", { ascending: false })
    .limit(20)

  return (
    <>
      <SiteHeader />
      <main>
        {/* Header */}
        <section className="border-b border-border bg-muted">
          <div className="mx-auto max-w-7xl px-4 pb-12 pt-16 lg:px-8 lg:pb-16 lg:pt-24">
            <p className="text-sm font-medium uppercase tracking-widest text-primary">
              Neuigkeiten
            </p>
            <h1 className="mt-3 font-display text-4xl font-bold tracking-tight text-foreground md:text-5xl">
              Aktuelles
            </h1>
            <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
              Bleiben Sie informiert ueber Veranstaltungen, Projekte und Neuigkeiten am Grabbe-Gymnasium.
            </p>
          </div>
        </section>

        {/* Posts */}
        <section className="mx-auto max-w-7xl px-4 py-16 lg:px-8">
          {posts && posts.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {posts.map((post) => (
                <Link
                  key={post.id}
                  href={`/aktuelles/${post.slug}`}
                  className="group flex flex-col rounded-2xl border border-border bg-card p-6 transition-all hover:border-primary/30 hover:shadow-lg"
                >
                  {post.category && (
                    <span className="mb-3 w-fit rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                      {post.category}
                    </span>
                  )}
                  <h2 className="font-display text-lg font-semibold text-card-foreground group-hover:text-primary">
                    {post.title}
                  </h2>
                  {post.excerpt && (
                    <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
                      {post.excerpt}
                    </p>
                  )}
                  <div className="mt-4 flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <CalendarDays className="h-3.5 w-3.5" />
                      {new Date(post.created_at).toLocaleDateString("de-DE", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </div>
                    <ArrowRight className="h-4 w-4 text-primary opacity-0 transition-opacity group-hover:opacity-100" />
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-border py-20 text-center">
              <CalendarDays className="mx-auto h-10 w-10 text-muted-foreground/40" />
              <h2 className="mt-4 font-display text-xl font-semibold text-foreground">
                Noch keine Beitraege
              </h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Neue Beitraege werden hier angezeigt, sobald sie im CMS veroeffentlicht werden.
              </p>
            </div>
          )}
        </section>
      </main>
      <SiteFooter />
    </>
  )
}
