'use client'

import React from 'react'
import { Box, Typography } from '@mui/material'

import AnimatedNumber from './AnimatedNumber'
import { getCategoryPalette } from './categoryColors'

type Props = {
  item: {
    title: string
    revenue: string
    amount?: number
    icon: string
  }
  selected?: boolean
  index?: number
}

const StatsCard = ({ item, selected }: Props) => {
  const palette = getCategoryPalette(item.title)
  const config = { bg: palette.bg, color: palette.primary, gradient: palette.gradient }

  return (
    <Box
      sx={{
        position: 'relative',
        borderRadius: '14px',
        p: { xs: 1.5, sm: 2, md: 2.5 },
        cursor: 'pointer',
        transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
        background: selected ? config.gradient : '#FFFFFF',
        border: '1px solid',
        borderColor: selected ? 'transparent' : 'rgba(15, 23, 42, 0.06)',
        boxShadow: selected
          ? `0 10px 28px ${config.color}40`
          : '0 1px 3px rgba(15, 23, 42, 0.04)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: { xs: 1, sm: 1.5 },
        height: '100%',
        overflow: 'hidden',
        '&::before': selected ? {} : {
          content: '""',
          position: 'absolute',
          left: 0,
          top: 0,
          bottom: 0,
          width: 3,
          backgroundColor: config.color,
          opacity: 0,
          transition: 'opacity 0.2s ease'
        },
        '&:hover': {
          boxShadow: selected
            ? `0 14px 32px ${config.color}50`
            : `0 6px 18px ${config.color}25`,
          transform: 'translateY(-2px)',
          borderColor: selected ? 'transparent' : `${config.color}30`,
          '&::before': { opacity: selected ? 0 : 1 }
        }
      }}
    >
      {/* Left: Title + Amount stacked */}
      <Box sx={{ minWidth: 0, flex: 1 }}>
        <Typography
          noWrap
          sx={{
            fontSize: { xs: '0.625rem', sm: '0.6875rem', md: '0.75rem' },
            fontWeight: 600,
            color: selected ? 'rgba(255,255,255,0.85)' : '#64748B',
            mb: { xs: 0.25, sm: 0.5 },
            lineHeight: 1.3,
            textTransform: 'uppercase',
            letterSpacing: '0.4px'
          }}
        >
          {item.title}
        </Typography>
        <Typography
          noWrap
          sx={{
            fontSize: { xs: '0.9375rem', sm: '1.125rem', md: '1.375rem' },
            fontWeight: 800,
            color: selected ? '#FFFFFF' : '#0F172A',
            lineHeight: 1.15,
            letterSpacing: '-0.02em'
          }}
        >
          {typeof item.amount === 'number' ? (
            <AnimatedNumber value={item.amount} prefix='₹' />
          ) : (
            item.revenue
          )}
        </Typography>
      </Box>

      {/* Right: Icon */}
      <Box
        sx={{
          width: { xs: 32, sm: 38, md: 42 },
          height: { xs: 32, sm: 38, md: 42 },
          borderRadius: '10px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: selected ? 'rgba(255,255,255,0.2)' : config.bg,
          flexShrink: 0,
          transition: 'all 0.25s ease'
        }}
      >
        <i
          className={item.icon}
          style={{
            fontSize: '1.125rem',
            color: selected ? '#FFFFFF' : config.color
          }}
        />
      </Box>
    </Box>
  )
}

export default StatsCard
