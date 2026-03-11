import { SiteLayout } from "@/components/site-layout"
import { PageHero } from "@/components/page-hero"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { getPageContent, PAGE_DEFAULTS } from "@/lib/page-content"
import { generatePageMetadata } from "@/lib/seo"
import type { Metadata } from "next"

export const revalidate = 3600

export async function generateMetadata(): Promise<Metadata> {
  return generatePageMetadata({
    title: "Fächer",
    description: "Alle Fächer am Grabbe-Gymnasium Detmold im Überblick – von Sprachen über MINT bis Gesellschaftswissenschaften.",
    path: "/unterricht/faecher",
  })
}

const SUBJECTS: { name: string; emoji: string; slug: string }[] = [
  { name: "Biologie", emoji: "🧬", slug: "biologie" },
  { name: "Chemie", emoji: "⚗️", slug: "chemie" },
  { name: "Deutsch", emoji: "📝", slug: "deutsch" },
  { name: "Englisch", emoji: "🇬🇧", slug: "englisch" },
  { name: "Erdkunde", emoji: "🌍", slug: "erdkunde" },
  { name: "Französisch", emoji: "🇫🇷", slug: "franzoesisch" },
  { name: "Geschichte", emoji: "🏛️", slug: "geschichte" },
  { name: "Informatik", emoji: "💻", slug: "informatik" },
  { name: "Kunst", emoji: "🎨", slug: "kunst" },
  { name: "Mathematik", emoji: "📐", slug: "mathematik" },
  { name: "Musik", emoji: "🎵", slug: "musik" },
  { name: "Latein", emoji: "🏺", slug: "latein" },
  { name: "Pädagogik", emoji: "🧠", slug: "paedagogik" },
  { name: "Philosophie", emoji: "💭", slug: "philosophie" },
  { name: "Physik", emoji: "⚛️", slug: "physik" },
  { name: "Politik", emoji: "🗳️", slug: "politik" },
  { name: "Religion", emoji: "✝️", slug: "religion" },
  { name: "Sozialwissenschaften", emoji: "📊", slug: "sozialwissenschaften" },
  { name: "Spanisch", emoji: "🇪🇸", slug: "spanisch" },
  { name: "Sport", emoji: "⚽", slug: "sport" },
]

export default async function FaecherPage() {
  const content = await getPageContent('landing-unterricht-faecher', PAGE_DEFAULTS['landing-unterricht-faecher'])

  return (
    <SiteLayout>
      <main>
        <PageHero
          title={content.page_title as string}
          label={content.page_label as string}
          subtitle={content.page_subtitle as string}
          imageUrl={(content.hero_image_url as string) || undefined}
        />

        {/* ═══ Intro + Subject List (blue mesh bg) ═══ */}
        <section className="relative py-28 lg:py-36 bg-mesh-blue">
          <div className="mx-auto max-w-6xl px-4 lg:px-8">
            <div className="grid gap-16 lg:grid-cols-2 lg:items-start">
              <div>
                <p className="font-sub text-[11px] uppercase tracking-[0.3em] text-primary">Fächerangebot</p>
                <h2 className="mt-3 font-display text-4xl md:text-5xl tracking-tight text-foreground">
                  {content.page_title}
                </h2>
                <p className="mt-6 text-base leading-relaxed text-muted-foreground">
                  {content.intro_text}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2">
                {SUBJECTS.map((subject) => (
                  <Link
                    key={subject.slug}
                    href={`/unterricht/faecher/${subject.slug}`}
                    className="group flex items-center gap-3 rounded-xl border border-border/60 bg-card/80 backdrop-blur-sm px-4 py-3 transition-colors hover:bg-primary/5 hover:border-primary/30"
                  >
                    <span aria-hidden="true" className="text-base">{subject.emoji}</span>
                    <span className="flex-1 text-sm font-medium text-foreground group-hover:text-primary truncate">
                      {subject.name}
                    </span>
                    <ArrowRight className="h-3.5 w-3.5 shrink-0 text-muted-foreground/40 transition-all duration-300 group-hover:text-primary group-hover:translate-x-0.5" />
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
