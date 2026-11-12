import type { Lang } from '@/i18n/ui'
import { useTranslations } from '@/i18n/utils'

export type YearMonth = `${number}-${number}`

export function parseYearMonth(value: YearMonth): { year: number, month: number } {
  const [year, month] = value.split('-').map(Number)
  return { year, month }
}

/** The build month, used as the end of ongoing roles. */
export function currentYearMonth(): YearMonth {
  const now = new Date()
  return `${now.getUTCFullYear()}-${now.getUTCMonth() + 1}`
}

/** Months from `start` to `end`; a `null` end means the build month. */
export function monthsBetween(start: YearMonth, end: YearMonth | null): number {
  const from = parseYearMonth(start)
  const to = parseYearMonth(end ?? currentYearMonth())
  return (to.year - from.year) * 12 + (to.month - from.month)
}

export function formatMonth(value: YearMonth, lang: Lang): string {
  const { year, month } = parseYearMonth(value)
  return new Intl.DateTimeFormat(lang, { month: 'short', year: 'numeric', timeZone: 'UTC' })
    .format(new Date(Date.UTC(year, month - 1, 1)))
}

/**
 * "3 years 10 months" / "3 años 10 meses". Not `Intl.DurationFormat`: it needs Node 23+,
 * and `engines` allows Node 22.
 */
export function formatDuration(start: YearMonth, end: YearMonth | null, lang: Lang): string {
  const total = Math.max(1, monthsBetween(start, end))
  const years = Math.floor(total / 12)
  const months = total % 12

  const parts = Object.entries({ year: years, month: months })
    .filter(([, value]) => value > 0)
    .map(([unit, value]) => new Intl.NumberFormat(lang, { style: 'unit', unit, unitDisplay: 'long' }).format(value))
  return new Intl.ListFormat(lang, { type: 'unit', style: 'narrow' }).format(parts)
}

export function formatRange(start: YearMonth, end: YearMonth | null, lang: Lang): string {
  const t = useTranslations(lang)
  return `${formatMonth(start, lang)} — ${end
    ? formatMonth(end, lang)
    : t('date.present')}`
}
