'use client'

import React, { useState } from 'react'

import { Button, MenuItem, TextField, Typography, Box } from '@mui/material'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers'

const ExportData = () => {
  const [startDate, setStartDate] = useState<Date | null>(null)
  const [endDate, setEndDate] = useState<Date | null>(null)
  const [selectedWaiver, setSelectedWaiver] = useState('Test')

  const handleDownload = () => {
    console.log('Downloading...', {
      start: startDate,
      end: endDate,
      waiver: selectedWaiver
    })
  }

  const fieldSx = {
    '& .MuiOutlinedInput-root': {
      borderRadius: '10px',
      backgroundColor: '#F8FAFC',
      '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(82,63,153,0.3)' },
      '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#523F99' }
    }
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <div className='max-w-6xl mx-auto px-3 sm:px-4 py-4 sm:py-6'>
        {/* Page Header */}
        <div className='mb-5 sm:mb-8 px-1'>
          <h1 className='text-xl sm:text-2xl font-bold text-[#1E293B]'>Export Data</h1>
          <p className='text-sm text-[#94A3B8] font-medium mt-1'>Download waiver data as a file</p>
        </div>

        <div className='rounded-2xl border border-[rgba(0,0,0,0.06)] bg-white'>
          {/* Section Header */}
          <Box sx={{ px: { xs: 3, sm: 4, md: 5 }, pt: { xs: 3, sm: 3, md: 4 }, pb: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
              <Box sx={{ width: 36, height: 36, borderRadius: '10px', backgroundColor: '#F0ECFA', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <i className='tabler-download' style={{ fontSize: '1.125rem', color: '#523F99' }} />
              </Box>
              <Box>
                <Typography sx={{ fontSize: '0.9375rem', fontWeight: 700, color: '#1E293B' }}>Export Settings</Typography>
                <Typography sx={{ fontSize: '0.75rem', color: '#94A3B8', fontWeight: 500 }}>Choose date range and waiver template to export</Typography>
              </Box>
            </Box>
          </Box>

          <Box sx={{ px: { xs: 3, sm: 4, md: 5 }, pb: { xs: 3, md: 4 } }}>
            {/* Date Range - Two DatePickers side by side */}
            <Box sx={{ mb: 3 }}>
              <Typography sx={{ fontSize: '0.8125rem', fontWeight: 600, color: '#475569', mb: 1 }}>Date Range</Typography>
              <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', sm: 'row' }, maxWidth: 520 }}>
                <DatePicker
                  label='Start Date'
                  value={startDate}
                  onChange={val => setStartDate(val)}
                  slotProps={{
                    textField: {
                      size: 'small',
                      fullWidth: true,
                      sx: { flex: 1, ...fieldSx }
                    }
                  }}
                />
                <DatePicker
                  label='End Date'
                  value={endDate}
                  onChange={val => setEndDate(val)}
                  slotProps={{
                    textField: {
                      size: 'small',
                      fullWidth: true,
                      sx: { flex: 1, ...fieldSx }
                    }
                  }}
                />
              </Box>
            </Box>

            {/* Select Waiver */}
            <Box sx={{ mb: 4, maxWidth: { xs: '100%', sm: 520 } }}>
              <Typography sx={{ fontSize: '0.8125rem', fontWeight: 600, color: '#475569', mb: 1 }}>Select Waiver</Typography>
              <TextField
                select
                fullWidth
                variant='outlined'
                size='small'
                value={selectedWaiver}
                onChange={e => setSelectedWaiver(e.target.value)}
                sx={fieldSx}
              >
                <MenuItem value='Test'>Test</MenuItem>
                <MenuItem value='Test 2'>Test 2</MenuItem>
                <MenuItem value='Test 3'>Test 3</MenuItem>
              </TextField>
            </Box>

            {/* Download Button */}
            <Button
              onClick={handleDownload}
              variant='contained'
              disableElevation
              fullWidth
              startIcon={<i className='tabler-download' style={{ fontSize: '1rem' }} />}
              sx={{
                borderRadius: '10px',
                textTransform: 'none',
                fontWeight: 600,
                fontSize: '0.875rem',
                backgroundColor: '#523F99',
                color: '#FFFFFF',
                height: 44,
                px: 3.5,
                maxWidth: { sm: 200 },
                '&:hover': { backgroundColor: '#6B52C4' }
              }}
            >
              Download Export
            </Button>
          </Box>
        </div>
      </div>
    </LocalizationProvider>
  )
}

export default ExportData
