'use client'

import dynamic from 'next/dynamic'

import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import LinearProgress, { linearProgressClasses } from '@mui/material/LinearProgress'

import type { ApexOptions } from 'apexcharts'

import AnimatedNumber from './AnimatedNumber'

const AppReactApexCharts = dynamic(() => import('@/libs/styles/AppReactApexCharts'))

type RevenueItem = {
  label: string
  amount: number
  color: string
}

type Props = {
  totalRevenue: number
  categories: RevenueItem[]
}

const COLORS = [
  '#523F99', '#06B6D4', '#F59E0B', '#EF4444',
  '#10B981', '#8B5CF6', '#F97316', '#EC4899'
]

const RevenueSummary = ({ totalRevenue, categories }: Props) => {
  const total = totalRevenue || 1

  const enriched = categories.map((cat, i) => ({
    ...cat,
    color: cat.color || COLORS[i % COLORS.length],
    pct: Math.round((cat.amount / total) * 100)
  }))

  const options: ApexOptions = {
    chart: {
      fontFamily: 'inherit',
      sparkline: { enabled: true }
    },
    plotOptions: {
      radialBar: {
        startAngle: -90,
        endAngle: 90,
        hollow: {
          size: '42%',
          margin: 0
        },
        track: {
          background: '#F1F5F9',
          strokeWidth: '100%',
          margin: 4
        },
        dataLabels: {
          name: { show: false },
          value: { show: false }
        }
      }
    },
    colors: enriched.map(c => c.color),
    stroke: { lineCap: 'round' }
  }

  // Only show non-zero categories in the radial chart
  const activeSeries = enriched.filter(c => c.amount > 0)
  const series = activeSeries.map(c => c.pct)

  const radialOptions: ApexOptions = {
    ...options,
    colors: activeSeries.map(c => c.color)
  }

  return (
    <Box
      sx={{
        borderRadius: '16px',
        background: '#FFFFFF',
        boxShadow: '0 1px 4px rgba(15, 23, 42, 0.04)',
        border: '1px solid rgba(15, 23, 42, 0.04)',
        p: { xs: 2, sm: 2.5 },
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        minWidth: 0
      }}
    >
      <Typography sx={{ fontSize: { xs: '0.9375rem', sm: '1rem' }, fontWeight: 700, color: '#0F172A', mb: 0.25 }}>
        Revenue Statistic
      </Typography>
      <Typography sx={{ fontSize: { xs: '0.6875rem', sm: '0.75rem' }, color: '#94A3B8', fontWeight: 500, mb: 1 }}>
        Category breakdown
      </Typography>

      {/* Radial chart + center label */}
      <Box sx={{ position: 'relative', display: 'flex', justifyContent: 'center', overflow: 'hidden', height: { xs: 110, sm: 130 }, mb: 1 }}>
        <Box sx={{ mt: -2 }}>
          <AppReactApexCharts type='radialBar' height={200} width={200} options={radialOptions} series={series} />
        </Box>
        <Box
          sx={{
            position: 'absolute',
            top: '45%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            textAlign: 'center',
            width: '70%'
          }}
        >
          <Typography noWrap sx={{ fontSize: { xs: '1rem', sm: '1.125rem', md: '1.25rem' }, fontWeight: 800, color: '#0F172A', lineHeight: 1.1, letterSpacing: '-0.02em' }}>
            <AnimatedNumber value={totalRevenue} prefix='₹' />
          </Typography>
          <Typography sx={{ fontSize: '0.5625rem', color: '#94A3B8', fontWeight: 700, mt: 0.25, letterSpacing: '0.5px' }}>
            TOTAL REVENUE
          </Typography>
        </Box>
      </Box>

      {/* Breakdown list with progress bars */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: { xs: 1.25, sm: 1.5 }, mt: 1, overflowY: 'auto', maxHeight: { xs: 320, sm: 'none' }, pr: 0.5 }}>
        {enriched.map((item) => (
          <Box key={item.label}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5, gap: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, minWidth: 0, flex: 1 }}>
                <Box sx={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: item.color, flexShrink: 0, boxShadow: `0 0 0 2px ${item.color}25` }} />
                <Typography noWrap sx={{ fontSize: { xs: '0.6875rem', sm: '0.75rem' }, fontWeight: 600, color: '#475569' }}>
                  {item.label}
                </Typography>
              </Box>
              <Typography sx={{ fontSize: { xs: '0.6875rem', sm: '0.75rem' }, fontWeight: 700, color: '#0F172A', flexShrink: 0 }}>
                <AnimatedNumber value={item.amount} prefix='₹' />
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <LinearProgress
                variant='determinate'
                value={item.pct}
                sx={{
                  height: 5,
                  borderRadius: 3,
                  flex: 1,
                  [`&.${linearProgressClasses.colorPrimary}`]: {
                    backgroundColor: '#F1F5F9'
                  },
                  [`& .${linearProgressClasses.bar}`]: {
                    borderRadius: 3,
                    backgroundColor: item.color,
                    transition: 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)'
                  }
                }}
              />
              <Typography sx={{ fontSize: '0.625rem', color: '#94A3B8', fontWeight: 600, minWidth: 28, textAlign: 'right' }}>
                {item.pct}%
              </Typography>
            </Box>
          </Box>
        ))}
      </Box>
    </Box>
  )
}

export default RevenueSummary
