'use client'

import dynamic from 'next/dynamic'

import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Grid from '@mui/material/Grid2'
import { useTheme } from '@mui/material/styles'

import classnames from 'classnames'
import type { ApexOptions } from 'apexcharts'

const AppReactApexCharts = dynamic(() => import('@/libs/styles/AppReactApexCharts'))

type DataType = {
  title: string
  value: number
  colorClass: string
}

const TopGameChart = ({
  selectedStat
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
}) => {
  const labels = selectedStat.datas
  const data1 = selectedStat.data1
  const data2 = selectedStat.data2
  const theme = useTheme()
  const topCount = data1.length + data2.length

  // Bar chart series = top 6 percentage values derived from API data
  const percentages = [...data1, ...data2].map(d => d.value)
  const series = [{ data: percentages }]

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
    colors: ['#523F99', '#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#06B6D4'],
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
      <Box sx={{ px: 3, pt: 2.5, pb: 0.5, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 1.5, flexWrap: 'wrap' }}>
        <Box sx={{ minWidth: 0 }}>
          <Typography sx={{ fontSize: '1rem', fontWeight: 700, color: '#1E293B' }}>
            {`Top ${topCount} ${selectedStat.title || 'Categories'}`}
          </Typography>
          <Typography sx={{ fontSize: '0.8125rem', color: '#94A3B8', fontWeight: 500 }}>
            {`Top ${topCount} categories by share`}
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
          {`Top ${topCount}`}
        </Box>
      </Box>

      <Box sx={{ px: 1.5 }}>
        <Grid container>
          <Grid size={{ xs: 12, sm: 6 }}>
            <AppReactApexCharts type='bar' height={300} width='100%' series={series} options={options} />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }} alignSelf='center'>
            <Box sx={{ display: { xs: 'none', sm: 'flex' }, justifyContent: 'space-around', px: 2 }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                {data1.map((item, i) => (
                  <Box key={i} sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <i className={classnames('tabler-circle-filled text-[10px]', item.colorClass)} />
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
                    <i className={classnames('tabler-circle-filled text-[10px]', item.colorClass)} />
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
      </Box>
    </Box>
  )
}

export default TopGameChart
