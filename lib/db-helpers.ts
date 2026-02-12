/**
 * Database Query Helpers
 * 
 * Common database queries and utilities for the School CMS
 * These helpers provide type-safe, reusable database operations
 */

import { createClient as createServerClient } from '@/lib/supabase/server'
import { createClient as createBrowserClient } from '@/lib/supabase/client'
import type {
  Page,
  Post,
  Event,
  Document,
  NavigationItem,
  NavigationItemWithChildren,
  SiteSetting,
  ContactSubmission,
  AnmeldungSubmission,
} from '@/lib/types/database.types'

// ============================================================================
// Pages Queries
// ============================================================================

/**
 * Get all published pages
 */
export async function getPublishedPages() {
  const supabase = await createServerClient()
  const { data, error } = await supabase
    .from('pages')
    .select('*')
    .eq('published', true)
    .order('sort_order', { ascending: true })

  if (error) throw error
  return data as Page[]
}

/**
 * Get a page by slug
 */
export async function getPageBySlug(slug: string) {
  const supabase = await createServerClient()
  const { data, error } = await supabase
    .from('pages')
    .select('*')
    .eq('slug', slug)
    .eq('published', true)
    .single()

  if (error) throw error
  return data as Page
}

/**
 * Get pages by section
 */
export async function getPagesBySection(section: string) {
  const supabase = await createServerClient()
  const { data, error } = await supabase
    .from('pages')
    .select('*')
    .eq('section', section)
    .eq('published', true)
    .order('sort_order', { ascending: true })

  if (error) throw error
  return data as Page[]
}

// ============================================================================
// Posts Queries
// ============================================================================

/**
 * Get all published posts
 */
export async function getPublishedPosts(limit?: number) {
  const supabase = await createServerClient()
  let query = supabase
    .from('posts')
    .select('*')
    .eq('published', true)
    .order('created_at', { ascending: false })

  if (limit) {
    query = query.limit(limit)
  }

  const { data, error } = await query
  if (error) throw error
  return data as Post[]
}

/**
 * Get featured posts
 */
export async function getFeaturedPosts(limit: number = 3) {
  const supabase = await createServerClient()
  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .eq('published', true)
    .eq('featured', true)
    .order('created_at', { ascending: false })
    .limit(limit)

  if (error) throw error
  return data as Post[]
}

/**
 * Get a post by slug
 */
export async function getPostBySlug(slug: string) {
  const supabase = await createServerClient()
  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .eq('slug', slug)
    .eq('published', true)
    .single()

  if (error) throw error
  return data as Post
}

/**
 * Get posts by category
 */
export async function getPostsByCategory(category: string, limit?: number) {
  const supabase = await createServerClient()
  let query = supabase
    .from('posts')
    .select('*')
    .eq('category', category)
    .eq('published', true)
    .order('created_at', { ascending: false })

  if (limit) {
    query = query.limit(limit)
  }

  const { data, error } = await query
  if (error) throw error
  return data as Post[]
}

// ============================================================================
// Events Queries
// ============================================================================

/**
 * Get upcoming events
 */
export async function getUpcomingEvents(limit?: number) {
  const supabase = await createServerClient()
  const today = new Date().toISOString().split('T')[0]

  let query = supabase
    .from('events')
    .select('*')
    .eq('published', true)
    .gte('event_date', today)
    .order('event_date', { ascending: true })

  if (limit) {
    query = query.limit(limit)
  }

  const { data, error } = await query
  if (error) throw error
  return data as Event[]
}

/**
 * Get past events
 */
export async function getPastEvents(limit?: number) {
  const supabase = await createServerClient()
  const today = new Date().toISOString().split('T')[0]

  let query = supabase
    .from('events')
    .select('*')
    .eq('published', true)
    .lt('event_date', today)
    .order('event_date', { ascending: false })

  if (limit) {
    query = query.limit(limit)
  }

  const { data, error } = await query
  if (error) throw error
  return data as Event[]
}

/**
 * Get events by category
 */
export async function getEventsByCategory(category: string) {
  const supabase = await createServerClient()
  const { data, error } = await supabase
    .from('events')
    .select('*')
    .eq('category', category)
    .eq('published', true)
    .order('event_date', { ascending: true })

  if (error) throw error
  return data as Event[]
}

// ============================================================================
// Documents Queries
// ============================================================================

/**
 * Get all published documents
 */
export async function getPublishedDocuments() {
  const supabase = await createServerClient()
  const { data, error } = await supabase
    .from('documents')
    .select('*')
    .eq('published', true)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data as Document[]
}

/**
 * Get documents by category
 */
export async function getDocumentsByCategory(category: string) {
  const supabase = await createServerClient()
  const { data, error } = await supabase
    .from('documents')
    .select('*')
    .eq('category', category)
    .eq('published', true)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data as Document[]
}

// ============================================================================
// Navigation Queries
// ============================================================================

/**
 * Get navigation items for a specific location (header/footer)
 * Returns a hierarchical structure with nested children
 */
export async function getNavigationItems(
  location: 'header' | 'footer' = 'header'
): Promise<NavigationItemWithChildren[]> {
  const supabase = await createServerClient()
  const { data, error } = await supabase
    .from('navigation_items')
    .select('*')
    .eq('location', location)
    .eq('visible', true)
    .order('sort_order', { ascending: true })

  if (error) throw error

  // Build hierarchical structure
  const items = data as NavigationItem[]
  const itemMap = new Map<string, NavigationItemWithChildren>()
  const rootItems: NavigationItemWithChildren[] = []

  // First pass: create map of all items
  items.forEach((item) => {
    itemMap.set(item.id, { ...item, children: [] })
  })

  // Second pass: build hierarchy
  items.forEach((item) => {
    const navItem = itemMap.get(item.id)!
    if (item.parent_id && itemMap.has(item.parent_id)) {
      const parent = itemMap.get(item.parent_id)!
      parent.children = parent.children || []
      parent.children.push(navItem)
    } else {
      rootItems.push(navItem)
    }
  })

  return rootItems
}

// ============================================================================
// Site Settings Queries
// ============================================================================

/**
 * Get a site setting by key
 */
export async function getSiteSetting(key: string): Promise<SiteSetting | null> {
  const supabase = await createServerClient()
  const { data, error } = await supabase
    .from('site_settings')
    .select('*')
    .eq('key', key)
    .single()

  if (error) return null
  return data as SiteSetting
}

/**
 * Get site setting value by key (returns just the value string)
 */
export async function getSiteSettingValue(key: string): Promise<string | null> {
  const setting = await getSiteSetting(key)
  return setting?.value || null
}

/**
 * Get all site settings by category
 */
export async function getSiteSettingsByCategory(category: string) {
  const supabase = await createServerClient()
  const { data, error } = await supabase
    .from('site_settings')
    .select('*')
    .eq('category', category)

  if (error) throw error
  return data as SiteSetting[]
}

/**
 * Get all site settings as a key-value map
 */
export async function getAllSiteSettings(): Promise<Record<string, string>> {
  const supabase = await createServerClient()
  const { data, error } = await supabase.from('site_settings').select('key, value')

  if (error) throw error

  const settings: Record<string, string> = {}
  data.forEach((setting) => {
    settings[setting.key] = setting.value
  })

  return settings
}

// ============================================================================
// Form Submissions (Server-side only)
// ============================================================================

/**
 * Create a contact submission
 */
export async function createContactSubmission(
  submission: Omit<ContactSubmission, 'id' | 'created_at' | 'read'>
) {
  const supabase = await createServerClient()
  const { data, error } = await supabase
    .from('contact_submissions')
    .insert(submission)
    .select()
    .single()

  if (error) throw error
  return data as ContactSubmission
}

/**
 * Create an anmeldung (enrollment) submission
 */
export async function createAnmeldungSubmission(
  submission: Omit<AnmeldungSubmission, 'id' | 'created_at'>
) {
  const supabase = await createServerClient()
  const { data, error } = await supabase
    .from('anmeldung_submissions')
    .insert(submission)
    .select()
    .single()

  if (error) throw error
  return data as AnmeldungSubmission
}

// ============================================================================
// Utility Functions
// ============================================================================

/**
 * Generate a URL-friendly slug from a string
 */
export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[äÄ]/g, 'ae')
    .replace(/[öÖ]/g, 'oe')
    .replace(/[üÜ]/g, 'ue')
    .replace(/[ß]/g, 'ss')
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

/**
 * Format date in German locale
 */
export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('de-DE', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

/**
 * Format datetime in German locale
 */
export function formatDateTime(dateString: string): string {
  return new Date(dateString).toLocaleDateString('de-DE', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}
