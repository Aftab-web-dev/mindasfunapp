'use client'
import React, { useState } from 'react'

// Next Imports
import dynamic from 'next/dynamic'

// MUI Imports
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import { Box, Button } from '@mui/material'

// Third-party Imports
import type { ApexOptions } from 'apexcharts'

// import SplitButtonDropdown from './SplitDropDown'

// Styled Component Imports
const AppReactApexCharts = dynamic(() => import('@/libs/styles/AppReactApexCharts'))

const MainCart = () => {
  // State for showing/hiding the data table
  const [showTable, setShowTable] = useState(false)

  // Vars
  const divider = 'var(--mui-palette-divider)'
  const disabledText = 'var(--mui-palette-text-disabled)'

  // Multiple series for multiple lines
  const multiSeries = [
    {
      name: 'Game Revenue',
      data: [280, 200, 220, 180, 270, 250, 70, 90, 200, 150, 160, 100, 150, 100, 50]
    },
    {
      name: 'Product Revenue',
      data: [170, 150, 120, 160, 250, 220, 190, 160, 160, 180, 120, 180, 170, 190, 160]
    },
    {
      name: 'Redemption Revenue',
      data: [150, 120, 180, 140, 200, 210, 90, 110, 170, 130, 170, 80, 120, 90, 60]
    }
  ]

  const options: ApexOptions = {
    chart: {
      parentHeightOffset: 0,
      zoom: { enabled: false },
      toolbar: { show: false }
    },
    colors: ['#A354FF', '#b70021', '#279301'],
    stroke: { curve: 'straight' },
    dataLabels: { enabled: false },
    markers: {
      strokeWidth: 7,
      strokeOpacity: 1,
      colors: ['#A354FF', '#b70021', '#279301'],
      strokeColors: ['#fff', '#fff', '#fff']
    },
    grid: {
      padding: { top: -10 },
      borderColor: divider,
      xaxis: {
        lines: { show: true }
      }
    },
    tooltip: {
      shared: true,
      custom({ series, dataPointIndex, w }) {
        let tooltipHTML = `<div class="custom-tooltip" style="padding: 8px; background: white; border: 1px solid #ccc; border-radius: 4px;">`

        w.globals.seriesNames.forEach((seriesName: string, i: number) => {
          const value: number = series[i][dataPointIndex]

          tooltipHTML += `
    <div style="margin-bottom: 4px;">
      <span style="font-weight: bold; color: ${w.globals.colors[i]}">${seriesName}</span>:
      <span>${value}</span>
    </div>`
        })

        tooltipHTML += `</div>`

        return tooltipHTML
      }
    },
    yaxis: {
      labels: {
        style: { colors: disabledText, fontSize: '13px' }
      }
    },
    xaxis: {
      axisBorder: { show: false },
      axisTicks: { color: divider },
      crosshairs: {
        stroke: { color: divider }
      },
      labels: {
        style: { colors: disabledText, fontSize: '10px' }
      },
      categories: [
        '10:00 AM',
        '11:00 AM',
        '12:00 PM',
        '01:00 PM',
        '02:00 PM',
        '03:00 PM',
        '04:00 PM',
        '05:00 PM',
        '06:00 PM',
        '07:00 PM',
        '08:00 PM',
        '09:00 PM',
        '10:00 PM',
        '11:00 PM',
        '12:00 AM'
      ]
    },
    legend: {
      show: true
    }
  }

  // const GamesDropDown = ['Game 1', 'Game 2', 'Game 3']
  // const TimeDropDown = ['7 Days', '15 Days', '30 Days']

  return (
    <Card>
      <CardHeader
        title='Total Revenue'
        subheader={'Period ( Friday,March 10 2023 )'}
        sx={{
          flexDirection: ['column', 'row'],
          alignItems: ['flex-start', 'center'],
          '& .MuiCardHeader-action': { mb: 0 },
          '& .MuiCardHeader-content': { mb: [2, 0] }
        }}
        action={
          <Box
            sx={{
              display: 'flex',
              gap: '10px',
              flexWrap: 'wrap',
              alignItems: 'center',
              justifyContent: { xs: 'space-evenly', md: 'space-between' },
              marginLeft: '20px'
            }}
          >
            {/* <Button

            // onClick={() => setSelectedButton('total')}
            // className={`w-fit py-[0.5rem] px-[2.7813rem] rounded max-sm:text-[0.7rem] text-[0.9375rem] font-[500] leading-[1.375rem] ${
            //   selectedButton == 'total'
            //     ? 'bg-[#8638E529]/[16%] text-[#8638E5]'
            //     : 'bg-[#75757529]/[16%] text-[#757575] '
            // }`}
            >
              Total Daily Revenue
            </Button> */}
            <div className='flex gap-3 max-sm:flex-col max-sm:items-center max-sm:w-full '>
              <Button
                variant='outlined'
                onClick={() => {
                  setShowTable(prev => !prev)
                }}
                className='w-full'
              >
                {!showTable ? 'View Excel Format' : 'View Data Chart'}
              </Button>
              {/* <SplitButtonDropdown

                // selectedButton={selectedButton}
                // setSelectedButton={setSelectedButton}
                menuItems={GamesDropDown}
                title='Game Category'
              /> */}
              {/* <SplitButtonDropdown

                selectedButton={selectedButton}
                menuItems={TimeDropDown}
                title='Period'
              /> */}
            </div>
          </Box>
        }
      />{' '}
      <CardContent>
        {' '}
        {!showTable && (
          <AppReactApexCharts type='line' width='100%' height={400} options={options} series={multiSeries} />
        )}
        {showTable && (
          <Box sx={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 600 }}>
              <thead>
                <tr>
                  <th style={{ border: '1px solid #e0e0e0', padding: '8px', background: '#fafafa' }}>Time</th>
                  {multiSeries.map(series => (
                    <th
                      key={series.name}
                      style={{ border: '1px solid #e0e0e0', padding: '8px', background: '#fafafa' }}
                    >
                      {series.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {options.xaxis?.categories?.map((category: any, idx: any) => (
                  <tr key={category}>
                    <td style={{ border: '1px solid #e0e0e0', padding: '8px' }}>{category}</td>
                    {multiSeries.map(series => (
                      <td key={series.name} style={{ border: '1px solid #e0e0e0', padding: '8px' }}>
                        {series.data[idx]}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </Box>
        )}
      </CardContent>{' '}
    </Card>
  )
}

export default MainCart
