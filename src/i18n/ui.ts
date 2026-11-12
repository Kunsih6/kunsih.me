// Keep `languages` in sync with `locales` in astro.config.mjs.
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

export type UIKey = LeafPath<Messages>
