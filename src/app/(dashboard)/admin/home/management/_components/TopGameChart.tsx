'use client'

import { useState, useMemo } from 'react'

import dynamic from 'next/dynamic'

import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Grid from '@mui/material/Grid2'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import CircularProgress from '@mui/material/CircularProgress'
import { useTheme } from '@mui/material/styles'

import type { ApexOptions } from 'apexcharts'

const AppReactApexCharts = dynamic(() => import('@/libs/styles/AppReactApexCharts'))

const COLOR_PALETTE = [
  '#523F99', '#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#06B6D4',
  '#EC4899', '#8B5CF6', '#14B8A6', '#F43F5E', '#10B981', '#6366F1',
  '#A855F7', '#0EA5E9', '#84CC16', '#EAB308', '#F97316', '#64748B'
]

const TopGameChart = ({
  title,
  data = [],
  loading = false,
  topLimit = 5,
  setTopLimit
}: {
  title: string
  data?: { label: string; val: number }[]
  loading?: boolean
  topLimit: number
  setTopLimit: (val: number) => void
}) => {
  const [customValue, setCustomValue] = useState<string>('')
  const theme = useTheme()

  const getTypeName = (title: string) => {
    const t = (title || '').toLowerCase()

    if (t.includes('game')) return 'games'
    if (t.includes('product')) return 'products'
    if (t.includes('redemption')) return 'redemption items'
    if (t.includes('event')) return 'events'
    if (t.includes('f&b') || t.includes('food')) return 'F&B items'
    if (t.includes('bounzing') || t.includes('trampoline')) return 'bounzing items'
    if (t.includes('bowling')) return 'bowling items'
    if (t.includes('ticketing') || t.includes('ticket')) return 'tickets'

    return 'categories'
  }

  // Sort and slice data to the user-selected topLimit
  const topItems = useMemo(() => {
    if (!data || data.length === 0) return []

    // Slice to limit
    const sliced = data.slice(0, topLimit)
    const topTotal = sliced.reduce((s, t) => s + t.val, 0) || 1

    return sliced
      .map((t, idx) => ({
        title: t.label,
        value: Math.round((t.val / topTotal) * 100),
        color: COLOR_PALETTE[idx % COLOR_PALETTE.length]
      }))
      .filter(item => item.value > 0)
  }, [data, topLimit])

  const labels = topItems.map(item => item.title)
  const percentages = topItems.map(item => item.value)
  const series = [{ data: percentages }]

  const half = Math.ceil(topItems.length / 2)
  const data1 = topItems.slice(0, half)
  const data2 = topItems.slice(half)

  const chartHeight = Math.max(180, topItems.length * 50)

  const options: ApexOptions = {
    chart: {
      parentHeightOffset: 0,
      toolbar: { show: false },
      fontFamily: 'inherit'
    },
    plotOptions: {
      bar: {
        horizontal: true,
        barHeight: '60%',
        distributed: true,
        borderRadius: 6,
        borderRadiusApplication: 'end'
      }
    },
    colors: COLOR_PALETTE,
    grid: {
      strokeDashArray: 6,
      borderColor: 'rgba(0,0,0,0.05)',
      xaxis: { lines: { show: true } },
      yaxis: { lines: { show: false } },
      padding: { top: -25, left: 21, right: 25, bottom: 0 }
    },
    dataLabels: {
      enabled: true,
      offsetY: 8,
      style: {
        colors: ['#fff'],
        fontWeight: 600,
        fontSize: '0.75rem'
      },
      formatter(val: string, opt: any) {
        return labels[opt.dataPointIndex]
      }
    },
    tooltip: {
      enabled: true,
      style: { fontSize: '0.75rem' },
      onDatasetHover: { highlightDataSeries: false }
    },
    legend: { show: false },
    states: {
      hover: { filter: { type: 'none' } },
      active: { filter: { type: 'none' } }
    },
    xaxis: {
      axisTicks: { show: false },
      axisBorder: { show: false },
      categories: labels,
      labels: {
        formatter: val => `${val}%`,
        style: { fontSize: '0.75rem', colors: '#94A3B8', fontWeight: 500 }
      }
    },
    yaxis: {
      labels: {
        align: theme.direction === 'rtl' ? 'right' : 'left',
        style: { fontWeight: 600, fontSize: '0.75rem', colors: '#94A3B8' },
        offsetX: theme.direction === 'rtl' ? -15 : -30
      }
    }
  }

  return (
    <Box
      sx={{
        borderRadius: '16px',
        background: '#FFFFFF',
        boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
        overflow: 'hidden',
        height: '100%'
      }}
    >
      <Box sx={{ px: 3, pt: 2.5, pb: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 1.5, flexWrap: 'wrap' }}>
        <Box sx={{ minWidth: 0 }}>
          <Typography sx={{ fontSize: '1rem', fontWeight: 700, color: '#1E293B' }}>
            {`Top ${topLimit} ${title || 'Categories'}`}
          </Typography>
          <Typography sx={{ fontSize: '0.8125rem', color: '#94A3B8', fontWeight: 500 }}>
            {`Top ${topLimit} ${getTypeName(title)} by share`}
          </Typography>
        </Box>
        <Box
          sx={{
            px: 1.25,
            py: 0.5,
            borderRadius: '999px',
            backgroundColor: '#523F9912',
            color: '#523F99',
            fontSize: '0.6875rem',
            fontWeight: 700,
            letterSpacing: '0.4px',
            textTransform: 'uppercase'
          }}
        >
          {`Top ${topLimit}`}
        </Box>
      </Box>

      {/* Select Limit Buttons & Custom Entry Textbox */}
      <Box sx={{ px: 3, py: 1.5, display: 'flex', alignItems: 'center', gap: 1.5, flexWrap: 'wrap', borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
        <Typography sx={{ fontSize: '0.8125rem', fontWeight: 600, color: '#64748B' }}>
          Select Top:
        </Typography>
        {[5, 10, 15].map(limit => {
          const active = topLimit === limit

          return (
            <Button
              key={limit}
              variant={active ? 'contained' : 'outlined'}
              onClick={() => {
                setTopLimit(limit)
                setCustomValue('')
              }}
              size='small'
              sx={{
                minWidth: 40,
                height: 28,
                borderRadius: '8px',
                textTransform: 'none',
                fontWeight: 600,
                fontSize: '0.8125rem',
                backgroundColor: active ? '#523F99' : 'transparent',
                borderColor: '#523F99',
                color: active ? '#FFF' : '#523F99',
                boxShadow: 'none',
                '&:hover': {
                  backgroundColor: active ? '#6B52C4' : 'rgba(82, 63, 153, 0.04)',
                  borderColor: '#6B52C4',
                  boxShadow: 'none'
                }
              }}
            >
              {limit}
            </Button>
          )
        })}

        {/* Custom Input */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, ml: { xs: 0, sm: 'auto' } }}>
          <TextField
            size='small'
            placeholder='Custom...'
            value={customValue}
            onChange={e => {
              const val = e.target.value

              if (/^\d*$/.test(val)) {
                setCustomValue(val)

                if (val === '') {
                  setTopLimit(5)
                } else {
                  const num = parseInt(val)

                  if (num > 0) {
                    setTopLimit(num)
                  }
                }
              }
            }}
            slotProps={{
              htmlInput: {
                style: {
                  padding: '4px 8px',
                  fontSize: '0.8125rem',
                  fontWeight: 600,
                  width: 80
                }
              }
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: '8px',
                height: 28,
                '& fieldset': { borderColor: 'rgba(0,0,0,0.15)' },
                '&:hover fieldset': { borderColor: '#523F99' },
                '&.Mui-focused fieldset': { borderColor: '#523F99' }
              }
            }}
          />
        </Box>
      </Box>

      <Box sx={{ px: 1.5, py: 2 }}>
        {loading ? (
          <Box sx={{ height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <CircularProgress size={32} sx={{ color: '#523F99' }} />
          </Box>
        ) : topItems.length === 0 ? (
          <Box sx={{ height: 300, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
            <i className='tabler-chart-line text-[2.5rem] text-[#94A3B8]' />
            <Typography sx={{ fontSize: '0.875rem', color: '#94A3B8' }}>No data available for this range</Typography>
          </Box>
        ) : (
          <Grid container spacing={4}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <AppReactApexCharts key={`${topLimit}-${labels.join(',')}`} type='bar' height={chartHeight} width='100%' series={series} options={options} />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }} alignSelf='center'>
              <Box sx={{ display: { xs: 'none', sm: 'flex' }, justifyContent: 'space-around', px: 2 }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                  {data1.map((item, i) => (
                    <Box key={i} sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <i className='tabler-circle-filled text-[10px]' style={{ color: item.color }} />
                      <Box>
                        <Typography sx={{ fontSize: '0.8125rem', color: '#64748B', fontWeight: 500 }}>{item.title}</Typography>
                        <Typography sx={{ fontSize: '1rem', fontWeight: 700, color: '#1E293B' }}>{`${item.value}%`}</Typography>
                      </Box>
                    </Box>
                  ))}
                </Box>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                  {data2.map((item, i) => (
                    <Box key={i} sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <i className='tabler-circle-filled text-[10px]' style={{ color: item.color }} />
                      <Box>
                        <Typography sx={{ fontSize: '0.8125rem', color: '#64748B', fontWeight: 500 }}>{item.title}</Typography>
                        <Typography sx={{ fontSize: '1rem', fontWeight: 700, color: '#1E293B' }}>{`${item.value}%`}</Typography>
                      </Box>
                    </Box>
                  ))}
                </Box>
              </Box>
            </Grid>
          </Grid>
        )}
      </Box>
    </Box>
  )
}

export default TopGameChart
