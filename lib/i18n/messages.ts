import { AppLocale, DEFAULT_LOCALE } from '@/lib/i18n/config'

export type Messages = Record<string, string>

const loaders: Record<AppLocale, () => Promise<Messages>> = {
  de: async () => (await import('@/lib/i18n/translations/de')).default,
  en: async () => (await import('@/lib/i18n/translations/en')).default,
}

export async function getMessages(locale: AppLocale): Promise<Messages> {
  const load = loaders[locale] ?? loaders[DEFAULT_LOCALE]
  return load()
}
