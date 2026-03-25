'use client'
import React, { useState } from 'react'

import { Box, Button, Card, CardContent, CardHeader } from '@mui/material'

import ReactApexcharts from '@/@core/components/react-apexcharts'
import StatsCard from './StatsCard'

// import SplitButtonDropdown from './SplitDropDown'
import GameRevenueChart from './GameRevenueChart'
import TopGameChart from './TopGameChart'
import UpcomingEvents from './UpcomingEvents'
import MainCart from './MainChart'

type TStats = {
  gameRevenue: number
  cardRevenue: number
  redemptionRevenue: number
  eventRevenue: number
  fbRevenue: number
  trampolineRevenue: number
  bowlingRevenue: number
  ticket: number
  time: number
}

const HomePage = ({ stats }: { stats: TStats }) => {
  const statsCardArray = [
    {
      title: 'Game Revenue',
      datas: ['Match 1', 'Match 2', 'Match 3', 'Match 4', 'Match 5', 'Match 6'],
      data1: [
        { title: 'Match 1', value: 50, colorClass: 'text-primary' },
        { title: 'Match 2', value: 30, colorClass: 'text-info' },
        { title: 'Match 3', value: 20, colorClass: 'text-success' }
      ],
      data2: [
        { title: 'Match 4', value: 15, colorClass: 'text-secondary' },
        { title: 'Match 5', value: 10, colorClass: 'text-error' },
        { title: 'Match 6', value: 5, colorClass: 'text-warning' }
      ],
      revenue: `₹${stats.gameRevenue.toLocaleString()}`,
      icon: 'tabler-coin-rupee',
      chartData: shuffleArray([420, 550, 500, 450, 400, 500, 450, 400, 420])
    },
    {
      title: 'Product Revenue',
      datas: ['Game A', 'Game B', 'Game C', 'Game D', 'Game E', 'Game F'],
      data1: [
        { title: 'Game A', value: 40, colorClass: 'text-primary' },
        { title: 'Game B', value: 25, colorClass: 'text-info' },
        { title: 'Game C', value: 20, colorClass: 'text-success' }
      ],
      data2: [
        { title: 'Game D', value: 18, colorClass: 'text-secondary' },
        { title: 'Game E', value: 10, colorClass: 'text-error' },
        { title: 'Game F', value: 7, colorClass: 'text-warning' }
      ],
      revenue: `₹${stats.cardRevenue.toLocaleString()}`,
      icon: 'tabler-cash',
      chartData: shuffleArray([420, 550, 500, 450, 400, 500, 450, 400, 420])
    },
    {
      title: 'Redemption Revenue',
      datas: ['Court 1', 'Court 2', 'Court 3', 'Court 4', 'Court 5', 'Court 6'],
      data1: [
        { title: 'Court 1', value: 30, colorClass: 'text-primary' },
        { title: 'Court 2', value: 28, colorClass: 'text-info' },
        { title: 'Court 3', value: 15, colorClass: 'text-success' }
      ],
      data2: [
        { title: 'Court 4', value: 14, colorClass: 'text-secondary' },
        { title: 'Court 5', value: 10, colorClass: 'text-error' },
        { title: 'Court 6', value: 3, colorClass: 'text-warning' }
      ],
      revenue: `₹${stats.redemptionRevenue.toLocaleString()}`,
      icon: 'tabler-coin-rupee',
      chartData: shuffleArray([420, 550, 500, 450, 400, 500, 450, 400, 420])
    },
    {
      title: 'Event Revenue',
      datas: ['ODI', 'T20', 'Test 1', 'Test 2', 'T10', 'IPL'],
      data1: [
        { title: 'ODI', value: 60, colorClass: 'text-primary' },
        { title: 'T20', value: 40, colorClass: 'text-info' },
        { title: 'Test 1', value: 30, colorClass: 'text-success' }
      ],
      data2: [
        { title: 'Test 2', value: 25, colorClass: 'text-secondary' },
        { title: 'T10', value: 20, colorClass: 'text-error' },
        { title: 'IPL', value: 15, colorClass: 'text-warning' }
      ],
      revenue: `₹${stats.eventRevenue.toLocaleString()}`,
      icon: 'tabler-calendar-event',
      chartData: shuffleArray([420, 550, 500, 450, 400, 500, 450, 400, 420])
    },
    {
      title: 'F&B Revenue',
      datas: ['Game 1', 'Game 2', 'Game 3', 'Game 4', 'Game 5', 'Game 6'],
      data1: [
        { title: 'Game 1', value: 45, colorClass: 'text-primary' },
        { title: 'Game 2', value: 35, colorClass: 'text-info' },
        { title: 'Game 3', value: 20, colorClass: 'text-success' }
      ],
      data2: [
        { title: 'Game 4', value: 18, colorClass: 'text-secondary' },
        { title: 'Game 5', value: 10, colorClass: 'text-error' },
        { title: 'Game 6', value: 7, colorClass: 'text-warning' }
      ],
      revenue: `₹${stats.fbRevenue.toLocaleString()}`,
      icon: 'tabler-coffee',
      chartData: shuffleArray([420, 550, 500, 450, 400, 500, 450, 400, 420])
    },
    {
      title: 'Bounzing Revenue',
      datas: ['Court A', 'Court B', 'Court C', 'Court D', 'Court E', 'Court F'],
      data1: [
        { title: 'Court A', value: 38, colorClass: 'text-primary' },
        { title: 'Court B', value: 32, colorClass: 'text-info' },
        { title: 'Court C', value: 25, colorClass: 'text-success' }
      ],
      data2: [
        { title: 'Court D', value: 20, colorClass: 'text-secondary' },
        { title: 'Court E', value: 10, colorClass: 'text-error' },
        { title: 'Court F', value: 5, colorClass: 'text-warning' }
      ],
      revenue: `₹${stats.trampolineRevenue.toLocaleString()}`,
      icon: 'tabler-confetti',
      chartData: shuffleArray([420, 550, 500, 450, 400, 500, 450, 400, 420])
    },
    {
      title: 'Bowling Revenue',
      datas: ['Set 1', 'Set 2', 'Set 3', 'Set 4', 'Set 5', 'Set 6'],
      data1: [
        { title: 'Set 1', value: 28, colorClass: 'text-primary' },
        { title: 'Set 2', value: 25, colorClass: 'text-info' },
        { title: 'Set 3', value: 22, colorClass: 'text-success' }
      ],
      data2: [
        { title: 'Set 4', value: 15, colorClass: 'text-secondary' },
        { title: 'Set 5', value: 8, colorClass: 'text-error' },
        { title: 'Set 6', value: 6, colorClass: 'text-warning' }
      ],
      revenue: `₹${stats.bowlingRevenue.toLocaleString()}`,
      icon: 'tabler-ball-bowling',
      chartData: shuffleArray([420, 550, 500, 450, 400, 500, 450, 400, 420])
    },

    {
      title: 'Ticketing Revenue',
      datas: ['Cash 1', 'Cash 2', 'Cash 3', 'Cash 4', 'Cash 5', 'Cash 6'],
      data1: [
        { title: 'Cash 1', value: 5, colorClass: 'text-primary' },
        { title: 'Cash 2', value: 20, colorClass: 'text-info' },
        { title: 'Cash 3', value: 14, colorClass: 'text-success' }
      ],
      data2: [
        { title: 'Cash 4', value: 12, colorClass: 'text-secondary' },
        { title: 'Cash 5', value: 10, colorClass: 'text-error' },
        { title: 'Cash 6', value: 9, colorClass: 'text-warning' }
      ],
      revenue: `₹${stats.ticket.toLocaleString()}`,
      icon: 'tabler-cash',
      chartData: shuffleArray([420, 550, 500, 450, 400, 500, 450, 400, 420])
    }
  ]

  function shuffleArray(array: number[]) {
    return array.sort(() => Math.random() - 0.5)
  }

  // const GamesDropDown = ['Game 1', 'Game 2', 'Game 3']
  // const TimeDropDown = ['7 Days', '15 Days', '30 Days']

  const [selectedStat, setSelectedStat] = useState<any | null>(null) // No default selected

  //   const [selectedGame, setSelectedGame] = useState(GamesDropDown[0]) // Default to the first
  const [selectedButton, setSelectedButton] = useState<string>('total')

  const options: ApexCharts.ApexOptions = {
    chart: {
      type: 'line',
      parentHeightOffset: 0,
      zoom: { enabled: false },
      toolbar: { show: false }
    },
    colors: ['#8638E5'],
    stroke: {
      curve: 'straight'
    },
    xaxis: {
      categories: [
        '0:00',
        '1:00',
        '2:00',
        '3:00',
        '4:00',
        '5:00',
        '6:00',
        '7:00',
        '8:00',
        '9:00',
        '10:00',
        '11:00',
        '12:00',
        '13:00',
        '14:00',
        '15:00',
        '16:00',
        '17:00',
        '18:00',
        '19:00',
        '20:00',
        '21:00',
        '22:00',
        '23:00',
        '24:00'
      ],
      labels: {
        formatter: value => {
          if (window.innerWidth <= 768) {
            return ['1:00', '5:00', '10:00', '15:00', '20:00', '24:00'].includes(value) ? value : ''
          }

          return value
        }
      }
    },
    yaxis: {
      labels: {
        style: { colors: '#9e9e9e' }
      }
    },
    grid: {
      padding: { top: -10 },
      borderColor: '#e0e0e0',
      xaxis: {
        lines: { show: true }
      }
    },
    tooltip: {
      enabled: true
    }
  }

  return (
    <div>
      <div className='grid xl:grid-cols-4 lg:grid-rows-2 gap-[1rem] md:grid-cols-3 grid-cols-2 '>
        {statsCardArray.map((item, i) => (
          <div key={i} onClick={() => setSelectedStat(selectedStat?.title === item.title ? null : item)}>
            <StatsCard item={item} selected={selectedStat?.title === item.title} />
          </div>
        ))}
      </div>

      <div className='gap-[1.5rem] pt-[1rem]'>
        {selectedStat ? (
          <Card>
            <CardHeader
              title={`Revenue Breakdown - ${selectedStat.title}`}
              style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', alignContent: 'center' }}
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
                  <Button
                    onClick={() => setSelectedButton('total')}
                    className={`w-fit py-[0.5rem] px-[2.7813rem] rounded max-sm:text-[0.7rem] text-[0.9375rem] font-[500] leading-[1.375rem] ${
                      selectedButton == 'total'
                        ? 'bg-[#8638E529]/[16%] text-[#8638E5]'
                        : 'bg-[#75757529]/[16%] text-[#757575] '
                    }`}
                  >
                    Total Daily Revenue
                  </Button>
                  {/* <div className='flex gap-3 max-sm:flex-col max-sm:items-center max-sm:w-full '>
                    <SplitButtonDropdown
                      selectedButton={selectedButton}
                      setSelectedButton={setSelectedButton}
                      menuItems={GamesDropDown}
                      title='Game Category'
                    />
                    <SplitButtonDropdown selectedButton={selectedButton} menuItems={TimeDropDown} title='Period' />
                  </div> */}
                </Box>
              }
            />
            <CardContent>
              {selectedButton == 'total' ? (
                <ReactApexcharts
                  type='line'
                  height={370}
                  width='100%' // Adjust width to be responsive
                  options={options}
                  series={[{ name: selectedStat.title, data: selectedStat.chartData }]}
                />
              ) : (
                <GameRevenueChart />
              )}
            </CardContent>
          </Card>
        ) : (
          <MainCart />
        )}
      </div>
      {selectedStat && (
        <div className='pt-[1.3rem] flex max-2xl:flex-col gap-[1.5rem]'>
          <div className='1xl:flex-1 md:min-w-[46.625rem] '>
            <TopGameChart selectedStat={selectedStat} />
          </div>
          <div className='1xl:flex-1 min-w-[22.625rem]dark '>
            <UpcomingEvents />
          </div>
        </div>
      )}
    </div>
  )
}

export default HomePage
