'use client'

import dynamic from 'next/dynamic'
import { useState, useMemo, useEffect } from 'react'

import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Grid from '@mui/material/Grid2'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import CircularProgress from '@mui/material/CircularProgress'
import { useTheme } from '@mui/material/styles'

import classnames from 'classnames'
import type { ApexOptions } from 'apexcharts'

import { managementDashboardApi } from '@/api/management-dashboard'
import { getUser } from '@/utils/authStorage'

const AppReactApexCharts = dynamic(() => import('@/libs/styles/AppReactApexCharts'))

type DataType = {
  title: string
  value: number
  color?: string
  colorClass?: string
}

const COLOR_PALETTE = [
  '#523F99', '#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#06B6D4',
  '#EC4899', '#8B5CF6', '#14B8A6', '#F43F5E', '#10B981', '#6366F1',
  '#A855F7', '#0EA5E9', '#84CC16', '#EAB308', '#F97316', '#64748B'
]

const TopGameChart = ({
  selectedStat,
  catCategories = [],
  catData = [],
  from = '',
  to = '',
  gamesList = []
}: {
  selectedStat: {
    title: string
    datas: any[]
    data1: DataType[]
    data2: DataType[]
    revenue: string
    icon: string
    chartData: number[]
  }
  catCategories?: string[]
  catData?: number[]
  from?: string
  to?: string
  gamesList?: { id: string | number; name: string }[]
}) => {
  const [topLimit, setTopLimit] = useState<number>(5)
  const [customValue, setCustomValue] = useState<string>('')
  const [apiData, setApiData] = useState<{ label: string; val: number }[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const theme = useTheme()

  // Fetch actual top games by revenue when on Game Revenue selection
  useEffect(() => {
    if (selectedStat.title !== 'Game Revenue' || !from || !to) {
      setApiData([])
      return
    }

    setLoading(true)
    const user = getUser()
    const branchId = user?.branchId ?? 1030

    managementDashboardApi.topGameRevenue({
      from,
      to,
      branchId,
      topOff: topLimit
    })
    .then(res => {
      const data = res.data?.data ?? res.data
      if (Array.isArray(data)) {
        // Filter out null/empty game items and ID 0 items
        const filtered = data.filter((item: any) => item.game !== null && item.game !== undefined && item.game !== '' && item.id !== 0 && item.id !== '0')
        setApiData(filtered.map((item: any) => {
          // Look up in gamesList if game/gameName is null
          let label = item.gameName ?? item.game ?? item.name ?? item.text ?? '';
          if (!label && gamesList && gamesList.length > 0) {
            const matched = gamesList.find(g => String(g.id) === String(item.id))
            if (matched) {
              label = matched.name
            }
          }
          if (!label) {
            label = `Game #${item.id}`
          }
          const val = Number(item.revenue ?? item.amount ?? item.value ?? 0);
          return { label, val };
        }))
      } else {
        setApiData([])
      }
    })
    .catch(err => {
      console.error('Error fetching TopGameRevenue:', err)
      setApiData([])
    })
    .finally(() => {
      setLoading(false)
    })
  }, [selectedStat.title, from, to, gamesList, topLimit])

  // Select whether to use API fetched top games or fallback to time-series category breakdown
  const isGameRevenue = selectedStat.title === 'Game Revenue'
  const activeCategories = isGameRevenue 
    ? apiData.map(item => item.label)
    : (catCategories.length > 0 ? catCategories : selectedStat.datas)
    
  const activeData = isGameRevenue
    ? apiData.map(item => item.val)
    : (catData.length > 0 ? catData : selectedStat.chartData)

  // Sort and slice data to the user-selected topLimit
  const topItems = useMemo(() => {
    if (!activeCategories || !activeData || activeCategories.length === 0) return []
    
    const indexed = activeData.map((val, idx) => ({ val, label: activeCategories[idx] ?? '' }))
    // Sort descending
    const sorted = [...indexed].sort((a, b) => b.val - a.val)
    
    // Slice to limit
    const sliced = sorted.slice(0, topLimit)
    const topTotal = sliced.reduce((s, t) => s + t.val, 0) || 1
    
    return sliced.map((t, idx) => ({
      title: t.label,
      value: Math.round((t.val / topTotal) * 100),
      color: COLOR_PALETTE[idx % COLOR_PALETTE.length]
    }))
  }, [activeCategories, activeData, topLimit])

  const labels = topItems.map(item => item.title)
  const percentages = topItems.map(item => item.value)
  const series = [{ data: percentages }]
  const topCount = topItems.length

  const half = Math.ceil(topItems.length / 2)
  const data1 = topItems.slice(0, half)
  const data2 = topItems.slice(half)

  const chartHeight = Math.max(300, topItems.length * 40)

  const options: ApexOptions = {
    chart: {
      parentHeightOffset: 0,
      toolbar: { show: false },
      fontFamily: 'inherit'
    },
    plotOptions: {
      bar: {
        horizontal: true,
        barHeight: '24px',
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
            {`Top ${topLimit} ${selectedStat.title || 'Categories'}`}
          </Typography>
          <Typography sx={{ fontSize: '0.8125rem', color: '#94A3B8', fontWeight: 500 }}>
            {`Top ${topLimit} categories by share`}
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
