'use client'
import React, { useEffect, useMemo, useState } from 'react'

import dynamic from 'next/dynamic'

import Box from '@mui/material/Box'
import Chip from '@mui/material/Chip'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import CircularProgress from '@mui/material/CircularProgress'
import useMediaQuery from '@mui/material/useMediaQuery'
import { useTheme } from '@mui/material/styles'

import type { ApexOptions } from 'apexcharts'

import { AVERAGE_PERIODS, RANGES, formatTimeLabel, detectAllHours, resolveDay, resolveDates } from './ranges'
import type { AveragePeriod, RangeKey } from './ranges'
import { managementDashboardApi } from '@/api/management-dashboard'
import { getCategoryColor } from './categoryColors'

const SERIES_COLORS = [
  getCategoryColor('Game Revenue'),
  getCategoryColor('Product Revenue'),
  getCategoryColor('Redemption Revenue'),
]

const AppReactApexCharts = dynamic(() => import('@/libs/styles/AppReactApexCharts'))

const formatValue = (val: number, short: boolean) => {
  if (!short) return `₹${val.toLocaleString()}`
  if (val >= 100000) return `₹${(val / 100000).toFixed(1)}L`
  if (val >= 1000) return `₹${(val / 1000).toFixed(0)}K`

  return `₹${val}`
}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

function getMonthKey(label: any, fallbackIndex: number, start: Date, end: Date): string {
  if (typeof label === 'string') {
    const match1 = label.match(/^(\d{2})[-/](\d{2})[-/](\d{4})$/)
    if (match1) {
      const p1 = Number(match1[1])
      const p2 = Number(match1[2])
      const monthIdx = p1 >= 1 && p1 <= 12 ? p1 - 1 : p2 >= 1 && p2 <= 12 ? p2 - 1 : 0
      return MONTHS[monthIdx]
    }
    const match2 = label.match(/^(\d{4})[-/](\d{2})[-/](\d{2})$/)
    if (match2) {
      const monthIdx = Number(match2[2]) - 1
      if (monthIdx >= 0 && monthIdx < 12) {
        return MONTHS[monthIdx]
      }
    }
    
    for (const m of MONTHS) {
      if (label.toLowerCase().includes(m.toLowerCase())) {
        return m
      }
    }
  }
  
  const estimatedDate = new Date(start.getTime() + fallbackIndex * 24 * 60 * 60 * 1000)
  return MONTHS[estimatedDate.getMonth()]
}

type MainCartProps = {
  range: RangeKey
  fromDate?: Date | null
  toDate?: Date | null
  averagePeriod?: AveragePeriod
  stats?: any
}

type FilterMode = 'all' | 'top10' | 'low10'

const MainCart = ({
  range,
  fromDate = null,
  toDate = null,
  averagePeriod = 'weekly',
  stats = null
}: MainCartProps) => {
  const [showTable, setShowTable] = useState(false)
  const [filter, setFilter] = useState<FilterMode>('all')
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))

  // Reset filter when range switches to average
  useEffect(() => {
    if (range === 'average') {
      setFilter('all')
    }
  }, [range])

  const [loading, setLoading] = useState(true)
  const [categories, setCategories] = useState<string[]>([])
  const [series, setSeries] = useState<{ name: string; data: number[] }[]>([])

  useEffect(() => {
    if (range === 'custom' && (!fromDate || !toDate)) {
      setLoading(false)
      setCategories([])
      setSeries([])

      return
    }

    setLoading(true)
    const { from, to } = resolveDates(range, fromDate, toDate, averagePeriod)
    console.log('[DEBUG] MainChart fetch: range=', range, 'from=', from, 'to=', to)

    Promise.all([
      managementDashboardApi.gameRevenueGraph({ from, to }),
      managementDashboardApi.productRevenueGraph({ from, to }),
      managementDashboardApi.redemptionRevenueGraph({ from, to })
    ]).then(([gameRes, productRes, redemptionRes]) => {
      const gameRaw = Array.isArray(gameRes.data?.data) ? gameRes.data.data : []
      const productRaw = Array.isArray(productRes.data?.data) ? productRes.data.data : []
      const redemptionRaw = Array.isArray(redemptionRes.data?.data) ? redemptionRes.data.data : []

      if (gameRaw.length === 0 && productRaw.length === 0 && redemptionRaw.length === 0) {
        setCategories([])
        setSeries([])

        return
      }

      // Check date range length
      const parseDate = (str: string) => {
        const parts = str.split('-')

        return new Date(Number(parts[2]), Number(parts[0]) - 1, Number(parts[1]))
      }
      const start = parseDate(from)
      const end = parseDate(to)
      const ms = end.getTime() - start.getTime()
      const days = Math.round(ms / (1000 * 60 * 60 * 24))

      if (days > 31) {
        // Build monthly categories (timeline)
        const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
        const cur = new Date(start)
        const monthlyCategories: string[] = []

        while (cur <= end) {
          const monthLabel = MONTHS[cur.getMonth()]

          if (!monthlyCategories.includes(monthLabel)) {
            monthlyCategories.push(monthLabel)
          }
          cur.setMonth(cur.getMonth() + 1)
        }

        const sums: Record<string, Record<string, number>> = {}
        monthlyCategories.forEach(m => {
          sums[m] = {
            game: 0,
            product: 0,
            redemption: 0
          }
        })

        gameRaw.forEach((r: any, idx: number) => {
          const label = r.time ?? r.hour ?? r.label
          const monthKey = getMonthKey(label, idx, start, end)
          if (sums[monthKey]) {
            sums[monthKey].game += Number(r.revenue ?? r.value ?? r.amount ?? r.gameRevenue ?? 0)
          }
        })

        productRaw.forEach((r: any, idx: number) => {
          const label = r.time ?? r.hour ?? r.label
          const monthKey = getMonthKey(label, idx, start, end)
          if (sums[monthKey]) {
            sums[monthKey].product += Number(r.revenue ?? r.value ?? r.amount ?? r.cardRevenue ?? r.productRevenue ?? 0)
          }
        })

        redemptionRaw.forEach((r: any, idx: number) => {
          const label = r.time ?? r.hour ?? r.label
          const monthKey = getMonthKey(label, idx, start, end)
          if (sums[monthKey]) {
            sums[monthKey].redemption += Number(r.revenue ?? r.value ?? r.amount ?? r.redemptionRevenue ?? 0)
          }
        })

        setCategories(monthlyCategories)
        setSeries([
          { name: 'Game Revenue', data: monthlyCategories.map(m => sums[m].game) },
          { name: 'Product Revenue', data: monthlyCategories.map(m => sums[m].product) },
          { name: 'Redemption Revenue', data: monthlyCategories.map(m => sums[m].redemption) }
        ])
      } else {
        const combinedRaw = [...gameRaw, ...productRaw, ...redemptionRaw]
        const allHours = range === 'daily' || detectAllHours(combinedRaw)
        const timeline: { timeVal: any; label: string }[] = []

        if (allHours) {
          // Hourly resolution
          let minHr = 10
          let maxHr = 17

          combinedRaw.forEach((r: any) => {
            const hr = Number(r.time ?? r.hour ?? r.label ?? 0)

            if (hr < minHr) minHr = hr
            if (hr > maxHr) maxHr = hr
          })

          for (let h = minHr; h <= maxHr; h++) {
            timeline.push({ timeVal: h, label: formatTimeLabel(h, true) })
          }
        } else {
          // Daily resolution (Weekly, Monthly <= 31, Custom <= 31)
          const cur = new Date(start)

          while (cur <= end) {
            timeline.push({
              timeVal: cur.getDate(),
              label: cur.toLocaleDateString('en-US', { day: 'numeric', month: 'short' })
            })
            cur.setDate(cur.getDate() + 1)
          }
        }

        const buildRawMap = (rawArr: any[]) => {
          const m = new Map<string, any>()
          rawArr.forEach((r: any) => {
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

            m.set(key, r)
          })
          return m
        }

        const gameMap = buildRawMap(gameRaw)
        const productMap = buildRawMap(productRaw)
        const redemptionMap = buildRawMap(redemptionRaw)

        const processedRaw = timeline.map(item => {
          const key = String(item.timeVal)

          const gameVal = gameMap.has(key)
            ? Number(gameMap.get(key).revenue ?? gameMap.get(key).value ?? gameMap.get(key).amount ?? gameMap.get(key).gameRevenue ?? 0)
            : 0

          const productVal = productMap.has(key)
            ? Number(productMap.get(key).revenue ?? productMap.get(key).value ?? productMap.get(key).amount ?? productMap.get(key).cardRevenue ?? productMap.get(key).productRevenue ?? 0)
            : 0

          const redemptionVal = redemptionMap.has(key)
            ? Number(redemptionMap.get(key).revenue ?? redemptionMap.get(key).value ?? redemptionMap.get(key).amount ?? redemptionMap.get(key).redemptionRevenue ?? 0)
            : 0

          return {
            label: item.label,
            gameRevenue: gameVal,
            productRevenue: productVal,
            redemptionRevenue: redemptionVal
          }
        })

        const cats = processedRaw.map(r => r.label)
        const game = processedRaw.map(r => r.gameRevenue)
        const product = processedRaw.map(r => r.productRevenue)
        const redemption = processedRaw.map(r => r.redemptionRevenue)

        const flatten = (arr: number[]) => {
          if (range !== 'average' || arr.length === 0) return arr
          const avg = arr.reduce((s, v) => s + v, 0) / arr.length

          return arr.map(() => Math.round(avg))
        }

        setCategories(cats)
        setSeries([
          { name: 'Game Revenue', data: flatten(game) },
          { name: 'Product Revenue', data: flatten(product) },
          { name: 'Redemption Revenue', data: flatten(redemption) }
        ])
      }
    }).catch(err => {
      console.error('[DEBUG] MainChart fetch error:', err)
      setCategories([])
      setSeries([])
    }).finally(() => setLoading(false))
  }, [range, fromDate, toDate, averagePeriod])

  // Apply Top 10 / Low 10 filter by ranking time buckets on summed revenue
  // across all three series, then preserving original chronological order.
  const { filteredCategories, filteredSeries } = useMemo(() => {
    if (filter === 'all') {
      return { filteredCategories: categories, filteredSeries: series }
    }

    const totals = categories.map((_, i) =>
      series.reduce((sum, s) => sum + (s.data[i] ?? 0), 0)
    )
    const indexed = totals.map((total, i) => ({ total, i }))

    indexed.sort((a, b) => filter === 'top10' ? b.total - a.total : a.total - b.total)

    const keepIdx = indexed.slice(0, 10).map(x => x.i)

    return {
      filteredCategories: keepIdx.map(i => categories[i]),
      filteredSeries: series.map(s => ({ name: s.name, data: keepIdx.map(i => s.data[i]) }))
    }
  }, [filter, categories, series])

  const lineOptions: ApexOptions = useMemo(() => ({
    chart: {
      parentHeightOffset: 0,
      toolbar: { show: false },
      fontFamily: 'inherit',
      zoom: { enabled: false }
    },
    colors: SERIES_COLORS,
    stroke: { curve: 'smooth', width: isMobile ? 2 : 2.5 },
    dataLabels: { enabled: false },
    markers: {
      size: isMobile ? 2 : 4,
      strokeWidth: isMobile ? 1 : 2,
      strokeOpacity: 1,
      colors: SERIES_COLORS,
      strokeColors: '#fff'
    },
    grid: {
      borderColor: 'rgba(0,0,0,0.05)',
      strokeDashArray: 3,
      padding: { top: -10, left: isMobile ? -10 : 10, right: isMobile ? -10 : 10 },
      xaxis: { lines: { show: !isMobile } }
    },
    tooltip: {
      shared: true,
      intersect: false,
      y: { formatter: (val: number) => `₹${val.toLocaleString()}` }
    },
    yaxis: {
      labels: {
        style: { colors: '#94A3B8', fontSize: isMobile ? '9px' : '11px', fontWeight: 500 },
        formatter: (val: number) => formatValue(val, isMobile)
      }
    },
    xaxis: {
      axisBorder: { show: false },
      axisTicks: { show: false },
      tickAmount: isMobile ? 6 : Math.min(filteredCategories.length, 12),
      labels: {
        style: { colors: '#94A3B8', fontSize: isMobile ? '8px' : '11px', fontWeight: 500 },
        rotate: isMobile ? -45 : 0,
        rotateAlways: false,
        hideOverlappingLabels: true,
        trim: false
      },
      categories: filteredCategories
    },
    legend: {
      show: true,
      position: 'bottom',
      horizontalAlign: 'center',
      fontSize: '11px',
      fontWeight: 600,
      markers: {
        width: 8,
        height: 8,
        radius: 4,
        offsetX: -2
      },
      itemMargin: { horizontal: 10, vertical: 2 },
      labels: { colors: '#475569' }
    }
  }), [filteredCategories, isMobile])

  const hasData = filteredSeries.some(s => s.data.some(v => v > 0))

  const chartHeight = isMobile ? 320 : 380

  return (
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
      {/* Header */}
      <Box sx={{
        px: { xs: 2, sm: 3 },
        pt: { xs: 2, sm: 2.5 },
        pb: 1,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: 1
      }}>
        <Box sx={{ minWidth: 0, flex: 1 }}>
          <Typography sx={{ fontSize: { xs: '0.9375rem', sm: '1rem' }, fontWeight: 700, color: '#0F172A' }}>
            Revenue overview
          </Typography>
          <Typography noWrap sx={{ fontSize: { xs: '0.6875rem', sm: '0.75rem' }, color: '#94A3B8', fontWeight: 500 }}>
            {range === 'custom' && fromDate && toDate
              ? `${fromDate.toLocaleDateString()} → ${toDate.toLocaleDateString()}`
              : range === 'average'
                ? `${AVERAGE_PERIODS[averagePeriod].label} Average`
                : RANGES[range].label}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, flexShrink: 0 }}>
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
                  fontSize: { xs: '0.6875rem', sm: '0.75rem' },
                  fontWeight: 600,
                  height: 30,
                  px: 0.25,
                  cursor: 'pointer',
                  display: { xs: f === 'all' ? 'none' : 'inline-flex', sm: 'inline-flex' },
                  backgroundColor: active ? `${SERIES_COLORS[0]}14` : '#F8FAFC',
                  color: active ? SERIES_COLORS[0] : '#64748B',
                  border: active ? `1px solid ${SERIES_COLORS[0]}30` : '1px solid transparent',
                  transition: 'all 0.2s ease',
                  '& .MuiChip-icon': { color: 'inherit' },
                  '&:hover': {
                    backgroundColor: active ? `${SERIES_COLORS[0]}1F` : `${SERIES_COLORS[0]}0A`,
                    color: SERIES_COLORS[0]
                  }
                }}
              />
            )
          })}
          <IconButton
            onClick={() => setShowTable(prev => !prev)}
            size='small'
            sx={{
              borderRadius: '8px',
              width: { xs: 30, sm: 32 },
              height: { xs: 30, sm: 32 },
              color: '#94A3B8',
              '&:hover': { backgroundColor: `${SERIES_COLORS[0]}10`, color: SERIES_COLORS[0] }
            }}
          >
            <i className={showTable ? 'tabler-chart-bar' : 'tabler-table'} style={{ fontSize: '1.125rem' }} />
          </IconButton>
        </Box>
      </Box>

      {/* Chart / Table / Empty state */}
      <Box sx={{ px: { xs: 0.5, sm: 1.5 }, pb: { xs: 1, sm: 1.5 }, minHeight: chartHeight }}>
        {loading ? (
          <Box sx={{ height: chartHeight, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <CircularProgress size={28} sx={{ color: SERIES_COLORS[0] }} />
          </Box>
        ) : range === 'custom' && (!fromDate || !toDate) ? (
          <Box sx={{ height: chartHeight, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 1, px: 2, textAlign: 'center' }}>
            <Box sx={{ width: 56, height: 56, borderRadius: '50%', backgroundColor: '#F0ECFA', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <i className='tabler-calendar-time' style={{ fontSize: '1.5rem', color: SERIES_COLORS[0] }} />
            </Box>
            <Typography sx={{ fontSize: '0.9375rem', fontWeight: 600, color: '#0F172A' }}>Select a date range</Typography>
            <Typography sx={{ fontSize: '0.8125rem', color: '#94A3B8' }}>Choose &quot;From&quot; and &quot;Till&quot; to view custom revenue.</Typography>
          </Box>
        ) : !hasData || filteredCategories.length === 0 ? (
          <Box sx={{ height: chartHeight, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 1, px: 2, textAlign: 'center' }}>
            <Box sx={{ width: 56, height: 56, borderRadius: '50%', backgroundColor: '#F0ECFA', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <i className='tabler-chart-line' style={{ fontSize: '1.5rem', color: SERIES_COLORS[0] }} />
            </Box>
            <Typography sx={{ fontSize: '0.9375rem', fontWeight: 600, color: '#0F172A' }}>No revenue data</Typography>
            <Typography sx={{ fontSize: '0.8125rem', color: '#94A3B8' }}>No transactions in this period.</Typography>
          </Box>
        ) : !showTable ? (
          <AppReactApexCharts type='line' width='100%' height={chartHeight} options={lineOptions} series={filteredSeries} />
        ) : (
          <Box sx={{ overflowX: 'auto', px: 1.5, pb: 1 }}>
            <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: '0 2px', minWidth: 600 }}>
              <thead>
                <tr>
                  <th style={{ padding: '10px 14px', textAlign: 'left', fontSize: '0.75rem', fontWeight: 600, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Time</th>
                  {filteredSeries.map(s => (
                    <th key={s.name} style={{ padding: '10px 14px', textAlign: 'right', fontSize: '0.75rem', fontWeight: 600, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                      {s.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredCategories.map((cat, idx) => (
                  <tr key={cat + idx} style={{ backgroundColor: idx % 2 === 0 ? '#FAFAFA' : 'transparent' }}>
                    <td style={{ padding: '8px 14px', borderRadius: '6px 0 0 6px', fontSize: '0.8125rem', fontWeight: 500, color: '#64748B' }}>{cat}</td>
                    {filteredSeries.map(s => (
                      <td key={s.name} style={{ padding: '8px 14px', textAlign: 'right', fontSize: '0.8125rem', fontWeight: 600, color: '#1E293B' }}>
                        ₹{s.data[idx]?.toLocaleString() ?? 0}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </Box>
        )}
      </Box>
    </Box>
  )
}

export default MainCart
