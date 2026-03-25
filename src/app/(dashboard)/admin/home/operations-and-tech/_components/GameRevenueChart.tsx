// ** React Imports

// ** Third Party Imports
import type { ApexOptions } from 'apexcharts'

// ** Icon Imports

// ** Types

// ** Component Import
import ReactApexcharts from '@/@core/components/react-apexcharts'

const GameRevenueChart = () => {
  // ** States

  // ** Hook

  const options: ApexOptions = {
    chart: {
      parentHeightOffset: 0,
      toolbar: { show: false }
    },
    colors: ['#A354FF'],
    dataLabels: { enabled: false },
    plotOptions: {
      bar: {
        borderRadius: 8,
        borderRadiusApplication: 'end',
        barHeight: '30%',
        columnWidth: '20px'

        // horizontal: true,
      }
    },
    grid: {
      //   borderColor: theme.palette.divider,
      xaxis: {
        lines: { show: false }
      },
      padding: {
        top: -10
      }
    },
    yaxis: {
      labels: {
        // style: { colors: theme.palette.text.disabled },
      }
    },
    xaxis: {
      axisBorder: { show: false },

      //   axisTicks: { color: theme.palette.divider },
      categories: [
        'MON, 11',
        'THU, 14',
        'FRI, 15',
        'MON, 18',
        'WED, 20',
        'FRI, 21',
        'MON, 23',
        'MON, 23',
        'MON, 23',
        'MON, 23',
        'MON, 23'
      ],
      labels: {
        // style: { colors: theme.palette.text.disabled },
      }
    }
  }

  return (
    <ReactApexcharts
      type='bar'
      height={380}
      options={options}
      series={[{ data: [700, 350, 480, 600, 210, 550, 150, 1000, 750, 800, 650] }]}
    />
  )
}

export default GameRevenueChart
