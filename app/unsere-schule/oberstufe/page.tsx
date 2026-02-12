import { SiteLayout } from "@/components/site-layout"
import { Phone, Mail, GraduationCap, FileText, ClipboardCheck, Bus } from "lucide-react"

export const metadata = {
  title: "Oberstufe - Grabbe-Gymnasium Detmold",
  description: "Informationen zur gymnasialen Oberstufe am Grabbe-Gymnasium Detmold.",
}

export default function OberstufePage() {
  return (
    <SiteLayout>
      <main>
        <section className="border-b border-border bg-muted">
          <div className="mx-auto max-w-7xl px-4 pb-12 pt-16 lg:px-8 lg:pb-16 lg:pt-24">
            <p className="text-sm font-medium uppercase tracking-widest text-primary">
              Sekundarstufe II
            </p>
            <h1 className="mt-3 font-display text-4xl font-bold tracking-tight text-foreground md:text-5xl">
              Oberstufe
            </h1>
            <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
              Dein Start in der Oberstufe - Wir freuen uns ueber Ihr/euer Interesse an unserer Schule!
            </p>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-16 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-8">
              <div>
                <h2 className="font-display text-2xl font-bold text-foreground">Oberstufen-Portal</h2>
                <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                  Naehere Informationen ueber unsere Oberstufe finden sich unter dem Oberstufen-Portal,
                  z.B. in der Broschuere, die unter der Rubrik &quot;Laufbahnplanung&quot; zur Verfuegung steht.
                </p>
              </div>

              <div className="rounded-2xl border border-border bg-card p-8">
                <h3 className="font-display text-xl font-semibold text-card-foreground">
                  Anmeldewoche Oberstufe
                </h3>
                <p className="mt-2 text-lg font-medium text-primary">23. bis 27. Februar 2026</p>
                <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                  Anders als bei den fuenften Klassen erfolgt die Terminvergabe nicht ueber das
                  Online-Tool, sondern telefonisch oder per Mail.
                </p>
                <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                  <div className="flex items-center gap-2 rounded-xl bg-muted px-4 py-3">
                    <Phone className="h-4 w-4 text-primary" />
                    <span className="text-sm font-medium text-foreground">05231 992617</span>
                  </div>
                  <div className="flex items-center gap-2 rounded-xl bg-muted px-4 py-3">
                    <Mail className="h-4 w-4 text-primary" />
                    <span className="text-sm font-medium text-foreground">b.mannebach@grabbe.nrw.schule</span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-display text-xl font-semibold text-foreground">Anmeldeunterlagen</h3>
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  {[
                    { icon: FileText, label: "Anmeldeformular" },
                    { icon: ClipboardCheck, label: "Einwilligung Datenverarbeitung" },
                    { icon: Bus, label: "Antrag auf Busfahrkarte" },
                  ].map((doc) => (
                    <div
                      key={doc.label}
                      className="flex items-center gap-3 rounded-xl border border-border bg-card p-4"
                    >
                      <doc.icon className="h-5 w-5 text-primary" />
                      <span className="text-sm font-medium text-card-foreground">{doc.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-xl bg-muted p-6">
                <h3 className="font-display text-lg font-semibold text-foreground">
                  Voraussetzung fuer die Aufnahme
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  Voraussetzung fuer die Aufnahme in die Sekundarstufe II des Grabbe-Gymnasiums ist
                  das Vorliegen der Berechtigung zum Besuch der gymnasialen Oberstufe, die am Gymnasium
                  durch die Versetzung am Ende der Jahrgangsstufe 10 oder an anderen Schulformen durch
                  den Erwerb des Mittleren Schulabschlusses mit Q-Vermerk erworben wird. Das
                  entsprechende Zeugnis muss vor Beginn der Einfuehrungsphase nachgereicht werden.
                </p>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <div className="rounded-2xl border border-border bg-card p-6">
                <GraduationCap className="h-8 w-8 text-primary" />
                <h3 className="mt-4 font-display text-lg font-semibold text-card-foreground">
                  Oberstufen-Koordination
                </h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Frau Mannebach steht Ihnen fuer alle Fragen zur Oberstufe zur Verfuegung.
                </p>
                <div className="mt-4 space-y-2 text-sm text-muted-foreground">
                  <p className="font-medium text-card-foreground">Frau Mannebach</p>
                  <p>Tel: 05231 992617</p>
                  <p>b.mannebach@grabbe.nrw.schule</p>
                </div>
              </div>

              <div className="rounded-2xl border border-border bg-card p-6">
                <h3 className="font-display text-lg font-semibold text-card-foreground">
                  Hospitationstage
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  Gerne koennen Interessent:innen sich auch im Vorfeld der Anmeldewoche persoenlich
                  oder telefonisch beraten lassen oder einen oder zwei Tage bei uns hospitieren.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </SiteLayout>
  )
}
