'use client'

import React, { useMemo } from 'react'
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

  const enriched = useMemo(() => {
    return categories.map((cat, i) => ({
      ...cat,
      color: cat.color || COLORS[i % COLORS.length],
      pct: Math.round((cat.amount / total) * 100)
    }))
  }, [categories, total])

  // Only show non-zero categories in the chart
  const activeSeries = useMemo(() => enriched.filter(c => c.amount > 0), [enriched])
  
  const series = useMemo(() => activeSeries.map(c => c.amount), [activeSeries])

  const donutOptions: ApexOptions = useMemo(() => ({
    chart: {
      fontFamily: 'inherit',
      sparkline: { enabled: true }
    },
    stroke: { width: 2, colors: ['#ffffff'] },
    colors: activeSeries.map(c => c.color),
    labels: activeSeries.map(c => c.label),
    plotOptions: {
      pie: {
        donut: {
          size: '72%',
          labels: { show: false }
        }
      }
    },
    dataLabels: { enabled: false },
    tooltip: {
      enabled: true,
      custom: function({ series, seriesIndex, w }) {
        const val = series[seriesIndex]
        const pct = Math.round((val / total) * 100)
        return `<div style="padding: 6px 10px; font-size: 11px; font-weight: 600; color: #1e293b; background: #fff; border: 1px solid #e2e8f0; border-radius: 6px; box-shadow: 0 4px 12px rgba(15, 23, 42, 0.05);">
          ${w.config.labels[seriesIndex]}: ₹${val.toLocaleString()} (${pct}%)
        </div>`
      }
    },
    states: {
      hover: { filter: { type: 'none' } }
    }
  }), [activeSeries, total])

  return (
    <Box
      sx={{
        borderRadius: '16px',
        background: '#FFFFFF',
        boxShadow: '0 4px 20px -2px rgba(15, 23, 42, 0.04), 0 2px 8px -1px rgba(15, 23, 42, 0.02)',
        border: '1px solid rgba(15, 23, 42, 0.05)',
        p: { xs: 2, sm: 2.5 },
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        minWidth: 0,
        transition: 'box-shadow 0.3s ease',
        '&:hover': {
          boxShadow: '0 10px 25px -3px rgba(15, 23, 42, 0.06), 0 4px 12px -2px rgba(15, 23, 42, 0.03)'
        }
      }}
    >
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.5 }}>
        <Box>
          <Typography sx={{ fontSize: { xs: '0.9375rem', sm: '1rem' }, fontWeight: 800, color: '#0F172A', letterSpacing: '-0.01em', lineHeight: 1.2 }}>
            Revenue Statistic
          </Typography>
          <Typography sx={{ fontSize: { xs: '0.6875rem', sm: '0.75rem' }, color: '#94A3B8', fontWeight: 500, mt: 0.25 }}>
            Category breakdown
          </Typography>
        </Box>
        <Box sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: 32,
          height: 32,
          borderRadius: '50%',
          backgroundColor: '#F8FAFC',
          border: '1px solid rgba(15, 23, 42, 0.04)'
        }}>
          <i className='tabler-chart-donut' style={{ fontSize: '1.125rem', color: '#64748B' }} />
        </Box>
      </Box>

      {/* Donut chart + center label */}
      <Box sx={{ position: 'relative', display: 'flex', justifyContent: 'center', alignItems: 'center', height: 160, my: 1.5 }}>
        {activeSeries.length > 0 ? (
          <AppReactApexCharts type='donut' height={150} width={150} options={donutOptions} series={series} />
        ) : (
          <Box sx={{ width: 120, height: 120, borderRadius: '50%', border: '6px dashed #F1F5F9', display: 'flex', alignItems: 'center', justifyContent: 'center' }} />
        )}
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            textAlign: 'center',
            width: '60%',
            pointerEvents: 'none'
          }}
        >
          <Typography noWrap sx={{ fontSize: { xs: '0.95rem', sm: '1.1rem', md: '1.2rem' }, fontWeight: 800, color: '#0F172A', lineHeight: 1.1, letterSpacing: '-0.02em' }}>
            <AnimatedNumber value={totalRevenue} prefix='₹' />
          </Typography>
          <Typography sx={{ fontSize: '0.5625rem', color: '#94A3B8', fontWeight: 700, mt: 0.25, letterSpacing: '0.5px' }}>
            TOTAL REVENUE
          </Typography>
        </Box>
      </Box>

      {/* Breakdown list with progress bars */}
      <Box 
        sx={{ 
          display: 'flex', 
          flexDirection: 'column', 
          gap: 0.75, 
          mt: 1.5, 
          overflowY: 'auto', 
          maxHeight: { xs: 320, sm: 'none' }, 
          pr: 0.5,
          '&::-webkit-scrollbar': { width: '4px' },
          '&::-webkit-scrollbar-track': { background: 'transparent' },
          '&::-webkit-scrollbar-thumb': { background: 'rgba(15, 23, 42, 0.08)', borderRadius: '4px' },
          '&::-webkit-scrollbar-thumb:hover': { background: 'rgba(15, 23, 42, 0.16)' }
        }}
      >
        {enriched.map((item) => (
          <Box 
            key={item.label}
            sx={{
              p: 0.75,
              borderRadius: '10px',
              border: '1px solid transparent',
              transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
              '&:hover': {
                backgroundColor: '#F8FAFC',
                borderColor: 'rgba(15, 23, 42, 0.03)',
                boxShadow: '0 2px 8px rgba(15, 23, 42, 0.02)',
                '& .progress-bar-line': { height: 5 }
              }
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5, gap: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, minWidth: 0, flex: 1 }}>
                <Box sx={{ 
                  width: 8, 
                  height: 8, 
                  borderRadius: '50%', 
                  backgroundColor: item.color, 
                  flexShrink: 0, 
                  boxShadow: `0 0 0 2px ${item.color}25` 
                }} />
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
                className="progress-bar-line"
                sx={{
                  height: 4,
                  borderRadius: 3,
                  flex: 1,
                  transition: 'height 0.2s ease',
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
