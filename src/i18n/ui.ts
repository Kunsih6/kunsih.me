/**
 * Locales and interface strings. Keep `locales` in sync with `astro.config.mjs`.
 * The strings of each language live in `./langs/<lang>.ts`.
 */
import type { Messages } from './langs/en'
import en from './langs/en'
import es from './langs/es'

export type { Messages }

export const languages = {
  en: 'English',
  es: 'Español',
} as const

export type Lang = keyof typeof languages

export const defaultLang: Lang = 'en'

export const locales = Object.keys(languages) as Lang[]

/** Values for `og:locale` (Open Graph uses `ll_CC`). */
export const ogLocales: Record<Lang, string> = {
  en: 'en_US',
  es: 'es_LA',
}

export const ui = { en, es } satisfies Record<Lang, Messages>

/** Dotted paths to the string leaves of `T`: `{ seo: { title } }` → `'seo.title'`. */
type LeafPath<T> = {
  [K in keyof T & string]: T[K] extends string
    ? K
    : `${K}.${LeafPath<T[K]>}`
}[keyof T & string]

/** A message key for `t()`, e.g. `'seo.title'`. */
export type UIKey = LeafPath<Messages>
