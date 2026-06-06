export type RangeKey = 'daily' | 'weekly' | 'monthly' | 'annually' | 'custom' | 'average'
export type AveragePeriod = 'weekly' | 'monthly' | 'annually'

export const RANGES: Record<RangeKey, { label: string; day: number }> = {
  daily: { label: 'Daily', day: 0 },
  weekly: { label: 'Weekly', day: 7 },
  monthly: { label: 'Monthly', day: 30 },
  annually: { label: 'Annually', day: 365 },
  custom: { label: 'Custom', day: 30 },
  average: { label: 'Average', day: 7 }
}

export const AVERAGE_PERIODS: Record<AveragePeriod, { label: string; day: number }> = {
  weekly: { label: 'Weekly', day: 7 },
  monthly: { label: 'Monthly', day: 30 },
  annually: { label: 'Annually', day: 365 }
}

// Compute the effective `day` value to send to the API for any range,
// taking into account custom from/till dates and the average period when provided.
export function resolveDay(
  range: RangeKey,
  fromDate?: Date | null,
  toDate?: Date | null,
  averagePeriod?: AveragePeriod
): number {
  if ((range === 'custom' || range === 'monthly' || range === 'annually') && fromDate && toDate) {
    const ms = toDate.getTime() - fromDate.getTime()
    const days = Math.max(1, Math.ceil(ms / (1000 * 60 * 60 * 24)))

    return days
  }

  if (range === 'average' && averagePeriod) {
    return AVERAGE_PERIODS[averagePeriod].day
  }

  return RANGES[range].day
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
  if (!rows || rows.length === 0) return false
  const times = rows.map(r => Number(r.time ?? r.hour ?? r.label))

  return times.every(n => Number.isFinite(n) && n >= 0 && n <= 23)
}

export function resolveDates(
  range: RangeKey,
  fromDate?: Date | null,
  toDate?: Date | null,
  averagePeriod?: AveragePeriod
): { from: string; to: string } {
  const formatDate = (date: Date) => {
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    const year = date.getFullYear()
    return `${month}-${day}-${year}`
  }

  const to = new Date()
  let from = new Date()

  if ((range === 'custom' || range === 'monthly' || range === 'annually') && fromDate && toDate) {
    return {
      from: formatDate(fromDate),
      to: formatDate(toDate)
    }
  }

  let days = 0
  if (range === 'average' && averagePeriod) {
    days = AVERAGE_PERIODS[averagePeriod].day
  } else {
    days = RANGES[range].day
  }

  from.setDate(to.getDate() - days)

  return {
    from: formatDate(from),
    to: formatDate(to)
  }
}

