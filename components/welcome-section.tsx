import { BookOpen, Users, Sparkles } from "lucide-react"

const values = [
  {
    icon: Sparkles,
    title: "Talente foerdern",
    text: "Wir foerdern Deine Talente und staerken Deine Persoenlichkeit.",
  },
  {
    icon: Users,
    title: "Gemeinschaft leben",
    text: "Wir wuenschen uns glueckliche Schueler:innen in einer guten Gemeinschaft - mit Deinen Freund:innen.",
  },
  {
    icon: BookOpen,
    title: "Zukunft gestalten",
    text: "Wir gestalten Deine Zukunft mit Dir.",
  },
]

export function WelcomeSection() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-20 lg:px-8 lg:py-28">
      <div className="mx-auto max-w-3xl text-center">
        <p className="text-sm font-medium uppercase tracking-widest text-primary">
          Herzlich willkommen
        </p>
        <h2 className="mt-3 text-balance font-display text-3xl font-bold tracking-tight text-foreground md:text-4xl">
          Entdecke das Grabbe
        </h2>
        <p className="mt-4 text-pretty text-lg leading-relaxed text-muted-foreground">
          Liebe Freund:innen des Grabbe-Gymnasiums, die es sind und werden wollen.
          Mit neuem Schwung in innovativer Kraft entwickeln wir unsere Schule fuer Dich weiter.
        </p>
      </div>

      <div className="mt-16 grid gap-8 md:grid-cols-3">
        {values.map((item) => (
          <div
            key={item.title}
            className="group relative rounded-2xl border border-border bg-card p-8 transition-all hover:border-primary/30 hover:shadow-lg"
          >
            <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
              <item.icon className="h-6 w-6" />
            </div>
            <h3 className="font-display text-lg font-semibold text-card-foreground">{item.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.text}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
