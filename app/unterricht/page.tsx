import { SiteLayout } from "@/components/site-layout"
import { PageHero } from "@/components/page-hero"
import Link from "next/link"
import { BookOpen, GraduationCap, Star, BookMarked, ArrowRight } from "lucide-react"
import { getPageContent, PAGE_DEFAULTS } from "@/lib/page-content"
import { generatePageMetadata } from "@/lib/seo"
import type { Metadata } from "next"

export const revalidate = 3600

export async function generateMetadata(): Promise<Metadata> {
  return generatePageMetadata({
    title: "Unterricht",
    description: "Das Unterrichtsangebot am Grabbe-Gymnasium Detmold – von der Erprobungsstufe bis zum Abitur.",
    path: "/unterricht",
  })
}

const NAV_LINKS: { href: string; icon: typeof BookOpen; title: string; description: string }[] = [
  {
    href: "/unterricht/faecher",
    icon: BookMarked,
    title: "Fächer",
    description: "Alle 20 Fächer am Grabbe-Gymnasium im Überblick.",
  },
  {
    href: "/unsere-schule/erprobungsstufe",
    icon: GraduationCap,
    title: "Erprobungsstufe",
    description: "Der Unterricht in den Klassen 5 und 6 mit besonderem Profil.",
  },
  {
    href: "/unsere-schule/profilprojekte",
    icon: Star,
    title: "Profilprojekte",
    description: "Kunst, Musik, Sport und NaWi – unsere besonderen Profilprojekte.",
  },
  {
    href: "/unsere-schule/oberstufe",
    icon: BookOpen,
    title: "Oberstufe",
    description: "Informationen zur gymnasialen Oberstufe und zum Abitur.",
  },
]

export default async function UnterrichtPage() {
  const content = await getPageContent('landing-unterricht', PAGE_DEFAULTS['landing-unterricht'])

  return (
    <SiteLayout>
      <main>
        <PageHero
          title={content.page_title as string}
          label={content.page_label as string}
          subtitle={content.page_subtitle as string}
          imageUrl={(content.hero_image_url as string) || undefined}
        />

        {/* ═══ Intro + Navigation Links (blue mesh bg) ═══ */}
        <section className="relative py-28 lg:py-36 bg-mesh-blue">
          <div className="mx-auto max-w-6xl px-4 lg:px-8">
            <div className="grid gap-16 lg:grid-cols-2 lg:items-start">
              <div>
                <p className="font-sub text-[11px] uppercase tracking-[0.3em] text-primary">Überblick</p>
                <h2 className="mt-3 font-display text-4xl md:text-5xl tracking-tight text-foreground">
                  {content.page_title}
                </h2>
                <p className="mt-6 text-base leading-relaxed text-muted-foreground">
                  {content.intro_text}
                </p>
              </div>

              <div className="space-y-4">
                {NAV_LINKS.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="group flex items-center gap-5 rounded-2xl border border-border/60 bg-card/80 backdrop-blur-sm p-8 transition-all duration-500 hover:border-primary/30 hover:shadow-xl hover:shadow-primary/[0.06] hover:-translate-y-1"
                  >
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary transition-all duration-500 group-hover:bg-primary group-hover:text-white group-hover:rotate-3 group-hover:scale-110">
                      <link.icon className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-display text-xl text-foreground">{link.title}</h3>
                      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{link.description}</p>
                    </div>
                    <ArrowRight className="h-5 w-5 shrink-0 text-muted-foreground/40 transition-all duration-500 group-hover:text-primary group-hover:translate-x-1" />
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>
    </SiteLayout>
  )
}
