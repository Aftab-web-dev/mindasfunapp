'use client'

import React from 'react'
import { Box, Typography, LinearProgress } from '@mui/material'

type PopularItem = {
  title: string
  desc: string
  percentage: number
}

const barColors = ['#523F99', '#059669', '#4F46E5', '#EA580C', '#DC2626']

const PopularItems = ({ popularData }: { popularData: PopularItem[] }) => (
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
      Popular Items
    </Typography>

    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      {popularData?.map((item: PopularItem, idx: number) => {
        const color = barColors[idx % barColors.length]

        return (
          <Box
            key={idx}
            sx={{
              borderRadius: '10px',
              p: { xs: 1.5, sm: 2 },
              backgroundColor: '#F8FAFC',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: 2,
              transition: 'all 0.2s ease',
              '&:hover': {
                boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
              }
            }}
          >
            <Box sx={{ minWidth: 0, flex: 1 }}>
              <Typography
                sx={{
                  fontSize: { xs: '0.8125rem', sm: '0.875rem' },
                  fontWeight: 600,
                  color: '#1E293B',
                  lineHeight: 1.4,
                  mb: 0.25,
                }}
              >
                {item.title}
              </Typography>
              <Typography
                sx={{
                  fontSize: { xs: '0.6875rem', sm: '0.75rem' },
                  color: '#94A3B8',
                  lineHeight: 1.3,
                }}
              >
                {item.desc}
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, width: { xs: 100, sm: 130 }, flexShrink: 0 }}>
              <LinearProgress
                variant='determinate'
                value={item.percentage}
                sx={{
                  flex: 1,
                  height: 6,
                  borderRadius: 3,
                  backgroundColor: '#E2E8F0',
                  '& .MuiLinearProgress-bar': {
                    borderRadius: 3,
                    backgroundColor: color,
                  }
                }}
              />
              <Typography
                sx={{
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  color: '#1E293B',
                  minWidth: 32,
                  textAlign: 'right',
                }}
              >
                {item.percentage}%
              </Typography>
            </Box>
          </Box>
        )
      })}
    </Box>
  </Box>
)

export default PopularItems
