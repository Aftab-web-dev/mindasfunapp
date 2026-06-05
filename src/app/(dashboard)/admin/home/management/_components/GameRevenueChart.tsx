import { useMemo } from 'react'

import type { ApexOptions } from 'apexcharts'

import ReactApexcharts from '@/@core/components/react-apexcharts'

type Props = {
  chartData: number[]
  title: string
  categories: string[]
  color?: string
}

const GameRevenueChart = ({ chartData, title, categories, color = '#523F99' }: Props) => {
  const barData = useMemo(() => chartData.map(v => Math.max(v, 0)), [chartData])

  const options: ApexOptions = {
    chart: {
      parentHeightOffset: 0,
      toolbar: { show: false },
      fontFamily: 'inherit'
    },
    colors: [color],
    dataLabels: { enabled: false },
    plotOptions: {
      bar: {
        borderRadius: 6,
        borderRadiusApplication: 'end',
        barHeight: '30%',
        columnWidth: '60%'
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
        formatter: (val: number) => {
          const showRupee = !['Game Revenue', 'Reedemption PayOut', 'Other Sales'].includes(title)
          return showRupee ? `₹${val.toLocaleString()}` : val.toLocaleString()
        }
      }
    },
    xaxis: {
      axisBorder: { show: false },
      axisTicks: { show: false },
      categories,
      tickAmount: Math.min(categories.length, 12),
      labels: {
        style: { colors: '#94A3B8', fontSize: '11px', fontWeight: 500 },
        rotate: -45,
        rotateAlways: false,
        hideOverlappingLabels: true,
        trim: false
      }
    },
    tooltip: {
      y: {
        formatter: (val: number) => {
          const showRupee = !['Game Revenue', 'Reedemption PayOut', 'Other Sales'].includes(title)
          return showRupee ? `₹${val.toLocaleString()}` : val.toLocaleString()
        }
      }
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
