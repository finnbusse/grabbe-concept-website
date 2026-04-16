import { AppLocale, DEFAULT_LOCALE, isSupportedLocale } from '@/lib/i18n/config'

type LocaleCandidate = {
  locale: string
  quality: number
}

function normalizeLocale(input: string): string {
  return input.trim().toLowerCase().replace('_', '-')
}

function toBaseLocale(input: string): string {
  return normalizeLocale(input).split('-')[0]
}

function parseAcceptLanguage(acceptLanguage: string | null): LocaleCandidate[] {
  if (!acceptLanguage) return []

  return acceptLanguage
    .split(',')
    .map((part) => {
      const [rawLocale, ...params] = part.trim().split(';')
      const qualityParam = params.find((param) => param.trim().startsWith('q='))
      const quality = qualityParam ? Number(qualityParam.split('=')[1]) : 1
      return {
        locale: normalizeLocale(rawLocale),
        quality: Number.isFinite(quality) ? quality : 0,
      }
    })
    .filter((candidate) => candidate.locale && candidate.quality > 0)
    .sort((a, b) => b.quality - a.quality)
}

function resolveSupportedLocale(input: string | null | undefined): AppLocale | null {
  if (!input) return null

  const normalized = normalizeLocale(input)
  if (isSupportedLocale(normalized)) return normalized

  const base = toBaseLocale(normalized)
  if (isSupportedLocale(base)) return base

  return null
}

export function detectRequestLocale({
  cookieLocale,
  acceptLanguage,
}: {
  cookieLocale?: string | null
  acceptLanguage?: string | null
}): AppLocale {
  const fromCookie = resolveSupportedLocale(cookieLocale)
  if (fromCookie) return fromCookie

  const candidates = parseAcceptLanguage(acceptLanguage ?? null)
  for (const candidate of candidates) {
    const resolved = resolveSupportedLocale(candidate.locale)
    if (resolved) return resolved
  }

  return DEFAULT_LOCALE
}
