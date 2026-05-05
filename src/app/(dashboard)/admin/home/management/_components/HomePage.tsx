'use client'
import React, { useEffect, useMemo, useState } from 'react'

import { Box, Button, CircularProgress, FormControl, MenuItem, Select, Skeleton, Stack, Typography } from '@mui/material'
import type { SelectChangeEvent } from '@mui/material/Select'

import ReactApexcharts from '@/@core/components/react-apexcharts'
import StatsCard from './StatsCard'
import GameRevenueChart from './GameRevenueChart'
import TopGameChart from './TopGameChart'
import UpcomingEvents from './UpcomingEvents'
import MainCart from './MainChart'
import RevenueSummary from './RevenueSummary'
import RangeTabs from './RangeTabs'
import { AVERAGE_PERIODS, RANGES, formatTimeLabel, detectAllHours, resolveDay } from './ranges'
import type { AveragePeriod, RangeKey } from './ranges'
import { managementDashboardMockApi as managementDashboardApi, GAMES, GAME_DAILY } from './mockData'
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

// Game-revenue specific: rank the actual games (not time slots) so the Top 6
// breakdown reads "Bumper Car / Shooting / …" instead of "6 PM / 7 PM / …".
function buildTopGameStat(selectedStat: any) {
  const ranked = GAMES
    .map(g => ({ id: g.id, name: g.name, val: GAME_DAILY[g.id] ?? 0 }))
    .sort((a, b) => b.val - a.val)

  const top6 = ranked.slice(0, 6)
  const topTotal = top6.reduce((s, t) => s + t.val, 0) || 1

  const colors1 = ['text-primary', 'text-info', 'text-success']
  const colors2 = ['text-secondary', 'text-error', 'text-warning']

  return {
    ...selectedStat,
    datas: top6.map(t => t.name),
    data1: top6.slice(0, 3).map((t, j) => ({
      title: t.name,
      value: Math.round((t.val / topTotal) * 100),
      colorClass: colors1[j]
    })),
    data2: top6.slice(3, 6).map((t, j) => ({
      title: t.name,
      value: Math.round((t.val / topTotal) * 100),
      colorClass: colors2[j]
    })),
    chartData: top6.map(t => t.val)
  }
}

const HomePage = () => {
  const [range, setRange] = useState<RangeKey>('daily')
  const [fromDate, setFromDate] = useState<Date | null>(null)
  const [toDate, setToDate] = useState<Date | null>(null)
  const [averagePeriod, setAveragePeriod] = useState<AveragePeriod>('weekly')
  const [selectedStat, setSelectedStat] = useState<any | null>(null)
  const [selectedButton, setSelectedButton] = useState<string>('total')
  const [selectedGame, setSelectedGame] = useState<string>('all')

  const [stats, setStats] = useState<TStats | null>(null)

  const [catLoading, setCatLoading] = useState(false)
  const [catCategories, setCatCategories] = useState<string[]>([])
  const [catData, setCatData] = useState<number[]>([])

  // Fetch range-aware widget totals whenever the active range changes.
  useEffect(() => {
    if (range === 'custom' && (!fromDate || !toDate)) return

    const day = resolveDay(range, fromDate, toDate, averagePeriod)

    managementDashboardApi.widgetValues({ day }).then(res => {
      const next = res.data?.data?.[0]

      if (next) setStats(next)
    }).catch(() => {})
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

    const apiKey = CATEGORY_TO_GRAPH[selectedStat.title as string]

    if (!apiKey) {
      setCatCategories([])
      setCatData([])

      return
    }

    setCatLoading(true)
    const day = resolveDay(range, fromDate, toDate, averagePeriod)
    const fn = managementDashboardApi[apiKey] as (args: any) => Promise<any>

    const args: any = { day }

    if (selectedStat.title === 'Game Revenue' && selectedGame && selectedGame !== 'all') {
      args.game = selectedGame
    }

    fn(args).then(res => {
      const raw = res.data?.data

      if (!Array.isArray(raw) || raw.length === 0) {
        setCatCategories([])
        setCatData([])

        return
      }

      const allHours = detectAllHours(raw)
      const cats = raw.map((r: any) => formatTimeLabel(r.time ?? r.hour, allHours))
      const vals = raw.map((r: any) => Number(r.revenue ?? r.value ?? r.amount ?? 0))

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
  }, [selectedStat, range, fromDate, toDate, averagePeriod, selectedGame])

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

  const options: ApexCharts.ApexOptions = {
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
    xaxis: {
      categories: catCategories,
      tickAmount: Math.min(catCategories.length, 12),
      labels: {
        style: { colors: '#94A3B8', fontSize: '11px' },
        rotate: 0,
        rotateAlways: false,
        hideOverlappingLabels: true,
        trim: true
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
  }

  const categoryHasData = catData.some(v => v > 0)

  // Initial load: render skeleton placeholders so the layout doesn't jump.
  if (!stats) {
    return (
      <Stack spacing={{ xs: 2, sm: 3 }} sx={{ p: { xs: 1.5, sm: 2.5, md: 3 } }}>
        <Skeleton variant='rounded' height={64} sx={{ borderRadius: '14px' }} />
        <Skeleton variant='rounded' height={56} sx={{ borderRadius: '14px' }} />
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: 'repeat(2, minmax(0, 1fr))', sm: 'repeat(3, minmax(0, 1fr))', md: 'repeat(4, minmax(0, 1fr))' }, gap: { xs: 1.25, sm: 2 } }}>
          {[...Array(8)].map((_, i) => (
            <Skeleton key={i} variant='rounded' height={85} sx={{ borderRadius: '14px' }} />
          ))}
        </Box>
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: 'minmax(0, 1fr)', lg: 'minmax(0, 1fr) 340px' }, gap: { xs: 2, sm: 3 } }}>
          <Skeleton variant='rounded' height={400} sx={{ borderRadius: '16px' }} />
          <Skeleton variant='rounded' height={400} sx={{ borderRadius: '16px' }} />
        </Box>
      </Stack>
    )
  }

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
                <AnimatedNumber value={totalRevenue} prefix='₹' />
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
          {statsCardArray.map((item, i) => (
            <Box
              key={i}
              onClick={() => {
                setSelectedGame('all')
                setSelectedStat(selectedStat?.title === item.title ? null : item)
              }}
            >
              <StatsCard item={item} selected={selectedStat?.title === item.title} index={i} />
            </Box>
          ))}
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
                    {selectedStat.title === 'Game Revenue' && selectedGame !== 'all'
                      ? `${GAMES.find(g => g.id === selectedGame)?.name ?? ''} Revenue`
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
                {selectedStat.title === 'Game Revenue' && (
                  <FormControl size='small' sx={{ minWidth: 160 }}>
                    <Select
                      value={selectedGame}
                      onChange={(e: SelectChangeEvent) => setSelectedGame(e.target.value)}
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
                      <MenuItem value='all'>All Games</MenuItem>
                      {GAMES.map(g => (
                        <MenuItem key={g.id} value={g.id}>{g.name}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                )}
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
                  series={[{ name: selectedStat.title, data: catData }]}
                />
              ) : (
                <GameRevenueChart chartData={catData} title={selectedStat.title} categories={catCategories} color={breakdownColor} />
              )}
            </Box>
          </Box>
        ) : (
          <MainCart range={range} fromDate={fromDate} toDate={toDate} averagePeriod={averagePeriod} />
        )}
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
            selectedStat={
              selectedStat.title === 'Game Revenue'
                ? buildTopGameStat(selectedStat)
                : buildTopStat(selectedStat, catCategories, catData)
            }
          />
          <UpcomingEvents />
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
          <UpcomingEvents />
        </Box>
      )}
    </Box>
  )
}

export default HomePage
