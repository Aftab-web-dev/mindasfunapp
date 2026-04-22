'use client'

import React from 'react'
import { Box, Typography } from '@mui/material'

type Props = {
  item: {
    title: string
    revenue: string
    status: boolean
    status_content: string
    icon: string
  }
  selected: boolean
  index?: number
}

const cardConfigs: Record<number, {
  gradient: string
  selectedGlow: string
  color: string
  iconBg: string
  iconSelectedBg: string
  badgeBg: string
  badgeColor: string
  badgeSelectedBg: string
  lightBg: string
  lightBorder: string
}> = {
  0: {
    gradient: 'linear-gradient(135deg, #523F99 0%, #7C63D4 60%, #A78BFA 100%)',
    selectedGlow: '0 10px 30px rgba(82, 63, 153, 0.35)',
    color: '#523F99',
    iconBg: '#F0ECFA',
    iconSelectedBg: 'rgba(255,255,255,0.2)',
    badgeBg: '#DCFCE7',
    badgeColor: '#166534',
    badgeSelectedBg: 'rgba(255,255,255,0.22)',
    lightBg: '#FFFFFF',
    lightBorder: '#E8E3F3',
  },
  1: {
    gradient: 'linear-gradient(135deg, #4F46E5 0%, #818CF8 60%, #A5B4FC 100%)',
    selectedGlow: '0 10px 30px rgba(79, 70, 229, 0.35)',
    color: '#4F46E5',
    iconBg: '#EEF2FF',
    iconSelectedBg: 'rgba(255,255,255,0.2)',
    badgeBg: '#FEE2E2',
    badgeColor: '#991B1B',
    badgeSelectedBg: 'rgba(255,255,255,0.22)',
    lightBg: '#FFFFFF',
    lightBorder: '#D8DEFE',
  },
  2: {
    gradient: 'linear-gradient(135deg, #EA580C 0%, #FB923C 60%, #FDBA74 100%)',
    selectedGlow: '0 10px 30px rgba(234, 88, 12, 0.35)',
    color: '#EA580C',
    iconBg: '#FFF7ED',
    iconSelectedBg: 'rgba(255,255,255,0.2)',
    badgeBg: '#FEE2E2',
    badgeColor: '#991B1B',
    badgeSelectedBg: 'rgba(255,255,255,0.22)',
    lightBg: '#FFFFFF',
    lightBorder: '#FED7AA',
  },
  3: {
    gradient: 'linear-gradient(135deg, #059669 0%, #34D399 60%, #6EE7B7 100%)',
    selectedGlow: '0 10px 30px rgba(5, 150, 105, 0.35)',
    color: '#059669',
    iconBg: '#ECFDF5',
    iconSelectedBg: 'rgba(255,255,255,0.2)',
    badgeBg: '#DBEAFE',
    badgeColor: '#1E40AF',
    badgeSelectedBg: 'rgba(255,255,255,0.22)',
    lightBg: '#FFFFFF',
    lightBorder: '#A7F3D0',
  },
  4: {
    gradient: 'linear-gradient(135deg, #DC2626 0%, #F87171 60%, #FCA5A5 100%)',
    selectedGlow: '0 10px 30px rgba(220, 38, 38, 0.35)',
    color: '#DC2626',
    iconBg: '#FEF2F2',
    iconSelectedBg: 'rgba(255,255,255,0.2)',
    badgeBg: '#FFEDD5',
    badgeColor: '#9A3412',
    badgeSelectedBg: 'rgba(255,255,255,0.22)',
    lightBg: '#FFFFFF',
    lightBorder: '#FECACA',
  },
  5: {
    gradient: 'linear-gradient(135deg, #7C3AED 0%, #A78BFA 60%, #C4B5FD 100%)',
    selectedGlow: '0 10px 30px rgba(124, 58, 237, 0.35)',
    color: '#7C3AED',
    iconBg: '#F5F3FF',
    iconSelectedBg: 'rgba(255,255,255,0.2)',
    badgeBg: '#DCFCE7',
    badgeColor: '#166534',
    badgeSelectedBg: 'rgba(255,255,255,0.22)',
    lightBg: '#FFFFFF',
    lightBorder: '#DDD6FE',
  },
}

const StatsCard = ({ item, selected, index = 0 }: Props) => {
  const config = cardConfigs[index % 6]

  return (
    <Box
      sx={{
        borderRadius: '16px',
        p: { xs: 2, sm: 2.5, md: 3 },
        cursor: 'pointer',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        position: 'relative',
        overflow: 'hidden',
        background: selected ? config.gradient : config.lightBg,
        border: selected ? 'none' : `1.5px solid ${config.lightBorder}`,
        boxShadow: selected
          ? config.selectedGlow
          : '0 1px 3px rgba(0,0,0,0.04)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: 1.5,
        height: '100%',
        '&:hover': {
          boxShadow: selected
            ? config.selectedGlow
            : `0 6px 20px ${config.color}15`,
          transform: selected ? 'translateY(-3px) scale(1.01)' : 'translateY(-3px)',
          borderColor: selected ? 'transparent' : config.color,
        },
        // Decorative background circle for selected
        ...(selected && {
          '&::before': {
            content: '""',
            position: 'absolute',
            right: -20,
            top: -20,
            width: 100,
            height: 100,
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.08)',
          },
          '&::after': {
            content: '""',
            position: 'absolute',
            right: 30,
            bottom: -30,
            width: 60,
            height: 60,
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.05)',
          },
        }),
      }}
    >
      {/* Left content */}
      <Box sx={{ minWidth: 0, position: 'relative', zIndex: 1 }}>
        <Typography
          noWrap
          sx={{
            fontSize: { xs: '0.6875rem', sm: '0.8125rem', md: '0.875rem' },
            fontWeight: 500,
            color: selected ? 'rgba(255,255,255,0.85)' : '#64748B',
            mb: 0.75,
            lineHeight: 1.3,
            letterSpacing: '0.01em',
          }}
        >
          {item.title}
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1.5, flexWrap: 'wrap' }}>
          <Typography
            noWrap
            sx={{
              fontSize: { xs: '1rem', sm: '1.25rem', md: '1.5rem' },
              fontWeight: 800,
              color: selected ? '#FFFFFF' : '#0F172A',
              lineHeight: 1.2,
              letterSpacing: '-0.02em',
            }}
          >
            {item.revenue}
          </Typography>

          <Box
            sx={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 0.5,
              px: 1,
              py: 0.25,
              borderRadius: '6px',
              fontSize: { xs: '0.5rem', sm: '0.6rem', md: '0.6875rem' },
              fontWeight: 700,
              backgroundColor: selected
                ? config.badgeSelectedBg
                : config.badgeBg,
              color: selected
                ? '#FFFFFF'
                : config.badgeColor,
              lineHeight: 1.4,
              whiteSpace: 'nowrap',
              backdropFilter: selected ? 'blur(8px)' : 'none',
            }}
          >
            {item.status_content}
          </Box>
        </Box>
      </Box>

      {/* Right icon */}
      <Box
        sx={{
          width: { xs: 36, sm: 42, md: 46 },
          height: { xs: 36, sm: 42, md: 46 },
          borderRadius: '12px',
          display: { xs: 'none', sm: 'flex' },
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: selected ? config.iconSelectedBg : config.iconBg,
          backdropFilter: selected ? 'blur(8px)' : 'none',
          flexShrink: 0,
          position: 'relative',
          zIndex: 1,
          transition: 'all 0.3s ease',
        }}
      >
        <i
          className={item.icon}
          style={{
            fontSize: '1.35rem',
            color: selected ? '#FFFFFF' : config.color,
          }}
        />
      </Box>
    </Box>
  )
}

export default StatsCard
