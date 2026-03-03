/**
 * Presentation Block Types
 *
 * Discriminated union for all block types available in the Presentation editor.
 * Each block carries a `type` discriminant, a unique `id`, and its own config.
 */

// ============================================================================
// Individual Block Types
// ============================================================================

export interface HeroBlock {
  type: "hero"
  id: string
  backgroundImageUrl: string
  heading: string
  subtitle: string
  ctaLabel: string
  ctaUrl: string
}

export interface TextBlock {
  type: "text"
  id: string
  content: string
  size: "h1" | "h2" | "h3" | "body"
  alignment: "left" | "center"
  isLead: boolean
}

export interface ImageFullBlock {
  type: "image_full"
  id: string
  imageUrl: string
  alt: string
  caption: string
}

export interface GalleryImage {
  imageUrl: string
  alt: string
  caption: string
}

export interface GalleryBlock {
  type: "gallery"
  id: string
  columns: 2 | 3 | 4
  images: GalleryImage[]
}

export interface QuoteBlock {
  type: "quote"
  id: string
  text: string
  attribution: string
  accentColor: string
}

export interface VideoBlock {
  type: "video"
  id: string
  url: string
  caption: string
}

export interface FeatureCard {
  iconName: string
  heading: string
  text: string
}

export interface FeatureCardsBlock {
  type: "feature_cards"
  id: string
  cards: FeatureCard[]
}

export interface DividerBlock {
  type: "divider"
  id: string
  style: "line" | "dots" | "wave"
}

export interface StatItem {
  value: string
  label: string
}

export interface StatsBlock {
  type: "stats"
  id: string
  items: StatItem[]
}

export interface TwoColumnBlock {
  type: "two_column"
  id: string
  textContent: string
  imageUrl: string
  imageAlt: string
  imagePosition: "left" | "right"
  split: "50/50" | "60/40" | "40/60"
}

// ============================================================================
// Discriminated Union
// ============================================================================

export type PresentationBlock =
  | HeroBlock
  | TextBlock
  | ImageFullBlock
  | GalleryBlock
  | QuoteBlock
  | VideoBlock
  | FeatureCardsBlock
  | DividerBlock
  | StatsBlock
  | TwoColumnBlock

/**
 * All available presentation block type identifiers
 */
export const PRESENTATION_BLOCK_TYPES = [
  "hero",
  "text",
  "image_full",
  "gallery",
  "quote",
  "video",
  "feature_cards",
  "divider",
  "stats",
  "two_column",
] as const

export type PresentationBlockType = (typeof PRESENTATION_BLOCK_TYPES)[number]

/**
 * Block type metadata for the editor UI
 */
export interface PresentationBlockMeta {
  type: PresentationBlockType
  label: string
  description: string
  iconName: string
}

export const PRESENTATION_BLOCK_META: PresentationBlockMeta[] = [
  { type: "hero", label: "Hero", description: "Vollbild-Abschnitt mit Hintergrundbild und Überschrift", iconName: "Monitor" },
  { type: "text", label: "Text", description: "Text mit konfigurierbarer Größe und Ausrichtung", iconName: "Type" },
  { type: "image_full", label: "Bild (Vollbreite)", description: "Vollbreites Bild mit optionaler Beschriftung", iconName: "Image" },
  { type: "gallery", label: "Galerie", description: "Responsives Bildgitter mit 2–4 Spalten", iconName: "LayoutGrid" },
  { type: "quote", label: "Zitat", description: "Großes Zitat mit optionaler Quellenangabe", iconName: "Quote" },
  { type: "video", label: "Video", description: "Eingebettetes Video (YouTube/Vimeo)", iconName: "Play" },
  { type: "feature_cards", label: "Feature-Karten", description: "2–4 Karten mit Icon, Titel und Text", iconName: "LayoutList" },
  { type: "divider", label: "Trenner", description: "Stilistischer Abschnittstrenner", iconName: "Minus" },
  { type: "stats", label: "Statistiken", description: "2–4 Kennzahlen mit Beschriftung", iconName: "BarChart3" },
  { type: "two_column", label: "Zwei Spalten", description: "Text und Bild nebeneinander", iconName: "Columns2" },
]
