'use client'

import React from 'react'
import { Box, Typography } from '@mui/material'

type PendingItem = {
  title: string
  supplier: string
  quantity: string | number
  date: string
}

const accentColors = ['#523F99', '#4F46E5', '#059669', '#EA580C', '#DC2626']

const PendingOrders = ({ pendingData }: { pendingData: PendingItem[] }) => (
  <Box
    sx={{
      backgroundColor: '#FFFFFF',
      borderRadius: '14px',
      p: { xs: 2.5, sm: 3, md: 4 },
      boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
      border: '1px solid rgba(0,0,0,0.06)',
    }}
  >
    <Typography
      sx={{
        fontSize: { xs: '0.875rem', sm: '1rem', md: '1.125rem' },
        fontWeight: 600,
        color: '#1E293B',
        mb: 3,
        lineHeight: 1.4,
      }}
    >
      Pending Orders
    </Typography>

    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
      {pendingData?.map((item, idx) => (
        <Box
          key={idx}
          sx={{
            borderRadius: '10px',
            p: { xs: 1.5, sm: 2 },
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            gap: 1,
            backgroundColor: '#F8FAFC',
            borderLeft: `4px solid ${accentColors[idx % accentColors.length]}`,
            transition: 'all 0.2s ease',
            '&:hover': {
              boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
              transform: 'translateX(2px)',
            }
          }}
        >
          <Box sx={{ minWidth: 0 }}>
            <Typography
              sx={{
                fontSize: { xs: '0.8125rem', sm: '0.875rem' },
                fontWeight: 600,
                color: '#1E293B',
                lineHeight: 1.4,
                mb: 0.5,
              }}
            >
              {item.title}
            </Typography>
            <Typography
              sx={{
                fontSize: { xs: '0.6875rem', sm: '0.75rem' },
                color: '#64748B',
                lineHeight: 1.3,
              }}
            >
              Supplier: {item.supplier}
            </Typography>
            <Typography
              sx={{
                fontSize: { xs: '0.6875rem', sm: '0.75rem' },
                color: '#64748B',
                lineHeight: 1.3,
              }}
            >
              Quantity: {item.quantity}
            </Typography>
          </Box>
          <Typography
            sx={{
              fontSize: { xs: '0.625rem', sm: '0.6875rem' },
              color: '#94A3B8',
              whiteSpace: 'nowrap',
              flexShrink: 0,
              mt: 0.25,
            }}
          >
            {item.date}
          </Typography>
        </Box>
      ))}
    </Box>
  </Box>
)

export default PendingOrders
