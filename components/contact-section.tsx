import Link from "next/link"
import { Mail, Phone, MapPin, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { getSettings } from "@/lib/settings"

export async function ContactSection() {
  const s = await getSettings()

  const address = s.school_address || "Kuester-Meyer-Platz 2, 32756 Detmold"
  const phone = s.school_phone || "05231 - 99260"
  const fax = s.school_fax || "05231 - 992616"
  const email = s.school_email || "sekretariat@grabbe.nrw.schule"
  const schulleiter = s.schulleitung_1 || "Dr. Claus Hilbing"
  const stellvertreter = s.schulleitung_2 || "Oliver Sprenger"

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
                  {s.school_name_full || "Christian-Dietrich-Grabbe-Gymnasium"}<br />
                  {address}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Phone className="h-5 w-5" />
              </div>
              <div>
                <p className="font-medium text-foreground">Telefon</p>
                <p className="text-sm text-muted-foreground">{phone}</p>
                <p className="text-xs text-muted-foreground">{"Fax: "}{fax}</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Mail className="h-5 w-5" />
              </div>
              <div>
                <p className="font-medium text-foreground">E-Mail</p>
                <a href={`mailto:${email}`} className="text-sm text-primary hover:underline">{email}</a>
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

        <div className="rounded-2xl border border-border bg-card p-8">
          <h3 className="font-display text-xl font-semibold text-card-foreground">Schulleitung</h3>
          <div className="mt-6 space-y-6">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-muted font-display text-sm font-bold text-muted-foreground">
                {schulleiter.split(" ").map(w => w[0]).join("").slice(0, 2)}
              </div>
              <div>
                <p className="font-medium text-card-foreground">{schulleiter}</p>
                <p className="text-sm text-muted-foreground">Schulleiter</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-muted font-display text-sm font-bold text-muted-foreground">
                {stellvertreter.split(" ").map(w => w[0]).join("").slice(0, 2)}
              </div>
              <div>
                <p className="font-medium text-card-foreground">{stellvertreter}</p>
                <p className="text-sm text-muted-foreground">Stellvertretende Schulleitung</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
