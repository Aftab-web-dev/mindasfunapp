export type RangeKey = 'today' | 'week' | 'month' | 'year'

export const RANGES: Record<RangeKey, { label: string; day: number }> = {
  today: { label: 'Today', day: 0 },
  week: { label: 'This Week', day: 7 },
  month: { label: 'This Month', day: 30 },
  year: { label: 'This Year', day: 365 }
}

// Format the `time` field returned by the backend.
// 0–23 → hour label ("12 AM", "1 PM"). Anything else → "Day N".
export function formatTimeLabel(value: any, allHours: boolean): string {
  const n = Number(value)

  if (!Number.isFinite(n)) return String(value ?? '')

  if (allHours) {
    const period = n >= 12 ? 'PM' : 'AM'
    const hr = n % 12 === 0 ? 12 : n % 12

    return `${hr} ${period}`
  }

  return `Day ${n}`
}

export function detectAllHours(rows: any[]): boolean {
  const times = rows.map(r => Number(r.time ?? r.hour ?? r.label))

  return times.every(n => Number.isFinite(n) && n >= 0 && n <= 23)
}
