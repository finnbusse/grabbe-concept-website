import Image from "next/image"
import Link from "next/link"
import { ArrowRight, Palette, Music, Dumbbell, FlaskConical } from "lucide-react"
import { Button } from "@/components/ui/button"

const profiles = [
  {
    icon: Palette,
    title: "Kunstprojekt",
    slug: "kunst",
    image: "/images/profil-kunst.jpg",
    description:
      "Der Kunstunterricht am Grabbe-Gymnasium versteht sich als bedeutsamer Baustein im Aufbau zukunftsrelevanter Kompetenzen. Im Projektkurs \"Werkstatt Kunst\" arbeiten die Schueler:innen ohne Notendruck projektbezogen.",
    color: "bg-rose-500",
  },
  {
    icon: Music,
    title: "Musikprojekt",
    slug: "musik",
    image: "/images/profil-musik.jpg",
    description:
      "Im Musikprofil entdecken Schuelerinnen und Schueler ihre musikalischen Interessen, Kreativitaet und Begabungen - in Theorie und Praxis, individuell und im Miteinander. Teil des Schulversuchs \"NRW-Musikprofil-Schule\".",
    color: "bg-amber-500",
  },
  {
    icon: Dumbbell,
    title: "Sportprojekt",
    slug: "sport",
    image: "/images/profil-sport.jpg",
    description:
      "Als eine der wenigen ausgewaehlten \"Partnerschulen des Sports\" in NRW bietet das Grabbe-Gymnasium allen jugendlichen Talenten die Chance, Schulausbildung mit optimaler Sportfoerderung zu verbinden.",
    color: "bg-emerald-500",
  },
  {
    icon: FlaskConical,
    title: "NaWi-Projekt",
    slug: "nawi",
    image: "/images/profil-nawi.jpg",
    description:
      "Im Profilprojekt NaWi entdecken die Schueler:innen die spannende Welt der Naturwissenschaften. Mit Neugier und Forschergeist gehen sie Phaenomenen aus Biologie, Chemie, Physik und Informatik auf den Grund.",
    color: "bg-sky-500",
  },
]

export function ProfileSection() {
  return (
    <section className="bg-muted py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-medium uppercase tracking-widest text-primary">
            Profilprojekte
          </p>
          <h2 className="mt-3 text-balance font-display text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            Waehle das Profilprojekt nach deinen Interessen
          </h2>
          <p className="mt-4 text-pretty text-lg leading-relaxed text-muted-foreground">
            Gestalte frei - ohne Leistungsdruck! Die Profilprojekte in Kunst, Musik, Sport oder NaWi
            bieten dir die Moeglichkeit, in einer gemischten Gruppe neue Lernwege zu entdecken.
          </p>
        </div>

        <div className="mt-16 grid gap-6 md:grid-cols-2">
          {profiles.map((profile) => (
            <Link
              key={profile.slug}
              href={`/unsere-schule/profilprojekte#${profile.slug}`}
              className="group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-card transition-all hover:shadow-xl"
            >
              <div className="relative h-52 overflow-hidden">
                <Image
                  src={profile.image}
                  alt={profile.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent" />
                <div className={`absolute left-4 top-4 flex h-10 w-10 items-center justify-center rounded-xl ${profile.color} text-background`}>
                  <profile.icon className="h-5 w-5" />
                </div>
              </div>
              <div className="flex flex-1 flex-col p-6">
                <h3 className="font-display text-xl font-semibold text-card-foreground">
                  {profile.title}
                </h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
                  {profile.description}
                </p>
                <div className="mt-4 flex items-center gap-1.5 text-sm font-medium text-primary">
                  Mehr erfahren
                  <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
