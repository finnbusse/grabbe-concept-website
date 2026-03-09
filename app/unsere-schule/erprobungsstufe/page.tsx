import { SiteLayout } from "@/components/site-layout"
import { PageHero } from "@/components/page-hero"
import Image from "next/image"
import Link from "next/link"
import { getPageContent, PAGE_DEFAULTS } from "@/lib/page-content"
import { generatePageMetadata } from "@/lib/seo"
import type { Metadata } from "next"

export const revalidate = 3600

export async function generateMetadata(): Promise<Metadata> {
  return generatePageMetadata({
    title: "Erprobungsstufe",
    description: "Informationen zur Erprobungsstufe (Klassen 5 und 6) am Grabbe-Gymnasium Detmold.",
    path: "/unsere-schule/erprobungsstufe",
  })
}

export default async function ErprobungsstufePage() {
  const content = await getPageContent('erprobungsstufe', PAGE_DEFAULTS['erprobungsstufe'])

  const heckerImageUrl = (content.hecker_image_url as string) || ''

  return (
    <SiteLayout>
      <main>
        <PageHero
          title={content.page_title as string}
          label={content.page_label as string}
          subtitle={content.page_subtitle as string}
          imageUrl={(content.hero_image_url as string) || undefined}
        />

        {/* ═══ Intro + Highlights (blue mesh bg) ═══ */}
        <section className="relative py-28 lg:py-36 bg-mesh-blue">
          <div className="mx-auto max-w-6xl px-4 lg:px-8">
            <div className="grid gap-16 lg:grid-cols-2 lg:items-start">
              <div>
                <p className="font-sub text-[11px] uppercase tracking-[0.3em] text-primary">Jahrgangsstufe 5 &amp; 6</p>
                <h2 className="mt-3 font-display text-4xl md:text-5xl tracking-tight text-foreground">
                  Eine besondere pädagogische Einheit
                </h2>
                <p className="mt-6 text-base leading-relaxed text-muted-foreground">
                  Die Jahrgänge 5 und 6 bilden eine besondere pädagogische Einheit – die Erprobungsstufe. In dieser Zeit, die für Kinder den Übergang von der Grundschule zum Gymnasium bedeutet, begleiten wir sie intensiv und individuell.
                </p>
                <p className="mt-4 text-base leading-relaxed text-muted-foreground">
                  Anknüpfend an die Erfahrungen der Grundschule führen wir die Schülerinnen und Schüler behutsam an die Lern- und Arbeitsformen des Gymnasiums heran. Wir fördern ihre Kenntnisse, Fähigkeiten und Fertigkeiten mit dem Ziel, gemeinsam mit den Eltern eine sichere Grundlage für den weiteren Bildungsweg zu schaffen.
                </p>
              </div>

              <div className="space-y-4">
                {[
                  {
                    title: 'Klassenbildung & Profile',
                    text: 'Sozial ausgewogene Klassen, vier wählbare Profilprojekte – Kunst, Musik, Sport und Naturwissenschaften – klassenübergreifend organisiert.',
                    icon: (
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                    ),
                  },
                  {
                    title: 'Soziales Lernen',
                    text: 'Begrüßungsnachmittag, pädagogisches Programm, Wandertag und Klassenfahrt – Gemeinschaft von Anfang an.',
                    icon: (
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>
                    ),
                  },
                  {
                    title: 'Lernen lernen',
                    text: 'Grundlegende Lern- und Arbeitstechniken sowie digitale Kompetenzen – Schritt für Schritt erworben und vertieft.',
                    icon: (
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5"/><path d="M9 18h6"/><path d="M10 22h4"/></svg>
                    ),
                  },
                  {
                    title: 'Begabungsförderung',
                    text: 'Wettbewerbe, Lernpatenprogramme und Arbeitsgemeinschaften – individuelle Förderung und Unterstützung für alle.',
                    icon: (
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                    ),
                  },
                ].map((item) => (
                  <div key={item.title} className="group rounded-2xl border border-border/60 bg-card/80 backdrop-blur-sm p-6 transition-all duration-500 hover:border-primary/30 hover:shadow-xl hover:shadow-primary/[0.06] hover:-translate-y-1">
                    <div className="flex items-start gap-5">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary transition-all duration-500 group-hover:bg-primary group-hover:text-white group-hover:rotate-3 group-hover:scale-110">
                        {item.icon}
                      </div>
                      <div>
                        <h3 className="font-display text-lg text-foreground">{item.title}</h3>
                        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.text}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ═══ Klassenbildung und Profile (white bg) ═══ */}
        <section className="relative py-28 lg:py-36">
          <div className="mx-auto max-w-6xl px-4 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <p className="font-sub text-[11px] uppercase tracking-[0.3em] text-primary">Ab Schuljahr 2026/27</p>
              <h2 className="mt-3 font-display text-4xl md:text-5xl tracking-tight text-foreground">
                Klassenbildung und Profile
              </h2>
            </div>

            <div className="mx-auto mt-16 max-w-3xl space-y-6">
              <p className="text-sm leading-relaxed text-muted-foreground">
                Ab dem Schuljahr 2026/27 werden die neuen Eingangsklassen sozial ausgewogen zusammengestellt – nach Wunschpartner:innen und pädagogischen Gesichtspunkten.
              </p>
              <p className="text-sm leading-relaxed text-muted-foreground">
                Die vier Profile – Kunst, Musik, Sport und Naturwissenschaften – bleiben inhaltlich erhalten, sind nun aber klassenübergreifend als wählbare Profilprojekte organisiert.
              </p>
            </div>

            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {[
                {
                  label: 'Kunst',
                  icon: (
                    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="13.5" cy="6.5" r=".5" fill="currentColor"/><circle cx="17.5" cy="10.5" r=".5" fill="currentColor"/><circle cx="8.5" cy="7.5" r=".5" fill="currentColor"/><circle cx="6.5" cy="12.5" r=".5" fill="currentColor"/><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z"/></svg>
                  ),
                },
                {
                  label: 'Musik',
                  icon: (
                    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>
                  ),
                },
                {
                  label: 'Sport',
                  icon: (
                    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M4.93 4.93 19.07 19.07"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/><path d="M2 12h20"/></svg>
                  ),
                },
                {
                  label: 'Naturwissenschaften',
                  icon: (
                    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 2v7.31"/><path d="M14 9.3V1.99"/><path d="M8.5 2h7"/><path d="M14 9.3a6.5 6.5 0 1 1-4 0"/></svg>
                  ),
                },
              ].map((profile) => (
                <div key={profile.label} className="group rounded-2xl border border-border/60 bg-card/80 backdrop-blur-sm p-6 text-center transition-all duration-500 hover:border-primary/30 hover:shadow-xl hover:shadow-primary/[0.06] hover:-translate-y-1">
                  <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 text-primary transition-all duration-500 group-hover:bg-primary group-hover:text-white group-hover:rotate-3 group-hover:scale-110">
                    {profile.icon}
                  </div>
                  <h3 className="font-display text-lg text-foreground">{profile.label}</h3>
                </div>
              ))}
            </div>

            <div className="mx-auto mt-12 max-w-3xl rounded-2xl border border-border/60 bg-muted/30 p-8">
              <div className="space-y-3">
                {[
                  'Jede Schülerin und jeder Schüler wählt bei der Anmeldung ein Profilprojekt, das ein Schuljahr lang besucht wird.',
                  'In Klasse 6 kann ein neues Profil gewählt werden.',
                  'Die Profilprojekte finden alle 14 Tage in einer Doppelstunde statt.',
                  'Kreatives, fächerverbindendes Arbeiten ohne Notendruck – dafür mit Feedback und Präsentationen.',
                  'Gemeinsame Interessen über Klassengrenzen hinweg stärken das Miteinander.',
                ].map((item) => (
                  <div key={item} className="flex items-start gap-3 text-sm text-muted-foreground">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ═══ Soziales Lernen (muted bg) ═══ */}
        <section className="relative py-28 lg:py-36 bg-muted/40">
          <div className="mx-auto max-w-6xl px-4 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <p className="font-sub text-[11px] uppercase tracking-[0.3em] text-primary">Gemeinschaft</p>
              <h2 className="mt-3 font-display text-4xl md:text-5xl tracking-tight text-foreground">
                Soziales Lernen
              </h2>
              <p className="mt-6 text-sm leading-relaxed text-muted-foreground">
                Von Anfang an steht das soziale Lernen im Mittelpunkt.
              </p>
            </div>

            <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {[
                {
                  title: 'Begrüßungsnachmittag',
                  text: 'Bereits vor den Sommerferien laden wir alle neuen Fünftklässler:innen zu einem Begrüßungsnachmittag ein, an dem sie ihre Mitschüler:innen, ihr Klassenleitungsteam und ihren Klassenraum kennenlernen.',
                  icon: (
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/><path d="M12 7v5l4 2"/></svg>
                  ),
                },
                {
                  title: 'Kennenlerntage',
                  text: 'Die ersten Unterrichtstage gestalten die Klassenleitungen mit einem pädagogischen Programm, das Orientierung gibt und das Ankommen erleichtert. Ein Wandertag rundet die Kennenlerntage ab.',
                  icon: (
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 17c2.5-3 6.5-3 9-1s6.5 2 9-1"/><path d="M3 7c2.5-3 6.5-3 9-1s6.5 2 9-1"/><path d="M3 12c2.5-3 6.5-3 9-1s6.5 2 9-1"/></svg>
                  ),
                },
                {
                  title: 'Klassenleitungsstunde',
                  text: 'In der wöchentlichen Klassenleitungsstunde liegt der Schwerpunkt auf Gemeinschaft, Verantwortung und Mitbestimmung. Hier werden Klassenvorhaben geplant, Konfliktlösungen eingeübt und Projekte vorbereitet.',
                  icon: (
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                  ),
                },
                {
                  title: 'Klassenfahrt',
                  text: 'Eine Klassenfahrt zu Beginn der sechsten Klasse stärkt die Gemeinschaft zusätzlich und gibt dem gemeinsamen Lernen einen besonderen Rahmen.',
                  icon: (
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"/><circle cx="12" cy="10" r="3"/></svg>
                  ),
                },
                {
                  title: 'Mitbestimmung',
                  text: 'Schülerinnen und Schüler übernehmen Verantwortung und gestalten ihren Schulalltag aktiv mit – von Klassenvorhaben bis zu gemeinsamen Projekten.',
                  icon: (
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 15h2a2 2 0 1 0 0-4h-3c-.6 0-1.1.2-1.4.6L3 17"/><path d="m7 21 1.6-1.4c.3-.4.8-.6 1.4-.6h4c1.1 0 2.1-.4 2.8-1.2l4.6-4.4a2 2 0 0 0-2.75-2.91l-4.2 3.9"/><path d="m2 16 6 6"/><circle cx="16" cy="9" r="2.9"/><circle cx="6" cy="5" r="3"/></svg>
                  ),
                },
                {
                  title: 'Klassenübergreifend',
                  text: 'Gemeinsame Interessen und Begegnungen über Klassengrenzen hinweg stärken das Miteinander – in den Profilen ebenso wie in den Klassen.',
                  icon: (
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>
                  ),
                },
              ].map((item) => (
                <div key={item.title} className="group rounded-2xl border border-border/60 bg-card/80 backdrop-blur-sm p-8 transition-all duration-500 hover:border-primary/30 hover:shadow-xl hover:shadow-primary/[0.06] hover:-translate-y-1">
                  <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition-all duration-500 group-hover:bg-primary group-hover:text-white group-hover:rotate-3 group-hover:scale-110">
                    {item.icon}
                  </div>
                  <h3 className="font-display text-lg text-foreground">{item.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{item.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══ Lernen lernen & Begabungsförderung (white bg) ═══ */}
        <section className="relative py-28 lg:py-36">
          <div className="mx-auto max-w-6xl px-4 lg:px-8">
            <div className="grid gap-16 lg:grid-cols-2">
              {/* Lernen lernen */}
              <div>
                <p className="font-sub text-[11px] uppercase tracking-[0.3em] text-primary">Kompetenzen</p>
                <h2 className="mt-3 font-display text-3xl md:text-4xl tracking-tight text-foreground">
                  Lernen lernen &amp; Digitalisierung
                </h2>
                <p className="mt-6 text-sm leading-relaxed text-muted-foreground">
                  Im Bereich „Lernen lernen" werden grundlegende Lern- und Arbeitstechniken vermittelt und in Projekten sowie im Fachunterricht vertieft.
                </p>
                <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                  Schrittweise erwerben die Kinder dabei auch digitale Kompetenzen, um ihr persönliches Repertoire an Lern- und Arbeitsstrategien zu erweitern und verantwortungsvoll anzuwenden.
                </p>
                <div className="mt-8 space-y-3">
                  {[
                    'Grundlegende Lern- und Arbeitstechniken',
                    'Projektarbeit und Fachunterricht vertiefend',
                    'Digitale Kompetenzen schrittweise aufbauen',
                    'Verantwortungsvoller Umgang mit digitalen Medien',
                  ].map((item) => (
                    <div key={item} className="flex items-start gap-3 text-sm text-muted-foreground">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                      {item}
                    </div>
                  ))}
                </div>
              </div>

              {/* Begabungsförderung */}
              <div>
                <p className="font-sub text-[11px] uppercase tracking-[0.3em] text-primary">Förderung</p>
                <h2 className="mt-3 font-display text-3xl md:text-4xl tracking-tight text-foreground">
                  Begabungsförderung &amp; Unterstützung
                </h2>
                <p className="mt-6 text-sm leading-relaxed text-muted-foreground">
                  Interessierte Schülerinnen und Schüler können ab Klasse 5 an schulischen und regionalen Wettbewerben teilnehmen.
                </p>
                <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                  Für die gezielte Unterstützung bietet das Grabbe-Gymnasium Lernpatenprogramme an: Ältere Schüler:innen helfen Jüngeren beim Aufarbeiten von Grundlagen.
                </p>
                <div className="mt-8 space-y-4">
                  <div className="group rounded-2xl border border-border/60 bg-card/80 backdrop-blur-sm p-5 transition-all duration-500 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/[0.06]">
                    <div className="flex items-start gap-4">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary transition-all duration-500 group-hover:bg-primary group-hover:text-white">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                      </div>
                      <div>
                        <h3 className="font-display text-base text-foreground">Wettbewerbe</h3>
                        <p className="mt-1 text-sm leading-relaxed text-muted-foreground">Schulische und regionale Wettbewerbe ab Klasse 5</p>
                      </div>
                    </div>
                  </div>
                  <div className="group rounded-2xl border border-border/60 bg-card/80 backdrop-blur-sm p-5 transition-all duration-500 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/[0.06]">
                    <div className="flex items-start gap-4">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary transition-all duration-500 group-hover:bg-primary group-hover:text-white">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                      </div>
                      <div>
                        <h3 className="font-display text-base text-foreground">Lernpaten</h3>
                        <p className="mt-1 text-sm leading-relaxed text-muted-foreground">Ältere Schüler:innen helfen Jüngeren beim Aufarbeiten von Grundlagen</p>
                      </div>
                    </div>
                  </div>
                  <div className="group rounded-2xl border border-border/60 bg-card/80 backdrop-blur-sm p-5 transition-all duration-500 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/[0.06]">
                    <div className="flex items-start gap-4">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary transition-all duration-500 group-hover:bg-primary group-hover:text-white">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
                      </div>
                      <div>
                        <h3 className="font-display text-base text-foreground">Arbeitsgemeinschaften</h3>
                        <p className="mt-1 text-sm leading-relaxed text-muted-foreground">Zahlreiche AGs aus allen Profilbereichen ergänzen das Angebot</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ═══ Anmeldung (muted bg) ═══ */}
        <section className="relative py-28 lg:py-36 bg-muted/40">
          <div className="mx-auto max-w-6xl px-4 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <p className="font-sub text-[11px] uppercase tracking-[0.3em] text-primary">23. – 27. Februar 2026</p>
              <h2 className="mt-3 font-display text-4xl md:text-5xl tracking-tight text-foreground">
                Anmeldung am Grabbe-Gymnasium
              </h2>
              <p className="mt-6 text-sm leading-relaxed text-muted-foreground">
                Die Anmeldung für den neuen Jahrgang 5 findet vom 23. bis 27. Februar 2026 statt. Eltern vereinbaren dazu vorab einen Termin für das Anmeldegespräch, zu dem sie möglichst gemeinsam mit ihrem Kind kommen.
              </p>
            </div>

            <div className="mt-16 grid gap-8 lg:grid-cols-2">
              {/* Unterlagen */}
              <div className="rounded-2xl border border-border/60 bg-card/80 backdrop-blur-sm p-8">
                <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M10 12h4"/><path d="M10 16h4"/></svg>
                </div>
                <h3 className="font-display text-xl text-foreground">Erforderliche Unterlagen</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  Die Anmeldeunterlagen stehen rechtzeitig im Dateimanager unserer Homepage zur Verfügung und werden auch beim Tag der offenen Tür ausgegeben.
                </p>
                <div className="mt-6 space-y-3">
                  {[
                    'Ausgefüllte Anmeldeformulare',
                    'Zeugnis und Empfehlung der Grundschule',
                    'Geburtsurkunde',
                    'Nachweis über den Masernimpfschutz',
                  ].map((item) => (
                    <div key={item} className="flex items-start gap-3 text-sm text-muted-foreground">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                      {item}
                    </div>
                  ))}
                </div>
              </div>

              {/* Profilwahl */}
              <div className="rounded-2xl border border-border/60 bg-card/80 backdrop-blur-sm p-8">
                <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                </div>
                <h3 className="font-display text-xl text-foreground">Profilwahl bei der Anmeldung</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  Im Rahmen der Anmeldung wählen Sie gemeinsam mit Ihrem Kind ein Profilprojekt für das kommende Schuljahr. Dabei geben Sie eine Erstwahl und eine Zweitwahl an.
                </p>
                <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                  So können wir die Klassen optimal zusammenstellen und gleichzeitig sicherstellen, dass jedes Kind an einem Profilprojekt teilnimmt, das seinen Interessen entspricht.
                </p>
                <Link
                  href="/unsere-schule/profilprojekte"
                  className="mt-6 inline-flex items-center gap-2 font-sub text-xs uppercase tracking-[0.15em] text-primary hover:text-foreground transition-colors group/link"
                >
                  Profilprojekte entdecken
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="transition-transform group-hover/link:translate-x-1"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                </Link>
              </div>
            </div>

            <div className="mt-8 text-center">
              <Link
                href="/unsere-schule/anmeldung"
                className="inline-flex items-center gap-2 rounded-2xl border border-primary/30 bg-primary/5 px-8 py-4 font-sub text-xs uppercase tracking-[0.15em] text-primary transition-all hover:bg-primary hover:text-white group/cta"
              >
                Zur Anmeldungsseite
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="transition-transform group-hover/cta:translate-x-1"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
              </Link>
            </div>
          </div>
        </section>

        {/* ═══ Betreuung & Kontakt (white bg) ═══ */}
        <section className="relative py-28 lg:py-36">
          <div className="mx-auto max-w-6xl px-4 lg:px-8">
            <div className="grid gap-16 lg:grid-cols-2 lg:items-start">
              {/* Betreuung */}
              <div>
                <p className="font-sub text-[11px] uppercase tracking-[0.3em] text-primary">Nachmittag</p>
                <h2 className="mt-3 font-display text-3xl md:text-4xl tracking-tight text-foreground">
                  Betreuung und Angebote
                </h2>
                <p className="mt-6 text-sm leading-relaxed text-muted-foreground">
                  Darüber hinaus steht eine Hausaufgabenbetreuung (13.30–14.30 Uhr) sowie eine Übermittagsbetreuung mit offenen Angeboten (montags bis donnerstags bis 15.30 Uhr) zur Verfügung.
                </p>
                <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                  Zahlreiche Arbeitsgemeinschaften – auch aus den Profilbereichen – ergänzen das Angebot und ermöglichen, Talente zu entfalten und Neues auszuprobieren.
                </p>
                <div className="mt-8 space-y-4">
                  <div className="rounded-2xl border border-border/60 bg-muted/30 p-5">
                    <div className="flex items-center gap-4">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
                      </div>
                      <div>
                        <p className="font-display text-sm text-foreground">Hausaufgabenbetreuung</p>
                        <p className="text-xs text-muted-foreground">13.30 – 14.30 Uhr</p>
                      </div>
                    </div>
                  </div>
                  <div className="rounded-2xl border border-border/60 bg-muted/30 p-5">
                    <div className="flex items-center gap-4">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/><path d="M12 7v5l4 2"/></svg>
                      </div>
                      <div>
                        <p className="font-display text-sm text-foreground">Übermittagsbetreuung</p>
                        <p className="text-xs text-muted-foreground">Mo – Do bis 15.30 Uhr, offene Angebote</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Kontakt Stefan Hecker */}
              <div>
                <p className="font-sub text-[11px] uppercase tracking-[0.3em] text-primary">Ansprechpartner</p>
                <h2 className="mt-3 font-display text-3xl md:text-4xl tracking-tight text-foreground">
                  Sprechen Sie mich an
                </h2>
                <div className="mt-8 group rounded-2xl border border-border/60 bg-card/80 backdrop-blur-sm p-8 transition-all duration-500 hover:border-primary/30 hover:shadow-xl hover:shadow-primary/[0.06]">
                  <div className="flex items-start gap-6">
                    {heckerImageUrl ? (
                      <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-2xl">
                        <Image
                          src={heckerImageUrl}
                          alt="Stefan Hecker"
                          fill
                          className="object-cover"
                          sizes="80px"
                        />
                      </div>
                    ) : (
                      <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                      </div>
                    )}
                    <div className="min-w-0 flex-1">
                      <h3 className="font-display text-xl text-foreground">Stefan Hecker</h3>
                      <p className="mt-1 font-sub text-xs uppercase tracking-[0.15em] text-muted-foreground">Erprobungsstufe</p>
                      <a
                        href="mailto:s.hecker@grabbe.nrw.schule"
                        className="mt-4 flex items-center gap-2 text-sm text-primary hover:text-foreground transition-colors"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
                        s.hecker@grabbe.nrw.schule
                      </a>
                    </div>
                  </div>
                </div>

                <div className="mt-6 rounded-2xl border border-border/60 bg-muted/30 p-6">
                  <p className="font-display text-sm text-foreground">Sekretariat</p>
                  <a
                    href="mailto:sekretariat@grabbe.nrw.schule"
                    className="mt-2 flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
                    sekretariat@grabbe.nrw.schule
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </SiteLayout>
  )
}
