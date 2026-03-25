'use client'

// Next Imports
import dynamic from 'next/dynamic'

// MUI Imports
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid2'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import { useTheme } from '@mui/material/styles'

// Third-party Imports
import classnames from 'classnames'
import type { ApexOptions } from 'apexcharts'

// Components Imports
import OptionMenu from '@core/components/option-menu'

// Styled Component Imports
const AppReactApexCharts = dynamic(() => import('@/libs/styles/AppReactApexCharts'))

type DataType = {
  title: string
  value: number
  colorClass: string
}

// Vars
const series = [
  {
    data: [35, 20, 14, 12, 12, 12]
  }
]

// const data1: DataType[] = [
//   { title: 'Game 1', value: 35, colorClass: 'text-primary' },
//   { title: 'Game 2', value: 20, colorClass: 'text-info' },
//   { title: 'Game 3', value: 14, colorClass: 'text-success' }
// ]

// const data2: DataType[] = [
//   { title: 'Game 4', value: 12, colorClass: 'text-secondary' },
//   { title: 'Game 5', value: 10, colorClass: 'text-error' },
//   { title: 'Game 6', value: 9, colorClass: 'text-warning' }
// ]

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
  // Hooks
  const labels = selectedStat.datas
  const data1 = selectedStat.data1
  const data2 = selectedStat.data2
  const theme = useTheme()

  // Vars
  const options: ApexOptions = {
    chart: {
      parentHeightOffset: 0,
      toolbar: { show: false }
    },
    plotOptions: {
      bar: {
        horizontal: true,
        barHeight: '28px',
        distributed: true,
        borderRadius: 7,
        borderRadiusApplication: 'end'
      }
    },

    colors: [
      'var(--mui-palette-primary-main)',
      'var(--mui-palette-info-main)',
      'var(--mui-palette-success-main)',
      'var(--mui-palette-secondary-main)',
      'var(--mui-palette-error-main)',
      'var(--mui-palette-warning-main)'
    ],
    grid: {
      strokeDashArray: 8,
      borderColor: 'var(--mui-palette-divider)',
      xaxis: {
        lines: { show: true }
      },
      yaxis: {
        lines: { show: false }
      },
      padding: {
        top: -25,
        left: 21,
        right: 25,
        bottom: 0
      }
    },
    dataLabels: {
      enabled: true,
      offsetY: 8,
      style: {
        colors: ['#fff'],
        fontWeight: 500,
        fontSize: window.innerWidth < 500 ? '0.625rem' : '0.8125rem'
      },
      formatter(val: string, opt: any) {
        return labels[opt.dataPointIndex]
      }
    },
    tooltip: {
      enabled: true,
      style: {
        fontSize: '0.75rem'
      },
      onDatasetHover: {
        highlightDataSeries: false
      }
    },
    legend: { show: false },
    states: {
      hover: {
        filter: { type: 'none' }
      },
      active: {
        filter: { type: 'none' }
      }
    },
    xaxis: {
      axisTicks: { show: false },
      axisBorder: { show: false },
      categories: ['6', '5', '4', '3', '2', '1'],
      labels: {
        formatter: val => `${val}%`,
        style: {
          fontSize: window.innerWidth < 500 ? '0.625rem' : '0.8125rem',
          colors: 'var(--mui-palette-text-disabled)'
        }
      }
    },
    yaxis: {
      labels: {
        align: theme.direction === 'rtl' ? 'right' : 'left',
        style: {
          fontWeight: 500,
          fontSize: window.innerWidth < 500 ? '0.625rem' : '0.8125rem',
          colors: 'var(--mui-palette-text-disabled)'
        },
        offsetX: theme.direction === 'rtl' ? -15 : -30
      }
    }
  }

  return (
    <Card>
      <CardHeader title={selectedStat.title || ''} action={<OptionMenu options={['Refresh', 'Update', 'Share']} />} />
      <CardContent>
        <Grid container>
          <Grid size={{ xs: 12, sm: 6 }} className='max-md:mbe-6'>
            <AppReactApexCharts type='bar' height={350} width='100%' series={series} options={options} />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }} alignSelf='center' >
            <div className='flex justify-around items-start max-sm:hidden'>
              <div className='flex flex-col gap-y-12'>
                {data1.map((item, i) => (
                  <div key={i} className='flex gap-2'>
                    <i className={classnames('tabler-circle-filled text-xs m-[5px]', item.colorClass)} />
                    <div>
                      <Typography className='md:text-[20px]'>{item.title}</Typography>
                      <Typography variant='h5' className='md:text-[20px]'>{`${item.value}%`}</Typography>
                    </div>
                  </div>
                ))}
              </div>
              <div className='flex flex-col gap-y-12'>
                {data2.map((item, i) => (
                  <div key={i} className='flex gap-2'>
                    <i className={classnames('tabler-circle-filled text-xs m-[5px]', item.colorClass)} />
                    <div>
                      <Typography className='md:text-[20px]'>{item.title}</Typography>
                      <Typography variant='h5' className='md:text-[20px]'>{`${item.value}%`}</Typography>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  )
}

export default TopGameChart
