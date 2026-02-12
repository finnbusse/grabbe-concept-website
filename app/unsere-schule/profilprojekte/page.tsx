import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import Image from "next/image"
import { Palette, Music, Dumbbell, FlaskConical } from "lucide-react"

export const metadata = {
  title: "Profilprojekte - Grabbe-Gymnasium Detmold",
  description: "Die Profilprojekte in Kunst, Musik, Sport und NaWi am Grabbe-Gymnasium Detmold.",
}

const profiles = [
  {
    id: "kunst",
    icon: Palette,
    title: "Kunstprojekt",
    image: "/images/profil-kunst.jpg",
    color: "bg-rose-500",
    content: [
      "Das Fach Kunst ist durch selbstbestimmtes Handeln und anschauliches Denken gepraegt, was Lernen besonders nachhaltig macht und zum ganzheitlichen Erleben und Verstehen der Wirklichkeit fuehrt. Dies ist bedeutsam in Bezug auf die zunehmende Aesthetisierung und Virtualisierung der Lebenswelt. Durch die Staerkung der Ich-Identitaet ermoeglicht das Fach Kunst den Kindern, sich in der Welt zu behaupten und diese als gestaltbar und veraenderbar zu begreifen.",
      "Der Kunstunterricht am Grabbe-Gymnasium versteht sich so als bedeutsamer und hochwertiger Baustein im Aufbau zukunftsrelevanter Kompetenzen fuer alle Schueler und Schuelerinnen.",
      "Neben den fuer alle Gymnasien obligatorischen Wochenstunden im Fach Kunst wird in den Klassen 5 und 6 ein Projektkurs \"Werkstatt Kunst - Unsere Welt mit den Augen von Kuenstlerinnen und Kuenstlern\" zusaetzlich verankert. Dies bietet weiteren Freiraum, in dem die Schuelerinnen und Schueler ohne Notendruck projektbezogen arbeiten koennen.",
      "Dem Profilprojekt liegt ein ganzheitliches und erfahrungsbezogenes Konzept zugrunde, in dem in besonderer Weise der kuenstlerische Prozess im Mittelpunkt steht. Ein Anliegen des Kurses ist u.a. die Sensibilisierung und Schaerfung der Wahrnehmung, die Auseinandersetzung mit der eigenen Lebenswelt und der Aufbau kuenstlerischen Ausdrucks.",
    ],
  },
  {
    id: "musik",
    icon: Music,
    title: "Musikprojekt",
    image: "/images/profil-musik.jpg",
    color: "bg-amber-500",
    content: [
      "Im Musikprofil entdecken Schuelerinnen und Schueler ihre musikalischen Interessen, Kreativitaet und Begabungen - in Theorie und Praxis, individuell und im Miteinander. Der Musikunterricht bildet dabei das kontinuierliche Rueckgrat ihrer musikalischen Bildung.",
      "Ergaenzend zum Musikunterricht wird im Musikprofil Instrumentalunterricht in Kooperation mit externen Instrumentallehrkraeften angeboten. Im zweiten Halbjahr des Jahrgangs 5 wird die instrumentale Praxis im Profilorchester intensiviert und vertieft.",
      "Im Musikprojekt arbeiten die Schuelerinnen und Schueler praxisorientiert in unterschiedlichen Vorhaben: Instrument & Stimme (Jg. 5.1), Profilorchester (Jg. 5.2, woechentlich), Klang & Szene (Jg. 6).",
      "Darueber hinaus bieten die AG-Angebote vielfaeltige Moeglichkeiten Musik aktiv zu leben. Die Ensembles arbeiten jahrgangsuebergreifend und foerdern Begabungen nachhaltig und individuell. Das Profilfach Musik ist Teil des Schulversuchs \"NRW-Musikprofil-Schule\".",
    ],
  },
  {
    id: "sport",
    icon: Dumbbell,
    title: "Sportprojekt",
    image: "/images/profil-sport.jpg",
    color: "bg-emerald-500",
    content: [
      "Als eine der wenigen ausgewaehlten \"Partnerschulen des Sports\" in NRW zeichnet sich das Grabbe-Gymnasium durch ein besonders sportfreundliches Klima aus und bietet allen jugendlichen Talenten die Chance, eine fundierte Schulausbildung mit einer optimalen Sportfoerderung zu verbinden.",
      "Diese Foerderung erfolgt u.a. durch frei waehlbare Sport-Projektkurse, vielfaeltige Sport-AGs in den Sportarten Kunstturnen, Fussball, Leichtathletik und Volleyball und die besondere Unterstuetzung von leistungssport-orientierten Schuelerinnen und Schuelern.",
      "Regelmaessig nehmen Schulmannschaften des Grabbe-Gymnasiums erfolgreich an Schulwettkaempfen teil. Basierend auf einer engen Zusammenarbeit von Schule, Verein, Eltern und Schuelerinnen und Schuelern werden darueber hinaus individuelle Loesungen fuer Kaderathleten gefunden, sodass sportliche Begabungen in besonderer Form gefoerdert werden.",
    ],
  },
  {
    id: "nawi",
    icon: FlaskConical,
    title: "NaWi-Projekt",
    image: "/images/profil-nawi.jpg",
    color: "bg-sky-500",
    content: [
      "Im Profilprojekt NaWi entdecken die Schuelerinnen und Schueler der Klassen 5 und 6 die spannende Welt der Naturwissenschaften. Mit Neugier und Forschergeist gehen sie Phaenomenen aus Biologie, Chemie, Physik und Informatik auf den Grund - immer mit dem Ziel, durch eigenes Beobachten, Experimentieren und Nachdenken Zusammenhaenge in der Natur und Technik zu verstehen.",
      "Im Mittelpunkt steht das selbststaendige und entdeckende Lernen. Die Kinder lernen, Fragen zu stellen, eigene Ideen zu entwickeln, Versuche zu planen und ihre Ergebnisse zu praesentieren. So erwerben sie nicht nur naturwissenschaftliches Wissen, sondern auch wichtige Faehigkeiten wie Teamarbeit, Genauigkeit und Ausdauer.",
      "Die Themen orientieren sich an der Lebenswelt der Kinder und wechseln mit den Jahreszeiten. Ob beim Erkunden der Sinne, beim Beobachten von Pflanzen und Tieren, beim Experimentieren mit Wasser und Energie oder beim Untersuchen von Wetterphaenomenen - ueberall steht das eigene Erleben und Ausprobieren im Vordergrund. Digitale Messgeraete und Sensoren helfen dabei, Daten zu erfassen und wissenschaftlich auszuwerten.",
      "Ergaenzt wird das Profilprojekt durch Wettbewerbe und Exkursionen, die Einblicke in die Anwendung naturwissenschaftlicher Erkenntnisse geben und die Freude am Forschen vertiefen. Dass die Naturwissenschaften an unserer Schule einen besonderen Stellenwert haben, zeigt die wiederholte Auszeichnung durch die Initiative \"MINT Zukunft Schaffen!\". Als MINT-freundliche Schule legen wir grossen Wert darauf, Begeisterung fuer Mathematik, Informatik, Naturwissenschaften und Technik zu wecken und zu foerdern.",
    ],
  },
]

export default function ProfilprojektePage() {
  return (
    <>
      <SiteHeader />
      <main>
        <section className="border-b border-border bg-muted">
          <div className="mx-auto max-w-7xl px-4 pb-12 pt-16 lg:px-8 lg:pb-16 lg:pt-24">
            <p className="text-sm font-medium uppercase tracking-widest text-primary">
              Unser besonderes Profil
            </p>
            <h1 className="mt-3 font-display text-4xl font-bold tracking-tight text-foreground md:text-5xl">
              Profilprojekte
            </h1>
            <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
              Waehle das Profilprojekt nach deinen Interessen! Gestalte frei - ohne Leistungsdruck!
              In Klasse 5 und 6 kannst du in einem der vier Profilprojekte neue Lernwege entdecken.
            </p>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-16 lg:px-8">
          <div className="space-y-24">
            {profiles.map((profile, index) => (
              <div
                key={profile.id}
                id={profile.id}
                className={`grid items-start gap-10 lg:grid-cols-2 ${index % 2 === 1 ? "lg:direction-rtl" : ""}`}
              >
                <div className={index % 2 === 1 ? "lg:order-2" : ""}>
                  <div className="relative aspect-[4/3] overflow-hidden rounded-2xl">
                    <Image
                      src={profile.image}
                      alt={profile.title}
                      fill
                      className="object-cover"
                    />
                    <div className={`absolute left-4 top-4 flex h-12 w-12 items-center justify-center rounded-xl ${profile.color} text-background`}>
                      <profile.icon className="h-6 w-6" />
                    </div>
                  </div>
                </div>
                <div className={index % 2 === 1 ? "lg:order-1" : ""}>
                  <h2 className="font-display text-3xl font-bold tracking-tight text-foreground">
                    {profile.title}
                  </h2>
                  <div className="mt-6 space-y-4">
                    {profile.content.map((p, i) => (
                      <p key={i} className="text-sm leading-relaxed text-muted-foreground">
                        {p}
                      </p>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  )
}
