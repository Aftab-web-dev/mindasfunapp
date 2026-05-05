// Mock data layer for the Management Dashboard.
// Mirrors the shape of `@/api/management-dashboard` so consumer components
// can swap imports without behavioural changes.

const wrap = <T>(payload: T) => Promise.resolve({ data: { data: payload } })

// Deterministic pseudo-random — seeded by (day, salt) so the chart doesn't
// flicker on re-renders.
function seeded(seed: number) {
  let s = seed % 2147483647
  if (s <= 0) s += 2147483646

  return () => {
    s = (s * 16807) % 2147483647

    return (s - 1) / 2147483646
  }
}

// 24-hour profile that peaks in the evening (gaming venue traffic).
const HOUR_WEIGHTS = [
  0.05, 0.04, 0.03, 0.02, 0.02, 0.03,
  0.05, 0.08, 0.12, 0.18, 0.25, 0.35,
  0.55, 0.65, 0.6, 0.55, 0.7, 0.85,
  1.0, 0.95, 0.85, 0.7, 0.45, 0.2
]

// Distributes `periodTotal` across 24 hours using a weighted profile
// (so the points sum to approximately `periodTotal`).
function buildHourlySeries(periodTotal: number, salt: number) {
  const rng = seeded(Math.abs(periodTotal) + salt)
  const weightSum = HOUR_WEIGHTS.reduce((s, w) => s + w, 0)

  return HOUR_WEIGHTS.map((w, hour) => {
    const share = (w / weightSum) * (0.85 + rng() * 0.3)

    return { hour, weighted: Math.round(periodTotal * share) }
  })
}

const DAY_NAMES = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

function dailyLabel(days: number, idx: number): string {
  // Exactly a week → use weekday names ending today.
  if (days === 7) {
    const todayDow = (new Date().getDay() + 6) % 7 // 0=Mon
    const offset = (todayDow - (days - 1) + idx + 7) % 7

    return DAY_NAMES[offset]
  }

  // Up to a month → "Apr 1", "Apr 2", … relative to today, counting back.
  if (days <= 31) {
    const d = new Date()

    d.setDate(d.getDate() - (days - 1 - idx))

    return d.toLocaleDateString('en-US', { day: 'numeric', month: 'short' })
  }

  return `Day ${idx + 1}`
}

// Distributes `periodTotal` across N daily buckets with human-readable labels.
function buildDailySeries(days: number, periodTotal: number, salt: number) {
  const rng = seeded(Math.abs(periodTotal) + salt + days)
  const perDay = periodTotal / Math.max(1, days)

  return Array.from({ length: days }, (_, i) => ({
    label: dailyLabel(days, i),
    weighted: Math.round(perDay * (0.7 + rng() * 0.6))
  }))
}

const MONTH_LABELS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

// Distributes `periodTotal` across 12 monthly buckets — used for annual / long ranges
// so the chart stays readable instead of plotting 365 individual day labels.
function buildMonthlySeries(periodTotal: number, salt: number) {
  const rng = seeded(Math.abs(periodTotal) + salt + 12)
  const perMonth = periodTotal / 12

  return MONTH_LABELS.map(label => ({
    label,
    weighted: Math.round(perMonth * (0.75 + rng() * 0.5))
  }))
}

// Choose the right resolution for a given `day` window.
// <=0  → 24 hourly buckets
// <=31 → daily buckets
// >31  → 12 monthly buckets (so the x-axis stays legible)
function chooseResolution(day: number): 'hourly' | 'daily' | 'monthly' {
  if (day <= 0) return 'hourly'
  if (day <= 31) return 'daily'

  return 'monthly'
}

// Daily baseline — scaled up for longer windows.
const DAILY_STATS = {
  gameRevenue: 28_540,
  cardRevenue: 12_470,
  redemptionRevenue: 8_630,
  eventRevenue: 16_290,
  fbRevenue: 9_420,
  trampolineRevenue: 14_280,
  bowlingRevenue: 7_850,
  ticket: 4_765
}

// Slight per-period jitter so each window feels distinct, while staying
// proportional to the daily baseline.
function scaleStats(day: number) {
  const span = day <= 0 ? 1 : day
  const rng = seeded(31 + span)

  const scale = (val: number) => {
    const jitter = 0.92 + rng() * 0.16

    return Math.round(val * span * jitter)
  }

  return {
    gameRevenue: scale(DAILY_STATS.gameRevenue),
    cardRevenue: scale(DAILY_STATS.cardRevenue),
    redemptionRevenue: scale(DAILY_STATS.redemptionRevenue),
    eventRevenue: scale(DAILY_STATS.eventRevenue),
    fbRevenue: scale(DAILY_STATS.fbRevenue),
    trampolineRevenue: scale(DAILY_STATS.trampolineRevenue),
    bowlingRevenue: scale(DAILY_STATS.bowlingRevenue),
    ticket: scale(DAILY_STATS.ticket),
    time: 24
  }
}

const CATEGORY_DAILY: Record<string, number> = {
  game: DAILY_STATS.gameRevenue,
  product: DAILY_STATS.cardRevenue,
  redemption: DAILY_STATS.redemptionRevenue,
  event: DAILY_STATS.eventRevenue,
  fb: DAILY_STATS.fbRevenue,
  trampoline: DAILY_STATS.trampolineRevenue,
  bowling: DAILY_STATS.bowlingRevenue
}

// Per-game mock daily revenue (in ₹). Keys must match GAMES[].id below so the
// dropdown selection can resolve to a baseline.
export const GAME_DAILY: Record<string, number> = {
  bumper_car: 3_240,
  shooting: 2_180,
  deal_or_no_deal: 2_870,
  bouncing: 1_960,
  bowling: 2_540,
  kids_play: 1_720,
  redemption: 2_410,
  car_race: 3_050,
  hover: 1_580,
  cinema_3d: 2_690,
  kiddy_rides: 1_340,
  basket_ball: 1_810,
  snooker: 2_050,
  vr_game_1: 2_770,
  vr_game_2: 2_330
}

export const GAMES: { id: string; name: string }[] = [
  { id: 'bumper_car', name: 'Bumper Car' },
  { id: 'shooting', name: 'Shooting' },
  { id: 'deal_or_no_deal', name: 'Deal or No Deal' },
  { id: 'bouncing', name: 'Bouncing' },
  { id: 'bowling', name: 'Bowling' },
  { id: 'kids_play', name: 'Kids Play' },
  { id: 'redemption', name: 'Redemption' },
  { id: 'car_race', name: 'Car Race' },
  { id: 'hover', name: 'Hover' },
  { id: 'cinema_3d', name: '3D Cinema' },
  { id: 'kiddy_rides', name: 'Kiddy Rides' },
  { id: 'basket_ball', name: 'Basket Ball' },
  { id: 'snooker', name: 'Snooker' },
  { id: 'vr_game_1', name: 'VR Game 1' },
  { id: 'vr_game_2', name: 'VR Game 2' }
]

function categoryGraph(category: string, day: number | string, baseOverride?: number, saltExtra = 0) {
  const dayNum = Number(day) || 0
  const dailyBase = baseOverride ?? CATEGORY_DAILY[category] ?? DAILY_STATS.gameRevenue
  const salt = category.length * 17 + saltExtra
  const resolution = chooseResolution(dayNum)

  if (resolution === 'hourly') {
    const rows = buildHourlySeries(dailyBase, salt).map(r => ({
      time: r.hour,
      hour: r.hour,
      revenue: r.weighted,
      value: r.weighted,
      amount: r.weighted
    }))

    return wrap(rows)
  }

  const span = Math.min(dayNum, 365)
  const periodTotal = dailyBase * span

  if (resolution === 'monthly') {
    const rows = buildMonthlySeries(periodTotal, salt).map(r => ({
      time: r.label,
      revenue: r.weighted,
      value: r.weighted,
      amount: r.weighted
    }))

    return wrap(rows)
  }

  const rows = buildDailySeries(span, periodTotal, salt).map(r => ({
    time: r.label,
    revenue: r.weighted,
    value: r.weighted,
    amount: r.weighted
  }))

  return wrap(rows)
}

function mainGraphRows(day: number | string) {
  const dayNum = Number(day) || 0
  const resolution = chooseResolution(dayNum)

  if (resolution === 'hourly') {
    const game = buildHourlySeries(DAILY_STATS.gameRevenue, 1)
    const product = buildHourlySeries(DAILY_STATS.cardRevenue, 2)
    const redemption = buildHourlySeries(DAILY_STATS.redemptionRevenue, 3)

    return game.map((row, i) => ({
      time: row.hour,
      hour: row.hour,
      gameRevenue: row.weighted,
      cardRevenue: product[i].weighted,
      productRevenue: product[i].weighted,
      redemptionRevenue: redemption[i].weighted
    }))
  }

  const span = Math.min(dayNum, 365)

  if (resolution === 'monthly') {
    const game = buildMonthlySeries(DAILY_STATS.gameRevenue * span, 11)
    const product = buildMonthlySeries(DAILY_STATS.cardRevenue * span, 22)
    const redemption = buildMonthlySeries(DAILY_STATS.redemptionRevenue * span, 33)

    return game.map((row, i) => ({
      time: row.label,
      gameRevenue: row.weighted,
      cardRevenue: product[i].weighted,
      productRevenue: product[i].weighted,
      redemptionRevenue: redemption[i].weighted
    }))
  }

  const game = buildDailySeries(span, DAILY_STATS.gameRevenue * span, 11)
  const product = buildDailySeries(span, DAILY_STATS.cardRevenue * span, 22)
  const redemption = buildDailySeries(span, DAILY_STATS.redemptionRevenue * span, 33)

  return game.map((row, i) => ({
    time: row.label,
    gameRevenue: row.weighted,
    cardRevenue: product[i].weighted,
    productRevenue: product[i].weighted,
    redemptionRevenue: redemption[i].weighted
  }))
}

const UPCOMING_EVENTS = [
  {
    name: 'Aarav Sharma',
    customerName: 'Aarav Sharma',
    event: 'Birthday Party',
    eventName: 'Birthday Party',
    eventDescription: 'Birthday Party',
    eventDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    name: 'Riya Mehta',
    customerName: 'Riya Mehta',
    event: 'Corporate Offsite',
    eventName: 'Corporate Offsite',
    eventDescription: 'Corporate Offsite',
    eventDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    name: 'Vikram Patel',
    customerName: 'Vikram Patel',
    event: 'School Field Trip',
    eventName: 'School Field Trip',
    eventDescription: 'School Field Trip',
    eventDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    name: 'Ananya Iyer',
    customerName: 'Ananya Iyer',
    event: 'Bachelorette Party',
    eventName: 'Bachelorette Party',
    eventDescription: 'Bachelorette Party',
    eventDate: new Date(Date.now() + 8 * 24 * 60 * 60 * 1000).toISOString()
  }
]

export const managementDashboardMockApi = {
  widgetValues: async ({ day = 0 }: { day?: number | string } = {}) => {
    const dayNum = Number(day)
    const span = Number.isFinite(dayNum) ? dayNum : 0

    return wrap([scaleStats(span <= 0 ? 1 : span)])
  },
  gameRevenueGraph: async ({ day = 0, game }: { game?: number | string; day?: number | string } = {}) => {
    const gameId = typeof game === 'string' ? game : ''

    if (gameId && gameId !== 'all' && GAME_DAILY[gameId] != null) {
      // Salt with index so different games get visibly different curves.
      const saltExtra = (Object.keys(GAME_DAILY).indexOf(gameId) + 1) * 7

      return categoryGraph('game', day, GAME_DAILY[gameId], saltExtra)
    }

    return categoryGraph('game', day)
  },
  productRevenueGraph: async ({ day = 0 }: { product?: number | string; day?: number | string } = {}) =>
    categoryGraph('product', day),
  redemptionRevenueGraph: async ({ day = 0 }: { product?: number | string; day?: number | string } = {}) =>
    categoryGraph('redemption', day),
  eventRevenueGraph: async ({ day = 0 }: { day?: number | string } = {}) =>
    categoryGraph('event', day),
  fbRevenueGraph: async ({ day = 0 }: { product?: number | string; day?: number | string } = {}) =>
    categoryGraph('fb', day),
  trampolineRevenueGraph: async ({ day = 0 }: { product?: number | string; day?: number | string } = {}) =>
    categoryGraph('trampoline', day),
  bowlingRevenueGraph: async ({ day = 0 }: { product?: number | string; day?: number | string } = {}) =>
    categoryGraph('bowling', day),
  upcomingEvent: async () => wrap(UPCOMING_EVENTS),
  mainGraph: async ({ day = 0 }: { day?: number | string } = {}) => wrap(mainGraphRows(day))
}
