'use client'

import { useEffect, useState } from 'react'

import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Avatar from '@mui/material/Avatar'

import { format } from 'date-fns'

import { managementDashboardApi } from '@/api/management-dashboard'

interface DataType {
  title: string
  date: string
  subTitle: string
}

const eventColors = ['#523F99', '#3B82F6', '#10B981', '#F59E0B']

const UpcomingEvents = ({ from, to }: { from: string; to: string }) => {
  const [data, setData] = useState<DataType[]>([])

  useEffect(() => {
    managementDashboardApi.upcomingEvent({ from, to }).then(res => {
      const items: any[] = res.data?.data || []

      const mapped = items.map((row: any) => ({
        title: row.name || row.customerName || row.ledgerName || 'Event',
        subTitle: row.event || row.eventName || row.eventDescription || 'Event',
        date: row.eventDate ? format(new Date(row.eventDate), 'd MMM') : ''
      }))

      setData(mapped)
    }).catch(() => setData([]))
  }, [from, to])

  return (
    <Box
      sx={{
        borderRadius: '16px',
        background: '#FFFFFF',
        boxShadow: '0 1px 4px rgba(15, 23, 42, 0.04)',
        border: '1px solid rgba(15, 23, 42, 0.04)',
        overflow: 'hidden',
        height: '100%',
        minWidth: 0
      }}
    >
      <Box sx={{ px: { xs: 2, sm: 3 }, pt: { xs: 2, sm: 2.5 }, pb: 1.5 }}>
        <Typography sx={{ fontSize: { xs: '0.9375rem', sm: '1rem' }, fontWeight: 700, color: '#0F172A' }}>
          Upcoming Events
        </Typography>
        <Typography sx={{ fontSize: { xs: '0.6875rem', sm: '0.75rem' }, color: '#94A3B8', fontWeight: 500 }}>
          {data.length} events scheduled
        </Typography>
      </Box>

      <Box sx={{ px: 2, pb: 2.5, display: 'flex', flexDirection: 'column', gap: 0.5 }}>
        {data.length === 0 && (
          <Box sx={{ px: 2, py: 3, textAlign: 'center' }}>
            <Typography sx={{ fontSize: '0.8125rem', color: '#94A3B8', fontWeight: 500 }}>
              No upcoming events
            </Typography>
          </Box>
        )}
        {data.map((row, i) => (
          <Box
            key={i}
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1.5,
              px: 1.5,
              py: 1.25,
              borderRadius: '10px',
              transition: 'background-color 0.15s ease',
              '&:hover': { backgroundColor: '#FAFAFA' }
            }}
          >
            <Avatar
              sx={{
                width: 38,
                height: 38,
                backgroundColor: `${eventColors[i % 4]}10`,
                color: eventColors[i % 4],
                fontSize: '0.875rem',
                fontWeight: 700
              }}
            >
              <i className='tabler-calendar-event' style={{ fontSize: '1.125rem' }} />
            </Avatar>

            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography sx={{ fontSize: '0.8125rem', fontWeight: 600, color: '#1E293B', lineHeight: 1.3 }} noWrap>
                {row.title}
              </Typography>
              <Typography sx={{ fontSize: '0.6875rem', color: '#94A3B8', fontWeight: 500 }} noWrap>
                {row.subTitle}
              </Typography>
            </Box>

            <Box
              sx={{
                px: 1.25,
                py: 0.4,
                borderRadius: '6px',
                backgroundColor: '#F0ECFA',
                flexShrink: 0
              }}
            >
              <Typography sx={{ fontSize: '0.6875rem', fontWeight: 600, color: '#523F99' }}>
                {row.date}
              </Typography>
            </Box>
          </Box>
        ))}
      </Box>
    </Box>
  )
}

export default UpcomingEvents
