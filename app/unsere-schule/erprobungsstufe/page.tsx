import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { Heart, Users, Lightbulb, ArrowRight } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export const metadata = {
  title: "Erprobungsstufe - Grabbe-Gymnasium Detmold",
  description: "Informationen zur Erprobungsstufe (Klassen 5 und 6) am Grabbe-Gymnasium Detmold.",
}

export default function ErprobungsstufePage() {
  return (
    <>
      <SiteHeader />
      <main>
        <section className="border-b border-border bg-muted">
          <div className="mx-auto max-w-7xl px-4 pb-12 pt-16 lg:px-8 lg:pb-16 lg:pt-24">
            <p className="text-sm font-medium uppercase tracking-widest text-primary">
              Klassen 5 & 6
            </p>
            <h1 className="mt-3 font-display text-4xl font-bold tracking-tight text-foreground md:text-5xl">
              Erprobungsstufe
            </h1>
            <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
              Entdecke deine Talente! Bringe deine Ideen ein und mach sie sichtbar!
              Ich kann was - und es zaehlt!
            </p>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-16 lg:px-8">
          {/* Values */}
          <div className="grid gap-6 md:grid-cols-3">
            {[
              {
                icon: Lightbulb,
                title: "Deine Talente entdecken",
                text: "Du wirst zunehmend kreativer und selbststaendiger!",
              },
              {
                icon: Users,
                title: "Gemeinschaft bilden",
                text: "Wir beteiligen Dich an immer mehr Entscheidungen!",
              },
              {
                icon: Heart,
                title: "Persoenlichkeit staerken",
                text: "Du kannst was - und es zaehlt!",
              },
            ].map((item) => (
              <div key={item.title} className="rounded-2xl border border-border bg-card p-6 text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <item.icon className="h-6 w-6" />
                </div>
                <h3 className="mt-4 font-display text-lg font-semibold text-card-foreground">{item.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{item.text}</p>
              </div>
            ))}
          </div>

          {/* Content */}
          <div className="mt-16 max-w-3xl space-y-6">
            <p className="text-sm leading-relaxed text-muted-foreground">
              Die Jahrgaenge 5 und 6 bilden eine besondere paedagogische Einheit, die Erprobungsstufe.
              Waehrend dieser Zeit, die fuer Schueler:innen mit dem Uebergang von der Grundschule zum
              Gymnasium viele Veraenderungen mit sich bringt, begleiten wir Ihre Kinder intensiv.
              Anknuepfend an die Lernerfahrungen in der Grundschule fuehren wir die Schueler:innen
              an die Unterrichtsmethoden und Lernangebote des Gymnasiums heran.
            </p>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Das besondere Profil des Grabbe mit den Profilprojekten in Kunst, Musik, Sport oder
              NaWi bietet den Schueler:innen die Moeglichkeit, frei waehlbar in einem der vier
              Profilprojekte fuer ein Jahr in einer gemischten Gruppe neue Lernwege zu entdecken.
              Moderner, vom Leistungsdruck befreiter und die unterschiedlichen Talente und Neigungen
              der Schueler:innen foerdernder Projektunterricht steht dabei im Mittelpunkt.
            </p>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Die Klassenbildung erfolgt dabei nach sozialen Kriterien und beruecksichtigt dabei neben
              der Grundschulzugehoerigkeit auch die Wunschpartner:innen.
            </p>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Wir laden Sie vor den Sommerferien zu einem Begruessungsnachmittag ein, an dem Ihre
              Kinder ihre neuen Mitschueler:innen sowie ihr Klassenleitungsteam und ihren Klassenraum
              kennenlernen. Die ersten Unterrichtstage zum Kennenlernen gestaltet das
              Klassenleitungsteam mit einem paedagogischen Programm und auch in der
              Klassenleitungsstunde liegt der Schwerpunkt auf dem sozialen Lernen. Eine einwoechige
              Klassenfahrt zu Beginn der sechsten Klasse festigt weiterhin die Klassengemeinschaft.
            </p>
          </div>

          <div className="mt-10 flex flex-wrap gap-3">
            <Button asChild>
              <Link href="/unsere-schule/profilprojekte">
                Profilprojekte entdecken
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/unsere-schule/anmeldung">Zur Anmeldung</Link>
            </Button>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  )
}
