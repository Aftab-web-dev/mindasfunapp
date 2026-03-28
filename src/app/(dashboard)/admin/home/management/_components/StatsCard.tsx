'use client'

import React from 'react'
import { Box, Typography } from '@mui/material'

type Props = {
  item: {
    title: string
    revenue: string
    icon: string
  }
  selected?: boolean
  index?: number
}

const iconConfigs: Record<number, { bg: string; color: string; gradient: string }> = {
  0: { bg: '#F0ECFA', color: '#523F99', gradient: 'linear-gradient(135deg, #523F99 0%, #7C63D4 100%)' },
  1: { bg: '#EEF2FF', color: '#4F46E5', gradient: 'linear-gradient(135deg, #4F46E5 0%, #818CF8 100%)' },
  2: { bg: '#ECFDF5', color: '#059669', gradient: 'linear-gradient(135deg, #059669 0%, #34D399 100%)' },
  3: { bg: '#FFF7ED', color: '#EA580C', gradient: 'linear-gradient(135deg, #EA580C 0%, #FB923C 100%)' },
  4: { bg: '#FEF2F2', color: '#DC2626', gradient: 'linear-gradient(135deg, #DC2626 0%, #F87171 100%)' },
  5: { bg: '#FAF5FF', color: '#9333EA', gradient: 'linear-gradient(135deg, #9333EA 0%, #C084FC 100%)' },
  6: { bg: '#ECFEFF', color: '#0891B2', gradient: 'linear-gradient(135deg, #0891B2 0%, #22D3EE 100%)' },
  7: { bg: '#FFF1F2', color: '#E11D48', gradient: 'linear-gradient(135deg, #E11D48 0%, #FB7185 100%)' }
}

const StatsCard = ({ item, selected, index = 0 }: Props) => {
  const config = iconConfigs[index % 8]

  return (
    <Box
      sx={{
        borderRadius: '14px',
        p: { xs: 2, sm: 3, md: 4.5 },
        cursor: 'pointer',
        transition: 'all 0.25s ease',
        background: selected ? config.gradient : '#FFFFFF',
        border: '1px solid',
        borderColor: selected ? 'transparent' : 'rgba(0,0,0,0.06)',
        boxShadow: selected
          ? `0 8px 24px ${config.color}40`
          : '0 1px 3px rgba(0,0,0,0.03)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: 1.5,
        height: '100%',
        '&:hover': {
          boxShadow: selected
            ? `0 10px 28px ${config.color}45`
            : '0 4px 14px rgba(0,0,0,0.07)',
          transform: 'translateY(-2px)'
        }
      }}
    >
      {/* Left: Title + Amount stacked */}
      <Box sx={{ minWidth: 0 }}>
        <Typography
          noWrap
          sx={{
            fontSize: { xs: '0.6875rem', sm: '0.8125rem' },
            fontWeight: 500,
            color: selected ? 'rgba(255,255,255,0.75)' : '#64748B',
            mb: 0.5,
            lineHeight: 1.3,
          }}
        >
          {item.title}
        </Typography>
        <Typography
          noWrap
          sx={{
            fontSize: { xs: '1.125rem', sm: '1.25rem', md: '1.5rem' },
            fontWeight: 700,
            color: selected ? '#FFFFFF' : '#1E293B',
            lineHeight: 1.2,
            letterSpacing: '-0.02em'
          }}
        >
          {item.revenue}
        </Typography>
      </Box>

      {/* Right: Icon */}
      <Box
        sx={{
          width: { xs: 34, sm: 42 },
          height: { xs: 34, sm: 42 },
          borderRadius: '10px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: selected ? 'rgba(255,255,255,0.18)' : config.bg,
          flexShrink: 0
        }}
      >
        <i
          className={item.icon}
          style={{
            fontSize: '1.25rem',
            color: selected ? '#FFFFFF' : config.color
          }}
        />
      </Box>
    </Box>
  )
}

export default StatsCard
