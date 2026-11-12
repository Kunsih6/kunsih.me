import type { Lang, Messages, UIKey } from './ui'
import { getAbsoluteLocaleUrl, getRelativeLocaleUrl } from 'astro:i18n'
import { defaultLang, languages, locales, ui } from './ui'

export function isLang(value: unknown): value is Lang {
  return typeof value === 'string' && value in languages
}

export function getLang(locale: string | undefined): Lang {
  return isLang(locale)
    ? locale
    : defaultLang
}

function lookup(messages: Messages, key: UIKey): string | undefined {
  const value = key.split('.').reduce<unknown>(
    (node, part) => (node as Record<string, unknown> | undefined)?.[part],
    messages,
  )
  return typeof value === 'string'
    ? value
    : undefined
}

export function useTranslations(lang: Lang) {
  return function t(key: UIKey): string {
    return lookup(ui[lang], key) ?? lookup(ui[defaultLang], key) ?? key
  }
}

export function localizedPath(lang: Lang, path = ''): string {
  return getRelativeLocaleUrl(lang, path)
}

export function alternateUrls(path = ''): { lang: Lang, href: string }[] {
  return locales.map(lang => ({
    lang,
    href: getAbsoluteLocaleUrl(lang, path),
  }))
}

export function otherLangs(lang: Lang): Lang[] {
  return locales.filter(l => l !== lang)
}
