import { getSettings } from "@/lib/settings"
import type { Metadata } from "next"

// ============================================================================
// Types
// ============================================================================

export interface SEOSettings {
  siteUrl: string
  siteName: string
  titleSeparator: string
  titleSuffix: string
  defaultDescription: string
  ogImage: string
  orgName: string
  orgLogo: string
  orgEmail: string
  orgPhone: string
  orgStreet: string
  orgCity: string
  orgZip: string
  orgCountry: string
  socialInstagram: string
  socialFacebook: string
  socialYoutube: string
  robotsTxt: string
}

export interface PageSEO {
  title: string
  description?: string
  ogImage?: string
  path: string
  type?: "website" | "article"
  publishedTime?: string
  modifiedTime?: string
  author?: string
  section?: string
  noIndex?: boolean
}

export interface BreadcrumbItem {
  name: string
  href: string
}

// ============================================================================
// Settings Loader
// ============================================================================

export async function getSEOSettings(): Promise<SEOSettings> {
  const s = await getSettings()
  return {
    siteUrl: (s.seo_site_url || "").replace(/\/$/, ""),
    siteName: s.school_name || "Grabbe-Gymnasium Detmold",
    titleSeparator: s.seo_title_separator || " / ",
    titleSuffix: s.seo_title_suffix || "Grabbe-Gymnasium",
    defaultDescription:
      s.seo_default_description ||
      s.seo_description ||
      "Das Christian-Dietrich-Grabbe-Gymnasium in Detmold - Wir foerdern Deine Talente und staerken Deine Persoenlichkeit.",
    ogImage: s.seo_og_image || "",
    orgName: s.seo_org_name || s.school_name || "Grabbe-Gymnasium Detmold",
    orgLogo: s.seo_org_logo || "",
    orgEmail: s.seo_org_email || s.contact_email || "",
    orgPhone: s.seo_org_phone || s.contact_phone || "",
    orgStreet: s.seo_org_address_street || "",
    orgCity: s.seo_org_address_city || "Detmold",
    orgZip: s.seo_org_address_zip || "",
    orgCountry: s.seo_org_address_country || "DE",
    socialInstagram: s.seo_social_instagram || "",
    socialFacebook: s.seo_social_facebook || "",
    socialYoutube: s.seo_social_youtube || "",
    robotsTxt:
      s.seo_robots_txt ||
      "User-agent: *\nAllow: /\nDisallow: /cms/\nDisallow: /auth/\nDisallow: /api/",
  }
}

// ============================================================================
// Metadata Generator
// ============================================================================

export async function generatePageMetadata(page: PageSEO): Promise<Metadata> {
  const seo = await getSEOSettings()
  const description = page.description || seo.defaultDescription
  const canonicalUrl = seo.siteUrl ? `${seo.siteUrl}${page.path}` : undefined
  const ogImage = page.ogImage || seo.ogImage

  const metadata: Metadata = {
    title: page.title,
    description,
    ...(canonicalUrl ? { alternates: { canonical: canonicalUrl } } : {}),
    ...(page.noIndex ? { robots: { index: false, follow: false } } : {}),
    openGraph: {
      title: `${page.title}${seo.titleSeparator}${seo.titleSuffix}`,
      description,
      type: page.type === "article" ? "article" : "website",
      locale: "de_DE",
      siteName: seo.siteName,
      ...(canonicalUrl ? { url: canonicalUrl } : {}),
      ...(ogImage ? { images: [{ url: ogImage, width: 1200, height: 630, alt: page.title }] } : {}),
      ...(page.type === "article"
        ? {
            ...(page.publishedTime ? { publishedTime: page.publishedTime } : {}),
            ...(page.modifiedTime ? { modifiedTime: page.modifiedTime } : {}),
            ...(page.author ? { authors: [page.author] } : {}),
            ...(page.section ? { section: page.section } : {}),
          }
        : {}),
    },
    twitter: {
      card: ogImage ? "summary_large_image" : "summary",
      title: `${page.title}${seo.titleSeparator}${seo.titleSuffix}`,
      description,
      ...(ogImage ? { images: [ogImage] } : {}),
    },
  }

  return metadata
}

// ============================================================================
// JSON-LD Generators
// ============================================================================

export function generateOrganizationJsonLd(seo: SEOSettings) {
  const org: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    name: seo.orgName,
    ...(seo.siteUrl ? { url: seo.siteUrl } : {}),
    ...(seo.orgLogo ? { logo: seo.orgLogo } : {}),
    ...(seo.orgEmail ? { email: seo.orgEmail } : {}),
    ...(seo.orgPhone ? { telephone: seo.orgPhone } : {}),
  }

  if (seo.orgStreet || seo.orgCity || seo.orgZip) {
    org.address = {
      "@type": "PostalAddress",
      ...(seo.orgStreet ? { streetAddress: seo.orgStreet } : {}),
      ...(seo.orgCity ? { addressLocality: seo.orgCity } : {}),
      ...(seo.orgZip ? { postalCode: seo.orgZip } : {}),
      ...(seo.orgCountry ? { addressCountry: seo.orgCountry } : {}),
    }
  }

  const sameAs: string[] = []
  if (seo.socialInstagram) sameAs.push(seo.socialInstagram)
  if (seo.socialFacebook) sameAs.push(seo.socialFacebook)
  if (seo.socialYoutube) sameAs.push(seo.socialYoutube)
  if (sameAs.length > 0) org.sameAs = sameAs

  return org
}

export function generateWebSiteJsonLd(seo: SEOSettings) {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: seo.siteName,
    ...(seo.siteUrl ? { url: seo.siteUrl } : {}),
    ...(seo.defaultDescription ? { description: seo.defaultDescription } : {}),
    inLanguage: "de-DE",
    publisher: {
      "@type": "EducationalOrganization",
      name: seo.orgName,
    },
  }
}

export function generateArticleJsonLd(opts: {
  seo: SEOSettings
  title: string
  description: string
  url: string
  imageUrl?: string
  publishedTime: string
  modifiedTime: string
  authorName?: string
  section?: string
}) {
  return {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: opts.title,
    description: opts.description,
    ...(opts.url ? { url: opts.url } : {}),
    ...(opts.imageUrl ? { image: opts.imageUrl } : {}),
    datePublished: opts.publishedTime,
    dateModified: opts.modifiedTime,
    inLanguage: "de-DE",
    ...(opts.authorName
      ? { author: { "@type": "Person", name: opts.authorName } }
      : { author: { "@type": "EducationalOrganization", name: opts.seo.orgName } }),
    publisher: {
      "@type": "EducationalOrganization",
      name: opts.seo.orgName,
      ...(opts.seo.orgLogo ? { logo: { "@type": "ImageObject", url: opts.seo.orgLogo } } : {}),
    },
    ...(opts.section ? { articleSection: opts.section } : {}),
    mainEntityOfPage: {
      "@type": "WebPage",
      ...(opts.url ? { "@id": opts.url } : {}),
    },
  }
}

export function generateBreadcrumbJsonLd(seo: SEOSettings, items: BreadcrumbItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      ...(seo.siteUrl ? { item: `${seo.siteUrl}${item.href}` } : {}),
    })),
  }
}

export function generateWebPageJsonLd(opts: {
  seo: SEOSettings
  title: string
  description: string
  url: string
  breadcrumbs?: BreadcrumbItem[]
}) {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: opts.title,
    description: opts.description,
    ...(opts.url ? { url: opts.url } : {}),
    inLanguage: "de-DE",
    isPartOf: {
      "@type": "WebSite",
      name: opts.seo.siteName,
      ...(opts.seo.siteUrl ? { url: opts.seo.siteUrl } : {}),
    },
    ...(opts.breadcrumbs
      ? { breadcrumb: generateBreadcrumbJsonLd(opts.seo, opts.breadcrumbs) }
      : {}),
  }
}

// ============================================================================
// JSON-LD Script Component Helper
// ============================================================================

export function JsonLd({ data }: { data: Record<string, unknown> | Record<string, unknown>[] }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  )
}
