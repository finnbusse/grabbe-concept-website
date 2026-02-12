import { getSettings, getNavigation, getAllNavItems } from "@/lib/settings"
import { SiteHeader, type NavItemData } from "@/components/site-header"
import { SiteFooter, type FooterLink } from "@/components/site-footer"

export async function SiteLayout({ children }: { children: React.ReactNode }) {
  const [settings, headerNav, footerNav, footerLegalNav] = await Promise.all([
    getSettings(),
    getNavigation("header"),
    getAllNavItems("footer"),
    getAllNavItems("footer-legal"),
  ])

  const navItems: NavItemData[] = headerNav.map((item) => ({
    id: item.id,
    label: item.label,
    href: item.href,
    children: item.children?.map((c) => ({
      id: c.id,
      label: c.label,
      href: c.href,
    })),
  }))

  const footerLinks: FooterLink[] = footerNav.map((l) => ({
    id: l.id,
    label: l.label,
    href: l.href,
  }))

  const legalLinks: FooterLink[] = footerLegalNav.map((l) => ({
    id: l.id,
    label: l.label,
    href: l.href,
  }))

  return (
    <>
      <SiteHeader
        navItems={navItems}
        schoolName={settings.school_name || "Grabbe-Gymnasium"}
        logoUrl={settings.school_logo_url || undefined}
      />
      {children}
      <SiteFooter links={footerLinks} legalLinks={legalLinks} settings={settings} />
    </>
  )
}
