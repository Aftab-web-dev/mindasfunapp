'use client'
import React, { useEffect, useMemo, useState } from 'react'

import { Box, Button, CircularProgress, MenuItem, TextField, Typography } from '@mui/material'

import ReactApexcharts from '@/@core/components/react-apexcharts'
import StatsCard from './StatsCard'
import GameRevenueChart from './GameRevenueChart'
import TopGameChart from './TopGameChart'
import UpcomingEvents from './UpcomingEvents'
import MainCart from './MainChart'
import RevenueSummary from './RevenueSummary'
import { RANGES, formatTimeLabel, detectAllHours } from './ranges'
import type { RangeKey } from './ranges'
import { managementDashboardApi } from '@/api/management-dashboard'

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

const HomePage = ({ stats }: { stats: TStats }) => {
  const [range, setRange] = useState<RangeKey>('today')
  const [selectedStat, setSelectedStat] = useState<any | null>(null)
  const [selectedButton, setSelectedButton] = useState<string>('total')

  const [catLoading, setCatLoading] = useState(false)
  const [catCategories, setCatCategories] = useState<string[]>([])
  const [catData, setCatData] = useState<number[]>([])

  // Fetch per-category graph when a card is selected OR range changes
  useEffect(() => {
    if (!selectedStat) {
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
    const { day } = RANGES[range]
    const fn = managementDashboardApi[apiKey] as (args: any) => Promise<any>

    fn({ day }).then(res => {
      const raw = res.data?.data

      if (!Array.isArray(raw) || raw.length === 0) {
        setCatCategories([])
        setCatData([])

        return
      }

      const allHours = detectAllHours(raw)

      setCatCategories(raw.map((r: any) => formatTimeLabel(r.time ?? r.hour, allHours)))
      setCatData(raw.map((r: any) => Number(r.revenue ?? r.value ?? r.amount ?? 0)))
    }).catch(() => {
      setCatCategories([])
      setCatData([])
    }).finally(() => setCatLoading(false))
  }, [selectedStat, range])

  const statsCardArray = useMemo(() => {
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
      icon: cat.icon,
      datas: [],
      data1: [],
      data2: [],
      chartData: []
    }))
  }, [stats])

  const totalRevenue =
    stats.gameRevenue + stats.cardRevenue + stats.redemptionRevenue +
    stats.eventRevenue + stats.fbRevenue + stats.trampolineRevenue +
    stats.bowlingRevenue + stats.ticket

  const options: ApexCharts.ApexOptions = {
    chart: {
      type: 'area',
      parentHeightOffset: 0,
      zoom: { enabled: false },
      toolbar: { show: false },
      fontFamily: 'inherit'
    },
    colors: ['#523F99'],
    stroke: { curve: 'smooth', width: 2.5 },
    fill: {
      type: 'gradient',
      gradient: { shadeIntensity: 1, opacityFrom: 0.2, opacityTo: 0.02, stops: [0, 90, 100] }
    },
    dataLabels: { enabled: false },
    xaxis: {
      categories: catCategories,
      labels: { style: { colors: '#94A3B8', fontSize: '11px' } },
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

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>

      {/* Header with range filter */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
        <Typography sx={{ fontSize: '1rem', fontWeight: 700, color: '#1E293B' }}>
          Revenue Categories
        </Typography>
        <TextField
          select
          size='small'
          value={range}
          onChange={e => setRange(e.target.value as RangeKey)}
          sx={{
            minWidth: 150,
            '& .MuiOutlinedInput-root': {
              borderRadius: '10px',
              fontSize: '0.8125rem',
              backgroundColor: '#FFFFFF',
              boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
              height: 38
            }
          }}
        >
          <MenuItem value='today'>Today</MenuItem>
          <MenuItem value='week'>This Week</MenuItem>
          <MenuItem value='month'>This Month</MenuItem>
          <MenuItem value='year'>This Year</MenuItem>
        </TextField>
      </Box>

      {/* Row 1: Revenue Category Cards */}
      <Box>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: 'repeat(2, 1fr)',
              md: 'repeat(3, 1fr)',
              lg: 'repeat(4, 1fr)',
              xl: 'repeat(4, 1fr)'
            },
            gap: 2
          }}
        >
          {statsCardArray.map((item, i) => (
            <Box
              key={i}
              onClick={() => setSelectedStat(selectedStat?.title === item.title ? null : item)}
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
          gridTemplateColumns: { xs: '1fr', lg: '1fr 320px' },
          gap: 3
        }}
      >
        {selectedStat ? (
          <Box
            sx={{
              borderRadius: '16px',
              background: '#FFFFFF',
              boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
              overflow: 'hidden'
            }}
          >
            <Box sx={{
              px: { xs: 2.5, sm: 3 },
              pt: 2.5,
              pb: 0.5,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: 2
            }}>
              <Box>
                <Typography sx={{ fontSize: '1rem', fontWeight: 700, color: '#1E293B' }}>
                  Revenue Breakdown
                </Typography>
                <Typography sx={{ fontSize: '0.8125rem', color: '#94A3B8', fontWeight: 500 }}>
                  {selectedStat.title} — {RANGES[range].label}
                </Typography>
              </Box>
              <Button
                onClick={() => setSelectedButton(selectedButton === 'total' ? 'category' : 'total')}
                size='small'
                sx={{
                  borderRadius: '8px',
                  px: 2,
                  py: 0.5,
                  fontSize: '0.8125rem',
                  fontWeight: 600,
                  textTransform: 'none',
                  backgroundColor: 'rgba(82, 63, 153, 0.06)',
                  color: '#523F99',
                  '&:hover': { backgroundColor: 'rgba(82, 63, 153, 0.1)' }
                }}
              >
                {selectedButton === 'total' ? 'Category View' : 'Total View'}
              </Button>
            </Box>
            <Box sx={{ px: { xs: 1, sm: 1.5 }, pb: 1.5, minHeight: 340 }}>
              {catLoading ? (
                <Box sx={{ height: 340, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <CircularProgress size={28} sx={{ color: '#523F99' }} />
                </Box>
              ) : !categoryHasData ? (
                <Box sx={{ height: 340, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                  <Box sx={{ width: 56, height: 56, borderRadius: '50%', backgroundColor: '#F0ECFA', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <i className='tabler-chart-line' style={{ fontSize: '1.5rem', color: '#523F99' }} />
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
                <GameRevenueChart chartData={catData} title={selectedStat.title} categories={catCategories} />
              )}
            </Box>
          </Box>
        ) : (
          <MainCart range={range} />
        )}
        <RevenueSummary
          totalRevenue={totalRevenue}
          categories={[
            { label: 'Game Revenue', amount: stats.gameRevenue, color: '#523F99' },
            { label: 'Product Revenue', amount: stats.cardRevenue, color: '#06B6D4' },
            { label: 'Redemption Revenue', amount: stats.redemptionRevenue, color: '#F59E0B' },
            { label: 'Event Revenue', amount: stats.eventRevenue, color: '#EF4444' },
            { label: 'F&B Revenue', amount: stats.fbRevenue, color: '#10B981' },
            { label: 'Bounzing Revenue', amount: stats.trampolineRevenue, color: '#8B5CF6' },
            { label: 'Bowling Revenue', amount: stats.bowlingRevenue, color: '#F97316' },
            { label: 'Ticketing Revenue', amount: stats.ticket, color: '#EC4899' }
          ]}
        />
      </Box>

      {/* Row 3: Category Breakdown + Upcoming Events (shown when card selected) */}
      {selectedStat && categoryHasData && (
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', xl: '2fr 1fr' },
            gap: 3
          }}
        >
          <TopGameChart selectedStat={buildTopStat(selectedStat, catCategories, catData)} />
          <UpcomingEvents />
        </Box>
      )}
      {selectedStat && !categoryHasData && !catLoading && (
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', xl: '2fr 1fr' },
            gap: 3
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
