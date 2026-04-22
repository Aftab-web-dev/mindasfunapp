'use client'

import React from 'react'
import { Box, Typography, Chip } from '@mui/material'

type Alert = {
  title: string
  desc: string
  time: string
}

const severityConfig = [
  {
    severity: 'Critical',
    bg: '#FEF2F2',
    borderColor: '#FECACA',
    accentColor: '#DC2626',
    icon: 'tabler-alert-triangle',
    iconBg: 'linear-gradient(135deg, #DC2626 0%, #F87171 100%)',
    chipBg: '#FEE2E2',
    chipColor: '#991B1B',
  },
  {
    severity: 'Warning',
    bg: '#FFF7ED',
    borderColor: '#FED7AA',
    accentColor: '#EA580C',
    icon: 'tabler-device-desktop-off',
    iconBg: 'linear-gradient(135deg, #EA580C 0%, #FB923C 100%)',
    chipBg: '#FFEDD5',
    chipColor: '#9A3412',
  },
  {
    severity: 'High',
    bg: '#F5F3FF',
    borderColor: '#DDD6FE',
    accentColor: '#7C3AED',
    icon: 'tabler-wifi-off',
    iconBg: 'linear-gradient(135deg, #7C3AED 0%, #A78BFA 100%)',
    chipBg: '#EDE9FE',
    chipColor: '#5B21B6',
  },
  {
    severity: 'Medium',
    bg: '#EEF2FF',
    borderColor: '#C7D2FE',
    accentColor: '#4F46E5',
    icon: 'tabler-eye',
    iconBg: 'linear-gradient(135deg, #4F46E5 0%, #818CF8 100%)',
    chipBg: '#E0E7FF',
    chipColor: '#3730A3',
  },
  {
    severity: 'Low',
    bg: '#F0FDF4',
    borderColor: '#BBF7D0',
    accentColor: '#16A34A',
    icon: 'tabler-server',
    iconBg: 'linear-gradient(135deg, #16A34A 0%, #4ADE80 100%)',
    chipBg: '#DCFCE7',
    chipColor: '#166534',
  },
]

const Alerts = ({ alertsData }: { alertsData: Alert[] }) => {

  return (
    <Box
      sx={{
        backgroundColor: '#FFFFFF',
        borderRadius: '16px',
        p: { xs: 2.5, sm: 3, md: 3.5 },
        boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
        border: '1px solid rgba(0,0,0,0.06)',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box
            sx={{
              width: 38,
              height: 38,
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #DC2626 0%, #F87171 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 14px rgba(220, 38, 38, 0.3)',
            }}
          >
            <i className='tabler-bell-ringing' style={{ fontSize: '1.1rem', color: '#FFFFFF' }} />
          </Box>
          <Box>
            <Typography sx={{ fontSize: '1.0625rem', fontWeight: 700, color: '#1E293B', lineHeight: 1.2 }}>
              Recent Alerts
            </Typography>
            <Typography sx={{ fontSize: '0.6875rem', color: '#94A3B8', mt: 0.25 }}>
              {alertsData.length} active
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Alert Cards */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, flex: 1 }}>
        {alertsData.map((alert, idx) => {
          const style = severityConfig[idx % severityConfig.length]

          return (
            <Box
              key={idx}
              sx={{
                borderRadius: '14px',
                backgroundColor: style.bg,
                border: `1.5px solid ${style.borderColor}`,
                p: 0,
                overflow: 'hidden',
                transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                cursor: 'pointer',
                animation: `fadeSlideIn 0.4s ease ${idx * 0.07}s both`,
                '@keyframes fadeSlideIn': {
                  from: { opacity: 0, transform: 'translateY(6px)' },
                  to: { opacity: 1, transform: 'translateY(0)' },
                },
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: `0 8px 24px ${style.accentColor}18`,
                  borderColor: style.accentColor,
                },
              }}
            >
              {/* Colored top accent bar */}
              <Box
                sx={{
                  height: '3px',
                  background: `linear-gradient(90deg, ${style.accentColor} 0%, ${style.accentColor}40 100%)`,
                }}
              />

              <Box sx={{ display: 'flex', gap: 1.5, p: { xs: 1.5, sm: 2 }, alignItems: 'flex-start' }}>
                {/* Icon */}
                <Box
                  sx={{
                    width: 40,
                    height: 40,
                    minWidth: 40,
                    borderRadius: '12px',
                    background: style.iconBg,
                    display: { xs: 'none', sm: 'flex' },
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: `0 4px 12px ${style.accentColor}25`,
                  }}
                >
                  <i className={style.icon} style={{ fontSize: '1.1rem', color: '#FFFFFF' }} />
                </Box>

                {/* Content */}
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  {/* Row 1: Title + Chip */}
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                    <Typography
                      noWrap
                      sx={{
                        fontSize: { xs: '0.8125rem', sm: '0.875rem' },
                        fontWeight: 700,
                        color: '#1E293B',
                        lineHeight: 1.3,
                      }}
                    >
                      {alert.title}
                    </Typography>
                    <Chip
                      label={style.severity}
                      size='small'
                      sx={{
                        height: 20,
                        fontSize: '0.5625rem',
                        fontWeight: 700,
                        letterSpacing: '0.04em',
                        textTransform: 'uppercase',
                        backgroundColor: style.chipBg,
                        color: style.chipColor,
                        borderRadius: '6px',
                        border: `1px solid ${style.accentColor}20`,
                        '& .MuiChip-label': { px: 0.75 },
                      }}
                    />
                  </Box>

                  {/* Row 2: Description + Time */}
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 1 }}>
                    <Typography
                      noWrap
                      sx={{
                        fontSize: { xs: '0.6875rem', sm: '0.75rem' },
                        color: '#64748B',
                        lineHeight: 1.4,
                      }}
                    >
                      {alert.desc}
                    </Typography>
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 0.5,
                        flexShrink: 0,
                        backgroundColor: '#FFFFFF',
                        border: '1px solid #E2E8F0',
                        borderRadius: '8px',
                        px: 1,
                        py: 0.25,
                      }}
                    >
                      <i className='tabler-clock' style={{ fontSize: '0.6875rem', color: '#94A3B8' }} />
                      <Typography
                        sx={{
                          fontSize: '0.625rem',
                          fontWeight: 500,
                          color: '#94A3B8',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {alert.time}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </Box>
            </Box>
          )
        })}
      </Box>

      {/* Footer */}
      <Box
        sx={{
          mt: 2.5,
          pt: 2,
          borderTop: '1px solid #F1F5F9',
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        <Typography
          sx={{
            fontSize: '0.75rem',
            fontWeight: 600,
            color: '#523F99',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 0.5,
            transition: 'all 0.2s',
            '&:hover': { color: '#7C3AED', gap: 1 },
          }}
        >
          View All Alerts
          <i className='tabler-arrow-right' style={{ fontSize: '0.875rem' }} />
        </Typography>
      </Box>
    </Box>
  )
}

export default Alerts
