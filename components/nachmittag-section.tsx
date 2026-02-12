import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

export function NachmittagSection() {
  return (
    <section className="bg-primary text-primary-foreground">
      <div className="mx-auto max-w-7xl px-4 py-20 lg:px-8 lg:py-28">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <div>
            <p className="text-sm font-medium uppercase tracking-widest opacity-70">
              Nachmittags am Grabbe
            </p>
            <h2 className="mt-3 text-balance font-display text-3xl font-bold tracking-tight md:text-4xl">
              {"\"Verlaesslich und flexibel\""}
            </h2>
            <p className="mt-2 text-sm opacity-70">Beate Bossmanns</p>
            <p className="mt-6 text-pretty leading-relaxed opacity-90">
              Nach Unterrichtsschluss bietet das Grabbe-Gymnasium mit einem breiten Spektrum an
              Nachmittagsaktivitaeten eine verlaessliche und flexibel gestaltbare Betreuungszeit
              bis 15:30 Uhr an. Neben unserer verlaesslichen Nachmittagsbetreuung mit offenen
              Betreuungszeiten kann Ihr Kind aus zahlreichen AG-Angeboten waehlen oder in der
              Hausaufgabenbetreuung unter Anleitung unserer Schuelertutorinnen und -tutoren
              Hausaufgaben erledigen.
            </p>
          </div>
          <div className="space-y-4">
            <div className="rounded-2xl bg-primary-foreground/10 p-6 backdrop-blur">
              <h3 className="font-display text-lg font-semibold">Betreuungsangebote</h3>
              <ul className="mt-3 space-y-2 text-sm opacity-90">
                <li>Offene Betreuungszeiten in modernen Raeumen</li>
                <li>Zahlreiche AG-Angebote am Nachmittag</li>
                <li>Hausaufgabenbetreuung durch Schuelertutoren</li>
                <li>Module fuer ein halbes Jahr waehlbar</li>
                <li>Mensa mit Kioskangebot und Mittagessen (LKS)</li>
              </ul>
            </div>
            <Button variant="secondary" size="lg" asChild className="w-full sm:w-auto">
              <Link href="/schulleben/nachmittag">
                Weitere Informationen
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
