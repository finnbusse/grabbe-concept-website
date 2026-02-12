const partners = [
  "Hochschule fuer Musik",
  "Landestheater Detmold",
  "Johanniter",
  "Stadtbibliothek Detmold",
  "Lippische Landesbibliothek",
  "Landesarchiv NRW",
  "Holocaust-Gedenkstaette Yad Vashem",
  "McLean Highschool Washington",
  "Wortmann KG",
  "Weidmueller GmbH & Co KG",
  "Peter-Glaesel-Schule Detmold",
]

export function PartnersSection() {
  return (
    <section className="border-t border-border bg-muted py-16">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <div className="text-center">
          <p className="text-sm font-medium uppercase tracking-widest text-primary">
            Vernetzt in Detmold
          </p>
          <h2 className="mt-3 text-balance font-display text-2xl font-bold tracking-tight text-foreground">
            Unsere Partner
          </h2>
          <p className="mt-3 text-sm text-muted-foreground">
            Wir bieten Ihren Kindern nicht nur in der Schule lebensnahe Erfahrungen, sondern auch
            mit unseren vertrauensvollen Partnern.
          </p>
        </div>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
          {partners.map((partner) => (
            <span
              key={partner}
              className="rounded-full border border-border bg-card px-4 py-2 text-xs font-medium text-muted-foreground transition-colors hover:border-primary/30 hover:text-foreground"
            >
              {partner}
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}
