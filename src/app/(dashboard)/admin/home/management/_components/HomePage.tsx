'use client'
import React, { useMemo, useState } from 'react'

import { Box, Button, Typography } from '@mui/material'

import ReactApexcharts from '@/@core/components/react-apexcharts'
import StatsCard from './StatsCard'
import GameRevenueChart from './GameRevenueChart'
import TopGameChart from './TopGameChart'
import UpcomingEvents from './UpcomingEvents'
import MainCart from './MainChart'
import RevenueSummary from './RevenueSummary'

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

// Generate realistic hourly revenue distribution from a total amount
// Each category gets a unique pattern based on its seed index
function generateHourlyData(totalRevenue: number, seed: number): number[] {
  const hours = 15 // 10 AM to 12 AM

  if (totalRevenue === 0) {
    return Array(hours).fill(0)
  }

  // Different distribution patterns per seed
  const patterns: number[][] = [
    [0.03, 0.04, 0.05, 0.06, 0.08, 0.10, 0.12, 0.11, 0.10, 0.09, 0.08, 0.06, 0.04, 0.03, 0.01], // morning ramp
    [0.02, 0.03, 0.04, 0.05, 0.06, 0.07, 0.08, 0.09, 0.11, 0.12, 0.11, 0.09, 0.07, 0.04, 0.02], // evening peak
    [0.05, 0.06, 0.08, 0.10, 0.09, 0.07, 0.05, 0.06, 0.08, 0.10, 0.09, 0.07, 0.05, 0.03, 0.02], // double peak
    [0.04, 0.05, 0.06, 0.07, 0.07, 0.08, 0.08, 0.08, 0.08, 0.08, 0.08, 0.07, 0.07, 0.05, 0.04], // steady
    [0.02, 0.03, 0.04, 0.06, 0.08, 0.10, 0.11, 0.12, 0.11, 0.10, 0.08, 0.06, 0.04, 0.03, 0.02], // bell curve
    [0.08, 0.09, 0.10, 0.09, 0.08, 0.06, 0.05, 0.05, 0.06, 0.07, 0.08, 0.07, 0.05, 0.04, 0.03], // morning heavy
    [0.03, 0.04, 0.05, 0.05, 0.06, 0.07, 0.07, 0.08, 0.09, 0.10, 0.11, 0.10, 0.07, 0.05, 0.03], // late evening
    [0.06, 0.07, 0.08, 0.07, 0.06, 0.05, 0.04, 0.05, 0.07, 0.09, 0.11, 0.10, 0.07, 0.05, 0.03], // bimodal
  ]

  const pattern = patterns[seed % patterns.length]

  // Add slight randomness based on seed so same revenue amount still looks different per category
  const variation = (i: number) => {
    const v = Math.sin(seed * 13 + i * 7) * 0.15

    return 1 + v
  }

  const raw = pattern.map((p, i) => Math.round(totalRevenue * p * variation(i)))

  // Adjust so sum roughly matches total
  const rawSum = raw.reduce((a, b) => a + b, 0)
  const scale = totalRevenue / (rawSum || 1)

  return raw.map(v => Math.round(v * scale))
}

const HomePage = ({ stats }: { stats: TStats }) => {
  const statsCardArray = useMemo(() => {
    const categories = [
      { title: 'Game Revenue', revenue: stats.gameRevenue, icon: 'tabler-coin-rupee' },
      { title: 'Product Revenue', revenue: stats.cardRevenue, icon: 'tabler-cash' },
      { title: 'Redemption Revenue', revenue: stats.redemptionRevenue, icon: 'tabler-coin-rupee' },
      { title: 'Event Revenue', revenue: stats.eventRevenue, icon: 'tabler-calendar-event' },
      { title: 'F&B Revenue', revenue: stats.fbRevenue, icon: 'tabler-coffee' },
      { title: 'Bounzing Revenue', revenue: stats.trampolineRevenue, icon: 'tabler-confetti' },
      { title: 'Bowling Revenue', revenue: stats.bowlingRevenue, icon: 'tabler-ball-bowling' },
      { title: 'Ticketing Revenue', revenue: stats.ticket, icon: 'tabler-cash' },
    ]

    return categories.map((cat, i) => {
      const hourlyData = generateHourlyData(cat.revenue, i)

      // Top 6 time slots by revenue for the breakdown chart
      const timeLabels = [
        '10 AM', '11 AM', '12 PM', '1 PM', '2 PM', '3 PM', '4 PM',
        '5 PM', '6 PM', '7 PM', '8 PM', '9 PM', '10 PM', '11 PM', '12 AM'
      ]

      const indexed = hourlyData.map((val, idx) => ({ val, label: timeLabels[idx] }))
      const top6 = [...indexed].sort((a, b) => b.val - a.val).slice(0, 6)
      const topTotal = top6.reduce((s, t) => s + t.val, 0) || 1

      const colors1 = ['text-primary', 'text-info', 'text-success']
      const colors2 = ['text-secondary', 'text-error', 'text-warning']

      return {
        title: cat.title,
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
        revenue: `₹${cat.revenue.toLocaleString()}`,
        icon: cat.icon,
        chartData: hourlyData
      }
    })
  }, [stats])

  const [selectedStat, setSelectedStat] = useState<any | null>(null)
  const [selectedButton, setSelectedButton] = useState<string>('total')

  const totalRevenue =
    stats.gameRevenue + stats.cardRevenue + stats.redemptionRevenue +
    stats.eventRevenue + stats.fbRevenue + stats.trampolineRevenue +
    stats.bowlingRevenue + stats.ticket

  const timeCategories = [
    '10 AM', '11 AM', '12 PM', '1 PM', '2 PM', '3 PM', '4 PM',
    '5 PM', '6 PM', '7 PM', '8 PM', '9 PM', '10 PM', '11 PM', '12 AM'
  ]

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
      categories: timeCategories,
      labels: {
        style: { colors: '#94A3B8', fontSize: '11px' },
        formatter: value => {
          if (typeof window !== 'undefined' && window.innerWidth <= 768) {
            return ['10 AM', '1 PM', '4 PM', '7 PM', '10 PM', '12 AM'].includes(value) ? value : ''
          }

          return value
        }
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
    tooltip: {
      y: { formatter: (val: number) => `₹${val.toLocaleString()}` }
    }
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>

      {/* Row 1: Revenue Category Cards */}
      <Box>
        <Typography sx={{ fontSize: '1rem', fontWeight: 700, color: '#1E293B', mb: 2 }}>
          Revenue Categories
        </Typography>
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

      {/* Row 2: Daily Balance Overview + Revenue Statistic */}
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
                  {selectedStat.title} — Hourly trend
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
                {selectedButton === 'total' ? 'Daily Revenue' : 'Category View'}
              </Button>
            </Box>
            <Box sx={{ px: { xs: 1, sm: 1.5 }, pb: 1.5 }}>
              {selectedButton === 'total' ? (
                <ReactApexcharts
                  type='area'
                  height={340}
                  width='100%'
                  options={options}
                  series={[{ name: selectedStat.title, data: selectedStat.chartData }]}
                />
              ) : (
                <GameRevenueChart chartData={selectedStat.chartData} title={selectedStat.title} />
              )}
            </Box>
          </Box>
        ) : (
          <MainCart stats={stats} />
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
            { label: 'Ticketing Revenue', amount: stats.ticket, color: '#EC4899' },
          ]}
        />
      </Box>

      {/* Row 3: Category Breakdown + Upcoming Events (shown when card selected) */}
      {selectedStat && (
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', xl: '2fr 1fr' },
            gap: 3
          }}
        >
          <TopGameChart selectedStat={selectedStat} />
          <UpcomingEvents />
        </Box>
      )}
    </Box>
  )
}

export default HomePage
