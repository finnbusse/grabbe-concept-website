import Link from "next/link"
import { Mail, Phone, MapPin, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

export function ContactSection() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-20 lg:px-8 lg:py-28">
      <div className="grid gap-12 lg:grid-cols-2">
        <div>
          <p className="text-sm font-medium uppercase tracking-widest text-primary">
            Kontakt
          </p>
          <h2 className="mt-3 text-balance font-display text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            So finden Sie uns
          </h2>
          <p className="mt-4 text-muted-foreground">
            Du bist in hoechstens 30 Minuten bei uns - mit Bahn, Bus, Fahrrad oder zu Fuss.
          </p>
          <div className="mt-8 space-y-4">
            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <MapPin className="h-5 w-5" />
              </div>
              <div>
                <p className="font-medium text-foreground">Adresse</p>
                <p className="text-sm text-muted-foreground">
                  Christian-Dietrich-Grabbe-Gymnasium<br />
                  Kuester-Meyer-Platz 2<br />
                  32756 Detmold
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Phone className="h-5 w-5" />
              </div>
              <div>
                <p className="font-medium text-foreground">Telefon</p>
                <p className="text-sm text-muted-foreground">05231 - 99260</p>
                <p className="text-xs text-muted-foreground">Fax: 05231 - 992616</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Mail className="h-5 w-5" />
              </div>
              <div>
                <p className="font-medium text-foreground">E-Mail</p>
                <a
                  href="mailto:sekretariat@grabbe.nrw.schule"
                  className="text-sm text-primary hover:underline"
                >
                  sekretariat@grabbe.nrw.schule
                </a>
              </div>
            </div>
          </div>
          <Button className="mt-8" asChild>
            <Link href="/kontakt">
              Alle Ansprechpartner:innen
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>

        {/* Schulleitung */}
        <div className="rounded-2xl border border-border bg-card p-8">
          <h3 className="font-display text-xl font-semibold text-card-foreground">Schulleitung</h3>
          <div className="mt-6 space-y-6">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-muted font-display text-sm font-bold text-muted-foreground">
                CH
              </div>
              <div>
                <p className="font-medium text-card-foreground">Dr. Claus Hilbing</p>
                <p className="text-sm text-muted-foreground">Schulleiter</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Personal- und Organisationsentwicklung, Unterrichtsverteilung, Didaktische Koordination
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-muted font-display text-sm font-bold text-muted-foreground">
                TB
              </div>
              <div>
                <p className="font-medium text-card-foreground">Tanja Brentrup-Lappe</p>
                <p className="text-sm text-muted-foreground">Staendige Vertretung (komm.)</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Planung und Bewirtschaftung der Haushaltsmittel, Unterhaltung der Schulgebaeude
                </p>
              </div>
            </div>
          </div>

          <div className="mt-8 border-t border-border pt-6">
            <h4 className="text-sm font-semibold text-card-foreground">Koordination</h4>
            <div className="mt-3 space-y-2 text-sm text-muted-foreground">
              <p>Erprobungsstufe (Kl. 5-6): Herr Hecker</p>
              <p>Mittelstufe (Kl. 7-10): Herr Dr. Chee</p>
              <p>Gymnasiale Oberstufe: Frau Mannebach</p>
              <p>Verwaltung: Herr Schilling</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
