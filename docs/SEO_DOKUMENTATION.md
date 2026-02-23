# SEO-Dokumentation – Grabbe-Gymnasium Website

> Letzte Aktualisierung: Februar 2026

## Inhaltsverzeichnis

1. [Ueberblick](#1-ueberblick)
2. [Architektur](#2-architektur)
3. [Zentrale SEO-Einstellungen](#3-zentrale-seo-einstellungen)
4. [Titel-System](#4-titel-system)
5. [Meta-Tags und Open Graph](#5-meta-tags-und-open-graph)
6. [JSON-LD Structured Data](#6-json-ld-structured-data)
7. [Sitemap](#7-sitemap)
8. [robots.txt](#8-robotstxt)
9. [Breadcrumbs](#9-breadcrumbs)
10. [SEO fuer Beitraege (News)](#10-seo-fuer-beitraege-news)
11. [SEO fuer eigene Seiten](#11-seo-fuer-eigene-seiten)
12. [Canonical URLs](#12-canonical-urls)
13. [Datenbank-Migration](#13-datenbank-migration)
14. [Technische Referenz](#14-technische-referenz)
15. [Best Practices fuer Redakteure](#15-best-practices-fuer-redakteure)

---

## 1. Ueberblick

Das SEO-System der Grabbe-Gymnasium Website wurde als modulares, dynamisches System entworfen. Alle SEO-relevanten Einstellungen werden zentral in der Datenbank (`site_settings` Tabelle) verwaltet und koennen ueber das CMS-Dashboard unter **Einstellungen > SEO & Open Graph** bearbeitet werden.

### Was wird automatisch generiert?

| Feature | Automatisch | Manuell anpassbar |
|---------|:-----------:|:-----------------:|
| Seitentitel (Tab-Leiste) | ✅ | ✅ per Einstellung |
| Meta-Beschreibungen | ✅ (Fallback) | ✅ per Seite/Beitrag |
| Open Graph Tags | ✅ | ✅ per Seite/Beitrag |
| Twitter Cards | ✅ | ✅ |
| Canonical URLs | ✅ | – |
| robots.txt | ✅ | ✅ per Einstellung |
| sitemap.xml | ✅ | – |
| JSON-LD Organisation | ✅ | ✅ per Einstellung |
| JSON-LD WebSite | ✅ | ✅ per Einstellung |
| JSON-LD NewsArticle | ✅ | – |
| JSON-LD BreadcrumbList | ✅ | – |
| Breadcrumb-Navigation | ✅ | – |

---

## 2. Architektur

```
lib/seo.ts                  ← Zentrale SEO-Bibliothek
├── getSEOSettings()        ← Laedt alle Einstellungen aus DB
├── generatePageMetadata()  ← Generiert Next.js Metadata-Objekt
├── generateOrganizationJsonLd()
├── generateWebSiteJsonLd()
├── generateArticleJsonLd()
├── generateBreadcrumbJsonLd()
├── generateWebPageJsonLd()
└── JsonLd                  ← React-Komponente fuer <script type="application/ld+json">

components/breadcrumbs.tsx  ← Breadcrumb-Komponente (visuell + JSON-LD)

app/layout.tsx              ← Root-Metadata + Organisation/WebSite JSON-LD
app/sitemap.ts              ← Dynamische Sitemap-Generierung
app/robots.ts               ← Dynamische robots.txt-Generierung
```

### Datenfluesse

1. **Einstellungen** werden beim Seitenaufruf aus `site_settings` geladen
2. **Root Layout** generiert globale Metadata (Titel-Template, Standard-OG, etc.)
3. **Einzelne Seiten** ueberschreiben den Titel via Next.js `metadata.title`
4. **Beitraege** nutzen `generateMetadata()` fuer vollstaendige Article-Metadata

---

## 3. Zentrale SEO-Einstellungen

Alle Einstellungen befinden sich im CMS unter **Einstellungen > SEO & Open Graph**.

### Verfuegbare Einstellungen

| Schluessel | Bezeichnung | Beschreibung |
|-----------|-------------|--------------|
| `seo_title` | SEO-Titel | Standard-Seitentitel (Fallback) |
| `seo_description` | SEO-Beschreibung | Standard Meta-Beschreibung |
| `seo_og_image` | OG-Bild | Standard Open-Graph-Vorschaubild |
| `seo_site_url` | Website-URL | Basis-URL fuer Canonical-Links und Sitemap (z.B. `https://grabbe.de`) |
| `seo_title_separator` | Titel-Trennzeichen | Zeichen zwischen Seitentitel und Suffix (z.B. ` / `) |
| `seo_title_suffix` | Titel-Suffix | Erscheint nach dem Trennzeichen (z.B. `Grabbe-Gymnasium`) |
| `seo_default_description` | Standard-Beschreibung | Fallback fuer Seiten ohne eigene Beschreibung |
| `seo_robots_txt` | robots.txt Inhalt | Vollstaendiger Inhalt der robots.txt |
| `seo_org_name` | Organisationsname | Name fuer Schema.org EducationalOrganization |
| `seo_org_logo` | Logo-URL | Logo fuer Schema.org |
| `seo_org_email` | E-Mail | Kontakt-E-Mail fuer Schema.org |
| `seo_org_phone` | Telefon | Telefonnummer fuer Schema.org |
| `seo_org_address_street` | Strasse | Strassenadresse fuer Schema.org |
| `seo_org_address_city` | Stadt | Stadt fuer Schema.org |
| `seo_org_address_zip` | PLZ | Postleitzahl fuer Schema.org |
| `seo_org_address_country` | Land | ISO-Laendercode fuer Schema.org (z.B. `DE`) |
| `seo_social_instagram` | Instagram-URL | Social-Media-Link fuer Schema.org sameAs |
| `seo_social_facebook` | Facebook-URL | Social-Media-Link fuer Schema.org sameAs |
| `seo_social_youtube` | YouTube-URL | Social-Media-Link fuer Schema.org sameAs |

---

## 4. Titel-System

Das Titel-System nutzt das Next.js Metadata Template-System:

### Beispiele

| Seite | Angezeigter Titel (Tab-Leiste) |
|-------|-------------------------------|
| Startseite | Grabbe-Gymnasium Detmold |
| Aktuelles | Aktuelles / Grabbe-Gymnasium |
| Oberstufe | Oberstufe / Grabbe-Gymnasium |
| Beitrag "Mathe-Olympiade" | Mathe-Olympiade / Grabbe-Gymnasium |
| Impressum | Impressum / Grabbe-Gymnasium |

### Konfiguration

- **Trennzeichen** aendern: Einstellung `seo_title_separator` (z.B. ` | ` oder ` - `)
- **Suffix** aendern: Einstellung `seo_title_suffix` (z.B. `Grabbe-Gymnasium Detmold`)

### Technisch

```tsx
// app/layout.tsx
title: {
  default: "Grabbe-Gymnasium Detmold",     // Startseite
  template: `%s / Grabbe-Gymnasium`,        // Alle anderen Seiten
}

// Einzelne Seiten
export const metadata = { title: "Aktuelles" }
// → Ergebnis: "Aktuelles / Grabbe-Gymnasium"
```

---

## 5. Meta-Tags und Open Graph

### Automatisch generierte Tags

Auf jeder Seite werden folgende Tags generiert:

```html
<title>Aktuelles / Grabbe-Gymnasium</title>
<meta name="description" content="..." />
<meta property="og:title" content="Aktuelles / Grabbe-Gymnasium" />
<meta property="og:description" content="..." />
<meta property="og:type" content="website" />
<meta property="og:locale" content="de_DE" />
<meta property="og:site_name" content="Grabbe-Gymnasium Detmold" />
<meta property="og:url" content="https://grabbe.de/aktuelles" />
<meta property="og:image" content="..." />
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="..." />
<meta name="twitter:description" content="..." />
<link rel="canonical" href="https://grabbe.de/aktuelles" />
```

### Zusaetzlich bei Beitraegen (Article-Typ)

```html
<meta property="og:type" content="article" />
<meta property="article:published_time" content="2026-01-15T10:00:00Z" />
<meta property="article:modified_time" content="2026-01-16T12:00:00Z" />
<meta property="article:section" content="aktuelles" />
```

---

## 6. JSON-LD Structured Data

### Organisation (auf jeder Seite)

```json
{
  "@context": "https://schema.org",
  "@type": "EducationalOrganization",
  "name": "Grabbe-Gymnasium Detmold",
  "url": "https://grabbe.de",
  "logo": "https://...",
  "email": "info@grabbe.de",
  "telephone": "+49 5231 ...",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "...",
    "addressLocality": "Detmold",
    "postalCode": "32756",
    "addressCountry": "DE"
  },
  "sameAs": ["https://instagram.com/...", "https://facebook.com/..."]
}
```

### WebSite (auf jeder Seite)

```json
{
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "Grabbe-Gymnasium Detmold",
  "url": "https://grabbe.de",
  "inLanguage": "de-DE"
}
```

### NewsArticle (auf Beitragsseiten)

```json
{
  "@context": "https://schema.org",
  "@type": "NewsArticle",
  "headline": "Mathe-Olympiade 2026",
  "description": "...",
  "datePublished": "2026-01-15T10:00:00Z",
  "dateModified": "2026-01-16T12:00:00Z",
  "author": { "@type": "Person", "name": "Dr. Max Mustermann" },
  "publisher": {
    "@type": "EducationalOrganization",
    "name": "Grabbe-Gymnasium Detmold"
  },
  "mainEntityOfPage": { "@type": "WebPage", "@id": "https://grabbe.de/aktuelles/..." }
}
```

### BreadcrumbList (auf Unterseiten)

```json
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    { "@type": "ListItem", "position": 1, "name": "Start", "item": "https://grabbe.de/" },
    { "@type": "ListItem", "position": 2, "name": "Aktuelles", "item": "https://grabbe.de/aktuelles" },
    { "@type": "ListItem", "position": 3, "name": "Mathe-Olympiade", "item": "https://grabbe.de/aktuelles/mathe-olympiade" }
  ]
}
```

---

## 7. Sitemap

Die Sitemap wird automatisch unter `/sitemap.xml` generiert.

### Enthaltene Seiten

- **Startseite** (Prioritaet 1.0, taegliche Aktualisierung)
- **Statische Seiten** (Aktuelles, Termine, Kontakt, etc.)
- **Alle veroeffentlichten Beitraege** mit `lastModified` Zeitstempel
- **Alle veroeffentlichten eigenen Seiten** mit korrekten Pfaden

### Voraussetzung

Die Einstellung `seo_site_url` muss gesetzt sein (z.B. `https://grabbe.de`), damit die Sitemap generiert wird.

---

## 8. robots.txt

Die robots.txt wird automatisch unter `/robots.txt` generiert.

### Standard-Inhalt

```
User-agent: *
Allow: /
Disallow: /cms/
Disallow: /auth/
Disallow: /api/

Sitemap: https://grabbe.de/sitemap.xml
```

### Anpassung

Der Inhalt kann in den Einstellungen unter `seo_robots_txt` frei bearbeitet werden.

---

## 9. Breadcrumbs

Visuelle Breadcrumb-Navigation wird auf folgenden Seiten angezeigt:

- `/aktuelles` → Start > Aktuelles
- `/aktuelles/[slug]` → Start > Aktuelles > Beitragstitel
- `/seiten/[slug]` → Start > Seitentitel
- `/unsere-schule/[slug]` → Start > Unsere Schule > Seitentitel
- `/schulleben/[slug]` → Start > Schulleben > Seitentitel

Jede Breadcrumb-Navigation generiert automatisch auch das passende `BreadcrumbList` JSON-LD.

---

## 10. SEO fuer Beitraege (News)

### Automatisch

Beim Erstellen eines Beitrags wird folgendes automatisch fuer SEO verwendet:

- **Titel** → `og:title`, `twitter:title`, JSON-LD `headline`
- **Kurztext (Excerpt)** → `meta description`, `og:description`
- **Beitragsbild** → `og:image`, JSON-LD `image`
- **Autor** → JSON-LD `author`
- **Erstellungsdatum** → `article:published_time`, JSON-LD `datePublished`
- **Kategorie** → `article:section`, JSON-LD `articleSection`

### Optional ueberschreibbar

Im Beitrags-Editor gibt es einen **SEO (optional)** Bereich:

- **Meta-Beschreibung**: Eigene Beschreibung fuer Suchmaschinen (empfohlen: max. 160 Zeichen). Falls leer, wird der Kurztext verwendet.
- **Social-Media Bild (OG-Image)**: Eigenes Vorschaubild fuer Social Media. Falls leer, wird das Beitragsbild verwendet.

> **Tipp**: Fuer die meisten Beitraege muessen keine SEO-Felder manuell ausgefuellt werden!

---

## 11. SEO fuer eigene Seiten

### Automatisch

- **Seitentitel** → im Tab nach dem Template angezeigt
- **Standard-Beschreibung** → aus den globalen SEO-Einstellungen

### Optional ueberschreibbar

Im Seiten-Editor gibt es einen **SEO (optional)** Bereich:

- **Meta-Beschreibung**: Eigene Beschreibung fuer Suchmaschinen
- **Social-Media Bild**: Eigenes OG-Bild

---

## 12. Canonical URLs

Canonical URLs werden automatisch auf allen Seiten gesetzt:

- Startseite: `https://grabbe.de/`
- Statische Seiten: `https://grabbe.de/aktuelles`
- Beitraege: `https://grabbe.de/aktuelles/mein-beitrag`
- Eigene Seiten: `https://grabbe.de/seiten/meine-seite`

### Voraussetzung

Die `metadataBase` wird im Root Layout gesetzt, wenn `seo_site_url` konfiguriert ist. Alle relativen `canonical`-Pfade werden dann automatisch zu absoluten URLs aufgeloest.

---

## 13. Datenbank-Migration

### SQL-Migration ausfuehren

Die Migration befindet sich in `scripts/migration_seo.sql` und fuegt folgende Aenderungen hinzu:

#### Neue Spalten

| Tabelle | Spalte | Typ | Beschreibung |
|---------|--------|-----|-------------|
| `posts` | `meta_description` | TEXT | Eigene Meta-Beschreibung |
| `posts` | `seo_og_image` | TEXT | Eigenes OG-Bild |
| `pages` | `meta_description` | TEXT | Eigene Meta-Beschreibung |
| `pages` | `seo_og_image` | TEXT | Eigenes OG-Bild |

#### Neue Einstellungen

19 neue Einstellungen in der Kategorie `seo` (siehe Kapitel 3).

### Ausfuehrung

```sql
-- In der Supabase SQL-Konsole ausfuehren:
-- Inhalt von scripts/migration_seo.sql einfuegen und ausfuehren
```

---

## 14. Technische Referenz

### Dateien

| Datei | Funktion |
|-------|----------|
| `lib/seo.ts` | Zentrale SEO-Bibliothek |
| `app/layout.tsx` | Root-Metadata + JSON-LD |
| `app/sitemap.ts` | Sitemap-Generierung |
| `app/robots.ts` | robots.txt-Generierung |
| `components/breadcrumbs.tsx` | Breadcrumb-Komponente |
| `components/cms/post-editor.tsx` | SEO-Felder im Beitrags-Editor |
| `components/cms/page-editor.tsx` | SEO-Felder im Seiten-Editor |
| `scripts/migration_seo.sql` | Datenbank-Migration |

### SEO-Settings Typ

```typescript
interface SEOSettings {
  siteUrl: string          // Basis-URL
  siteName: string         // Seitenname
  titleSeparator: string   // z.B. " / "
  titleSuffix: string      // z.B. "Grabbe-Gymnasium"
  defaultDescription: string
  ogImage: string          // Standard-OG-Bild
  orgName: string          // Organisationsname
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
```

### JSON-LD Funktionen

```typescript
generateOrganizationJsonLd(seo: SEOSettings)  // EducationalOrganization
generateWebSiteJsonLd(seo: SEOSettings)        // WebSite
generateArticleJsonLd({...})                    // NewsArticle
generateBreadcrumbJsonLd(seo, items)            // BreadcrumbList
generateWebPageJsonLd({...})                    // WebPage
```

---

## 15. Best Practices fuer Redakteure

### Beim Erstellen von Beitraegen

1. **Aussagekraeftigen Titel** waehlen (wird als Tab-Titel und in Suchergebnissen angezeigt)
2. **Kurztext (Excerpt)** ausfuellen – dieser wird als Meta-Beschreibung in Suchmaschinen angezeigt
3. **Beitragsbild** hochladen – dieses wird als Vorschaubild in Social Media verwendet
4. Kategorie korrekt waehlen
5. **SEO-Felder** nur ausfuellen, wenn die automatischen Werte nicht passen

### Beim Erstellen von Seiten

1. Eindeutigen, beschreibenden **Seitentitel** waehlen
2. URL-Pfad/Slug kurz und aussagekraeftig halten
3. Bei Bedarf eine **Meta-Beschreibung** im SEO-Bereich eintragen

### Allgemeine Tipps

- Meta-Beschreibungen sollten 120-160 Zeichen lang sein
- Titel sollten unter 60 Zeichen bleiben
- OG-Bilder sollten 1200x630 Pixel gross sein
- Die Website-URL (`seo_site_url`) muss gesetzt sein, damit Sitemap und Canonical URLs funktionieren

---

*Diese Dokumentation beschreibt das SEO-System der Grabbe-Gymnasium Website. Bei Fragen oder Problemen wenden Sie sich an die Webadministration.*
