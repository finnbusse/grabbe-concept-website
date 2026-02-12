import Image from "next/image"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { getSettings } from "@/lib/settings"

export async function HeroSection() {
  const s = await getSettings()

  const headline = s.hero_headline || "Deine Talente. Deine Buehne. Dein Grabbe."
  const subtext = s.hero_subtext || "Wir foerdern Deine Talente und staerken Deine Persoenlichkeit. Wir gestalten Deine Zukunft mit Dir."
  const schoolNameFull = s.school_name_full || "Christian-Dietrich-Grabbe-Gymnasium Detmold"

  // Split headline by period to color the middle part
  const parts = headline.split(".")
  const headlineJsx = parts.length >= 3 ? (
    <>{parts[0]}.{" "}<span className="text-primary">{parts[1].trim()}.</span>{" "}{parts[2].trim()}{parts[2].trim().endsWith(".") ? "" : "."}</>
  ) : headline

  return (
    <section className="relative overflow-hidden bg-foreground text-background">
      <div className="absolute inset-0">
        <Image
          src="/images/hero-school.jpg"
          alt="Grabbe-Gymnasium Schulgebaeude"
          fill
          className="object-cover opacity-25"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-br from-foreground/60 via-foreground/80 to-foreground/95" />
      </div>

      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden>
        <div className="absolute -top-24 -right-24 h-96 w-96 rounded-full bg-primary/10 blur-3xl animate-fade-in" />
        <div className="absolute -bottom-32 -left-32 h-80 w-80 rounded-full bg-primary/5 blur-3xl animate-fade-in" style={{ animationDelay: "0.5s" }} />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 pb-24 pt-32 lg:px-8 lg:pb-36 lg:pt-48">
        <div className="max-w-2xl">
          <p className="mb-4 text-sm font-medium uppercase tracking-widest text-primary-foreground/60 animate-fade-in-up">
            {schoolNameFull}
          </p>
          <h1 className="text-balance font-display text-4xl font-bold leading-tight tracking-tight md:text-5xl lg:text-6xl animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
            {headlineJsx}
          </h1>
          <p className="mt-6 max-w-lg text-pretty text-lg leading-relaxed text-background/70 animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
            {subtext}
          </p>
          <div className="mt-8 flex flex-wrap gap-3 animate-fade-in-up" style={{ animationDelay: "0.3s" }}>
            <Button size="lg" asChild>
              <Link href="/unsere-schule/anmeldung">
                Anmeldung Klasse 5
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="border-background/20 text-background hover:bg-background/10 hover:text-background">
              <Link href="/unsere-schule/profilprojekte">Profilprojekte entdecken</Link>
            </Button>
          </div>
        </div>

        <div className="mt-16 grid grid-cols-2 gap-4 sm:grid-cols-4 animate-fade-in-up" style={{ animationDelay: "0.5s" }}>
          {[
            { value: s.stat_schueler || "900+", label: "Schueler:innen" },
            { value: s.stat_lehrer || "80+", label: "Lehrkraefte" },
            { value: s.stat_profile || "4", label: "Profilprojekte" },
            { value: s.stat_ags || "25+", label: "AGs & Projekte" },
          ].map((stat) => (
            <div key={stat.label} className="rounded-xl border border-background/10 bg-background/5 p-4 backdrop-blur-sm">
              <p className="font-display text-2xl font-bold text-background">{stat.value}</p>
              <p className="text-xs text-background/60">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
