'use client'

import React, { useState } from 'react'

import { DateRange } from 'react-date-range'
import { format } from 'date-fns'
import 'react-date-range/dist/styles.css'
import 'react-date-range/dist/theme/default.css'
import { Button, MenuItem, TextField } from '@mui/material'

const ExportData = () => {
  const [showDateRange, setShowDateRange] = useState(false)

  const [dateRange, setDateRange] = useState<any>(null)

  const [selectedWaiver, setSelectedWaiver] = useState('Test')

  const handleDownload = () => {
    console.log('Downloading...', {
      start: dateRange?.startDate,
      end: dateRange?.endDate,
      waiver: selectedWaiver
    })
  }

  return (
    <div className='p-6 bg-[#ffffff] rounded-lg shadow-md'>
      <h2 className='text-lg font-semibold mb-4'>Export Data</h2>

      <div className='bg-[#f6fafd] p-6 rounded-xl'>
        {/* Date Picker */}
        <div className='mb-4'>
          <label className='block font-medium mb-1'>Date</label>
          <div
            className={`flex items-center space-x-2 rounded-md border px-4 py-2 max-w-md ${!dateRange ? 'justify-evenly cursor-pointer' : ''}`}
            onClick={() => {
              if (!dateRange) setShowDateRange(!showDateRange)
            }}
          >
            {dateRange ? (
              <>
                <span
                  className='underline underline-offset-4 cursor-pointer'
                  onClick={() => setShowDateRange(!showDateRange)}
                >
                  {format(dateRange.startDate, 'PPP p')}
                </span>
                <span>to</span>
                <span
                  className='underline underline-offset-4 cursor-pointer'
                  onClick={() => setShowDateRange(!showDateRange)}
                >
                  {format(dateRange.endDate, 'PPP p')}
                </span>
                <i
                  className='tabler-square-rounded-x size-[0.875rem] cursor-pointer'
                  onClick={e => {
                    e.stopPropagation()
                    setDateRange(null)
                  }}
                />
              </>
            ) : (
              <>
                <span>Start Date</span>
                <span>to</span>
                <span>End Date</span>
              </>
            )}
          </div>
          {showDateRange && (
            <div className='mt-2'>
              <DateRange
                ranges={[
                  dateRange ?? {
                    startDate: new Date(),
                    endDate: new Date(),
                    key: 'selection'
                  }
                ]}
                onChange={(item: any) => {
                  setDateRange(item.selection)
                }}
                showTimeSelect
              />
            </div>
          )}
        </div>

        {/* Select Waiver */}
        <div className='mb-4 max-w-md'>
          <label className='block font-medium mb-1'>Select Waiver:</label>
          <TextField
            select
            fullWidth
            variant='outlined'
            value={selectedWaiver}
            onChange={e => setSelectedWaiver(e.target.value)}
            className='w-full border rounded-md '
          >
            <MenuItem value='Test'>Test</MenuItem>
            <MenuItem value='Test 2'>Test 2</MenuItem>
            <MenuItem value='Test 3'>Test 3</MenuItem>
          </TextField>
        </div>

        {/* Download Button */}
        <Button
          onClick={handleDownload}
          className='bg-violet-500 hover:bg-violet-700 text-white px-5 py-2 rounded-md flex items-center'
        >
          <svg
            xmlns='http://www.w3.org/2000/svg'
            className='h-5 w-5 mr-2'
            fill='none'
            viewBox='0 0 24 24'
            stroke='currentColor'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5m0 0l5-5m-5 5V4'
            />
          </svg>
          Download
        </Button>
      </div>
    </div>
  )
}

export default ExportData
