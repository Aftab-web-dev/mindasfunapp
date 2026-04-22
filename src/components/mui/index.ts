'use client'

import React from 'react'
import { styled, alpha } from '@mui/material/styles'
import {
  Button,
  ButtonProps,
  Box,
  BoxProps,
  Card,
  CardProps,
  Typography,
  TypographyProps,
  Chip,
  ChipProps,
  Paper,
  PaperProps
} from '@mui/material'

export const CustomButton = styled(Button)<ButtonProps>(({ variant }) => ({
  borderRadius: 10,
  padding: '10px 24px',
  fontWeight: 600,
  fontSize: '0.9375rem',
  textTransform: 'none' as const,
  boxShadow: 'none',
  transition: 'all 0.2s ease',
  ...(variant === 'contained' && {
    '&:hover': {
      boxShadow: '0 4px 12px rgba(82, 63, 153, 0.25)',
      transform: 'translateY(-1px)'
    }
  }),
  ...(variant === 'outlined' && {
    borderWidth: '1.5px',
    '&:hover': {
      borderWidth: '1.5px',
      transform: 'translateY(-1px)'
    }
  })
}))

export const GradientButton = styled(CustomButton)({
  background: 'linear-gradient(135deg, #523F99 0%, #7C63D4 100%)',
  '&:hover': {
    background: 'linear-gradient(135deg, #6B52C4 0%, #8B73E4 100%)',
    boxShadow: '0 6px 20px rgba(82, 63, 153, 0.35)'
  }
})

export const CustomCard = styled(Card)<CardProps>(({ theme }) => ({
  borderRadius: 16,
  boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
  border: '1px solid rgba(0,0,0,0.06)',
  transition: 'box-shadow 0.2s ease, transform 0.2s ease',
  '&:hover': {
    boxShadow: '0 8px 24px rgba(0,0,0,0.1)'
  }
}))

export const StatCard = styled(CustomCard)<{ selected?: boolean; color?: string }>(
  ({ theme, selected, color = '#523F99' }) => ({
    padding: theme.spacing(2.5),
    cursor: 'pointer',
    background: selected ? `linear-gradient(135deg, ${color} 0%, ${alpha(color, 0.8)} 100%)` : '#FFFFFF',
    border: '1px solid',
    borderColor: selected ? 'transparent' : 'rgba(0,0,0,0.06)',
    boxShadow: selected ? `0 8px 24px ${alpha(color, 0.35)}` : '0 1px 3px rgba(0,0,0,0.03)',
    '&:hover': {
      boxShadow: selected ? `0 10px 28px ${alpha(color, 0.4)}` : '0 8px 20px rgba(0,0,0,0.08)',
      transform: 'translateY(-2px)'
    }
  })
)

export const CustomChip = styled(Chip)<ChipProps>(({ theme, color }) => ({
  borderRadius: 8,
  fontWeight: 500,
  ...(color === 'success' && {
    backgroundColor: alpha(theme.palette.success.main, 0.12),
    color: theme.palette.success.dark
  }),
  ...(color === 'warning' && {
    backgroundColor: alpha(theme.palette.warning.main, 0.12),
    color: theme.palette.warning.dark
  }),
  ...(color === 'error' && {
    backgroundColor: alpha(theme.palette.error.main, 0.12),
    color: theme.palette.error.dark
  }),
  ...(color === 'info' && {
    backgroundColor: alpha(theme.palette.info.main, 0.12),
    color: theme.palette.info.dark
  })
}))

export const GlassCard = styled(Card)<CardProps>(({ theme }) => ({
  borderRadius: 16,
  background: 'rgba(255, 255, 255, 0.8)',
  backdropFilter: 'blur(10px)',
  border: '1px solid rgba(255, 255, 255, 0.5)',
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)'
}))

export const SectionHeading = styled(Typography)<TypographyProps>(({ theme }) => ({
  fontSize: '1.125rem',
  fontWeight: 700,
  color: theme.palette.text.primary,
  marginBottom: theme.spacing(2)
}))

export const PageTitle = styled(Typography)<TypographyProps>(({ theme }) => ({
  fontSize: '1.5rem',
  fontWeight: 700,
  color: theme.palette.text.primary,
  marginBottom: theme.spacing(1)
}))

export const PageSubtitle = styled(Typography)<TypographyProps>(({ theme }) => ({
  fontSize: '0.9375rem',
  color: theme.palette.text.secondary,
  marginBottom: theme.spacing(3)
}))

export { alpha }
