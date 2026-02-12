import Link from "next/link"
import { Mail, Phone, MapPin } from "lucide-react"

export type FooterLink = { id: string; label: string; href: string }

export function SiteFooter({
  links,
  legalLinks,
  settings,
}: {
  links: FooterLink[]
  legalLinks: FooterLink[]
  settings: Record<string, string>
}) {
  const name = settings.school_name || "Grabbe-Gymnasium"
  const fullName =
    settings.school_name_full || "Christian-Dietrich-Grabbe-Gymnasium Detmold"
  const address =
    settings.school_address || "Kuester-Meyer-Platz 2, 32756 Detmold"
  const phone = settings.school_phone || "05231 - 99260"
  const email = settings.school_email || "sekretariat@grabbe.nrw.schule"
  const year = new Date().getFullYear()

  return (
    <footer className="border-t border-border bg-foreground text-background">
      <div className="mx-auto max-w-7xl px-4 py-16 lg:px-8">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          {/* School info */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3">
              {settings.school_logo_url ? (
                <img
                  src={settings.school_logo_url}
                  alt={name}
                  className="h-9 w-auto"
                />
              ) : (
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-sm font-bold text-primary-foreground font-display">
                  G
                </span>
              )}
              <div>
                <p className="font-semibold font-display">{name}</p>
                <p className="text-sm opacity-70">
                  {settings.school_city || "Detmold"}
                </p>
              </div>
            </div>
            <p className="mt-4 text-sm leading-relaxed opacity-70">
              {settings.school_description ||
                "Wir foerdern Deine Talente und staerken Deine Persoenlichkeit."}
            </p>
          </div>

          {/* Quick links */}
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider opacity-50">
              Schnellzugriff
            </h3>
            <ul className="flex flex-col gap-2.5">
              {links.map((l) => (
                <li key={l.id}>
                  <Link
                    href={l.href}
                    className="text-sm opacity-70 transition-opacity hover:opacity-100"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider opacity-50">
              Kontakt
            </h3>
            <ul className="flex flex-col gap-3">
              <li className="flex items-start gap-2.5">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 opacity-60" />
                <span className="text-sm opacity-70">{address}</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="h-4 w-4 shrink-0 opacity-60" />
                <a
                  href={`tel:${phone.replace(/[\s-]/g, "")}`}
                  className="text-sm opacity-70 hover:opacity-100"
                >
                  {phone}
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="h-4 w-4 shrink-0 opacity-60" />
                <a
                  href={`mailto:${email}`}
                  className="text-sm opacity-70 hover:opacity-100"
                >
                  {email}
                </a>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider opacity-50">
              Rechtliches
            </h3>
            <ul className="flex flex-col gap-2.5">
              {legalLinks.map((l) => (
                <li key={l.id}>
                  <Link
                    href={l.href}
                    className="text-sm opacity-70 hover:opacity-100"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-background/10 pt-8 sm:flex-row">
          <p className="text-xs opacity-50">
            {year} {fullName}
          </p>
          <Link
            href="/auth/login"
            className="text-xs opacity-20 transition-opacity hover:opacity-50"
          >
            Verwaltung
          </Link>
        </div>
      </div>
    </footer>
  )
}
