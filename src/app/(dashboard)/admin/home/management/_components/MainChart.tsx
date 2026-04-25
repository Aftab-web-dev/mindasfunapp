'use client'
import React, { useEffect, useMemo, useState } from 'react'

import dynamic from 'next/dynamic'

import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import CircularProgress from '@mui/material/CircularProgress'
import useMediaQuery from '@mui/material/useMediaQuery'
import { useTheme } from '@mui/material/styles'

import type { ApexOptions } from 'apexcharts'

import { RANGES, formatTimeLabel, detectAllHours } from './ranges'
import type { RangeKey } from './ranges'
import { managementDashboardApi } from '@/api/management-dashboard'

const AppReactApexCharts = dynamic(() => import('@/libs/styles/AppReactApexCharts'))

const formatValue = (val: number, short: boolean) => {
  if (!short) return `₹${val.toLocaleString()}`
  if (val >= 100000) return `₹${(val / 100000).toFixed(1)}L`
  if (val >= 1000) return `₹${(val / 1000).toFixed(0)}K`

  return `₹${val}`
}

const MainCart = ({ range }: { range: RangeKey }) => {
  const [showTable, setShowTable] = useState(false)
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))

  const [loading, setLoading] = useState(true)
  const [categories, setCategories] = useState<string[]>([])
  const [series, setSeries] = useState<{ name: string; data: number[] }[]>([])

  useEffect(() => {
    setLoading(true)
    const { day } = RANGES[range]

    managementDashboardApi.mainGraph({ day }).then(res => {
      const raw = res.data?.data

      if (!Array.isArray(raw) || raw.length === 0) {
        setCategories([])
        setSeries([])

        return
      }

      const allHours = detectAllHours(raw)

      setCategories(raw.map((r: any) => formatTimeLabel(r.time ?? r.hour ?? r.label, allHours)))
      setSeries([
        { name: 'Game Revenue', data: raw.map((r: any) => Number(r.gameRevenue ?? 0)) },
        { name: 'Product Revenue', data: raw.map((r: any) => Number(r.cardRevenue ?? r.productRevenue ?? 0)) },
        { name: 'Redemption Revenue', data: raw.map((r: any) => Number(r.redemptionRevenue ?? 0)) }
      ])
    }).catch(() => {
      setCategories([])
      setSeries([])
    }).finally(() => setLoading(false))
  }, [range])

  const lineOptions: ApexOptions = useMemo(() => ({
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
        labels: { formatter: (val: number) => formatValue(val, isMobile) }
      }
    ],
    xaxis: {
      axisBorder: { show: false },
      axisTicks: { show: false },
      labels: {
        style: { colors: '#94A3B8', fontSize: isMobile ? '8px' : '11px', fontWeight: 500 },
        rotate: isMobile ? -45 : 0,
        hideOverlappingLabels: true
      },
      categories
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
  }), [categories, isMobile])

  const hasData = series.some(s => s.data.some(v => v > 0))

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
          <Typography sx={{ fontSize: '0.8125rem', color: '#94A3B8', fontWeight: 500 }}>
            {RANGES[range].label}
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

      {/* Chart / Table / Empty state */}
      <Box sx={{ px: { xs: 1, sm: 1.5 }, pb: 1.5, minHeight: 340 }}>
        {loading ? (
          <Box sx={{ height: 340, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <CircularProgress size={28} sx={{ color: '#523F99' }} />
          </Box>
        ) : !hasData || categories.length === 0 ? (
          <Box sx={{ height: 340, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
            <Box sx={{ width: 56, height: 56, borderRadius: '50%', backgroundColor: '#F0ECFA', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <i className='tabler-chart-line' style={{ fontSize: '1.5rem', color: '#523F99' }} />
            </Box>
            <Typography sx={{ fontSize: '0.9375rem', fontWeight: 600, color: '#1E293B' }}>No revenue data</Typography>
            <Typography sx={{ fontSize: '0.8125rem', color: '#94A3B8' }}>No transactions in this period.</Typography>
          </Box>
        ) : !showTable ? (
          <AppReactApexCharts type='line' width='100%' height={340} options={lineOptions} series={series} />
        ) : (
          <Box sx={{ overflowX: 'auto', px: 1.5, pb: 1 }}>
            <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: '0 2px', minWidth: 600 }}>
              <thead>
                <tr>
                  <th style={{ padding: '10px 14px', textAlign: 'left', fontSize: '0.75rem', fontWeight: 600, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Time</th>
                  {series.map(s => (
                    <th key={s.name} style={{ padding: '10px 14px', textAlign: 'right', fontSize: '0.75rem', fontWeight: 600, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                      {s.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {categories.map((cat, idx) => (
                  <tr key={cat + idx} style={{ backgroundColor: idx % 2 === 0 ? '#FAFAFA' : 'transparent' }}>
                    <td style={{ padding: '8px 14px', borderRadius: '6px 0 0 6px', fontSize: '0.8125rem', fontWeight: 500, color: '#64748B' }}>{cat}</td>
                    {series.map(s => (
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
