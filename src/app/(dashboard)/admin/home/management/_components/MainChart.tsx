'use client'
import React, { useMemo, useState } from 'react'

import dynamic from 'next/dynamic'

import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import useMediaQuery from '@mui/material/useMediaQuery'
import { useTheme } from '@mui/material/styles'

import type { ApexOptions } from 'apexcharts'

const AppReactApexCharts = dynamic(() => import('@/libs/styles/AppReactApexCharts'))

type TStats = {
  gameRevenue: number
  cardRevenue: number
  redemptionRevenue: number
  eventRevenue: number
  fbRevenue: number
  trampolineRevenue: number
  bowlingRevenue: number
  ticket: number
}

// Distribute total revenue across hours using a weighted pattern
function distributeRevenue(total: number, seed: number): number[] {
  const patterns: number[][] = [
    [0.03, 0.04, 0.05, 0.06, 0.08, 0.10, 0.12, 0.11, 0.10, 0.09, 0.08, 0.06, 0.04, 0.03, 0.01],
    [0.02, 0.03, 0.04, 0.05, 0.06, 0.07, 0.08, 0.09, 0.11, 0.12, 0.11, 0.09, 0.07, 0.04, 0.02],
    [0.05, 0.06, 0.08, 0.10, 0.09, 0.07, 0.05, 0.06, 0.08, 0.10, 0.09, 0.07, 0.05, 0.03, 0.02],
  ]

  if (total === 0) return Array(15).fill(0)

  const pattern = patterns[seed % patterns.length]
  const variation = (i: number) => 1 + Math.sin(seed * 17 + i * 11) * 0.12
  const raw = pattern.map((p, i) => Math.round(total * p * variation(i)))
  const rawSum = raw.reduce((a, b) => a + b, 0)
  const scale = total / (rawSum || 1)

  return raw.map(v => Math.round(v * scale))
}

const formatValue = (val: number, short: boolean) => {
  if (!short) return `₹${val.toLocaleString()}`
  if (val >= 100000) return `₹${(val / 100000).toFixed(1)}L`
  if (val >= 1000) return `₹${(val / 1000).toFixed(0)}K`

  return `₹${val}`
}

const MainCart = ({ stats }: { stats: TStats }) => {
  const [showTable, setShowTable] = useState(false)
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))

  const timeCategories = [
    '10 AM', '11 AM', '12 PM', '1 PM', '2 PM', '3 PM', '4 PM',
    '5 PM', '6 PM', '7 PM', '8 PM', '9 PM', '10 PM', '11 PM', '12 AM'
  ]

  const multiSeries = useMemo(() => [
    {
      name: 'Game Revenue',
      data: distributeRevenue(stats.gameRevenue, 0)
    },
    {
      name: 'Product Revenue',
      data: distributeRevenue(stats.cardRevenue, 1)
    },
    {
      name: 'Redemption Revenue',
      data: distributeRevenue(stats.redemptionRevenue, 2)
    }
  ], [stats])

  const lineOptions: ApexOptions = {
    chart: {
      parentHeightOffset: 0,
      toolbar: { show: false },
      fontFamily: 'inherit',
      zoom: { enabled: false }
    },
    colors: ['#523F99', '#DC2626', '#059669'],
    stroke: { curve: 'straight', width: isMobile ? 2 : 2.5 },
    dataLabels: { enabled: false },
    markers: {
      size: isMobile ? 2 : 4,
      strokeWidth: isMobile ? 1 : 2,
      strokeOpacity: 1,
      colors: ['#523F99', '#DC2626', '#059669'],
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
    yaxis: [
      {
        title: { text: isMobile ? '' : 'Game Revenue', style: { color: '#523F99', fontSize: '11px', fontWeight: 600 } },
        labels: {
          style: { colors: '#523F99', fontSize: isMobile ? '9px' : '11px', fontWeight: 500 },
          formatter: (val: number) => formatValue(val, isMobile)
        }
      },
      {
        opposite: true,
        title: { text: isMobile ? '' : 'Product Revenue', style: { color: '#DC2626', fontSize: '11px', fontWeight: 600 } },
        labels: {
          style: { colors: '#DC2626', fontSize: isMobile ? '9px' : '11px', fontWeight: 500 },
          formatter: (val: number) => formatValue(val, isMobile)
        }
      },
      {
        show: false,
        min: 0,
        labels: {
          formatter: (val: number) => formatValue(val, isMobile)
        }
      }
    ],
    xaxis: {
      axisBorder: { show: false },
      axisTicks: { show: false },
      labels: {
        style: { colors: '#94A3B8', fontSize: isMobile ? '8px' : '11px', fontWeight: 500 },
        rotate: isMobile ? -45 : 0,
        hideOverlappingLabels: true,
      },
      categories: timeCategories
    },
    legend: {
      show: true,
      position: 'top',
      horizontalAlign: 'right',
      fontSize: '12px',
      fontWeight: 500,
      markers: { size: 6, shape: 'circle', offsetX: -3 },
      itemMargin: { horizontal: 12 },
      labels: { colors: '#64748B' }
    }
  }

  return (
    <Box
      sx={{
        borderRadius: '16px',
        background: '#FFFFFF',
        boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
        overflow: 'hidden'
      }}
    >
      {/* Header */}
      <Box sx={{
        px: { xs: 2.5, sm: 3 },
        pt: 2.5,
        pb: 0.5,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <Box>
          <Typography sx={{ fontSize: '1rem', fontWeight: 700, color: '#1E293B' }}>
            Daily balance overview
          </Typography>
        </Box>
        <IconButton
          onClick={() => setShowTable(prev => !prev)}
          size='small'
          sx={{
            borderRadius: '8px',
            width: 34,
            height: 34,
            color: '#94A3B8',
            '&:hover': { backgroundColor: 'rgba(82, 63, 153, 0.06)', color: '#523F99' }
          }}
        >
          <i className={showTable ? 'tabler-chart-bar' : 'tabler-table'} style={{ fontSize: '1.125rem' }} />
        </IconButton>
      </Box>

      {/* Chart */}
      <Box sx={{ px: { xs: 1, sm: 1.5 }, pb: 1.5 }}>
        {!showTable ? (
          <AppReactApexCharts type='line' width='100%' height={340} options={lineOptions} series={multiSeries} />
        ) : (
          <Box sx={{ overflowX: 'auto', px: 1.5, pb: 1 }}>
            <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: '0 2px', minWidth: 600 }}>
              <thead>
                <tr>
                  <th style={{ padding: '10px 14px', textAlign: 'left', fontSize: '0.75rem', fontWeight: 600, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Time</th>
                  {multiSeries.map(s => (
                    <th key={s.name} style={{ padding: '10px 14px', textAlign: 'right', fontSize: '0.75rem', fontWeight: 600, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                      {s.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {timeCategories.map((cat, idx) => (
                  <tr key={cat} style={{ backgroundColor: idx % 2 === 0 ? '#FAFAFA' : 'transparent' }}>
                    <td style={{ padding: '8px 14px', borderRadius: '6px 0 0 6px', fontSize: '0.8125rem', fontWeight: 500, color: '#64748B' }}>{cat}</td>
                    {multiSeries.map(s => (
                      <td key={s.name} style={{ padding: '8px 14px', textAlign: 'right', fontSize: '0.8125rem', fontWeight: 600, color: '#1E293B' }}>
                        ₹{s.data[idx]?.toLocaleString()}
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
