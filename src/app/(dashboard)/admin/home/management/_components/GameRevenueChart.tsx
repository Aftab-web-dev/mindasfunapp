import { useMemo } from 'react'

import type { ApexOptions } from 'apexcharts'

import ReactApexcharts from '@/@core/components/react-apexcharts'

type Props = {
  chartData: number[]
  title: string
}

const GameRevenueChart = ({ chartData, title }: Props) => {
  const timeLabels = [
    '10 AM', '11 AM', '12 PM', '1 PM', '2 PM', '3 PM', '4 PM',
    '5 PM', '6 PM', '7 PM', '8 PM', '9 PM', '10 PM', '11 PM', '12 AM'
  ]

  // Aggregate hourly data into daily-style buckets for the bar chart
  const barData = useMemo(() => {
    return chartData.map(v => Math.max(v, 0))
  }, [chartData])

  const options: ApexOptions = {
    chart: {
      parentHeightOffset: 0,
      toolbar: { show: false },
      fontFamily: 'inherit'
    },
    colors: ['#523F99'],
    dataLabels: { enabled: false },
    plotOptions: {
      bar: {
        borderRadius: 6,
        borderRadiusApplication: 'end',
        barHeight: '30%',
        columnWidth: '24px'
      }
    },
    grid: {
      borderColor: 'rgba(0,0,0,0.06)',
      strokeDashArray: 4,
      xaxis: { lines: { show: false } },
      padding: { top: -10 }
    },
    yaxis: {
      labels: {
        style: { colors: '#94A3B8', fontSize: '12px', fontWeight: 500 },
        formatter: (val: number) => `₹${val.toLocaleString()}`
      }
    },
    xaxis: {
      axisBorder: { show: false },
      axisTicks: { show: false },
      categories: timeLabels,
      labels: {
        style: { colors: '#94A3B8', fontSize: '11px', fontWeight: 500 }
      }
    },
    tooltip: {
      y: { formatter: (val: number) => `₹${val.toLocaleString()}` }
    }
  }

  return (
    <ReactApexcharts
      type='bar'
      height={340}
      options={options}
      series={[{ name: title, data: barData }]}
    />
  )
}

export default GameRevenueChart
