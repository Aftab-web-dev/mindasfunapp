'use client'
import React from 'react'

import { Box, Chip, Tabs, Tab, Typography, useMediaQuery, FormControl, Select, MenuItem } from '@mui/material'

const MONTH_NAMES = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December'
]
import { useTheme } from '@mui/material/styles'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import { LocalizationProvider, DatePicker, MobileDatePicker } from '@mui/x-date-pickers'

import { AVERAGE_PERIODS } from './ranges'
import type { AveragePeriod, RangeKey } from './ranges'

type Props = {
  range: RangeKey
  onRangeChange: (range: RangeKey) => void
  fromDate: Date | null
  toDate: Date | null
  onFromDateChange: (date: Date | null) => void
  onToDateChange: (date: Date | null) => void
  averagePeriod: AveragePeriod
  onAveragePeriodChange: (period: AveragePeriod) => void
}

const TAB_OPTIONS: { value: RangeKey; label: string; icon: string }[] = [
  { value: 'daily', label: 'Daily', icon: 'tabler-calendar' },
  { value: 'weekly', label: 'Weekly', icon: 'tabler-calendar-week' },
  { value: 'monthly', label: 'Monthly', icon: 'tabler-calendar-month' },
  { value: 'annually', label: 'Annually', icon: 'tabler-calendar-stats' },
  { value: 'custom', label: 'Custom', icon: 'tabler-calendar-time' },
  { value: 'average', label: 'Average', icon: 'tabler-chart-line' }
]

const RangeTabs = ({
  range,
  onRangeChange,
  fromDate,
  toDate,
  onFromDateChange,
  onToDateChange,
  averagePeriod,
  onAveragePeriodChange
}: Props) => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const PickerComponent = isMobile ? MobileDatePicker : DatePicker

  const currentMonth = fromDate ? fromDate.getMonth() : new Date().getMonth()
  const currentYear = fromDate ? fromDate.getFullYear() : new Date().getFullYear()

  const handleMonthChange = (monthIdx: number) => {
    const from = new Date(currentYear, monthIdx, 1)
    const to = new Date(currentYear, monthIdx + 1, 0)
    onFromDateChange(from)
    onToDateChange(to)
  }

  const handleYearChange = (yearVal: number) => {
    const from = new Date(yearVal, currentMonth, 1)
    const to = new Date(yearVal, currentMonth + 1, 0)
    onFromDateChange(from)
    onToDateChange(to)
  }

  const nowYear = new Date().getFullYear()
  const YEARS = Array.from({ length: 5 }, (_, i) => nowYear - 2 + i) // [2024, 2025, 2026, 2027, 2028]

  const getSelectedAnnualOption = () => {
    if (!fromDate || !toDate) return ''
    const fromYear = fromDate.getFullYear()
    const fromMonth = fromDate.getMonth()
    const toYear = toDate.getFullYear()
    const toMonth = toDate.getMonth()

    if (fromMonth === 0 && toMonth === 11) {
      return String(fromYear)
    } else if (fromMonth === 3 && toMonth === 2 && toYear === fromYear + 1) {
      return `${fromYear}-${toYear}`
    }
    return ''
  }

  const handleAnnualChange = (val: string) => {
    if (val.includes('-')) {
      const [startYr, endYr] = val.split('-').map(Number)
      const from = new Date(startYr, 3, 1)
      const to = new Date(endYr, 2, 31)
      onFromDateChange(from)
      onToDateChange(to)
    } else {
      const yr = Number(val)
      const from = new Date(yr, 0, 1)
      const to = new Date(yr, 11, 31)
      onFromDateChange(from)
      onToDateChange(to)
    }
  }

  const ANNUAL_OPTIONS = React.useMemo(() => {
    const opts: { value: string; label: string }[] = []
    for (let i = -2; i <= 1; i++) {
      const yr = nowYear + i
      opts.push({ value: String(yr), label: `Year ${yr}` })
      opts.push({ value: `${yr}-${yr + 1}`, label: `FY ${yr}-${yr + 1}` })
    }
    return opts
  }, [nowYear])

  const dateFieldSx = {
    minWidth: { xs: '100%', sm: 220 },
    '& .MuiOutlinedInput-root': {
      borderRadius: '10px',
      fontSize: '0.8125rem',
      backgroundColor: '#FFFFFF',
      boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
      height: 40,
      '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(82,63,153,0.3)' },
      '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#523F99', borderWidth: '1.5px' }
    },
    '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(0,0,0,0.08)' },
    '& .MuiInputLabel-root': { fontSize: '0.8125rem', color: '#94A3B8' },
    '& .MuiInputLabel-root.Mui-focused': { color: '#523F99' }
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box
        sx={{
          background: '#FFFFFF',
          borderRadius: '14px',
          boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
          p: { xs: 1, sm: 1.25 }
        }}
      >
        <Tabs
          value={range}
          onChange={(_, val) => onRangeChange(val as RangeKey)}
          variant={isMobile ? 'scrollable' : 'fullWidth'}
          scrollButtons={isMobile ? 'auto' : false}
          allowScrollButtonsMobile
          TabIndicatorProps={{ style: { display: 'none' } }}
          sx={{
            minHeight: 44,
            border: 'none',
            boxShadow: 'none',
            '&::before, &::after': { display: 'none' },
            // Scroller must keep its native overflow on mobile so tabs scroll;
            // on desktop (fullWidth variant) we can let it render visibly.
            '& .MuiTabs-scroller': {
              borderBottom: 'none',
              overflow: { xs: 'auto !important', md: 'visible !important' },
              scrollbarWidth: 'none',
              '&::-webkit-scrollbar': { display: 'none' }
            },
            '& .MuiTabs-flexContainer': { gap: { xs: 0.5, sm: 0.75 }, borderBottom: 'none' },
            '& .MuiTabs-indicator': { display: 'none' },
            '& .MuiTabs-scrollButtons.Mui-disabled': { opacity: 0.3 },
            '& .MuiTab-root': {
              position: 'relative',
              minHeight: 44,
              textTransform: 'none',
              fontSize: { xs: '0.75rem', sm: '0.8125rem' },
              fontWeight: 600,
              color: '#64748B',
              borderRadius: '10px',
              px: { xs: 1, sm: 1.5 },
              py: 1,
              minWidth: { xs: 'auto', sm: 0 },
              flex: { xs: '0 0 auto', sm: 1 },
              transition: 'color 0.2s ease, background-color 0.2s ease',
              '&:hover': {
                color: '#523F99',
                backgroundColor: 'rgba(82, 63, 153, 0.04)'
              },
              '&.Mui-selected': {
                color: '#523F99',
                backgroundColor: 'rgba(82, 63, 153, 0.1)'
              }
            }
          }}
        >
          {TAB_OPTIONS.map(opt => (
            <Tab
              key={opt.value}
              value={opt.value}
              iconPosition='start'
              icon={
                <i
                  className={opt.icon}
                  style={{
                    fontSize: '1rem',
                    marginRight: 4,
                    display: isMobile ? 'none' : 'inline-flex'
                  }}
                />
              }
              label={opt.label}
            />
          ))}
        </Tabs>

        {range === 'custom' && (
          <Box
            sx={{
              mt: 1.5,
              pt: 1.5,
              borderTop: '1px dashed rgba(82, 63, 153, 0.15)',
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row' },
              gap: 1.5,
              alignItems: { xs: 'stretch', sm: 'center' },
              justifyContent: 'center',
              flexWrap: 'wrap',
              px: { xs: 0.5, sm: 1 }
            }}
          >
            <PickerComponent
              label='From'
              value={fromDate}
              onChange={onFromDateChange}
              maxDate={toDate ?? undefined}
              slotProps={{
                textField: { size: 'small', sx: dateFieldSx },
                dialog: {
                  fullScreen: isMobile,
                  sx: {
                    '& .MuiPaper-root': {
                      borderRadius: isMobile ? 0 : '16px',
                      maxWidth: '100%',
                      overflow: 'auto'
                    },
                    '& .MuiPickersLayout-root': {
                      maxWidth: '100%',
                      overflow: 'auto'
                    },
                    '& .MuiPickersLayout-contentWrapper': {
                      maxWidth: '100%',
                      overflow: 'auto'
                    }
                  }
                }
              }}
            />
            <Box
              sx={{
                color: '#94A3B8',
                fontSize: '0.75rem',
                fontWeight: 600,
                display: { xs: 'none', sm: 'flex' },
                alignItems: 'center'
              }}
            >
              <i className='tabler-arrow-right' style={{ fontSize: '1rem' }} />
            </Box>
            <PickerComponent
              label='Till'
              value={toDate}
              onChange={onToDateChange}
              minDate={fromDate ?? undefined}
              maxDate={new Date()}
              slotProps={{
                textField: { size: 'small', sx: dateFieldSx },
                dialog: {
                  fullScreen: isMobile,
                  sx: {
                    '& .MuiPaper-root': {
                      borderRadius: isMobile ? 0 : '16px',
                      maxWidth: '100%',
                      overflow: 'auto'
                    },
                    '& .MuiPickersLayout-root': {
                      maxWidth: '100%',
                      overflow: 'auto'
                    },
                    '& .MuiPickersLayout-contentWrapper': {
                      maxWidth: '100%',
                      overflow: 'auto'
                    }
                  }
                }
              }}
            />
          </Box>
        )}

        {range === 'monthly' && (
          <Box
            sx={{
              mt: 1.5,
              pt: 1.5,
              borderTop: '1px dashed rgba(82, 63, 153, 0.15)',
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row' },
              gap: 1.5,
              alignItems: { xs: 'stretch', sm: 'center' },
              justifyContent: 'center',
              flexWrap: 'wrap',
              px: { xs: 0.5, sm: 1 }
            }}
          >
            <Typography
              sx={{
                fontSize: '0.75rem',
                fontWeight: 600,
                color: '#94A3B8',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                textAlign: { xs: 'center', sm: 'left' }
              }}
            >
              Select Month
            </Typography>
            <Box
              sx={{
                display: 'flex',
                gap: 1,
                flexDirection: { xs: 'column', sm: 'row' },
                width: { xs: '100%', sm: 'auto' },
                alignItems: 'center'
              }}
            >
              <FormControl size='small' sx={{ minWidth: { xs: '100%', sm: 155 } }}>
                <Select
                  value={currentMonth}
                  onChange={(e) => handleMonthChange(Number(e.target.value))}
                  sx={{
                    borderRadius: '8px',
                    fontSize: '0.8125rem',
                    fontWeight: 600,
                    height: 40,
                    backgroundColor: '#FFFFFF',
                    color: '#0F172A',
                    '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(0,0,0,0.08)' },
                    '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(82,63,153,0.3)' },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#523F99' }
                  }}
                >
                  {MONTH_NAMES.map((name, index) => (
                    <MenuItem key={index} value={index}>
                      {name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl size='small' sx={{ minWidth: { xs: '100%', sm: 105 } }}>
                <Select
                  value={currentYear}
                  onChange={(e) => handleYearChange(Number(e.target.value))}
                  sx={{
                    borderRadius: '8px',
                    fontSize: '0.8125rem',
                    fontWeight: 600,
                    height: 40,
                    backgroundColor: '#FFFFFF',
                    color: '#0F172A',
                    '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(0,0,0,0.08)' },
                    '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(82,63,153,0.3)' },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#523F99' }
                  }}
                >
                  {YEARS.map((y) => (
                    <MenuItem key={y} value={y}>
                      {y}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
          </Box>
        )}

        {range === 'annually' && (
          <Box
            sx={{
              mt: 1.5,
              pt: 1.5,
              borderTop: '1px dashed rgba(82, 63, 153, 0.15)',
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row' },
              gap: 1.5,
              alignItems: { xs: 'stretch', sm: 'center' },
              justifyContent: 'center',
              flexWrap: 'wrap',
              px: { xs: 0.5, sm: 1 }
            }}
          >
            <Typography
              sx={{
                fontSize: '0.75rem',
                fontWeight: 600,
                color: '#94A3B8',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                textAlign: { xs: 'center', sm: 'left' }
              }}
            >
              Select Year
            </Typography>
            <FormControl size='small' sx={{ minWidth: { xs: '100%', sm: 180 } }}>
              <Select
                value={getSelectedAnnualOption()}
                onChange={(e) => handleAnnualChange(e.target.value)}
                sx={{
                  borderRadius: '8px',
                  fontSize: '0.8125rem',
                  fontWeight: 600,
                  height: 40,
                  backgroundColor: '#FFFFFF',
                  color: '#0F172A',
                  '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(0,0,0,0.08)' },
                  '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(82,63,153,0.3)' },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#523F99' }
                }}
              >
                {ANNUAL_OPTIONS.map((opt) => (
                  <MenuItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        )}

        {range === 'average' && (
          <Box
            sx={{
              mt: 1.5,
              pt: 1.5,
              borderTop: '1px dashed rgba(82, 63, 153, 0.15)',
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row' },
              gap: 1.25,
              alignItems: { xs: 'stretch', sm: 'center' },
              justifyContent: 'center',
              flexWrap: 'wrap',
              px: { xs: 0.5, sm: 1 }
            }}
          >
            <Typography
              sx={{
                fontSize: '0.75rem',
                fontWeight: 600,
                color: '#94A3B8',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                textAlign: { xs: 'center', sm: 'left' }
              }}
            >
              Average over
            </Typography>
            <Box
              sx={{
                display: 'flex',
                gap: 0.75,
                flexWrap: 'wrap',
                justifyContent: { xs: 'center', sm: 'flex-start' }
              }}
            >
              {(Object.keys(AVERAGE_PERIODS) as AveragePeriod[]).map(p => {
                const active = averagePeriod === p

                return (
                  <Chip
                    key={p}
                    label={AVERAGE_PERIODS[p].label}
                    onClick={() => onAveragePeriodChange(p)}
                    size='small'
                    sx={{
                      borderRadius: '8px',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      height: 30,
                      px: 0.5,
                      cursor: 'pointer',
                      backgroundColor: active ? 'rgba(82, 63, 153, 0.1)' : '#F8FAFC',
                      color: active ? '#523F99' : '#64748B',
                      border: active ? '1px solid rgba(82, 63, 153, 0.25)' : '1px solid transparent',
                      transition: 'all 0.2s ease',
                      '&:hover': {
                        backgroundColor: active ? 'rgba(82, 63, 153, 0.14)' : 'rgba(82, 63, 153, 0.06)',
                        color: '#523F99'
                      }
                    }}
                  />
                )
              })}
            </Box>
          </Box>
        )}
      </Box>
    </LocalizationProvider>
  )
}

export default RangeTabs
