/**
 * Shared teacher utility functions.
 *
 * These live in a plain (non-"use client") module so they can be used by both
 * server components (e.g. app/aktuelles/[slug]/page.tsx) and client components
 * (e.g. teacher-author-selector.tsx).
 */

// ---------------------------------------------------------------------------
// Helper: gender-aware salutation prefix for display
// ---------------------------------------------------------------------------

export function genderPrefix(gender: string): string {
  switch (gender) {
    case "male":
      return "Herr"
    case "female":
      return "Frau"
    default:
      return ""
  }
}

export function teacherDisplayName(teacher: { gender: string; first_name: string; last_name: string }): string {
  const prefix = genderPrefix(teacher.gender)
  return [prefix, teacher.first_name, teacher.last_name].filter(Boolean).join(" ")
}

/**
 * Public-facing display name — first + last name only, **no** gender salutation.
 * Use this on visitor-facing pages (e.g. /aktuelles/[slug]).
 */
export function teacherPublicName(teacher: { first_name: string; last_name: string }): string {
  return [teacher.first_name, teacher.last_name].filter(Boolean).join(" ")
}
