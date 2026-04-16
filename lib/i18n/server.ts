import 'server-only'
import { cookies, headers } from 'next/headers'
import { detectRequestLocale } from '@/lib/i18n/locale'
import { LOCALE_COOKIE_NAME } from '@/lib/i18n/config'

export async function getRequestLocale() {
  const cookieStore = await cookies()
  const headerStore = await headers()

  return detectRequestLocale({
    cookieLocale: cookieStore.get(LOCALE_COOKIE_NAME)?.value,
    acceptLanguage: headerStore.get('accept-language'),
  })
}
