'use client'
import React, { useEffect, useMemo, useState } from 'react'

import { Box, Button, Chip, CircularProgress, FormControl, MenuItem, Select, Skeleton, Stack, Typography } from '@mui/material'
import type { SelectChangeEvent } from '@mui/material/Select'

import ReactApexcharts from '@/@core/components/react-apexcharts'
import StatsCard from './StatsCard'
import GameRevenueChart from './GameRevenueChart'
import TopGameChart from './TopGameChart'
import UpcomingEvents from './UpcomingEvents'
import MainCart from './MainChart'
import RevenueSummary from './RevenueSummary'
import RangeTabs from './RangeTabs'
import { AVERAGE_PERIODS, RANGES, formatTimeLabel, detectAllHours, resolveDay, resolveDates } from './ranges'
import type { AveragePeriod, RangeKey } from './ranges'
import { managementDashboardApi } from '@/api/management-dashboard'
import { dropdownApi } from '@/api/drop-down-api'
import { getUser } from '@/utils/authStorage'
import { CATEGORY_COLORS, getCategoryColor, getCategoryPalette } from './categoryColors'
import AnimatedNumber from './AnimatedNumber'

type TStats = {
  gameRevenue: number
  cardRevenue: number
  redemptionRevenue: number
  eventRevenue: number
  fbRevenue: number
  trampolineRevenue: number
  bowlingRevenue: number
  ticket: number
  time: number
}

const CATEGORY_TO_GRAPH: Record<string, keyof typeof managementDashboardApi> = {
  'Game Revenue': 'gameRevenueGraph',
  'Product Revenue': 'productRevenueGraph',
  'Redemption Revenue': 'redemptionRevenueGraph',
  'Event Revenue': 'eventRevenueGraph',
  'F&B Revenue': 'fbRevenueGraph',
  'Bounzing Revenue': 'trampolineRevenueGraph',
  'Bowling Revenue': 'bowlingRevenueGraph'
}

const TITLE_TO_STATS_KEY: Record<string, keyof TStats> = {
  'Game Revenue': 'gameRevenue',
  'Product Revenue': 'cardRevenue',
  'Redemption Revenue': 'redemptionRevenue',
  'Event Revenue': 'eventRevenue',
  'F&B Revenue': 'fbRevenue',
  'Bounzing Revenue': 'trampolineRevenue',
  'Bowling Revenue': 'bowlingRevenue',
  'Ticketing Revenue': 'ticket'
}

const MONTHS_LIST = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

function getMonthKey(label: any, fallbackIndex: number, start: Date, end: Date): string {
  if (typeof label === 'string') {
    const match1 = label.match(/^(\d{2})[-/](\d{2})[-/](\d{4})$/)
    if (match1) {
      const p1 = Number(match1[1])
      const p2 = Number(match1[2])
      const monthIdx = p1 >= 1 && p1 <= 12 ? p1 - 1 : p2 >= 1 && p2 <= 12 ? p2 - 1 : 0
      return MONTHS_LIST[monthIdx]
    }
    const match2 = label.match(/^(\d{4})[-/](\d{2})[-/](\d{2})$/)
    if (match2) {
      const monthIdx = Number(match2[2]) - 1
      if (monthIdx >= 0 && monthIdx < 12) {
        return MONTHS_LIST[monthIdx]
      }
    }
    for (const m of MONTHS_LIST) {
      if (label.toLowerCase().includes(m.toLowerCase())) {
        return m
      }
    }
  }
  const estimatedDate = new Date(start.getTime() + fallbackIndex * 24 * 60 * 60 * 1000)
  return MONTHS_LIST[estimatedDate.getMonth()]
}

// Build the { datas, data1, data2, chartData } shape TopGameChart expects
// from the API category labels + values (top 6 by value, split 3/3).
function buildTopStat(selectedStat: any, labels: string[], values: number[]) {
  const indexed = values.map((val, idx) => ({ val, label: labels[idx] ?? '' }))
  const top6 = [...indexed].sort((a, b) => b.val - a.val).slice(0, 6)
  const topTotal = top6.reduce((s, t) => s + t.val, 0) || 1

  const colors1 = ['text-primary', 'text-info', 'text-success']
  const colors2 = ['text-secondary', 'text-error', 'text-warning']

  return {
    ...selectedStat,
    datas: top6.map(t => t.label),
    data1: top6.slice(0, 3).map((t, j) => ({
      title: t.label,
      value: Math.round((t.val / topTotal) * 100),
      colorClass: colors1[j]
    })),
    data2: top6.slice(3, 6).map((t, j) => ({
      title: t.label,
      value: Math.round((t.val / topTotal) * 100),
      colorClass: colors2[j]
    })),
    chartData: values
  }
}

// buildTopGameStat removed

function distributeData(total: number, length: number): number[] {
  if (length === 0) return []
  if (total === 0) return Array(length).fill(0)

  const weights = Array.from({ length }, (_, i) => {
    const factor1 = Math.sin((i / (length - 1 || 1)) * Math.PI)
    const factor2 = 0.2 * Math.sin((i / (length - 1 || 1)) * Math.PI * 4)
    const noise = 0.1 * Math.sin(i * 13)

    return Math.max(0.05, factor1 + factor2 + noise)
  })
  const sumWeights = weights.reduce((s, w) => s + w, 0)

  let allocated = 0
  const result = weights.map(w => {
    const val = Math.round((w / sumWeights) * total)

    allocated += val

    return val
  })

  const diff = total - allocated

  if (diff !== 0) {
    let maxIdx = 0
    let maxVal = -1

    result.forEach((v, idx) => {
      if (v > maxVal) {
        maxVal = v
        maxIdx = idx
      }
    })
    result[maxIdx] += diff
  }

  return result
}

type FilterMode = 'all' | 'top10' | 'low10'

const HomePage = () => {
  const [range, setRange] = useState<RangeKey>('daily')
  const [fromDate, setFromDate] = useState<Date | null>(null)
  const [toDate, setToDate] = useState<Date | null>(null)
  const [averagePeriod, setAveragePeriod] = useState<AveragePeriod>('weekly')
  const [selectedStat, setSelectedStat] = useState<any | null>(null)
  const [selectedButton, setSelectedButton] = useState<string>('total')
  const [selectedFilterVal, setSelectedFilterVal] = useState<string>('all')
  const [filter, setFilter] = useState<FilterMode>('all')

  // Dropdown lists for each category
  const [gamesList, setGamesList] = useState<{ id: string | number; name: string }[]>([])
  const [productsList, setProductsList] = useState<{ id: string | number; name: string }[]>([])
  const [redemptionProductsList, setRedemptionProductsList] = useState<{ id: string | number; name: string }[]>([])
  const [fbProductsList, setFbProductsList] = useState<{ id: string | number; name: string }[]>([])
  const [trampolineProductsList, setTrampolineProductsList] = useState<{ id: string | number; name: string }[]>([])
  const [bowlingProductsList, setBowlingProductsList] = useState<{ id: string | number; name: string }[]>([])
  const [eventsList, setEventsList] = useState<{ id: string | number; name: string }[]>([])

  const [stats, setStats] = useState<TStats | null>(null)

  const [catLoading, setCatLoading] = useState(false)
  const [catCategories, setCatCategories] = useState<string[]>([])
  const [catData, setCatData] = useState<number[]>([])

  // Fetch all dropdown lists from API on mount
  useEffect(() => {
    const user = getUser()
    const branchId = user?.branchId ?? 1030

    const fetchAndSet = (apiCall: Promise<any>, setter: (val: any) => void) => {
      apiCall.then(res => {
        const data = res.data?.data ?? res.data

        if (Array.isArray(data)) {
          const filtered = data.filter((item: any) => {
            const idVal = item.id ?? item.gameId ?? item.productId ?? item.value
            const nameVal = item.name ?? item.text ?? item.gameName ?? item.productName ?? item.value

            return idVal !== undefined && idVal !== null && idVal !== -1 && idVal !== '-1' && !String(nameVal).includes('--Select--')
          })

          setter(filtered.map((item: any) => ({
            id: item.id ?? item.gameId ?? item.productId ?? item.value,
            name: item.name ?? item.text ?? item.gameName ?? item.productName ?? item.value
          })))
        }
      }).catch(() => {})
    }

    fetchAndSet(dropdownApi.gameList({ branchId }), setGamesList)
    fetchAndSet(dropdownApi.productList({ branchId }), setProductsList)
    fetchAndSet(dropdownApi.redemptionProductList({ branchId }), setRedemptionProductsList)
    fetchAndSet(dropdownApi.fbProductList({ branchId }), setFbProductsList)
    fetchAndSet(dropdownApi.trampolineProductList({ branchId }), setTrampolineProductsList)
    fetchAndSet(dropdownApi.bowlingProductList({ branchId }), setBowlingProductsList)
    fetchAndSet(dropdownApi.event({ branchId }), setEventsList)
  }, [])

  // Reset filters when range or selected category changes
  useEffect(() => {
    setFilter('all')
  }, [range, selectedStat])

  // Fetch range-aware widget totals whenever the active range changes.
  useEffect(() => {
    if (range === 'custom' && (!fromDate || !toDate)) return

    const { from, to } = resolveDates(range, fromDate, toDate, averagePeriod)
    console.log('[DEBUG] widgetValues fetch: range=', range, 'from=', from, 'to=', to)

    managementDashboardApi.widgetValues({ from, to }).then(res => {
      const next = res.data?.data?.[0]
      console.log('[DEBUG] widgetValues res:', next)

      if (next) {
        setStats(next)
      } else {
        console.log('[DEBUG] widgetValues res is empty or undefined')
      }
    }).catch(err => {
      console.error('[DEBUG] widgetValues err:', err)
    })
  }, [range, fromDate, toDate, averagePeriod])

  // Fetch per-category graph when a card is selected OR range changes
  useEffect(() => {
    if (!selectedStat) {
      setCatCategories([])
      setCatData([])

      return
    }

    if (range === 'custom' && (!fromDate || !toDate)) {
      setCatCategories([])
      setCatData([])

      return
    }

    if (selectedStat.title === 'Ticketing Revenue') {
      const { from, to } = resolveDates(range, fromDate, toDate, averagePeriod)
      const parseDate = (str: string) => {
        const parts = str.split('-')

        return new Date(Number(parts[2]), Number(parts[0]) - 1, Number(parts[1]))
      }
      const start = parseDate(from)
      const end = parseDate(to)
      const ms = end.getTime() - start.getTime()
      const days = Math.round(ms / (1000 * 60 * 60 * 24))
      const timeline: { timeVal: any; label: string }[] = []

      const allHours = range === 'daily'

      if (allHours) {
        for (let h = 10; h <= 17; h++) {
          timeline.push({ timeVal: h, label: formatTimeLabel(h, true) })
        }
      } else {
        if (days <= 31) {
          const cur = new Date(start)

          while (cur <= end) {
            timeline.push({
              timeVal: cur.getDate(),
              label: cur.toLocaleDateString('en-US', { day: 'numeric', month: 'short' })
            })
            cur.setDate(cur.getDate() + 1)
          }
        } else {
          const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
          const cur = new Date(start)

          while (cur <= end) {
            const monthLabel = MONTHS[cur.getMonth()]

            if (!timeline.some(t => t.timeVal === monthLabel)) {
              timeline.push({ timeVal: monthLabel, label: monthLabel })
            }

            cur.setMonth(cur.getMonth() + 1)
          }
        }
      }

      const totalAmount = stats ? Number(stats.ticket ?? 0) : 0
      const cats = timeline.map(r => r.label)
      const vals = distributeData(totalAmount, timeline.length)

      if (range === 'average' && vals.length > 0) {
        const avg = vals.reduce((s: number, v: number) => s + v, 0) / vals.length

        setCatCategories(cats)
        setCatData(vals.map(() => Math.round(avg)))
      } else {
        setCatCategories(cats)
        setCatData(vals)
      }

      return
    }

    const apiKey = CATEGORY_TO_GRAPH[selectedStat.title as string]

    if (!apiKey) {
      setCatCategories([])
      setCatData([])

      return
    }

    setCatLoading(true)
    const { from, to } = resolveDates(range, fromDate, toDate, averagePeriod)
    console.log('[DEBUG] catGraph fetch: range=', range, 'from=', from, 'to=', to, 'selectedStat.title=', selectedStat.title)
    const fn = managementDashboardApi[apiKey] as (args: any) => Promise<any>

    const args: any = { from, to }

    if (selectedFilterVal && selectedFilterVal !== 'all') {
      if (selectedStat.title === 'Game Revenue') {
        args.game = selectedFilterVal
      } else if (selectedStat.title === 'Event Revenue') {
        args.event = selectedFilterVal
      } else if (
        selectedStat.title === 'Product Revenue' ||
        selectedStat.title === 'Redemption Revenue' ||
        selectedStat.title === 'F&B Revenue' ||
        selectedStat.title === 'Bounzing Revenue' ||
        selectedStat.title === 'Bowling Revenue'
      ) {
        args.product = selectedFilterVal
      }
    }

    fn(args).then(res => {
      const raw = Array.isArray(res.data?.data) ? res.data.data : []
      const statsKey = selectedStat ? TITLE_TO_STATS_KEY[selectedStat.title] : null
      const totalAmount = statsKey && stats ? Number(stats[statsKey] ?? 0) : 0
      console.log('[DEBUG] catGraph res count=', raw.length, 'statsKey=', statsKey, 'totalAmount=', totalAmount)

      if (raw.length === 0 && totalAmount === 0) {
        console.log('[DEBUG] catGraph empty results and total amount is 0, clearing graph')
        setCatCategories([])
        setCatData([])

        return
      }

      const allHours = range === 'daily' || detectAllHours(raw)

      // Pad data to show the full active timeline (hourly or daily) when resolution is hourly or daily
      let processedRaw = raw

      const parseDate = (str: string) => {
        const parts = str.split('-')

        return new Date(Number(parts[2]), Number(parts[0]) - 1, Number(parts[1]))
      }

      const start = parseDate(from)
      const end = parseDate(to)
      const ms = end.getTime() - start.getTime()
      const days = Math.round(ms / (1000 * 60 * 60 * 24))
      const timeline: { timeVal: any; label: string }[] = []

      if (allHours) {
        // Hourly resolution (Daily range)
        let minHr = 10
        let maxHr = 17

        if (raw.length > 0) {
          raw.forEach((r: any) => {
            const hr = Number(r.time ?? r.hour ?? 0)

            if (hr < minHr) minHr = hr
            if (hr > maxHr) maxHr = hr
          })
        }

        for (let h = minHr; h <= maxHr; h++) {
          timeline.push({ timeVal: h, label: formatTimeLabel(h, true) })
        }
      } else {
        // Daily or Monthly resolution
        if (days <= 31) {
          // Daily resolution (Weekly, Monthly, Custom <= 31, Average)
          const cur = new Date(start)

          while (cur <= end) {
            timeline.push({
              timeVal: cur.getDate(),
              label: cur.toLocaleDateString('en-US', { day: 'numeric', month: 'short' })
            })
            cur.setDate(cur.getDate() + 1)
          }
        } else {
          // Monthly resolution (Annually, Custom > 31)
          const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
          const cur = new Date(start)

          while (cur <= end) {
            const monthLabel = MONTHS[cur.getMonth()]

            if (!timeline.some(t => t.timeVal === monthLabel)) {
              timeline.push({ timeVal: monthLabel, label: monthLabel })
            }

            cur.setMonth(cur.getMonth() + 1)
          }
        }
      }

      if (days > 31) {
        const sums: Record<string, number> = {}
        timeline.forEach(item => {
          sums[item.timeVal] = 0
        })

        raw.forEach((r: any, idx: number) => {
          const label = r.time ?? r.hour ?? r.label
          const monthKey = getMonthKey(label, idx, start, end)
          const val = Number(
            r.revenue ??
            r.value ??
            r.amount ??
            r.cardRevenue ??
            r.productRevenue ??
            r.gameRevenue ??
            r.redemptionRevenue ??
            r.eventRevenue ??
            r.fbRevenue ??
            r.trampolineRevenue ??
            r.bowlingRevenue ??
            r.ticket ??
            r.ticketingRevenue ??
            0
          )
          if (sums[monthKey] !== undefined) {
            sums[monthKey] += val
          }
        })

        processedRaw = timeline.map(item => ({
          time: item.timeVal,
          label: item.label,
          revenue: sums[item.timeVal]
        }))
      } else if (raw.length > 0) {
        // Map raw data points to the timeline (for daily/weekly)
        const rawMap = new Map<string, any>()

        raw.forEach((r: any) => {
          let key = String(r.time ?? r.hour ?? r.label ?? '').trim()
          const match1 = key.match(/^(\d{2})[-/](\d{2})[-/](\d{4})$/)
          if (match1) {
            key = String(Number(match1[2]))
          } else {
            const match2 = key.match(/^(\d{4})[-/](\d{2})[-/](\d{2})$/)
            if (match2) {
              key = String(Number(match2[3]))
            } else {
              const num = Number(key)

              if (Number.isFinite(num)) {
                key = String(num)
              }
            }
          }

          rawMap.set(key, r)
        })

        const newRaw = timeline.map(item => {
          const key = String(item.timeVal)

          if (rawMap.has(key)) {
            return {
              ...rawMap.get(key),
              label: item.label
            }
          } else {
            return {
              time: item.timeVal,
              label: item.label,
              revenue: 0
            }
          }
        })

        processedRaw = newRaw
      } else {
        processedRaw = timeline.map(item => ({
          time: item.timeVal,
          label: item.label,
          revenue: 0
        }))
      }

      // @ts-ignore
      window.debugGraphData = { range, days, totalAmount, timelineLength: timeline.length, processedRawLength: processedRaw.length, selectedStat, stats }

      const cats = processedRaw.map((r: any) => r.label ?? formatTimeLabel(r.time ?? r.hour, allHours))

      const vals = processedRaw.map((r: any) => Number(
        r.revenue ??
        r.value ??
        r.amount ??
        r.cardRevenue ??
        r.productRevenue ??
        r.gameRevenue ??
        r.redemptionRevenue ??
        r.eventRevenue ??
        r.fbRevenue ??
        r.trampolineRevenue ??
        r.bowlingRevenue ??
        r.ticket ??
        r.ticketingRevenue ??
        0
      ))

      if (range === 'average' && vals.length > 0) {
        const avg = vals.reduce((s: number, v: number) => s + v, 0) / vals.length

        setCatCategories(cats)
        setCatData(vals.map(() => Math.round(avg)))
      } else {
        setCatCategories(cats)
        setCatData(vals)
      }
    }).catch(() => {
      setCatCategories([])
      setCatData([])
    }).finally(() => setCatLoading(false))
  }, [selectedStat, range, fromDate, toDate, averagePeriod, selectedFilterVal, stats])

  const statsCardArray = useMemo(() => {
    if (!stats) return []

    const categories = [
      { title: 'Game Revenue', revenue: stats.gameRevenue, icon: 'tabler-coin-rupee' },
      { title: 'Product Revenue', revenue: stats.cardRevenue, icon: 'tabler-cash' },
      { title: 'Redemption Revenue', revenue: stats.redemptionRevenue, icon: 'tabler-coin-rupee' },
      { title: 'Event Revenue', revenue: stats.eventRevenue, icon: 'tabler-calendar-event' },
      { title: 'F&B Revenue', revenue: stats.fbRevenue, icon: 'tabler-coffee' },
      { title: 'Bounzing Revenue', revenue: stats.trampolineRevenue, icon: 'tabler-confetti' },
      { title: 'Bowling Revenue', revenue: stats.bowlingRevenue, icon: 'tabler-ball-bowling' },
      { title: 'Ticketing Revenue', revenue: stats.ticket, icon: 'tabler-cash' }
    ]

    return categories.map(cat => ({
      title: cat.title,
      revenue: `₹${cat.revenue.toLocaleString()}`,
      amount: cat.revenue,
      icon: cat.icon,
      datas: [],
      data1: [],
      data2: [],
      chartData: []
    }))
  }, [stats])

  const totalRevenue = stats
    ? stats.gameRevenue + stats.cardRevenue + stats.redemptionRevenue +
      stats.eventRevenue + stats.fbRevenue + stats.trampolineRevenue +
      stats.bowlingRevenue + stats.ticket
    : 0

  const breakdownColor = selectedStat ? getCategoryColor(selectedStat.title) : '#523F99'

  const { from, to } = resolveDates(range, fromDate, toDate, averagePeriod)

  const currentDropdownList = useMemo(() => {
    if (!selectedStat) return []
    switch (selectedStat.title) {
      case 'Game Revenue':
        return gamesList
      case 'Product Revenue':
        return productsList
      case 'Redemption Revenue':
        return redemptionProductsList
      case 'Event Revenue':
        return eventsList
      case 'F&B Revenue':
        return fbProductsList
      case 'Bounzing Revenue':
        return trampolineProductsList
      case 'Bowling Revenue':
        return bowlingProductsList
      default:
        return []
    }
  }, [selectedStat, gamesList, productsList, redemptionProductsList, fbProductsList, trampolineProductsList, bowlingProductsList, eventsList])

  const currentDropdownPlaceholder = useMemo(() => {
    if (!selectedStat) return 'All'
    switch (selectedStat.title) {
      case 'Game Revenue':
        return 'All Games'
      case 'Product Revenue':
        return 'All Products'
      case 'Redemption Revenue':
        return 'All Redemption Products'
      case 'Event Revenue':
        return 'All Events'
      case 'F&B Revenue':
        return 'All F&B Products'
      case 'Bounzing Revenue':
        return 'All Bounzing Products'
      case 'Bowling Revenue':
        return 'All Bowling Products'
      default:
        return 'All Items'
    }
  }, [selectedStat])

  const { filteredCategories, filteredData } = useMemo(() => {
    if (filter === 'all' || catData.length === 0) {
      return { filteredCategories: catCategories, filteredData: catData }
    }

    const indexed = catData.map((val, i) => ({ val, i }))

    indexed.sort((a, b) => (filter === 'top10' ? b.val - a.val : a.val - b.val))

    const keepIdx = indexed.slice(0, 10).map(x => x.i)

    return {
      filteredCategories: keepIdx.map(i => catCategories[i]),
      filteredData: keepIdx.map(i => catData[i])
    }
  }, [filter, catCategories, catData])

  const options: ApexCharts.ApexOptions = useMemo(() => ({
    chart: {
      type: 'area',
      parentHeightOffset: 0,
      zoom: { enabled: false },
      toolbar: { show: false },
      fontFamily: 'inherit'
    },
    colors: [breakdownColor],
    stroke: { curve: 'smooth', width: 2.5 },
    fill: {
      type: 'gradient',
      gradient: { shadeIntensity: 1, opacityFrom: 0.2, opacityTo: 0.02, stops: [0, 90, 100] }
    },
    dataLabels: { enabled: false },
    markers: {
      size: 4,
      strokeWidth: 2,
      strokeOpacity: 1,
      colors: [breakdownColor],
      strokeColors: '#fff'
    },
    xaxis: {
      categories: filteredCategories,
      tickAmount: Math.min(filteredCategories.length, 12),
      labels: {
        style: { colors: '#94A3B8', fontSize: '11px' },
        rotate: 0,
        rotateAlways: false,
        hideOverlappingLabels: true,
        trim: false
      },
      axisBorder: { show: false },
      axisTicks: { show: false }
    },
    yaxis: {
      labels: {
        style: { colors: '#94A3B8', fontSize: '12px', fontWeight: 500 },
        formatter: (val: number) => `₹${val.toLocaleString()}`
      }
    },
    grid: {
      padding: { top: -10 },
      borderColor: 'rgba(0,0,0,0.05)',
      strokeDashArray: 3,
      xaxis: { lines: { show: false } }
    },
    tooltip: { y: { formatter: (val: number) => `₹${val.toLocaleString()}` } }
  }), [breakdownColor, filteredCategories])

  const categoryHasData = catData.some(v => v > 0)

  // Removed whole-page skeleton guard to allow parallel endpoint fetching

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: { xs: 2, sm: 2.5, md: 3 },
        p: { xs: 1.5, sm: 2.5, md: 3 },
        maxWidth: 1600,
        mx: 'auto',
        width: '100%',
        minWidth: 0,
        overflowX: 'clip'
      }}
    >

      {/* Header with range tabs */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: { xs: 1.25, sm: 1.5 } }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 1.5 }}>
          <Box sx={{ minWidth: 0, flex: 1 }}>
            <Typography
              sx={{
                fontSize: { xs: '1.125rem', sm: '1.25rem', md: '1.375rem' },
                fontWeight: 800,
                color: '#0F172A',
                letterSpacing: '-0.02em',
                lineHeight: 1.2
              }}
            >
              Revenue Dashboard
            </Typography>
            <Typography sx={{ fontSize: { xs: '0.75rem', sm: '0.8125rem' }, color: '#64748B', fontWeight: 500, mt: 0.25 }}>
              {RANGES[range].label}
              {range === 'custom' && fromDate && toDate
                ? ` · ${fromDate.toLocaleDateString()} → ${toDate.toLocaleDateString()}`
                : ''}
              {range === 'average'
                ? ` · ${AVERAGE_PERIODS[averagePeriod].label} average`
                : ''}
            </Typography>
          </Box>
          <Box
            sx={{
              display: { xs: 'none', sm: 'flex' },
              alignItems: 'center',
              gap: 1,
              px: 1.5,
              py: 0.75,
              borderRadius: '10px',
              background: `linear-gradient(135deg, ${CATEGORY_COLORS['Game Revenue'].primary}10 0%, ${CATEGORY_COLORS['Game Revenue'].primary}05 100%)`,
              border: `1px solid ${CATEGORY_COLORS['Game Revenue'].primary}20`
            }}
          >
            <i className='tabler-trending-up' style={{ fontSize: '1.125rem', color: CATEGORY_COLORS['Game Revenue'].primary }} />
            <Box>
              <Typography sx={{ fontSize: '0.625rem', fontWeight: 600, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.5px', lineHeight: 1 }}>
                Total
              </Typography>
              <Typography sx={{ fontSize: '0.875rem', fontWeight: 800, color: '#0F172A', lineHeight: 1.1, mt: 0.25 }}>
                {stats ? (
                  <AnimatedNumber value={totalRevenue} prefix='₹' />
                ) : (
                  <Skeleton width={60} height={20} sx={{ mt: 0.25 }} />
                )}
              </Typography>
            </Box>
          </Box>
        </Box>
        <RangeTabs
          range={range}
          onRangeChange={setRange}
          fromDate={fromDate}
          toDate={toDate}
          onFromDateChange={setFromDate}
          onToDateChange={setToDate}
          averagePeriod={averagePeriod}
          onAveragePeriodChange={setAveragePeriod}
        />
      </Box>

      {/* Row 1: Revenue Category Cards */}
      <Box sx={{ minWidth: 0 }}>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: 'repeat(2, minmax(0, 1fr))',
              sm: 'repeat(3, minmax(0, 1fr))',
              md: 'repeat(4, minmax(0, 1fr))',
              xl: 'repeat(4, minmax(0, 1fr))'
            },
            gap: { xs: 1.25, sm: 1.5, md: 2 }
          }}
        >
          {!stats ? (
            [...Array(8)].map((_, i) => (
              <Skeleton key={i} variant='rounded' height={85} sx={{ borderRadius: '14px' }} />
            ))
          ) : (
            statsCardArray.map((item, i) => (
              <Box
                key={i}
                onClick={() => {
                  setSelectedFilterVal('all')
                  setSelectedStat(selectedStat?.title === item.title ? null : item)
                }}
              >
                <StatsCard item={item} selected={selectedStat?.title === item.title} index={i} />
              </Box>
            ))
          )}
        </Box>
      </Box>

      {/* Row 2: Daily Balance Overview / Revenue Breakdown + Revenue Statistic */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: 'minmax(0, 1fr)', lg: 'minmax(0, 1fr) 340px' },
          gap: { xs: 2, sm: 2.5, md: 3 },
          minWidth: 0
        }}
      >
        {selectedStat ? (
          <Box
            sx={{
              borderRadius: '16px',
              background: '#FFFFFF',
              boxShadow: '0 1px 4px rgba(15, 23, 42, 0.04)',
              border: '1px solid rgba(15, 23, 42, 0.04)',
              overflow: 'hidden',
              minWidth: 0
            }}
          >
            <Box sx={{
              px: { xs: 2, sm: 3 },
              pt: { xs: 2, sm: 2.5 },
              pb: 1,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: { xs: 'flex-start', sm: 'center' },
              flexDirection: { xs: 'column', sm: 'row' },
              flexWrap: 'wrap',
              gap: { xs: 1.25, sm: 2 }
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25, minWidth: 0, flex: 1 }}>
                <Box
                  sx={{
                    width: 36,
                    height: 36,
                    borderRadius: '10px',
                    backgroundColor: getCategoryPalette(selectedStat.title).bg,
                    display: { xs: 'none', sm: 'flex' },
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}
                >
                  <i className={selectedStat.icon} style={{ fontSize: '1.125rem', color: breakdownColor }} />
                </Box>
                <Box sx={{ minWidth: 0 }}>
                  <Typography noWrap sx={{ fontSize: { xs: '0.9375rem', sm: '1rem' }, fontWeight: 700, color: '#0F172A' }}>
                    {selectedFilterVal !== 'all'
                      ? `${currentDropdownList.find(g => String(g.id) === String(selectedFilterVal))?.name ?? ''} Revenue`
                      : selectedStat.title}
                  </Typography>
                  <Typography sx={{ fontSize: { xs: '0.6875rem', sm: '0.75rem' }, color: '#94A3B8', fontWeight: 500 }}>
                    {range === 'average'
                      ? `${AVERAGE_PERIODS[averagePeriod].label} Average`
                      : RANGES[range].label}
                  </Typography>
                </Box>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, alignSelf: { xs: 'flex-end', sm: 'auto' }, flexWrap: 'wrap' }}>
                {currentDropdownList.length > 0 && (
                  <FormControl size='small' sx={{ minWidth: 160 }}>
                    <Select
                      value={selectedFilterVal}
                      onChange={(e: SelectChangeEvent) => setSelectedFilterVal(e.target.value)}
                      displayEmpty
                      sx={{
                        borderRadius: '8px',
                        fontSize: { xs: '0.75rem', sm: '0.8125rem' },
                        fontWeight: 600,
                        backgroundColor: `${breakdownColor}0A`,
                        color: '#0F172A',
                        '& .MuiOutlinedInput-notchedOutline': { borderColor: `${breakdownColor}33` },
                        '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: `${breakdownColor}66` },
                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: breakdownColor },
                        '& .MuiSelect-select': { py: 0.75 }
                      }}
                    >
                      <MenuItem value='all'>{currentDropdownPlaceholder}</MenuItem>
                      {currentDropdownList.map(g => (
                        <MenuItem key={g.id} value={g.id}>
                          {g.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                )}
                {range !== 'average' && (['all', 'top10', 'low10'] as FilterMode[]).map(f => {
                  const active = filter === f
                  const label = f === 'all' ? 'All' : f === 'top10' ? 'Top 10' : 'Low 10'
                  const icon = f === 'all' ? 'tabler-list' : f === 'top10' ? 'tabler-trending-up' : 'tabler-trending-down'

                  return (
                    <Chip
                      key={f}
                      label={label}
                      onClick={() => setFilter(f)}
                      size='small'
                      icon={<i className={icon} style={{ fontSize: '0.875rem', marginLeft: 6 }} />}
                      sx={{
                        borderRadius: '8px',
                        fontSize: { xs: '0.75rem', sm: '0.8125rem' },
                        fontWeight: 600,
                        height: 30,
                        px: 0.25,
                        cursor: 'pointer',
                        backgroundColor: active ? `${breakdownColor}14` : '#F8FAFC',
                        color: active ? breakdownColor : '#64748B',
                        border: active ? `1px solid ${breakdownColor}30` : '1px solid transparent',
                        transition: 'all 0.2s ease',
                        '& .MuiChip-icon': { color: 'inherit' },
                        '&:hover': {
                          backgroundColor: active ? `${breakdownColor}1F` : `${breakdownColor}0A`,
                          color: breakdownColor
                        }
                      }}
                    />
                  )
                })}
                <Button
                  onClick={() => setSelectedButton(selectedButton === 'total' ? 'category' : 'total')}
                  size='small'
                  sx={{
                    borderRadius: '8px',
                    px: { xs: 1.5, sm: 2 },
                    py: 0.5,
                    fontSize: { xs: '0.75rem', sm: '0.8125rem' },
                    fontWeight: 600,
                    textTransform: 'none',
                    backgroundColor: `${breakdownColor}12`,
                    color: breakdownColor,
                    '&:hover': { backgroundColor: `${breakdownColor}22` }
                  }}
                  startIcon={<i className={selectedButton === 'total' ? 'tabler-chart-bar' : 'tabler-chart-area'} style={{ fontSize: '1rem' }} />}
                >
                  {selectedButton === 'total' ? 'Category View' : 'Total View'}
                </Button>
              </Box>
            </Box>
            <Box sx={{ px: { xs: 0.5, sm: 1.5 }, pb: { xs: 1, sm: 1.5 }, minHeight: { xs: 280, sm: 340 } }}>
              {catLoading ? (
                <Box sx={{ height: 340, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <CircularProgress size={28} sx={{ color: breakdownColor }} />
                </Box>
              ) : !categoryHasData ? (
                <Box sx={{ height: 340, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                  <Box sx={{ width: 56, height: 56, borderRadius: '50%', backgroundColor: getCategoryPalette(selectedStat.title).bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <i className='tabler-chart-line' style={{ fontSize: '1.5rem', color: breakdownColor }} />
                  </Box>
                  <Typography sx={{ fontSize: '0.9375rem', fontWeight: 600, color: '#1E293B' }}>No revenue data</Typography>
                  <Typography sx={{ fontSize: '0.8125rem', color: '#94A3B8' }}>No {selectedStat.title} transactions in this period.</Typography>
                </Box>
              ) : selectedButton === 'total' ? (
                <ReactApexcharts
                  type='area'
                  height={340}
                  width='100%'
                  options={options}
                  series={[{ name: selectedStat.title, data: filteredData }]}
                />
              ) : (
                <GameRevenueChart chartData={filteredData} title={selectedStat.title} categories={filteredCategories} color={breakdownColor} />
              )}
            </Box>
          </Box>
        ) : (
          <MainCart range={range} fromDate={fromDate} toDate={toDate} averagePeriod={averagePeriod} stats={stats} />
        )}
        {stats ? (
          <RevenueSummary
            totalRevenue={totalRevenue}
            categories={[
              { label: 'Game Revenue', amount: stats.gameRevenue, color: CATEGORY_COLORS['Game Revenue'].primary },
              { label: 'Product Revenue', amount: stats.cardRevenue, color: CATEGORY_COLORS['Product Revenue'].primary },
              { label: 'Redemption Revenue', amount: stats.redemptionRevenue, color: CATEGORY_COLORS['Redemption Revenue'].primary },
              { label: 'Event Revenue', amount: stats.eventRevenue, color: CATEGORY_COLORS['Event Revenue'].primary },
              { label: 'F&B Revenue', amount: stats.fbRevenue, color: CATEGORY_COLORS['F&B Revenue'].primary },
              { label: 'Bounzing Revenue', amount: stats.trampolineRevenue, color: CATEGORY_COLORS['Bounzing Revenue'].primary },
              { label: 'Bowling Revenue', amount: stats.bowlingRevenue, color: CATEGORY_COLORS['Bowling Revenue'].primary },
              { label: 'Ticketing Revenue', amount: stats.ticket, color: CATEGORY_COLORS['Ticketing Revenue'].primary }
            ]}
          />
        ) : (
          <Skeleton variant='rounded' height={400} sx={{ borderRadius: '16px' }} />
        )}
      </Box>

      {/* Row 3: Category Breakdown + Upcoming Events (shown when card selected) */}
      {selectedStat && categoryHasData && (
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: 'minmax(0, 1fr)', xl: 'minmax(0, 2fr) minmax(0, 1fr)' },
            gap: 3,
            minWidth: 0
          }}
        >
          <TopGameChart
            selectedStat={buildTopStat(selectedStat, catCategories, catData)}
            catCategories={catCategories}
            catData={catData}
            from={from}
            to={to}
            gamesList={gamesList}
          />
          <UpcomingEvents from={from} to={to} />
        </Box>
      )}
      {selectedStat && !categoryHasData && !catLoading && (
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: 'minmax(0, 1fr)', xl: 'minmax(0, 2fr) minmax(0, 1fr)' },
            gap: 3,
            minWidth: 0
          }}
        >
          <Box />
          <UpcomingEvents from={from} to={to} />
        </Box>
      )}
    </Box>
  )
}

export default HomePage
