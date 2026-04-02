import { PAGE_DEFAULTS } from './defaults'
import type { EditablePage, PageSection } from './types'

export const HERO_IMAGE_SECTION: PageSection = {
  id: 'hero',
  title: 'Titelbild (Hero)',
  fields: [
    {
      key: 'hero_image_url',
      label: 'Hintergrundbild URL',
      type: 'image',
      description: 'Optionales Hintergrundbild im Kopfbereich der Seite. Empfohlen: 1920x1080px oder grösser.',
    },
  ],
}

// Tasks 101, 102, 103, 104, 105: Centralized definitions.
export interface CategoryDef {
  id: string
  slug: string
  label: string
  sort_order: number
  children: CategoryDef[]
}

export const SYSTEM_ROUTES: { path: string; label: string; category?: string; subcategory?: string }[] = [
  { path: "/", label: "Startseite" },
  { path: "/aktuelles", label: "Aktuelles (Beiträge)" },
  { path: "/termine", label: "Termine" },
  { path: "/downloads", label: "Downloads" },
  { path: "/kontakt", label: "Kontakt" },
  { path: "/unsere-schule", label: "Unsere Schule (Übersicht)", category: "unsere-schule" },
  { path: "/unsere-schule/erprobungsstufe", label: "Erprobungsstufe", category: "unsere-schule" },
  { path: "/unsere-schule/profilprojekte", label: "Profilprojekte", category: "unsere-schule" },
  { path: "/unsere-schule/oberstufe", label: "Oberstufe", category: "unsere-schule" },
  { path: "/unsere-schule/anmeldung", label: "Anmeldung", category: "unsere-schule" },
  { path: "/schulleben", label: "Schulleben (Übersicht)", category: "schulleben" },
  { path: "/schulleben/faecher-ags", label: "Fächer & AGs", category: "schulleben" },
  { path: "/schulleben/nachmittag", label: "Nachmittags am Grabbe", category: "schulleben" },
  { path: "/schulleben/netzwerk", label: "Netzwerk & Partner", category: "schulleben" },
  { path: "/unterricht", label: "Unterricht", category: "unterricht" },
  { path: "/unterricht/faecher", label: "Fächer", category: "unterricht", subcategory: "faecher" },
  { path: "/impressum", label: "Impressum" },
  { path: "/datenschutz", label: "Datenschutz" },
]

export const DEFAULT_CATEGORIES: CategoryDef[] = [
  {
    id: "unsere-schule",
    slug: "unsere-schule",
    label: "Unsere Schule",
    sort_order: 0,
    children: [],
  },
  {
    id: "schulleben",
    slug: "schulleben",
    label: "Schulleben",
    sort_order: 1,
    children: [],
  },
  {
    id: "unterricht",
    slug: "unterricht",
    label: "Unterricht",
    sort_order: 2,
    children: [
      {
        id: "unterricht-faecher",
        slug: "faecher",
        label: "Fächer",
        sort_order: 0,
        children: [],
      }
    ],
  },
  {
    id: "sonstiges",
    slug: "sonstiges",
    label: "Freie Seiten",
    sort_order: 3,
    children: [],
  },
]

export const EDITABLE_PAGES: EditablePage[] = [
  {
    id: 'homepage-hero',
    title: 'Startseite: Hero & Intro',
    description: 'Titel, Subtitle und Titelbild der Startseite.',
    route: '/',
    sections: [
      {
        id: 'hero',
        title: 'Hero Sektion',
        fields: [
          { key: 'hero_title', label: 'Titel (groß)', type: 'text' },
          { key: 'hero_subtitle', label: 'Untertitel', type: 'text' },
          { key: 'hero_button_text', label: 'Button Text', type: 'text' },
          { key: 'hero_button_link', label: 'Button Link', type: 'text' },
          { key: 'hero_image_url', label: 'Hintergrundbild (URL)', type: 'image' },
        ],
      },
    ],
    defaults: PAGE_DEFAULTS['homepage-hero'] || {},
  },
]
