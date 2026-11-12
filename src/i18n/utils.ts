import type { Lang, UIKey } from './ui'
import { getAbsoluteLocaleUrl, getRelativeLocaleUrl } from 'astro:i18n'
import { defaultLang, languages, locales, ui } from './ui'

export function isLang(value: unknown): value is Lang {
  return typeof value === 'string' && value in languages
}

/** Normalizes `Astro.currentLocale` to one of the supported languages. */
export function getLang(locale: string | undefined): Lang {
  return isLang(locale)
    ? locale
    : defaultLang
}

export function useTranslations(lang: Lang) {
  return function t(key: UIKey): string {
    return ui[lang][key] ?? ui[defaultLang][key]
  }
}

/** Relative URL of `path` in `lang` (e.g. `/`, `/es/`). */
export function localizedPath(lang: Lang, path = ''): string {
  return getRelativeLocaleUrl(lang, path)
}

/** Absolute URL of `path` in every locale, used for hreflang links. */
export function alternateUrls(path = ''): { lang: Lang, href: string }[] {
  return locales.map(lang => ({
    lang,
    href: getAbsoluteLocaleUrl(lang, path),
  }))
}

/** The other locales, for the language switcher. */
export function otherLangs(lang: Lang): Lang[] {
  return locales.filter(l => l !== lang)
}
