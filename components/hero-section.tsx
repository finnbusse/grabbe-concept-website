import Image from "next/image"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-foreground text-background">
      <div className="absolute inset-0">
        <Image
          src="/images/hero-school.jpg"
          alt="Grabbe-Gymnasium Schulgebaeude"
          fill
          className="object-cover opacity-30"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-foreground/40 to-foreground/90" />
      </div>
      <div className="relative mx-auto max-w-7xl px-4 pb-24 pt-32 lg:px-8 lg:pb-32 lg:pt-44">
        <div className="max-w-2xl">
          <p className="mb-4 text-sm font-medium uppercase tracking-widest text-primary-foreground/70">
            Christian-Dietrich-Grabbe-Gymnasium Detmold
          </p>
          <h1 className="text-balance font-display text-4xl font-bold leading-tight tracking-tight md:text-5xl lg:text-6xl">
            Deine Talente.{" "}
            <span className="text-primary">Deine Buehne.</span>{" "}
            Dein Grabbe.
          </h1>
          <p className="mt-6 max-w-lg text-pretty text-lg leading-relaxed opacity-80">
            Wir foerdern Deine Talente und staerken Deine Persoenlichkeit.
            Wir gestalten Deine Zukunft mit Dir.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button size="lg" asChild>
              <Link href="/unsere-schule/anmeldung">
                Anmeldung Klasse 5
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="border-background/30 text-background hover:bg-background/10 hover:text-background">
              <Link href="/unsere-schule/profilprojekte">Profilprojekte entdecken</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
