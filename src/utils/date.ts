import type { Lang } from '@/i18n/ui'
import { useTranslations } from '@/i18n/utils'

/** A calendar month in `YYYY-MM` format. */
export type YearMonth = `${number}-${number}`

function parse(value: YearMonth): { year: number, month: number } {
  const [year, month] = value.split('-').map(Number)
  return { year, month }
}

function currentYearMonth(): YearMonth {
  const now = new Date()
  return `${now.getUTCFullYear()}-${now.getUTCMonth() + 1}`
}

/** "Jan 2023" / "ene 2023". */
export function formatMonth(value: YearMonth, lang: Lang): string {
  const { year, month } = parse(value)
  return new Intl.DateTimeFormat(lang, { month: 'short', year: 'numeric', timeZone: 'UTC' })
    .format(new Date(Date.UTC(year, month - 1, 1)))
}

/**
 * "3 years 10 months" / "3 años 10 meses". `end` defaults to the build month.
 *
 * Intl picks the unit word and its plural form from CLDR data, so the message
 * files need no plural strings. `Intl.DurationFormat` would do this in one call,
 * but it needs Node 23+ and `engines` still allows Node 22.
 */
export function formatDuration(start: YearMonth, end: YearMonth | null, lang: Lang): string {
  const from = parse(start)
  const to = parse(end ?? currentYearMonth())
  const total = Math.max(1, (to.year - from.year) * 12 + (to.month - from.month))
  const years = Math.floor(total / 12)
  const months = total % 12

  const parts = Object.entries({ year: years, month: months })
    .filter(([, value]) => value > 0)
    .map(([unit, value]) => new Intl.NumberFormat(lang, { style: 'unit', unit, unitDisplay: 'long' }).format(value))
  return new Intl.ListFormat(lang, { type: 'unit', style: 'narrow' }).format(parts)
}

/** "Jan 2023 — Present" with the end month or the localized "present" label. */
export function formatRange(start: YearMonth, end: YearMonth | null, lang: Lang): string {
  const t = useTranslations(lang)
  return `${formatMonth(start, lang)} — ${end
    ? formatMonth(end, lang)
    : t('date.present')}`
}
