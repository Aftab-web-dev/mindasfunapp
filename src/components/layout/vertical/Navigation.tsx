'use client'

// React Imports
import { useCallback, useEffect, useRef } from 'react'

// Next Imports
import Link from 'next/link'

// MUI Imports
import { useColorScheme, useTheme } from '@mui/material/styles'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'

// Type Imports
import type { Mode } from '@core/types'

// Component Imports
import VerticalNav, { NavHeader, NavCollapseIcons } from '@menu/vertical-menu'
import VerticalMenu from './VerticalMenu'
import Logo from '@components/layout/shared/Logo'

// Hook Imports
import useVerticalNav from '@menu/hooks/useVerticalNav'
import { useSettings } from '@core/hooks/useSettings'
import { useAuth } from '@/hooks/useAuth'

// Style Imports
import navigationCustomStyles from '@core/styles/vertical/navigationCustomStyles'

const BRAND = '#523F99'

type Props = {
  mode: Mode
}

const Navigation = (props: Props) => {
  const { mode } = props

  // Hooks
  const verticalNavOptions = useVerticalNav()
  const { updateSettings, settings } = useSettings()
  const { mode: muiMode, systemMode: muiSystemMode } = useColorScheme()
  const theme = useTheme()
  const { userName, userRole, handleLogout } = useAuth()

  // Refs
  const shadowRef = useRef<HTMLDivElement>(null)

  // Vars
  const { isCollapsed, isHovered, collapseVerticalNav, isBreakpointReached } = verticalNavOptions
  const isSemiDark = settings.semiDark
  const currentMode = muiMode === 'system' ? muiSystemMode : muiMode || mode
  const isDark = currentMode === 'dark'
  const collapsedNotHovered = isCollapsed && !isHovered

  const scrollMenu = useCallback((container: HTMLElement | Event, isPerfectScrollbar: boolean) => {
    const scrollTarget = isBreakpointReached || !isPerfectScrollbar
      ? (container as Event).target as HTMLElement
      : container as HTMLElement

    if (shadowRef.current && scrollTarget.scrollTop > 0) {
      if (!shadowRef.current.classList.contains('scrolled')) {
        shadowRef.current.classList.add('scrolled')
      }
    } else {
      shadowRef.current?.classList.remove('scrolled')
    }
  }, [isBreakpointReached])

  useEffect(() => {
    if (settings.layout === 'collapsed') {
      collapseVerticalNav(true)
    } else {
      collapseVerticalNav(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [settings.layout])

  return (
    <VerticalNav
      customStyles={navigationCustomStyles(verticalNavOptions, theme)}
      collapsedWidth={72}
      backgroundColor={BRAND}
      {...(isSemiDark &&
        !isDark && {
          'data-dark': ''
        })}
    >
      {/* Nav Header */}
      <NavHeader>
        <Link href='#'>
          <Logo />
        </Link>
        {!collapsedNotHovered && (
          <NavCollapseIcons
            lockedIcon={
              <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 28, height: 28, borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.15)' }}>
                <i className='tabler-chevron-left' style={{ fontSize: '0.875rem', color: '#fff' }} />
              </span>
            }
            unlockedIcon={
              <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 28, height: 28, borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.15)' }}>
                <i className='tabler-chevron-right' style={{ fontSize: '0.875rem', color: '#fff' }} />
              </span>
            }
            closeIcon={
              <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 28, height: 28, borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.15)' }}>
                <i className='tabler-x' style={{ fontSize: '0.875rem', color: '#fff' }} />
              </span>
            }
            onClick={() => updateSettings({ layout: !isCollapsed ? 'collapsed' : 'vertical' })}
          />
        )}
      </NavHeader>

      {/* Main Menu */}
      <VerticalMenu scrollMenu={scrollMenu} />

      {/* Bottom: Profile + Logout */}
      <Box
        sx={{
          mt: 'auto',
          borderTop: '1px solid rgba(255,255,255,0.1)',
          px: collapsedNotHovered ? 0 : 2.5,
          py: 2,
          display: 'flex',
          flexDirection: 'column',
          alignItems: collapsedNotHovered ? 'center' : 'stretch',
          gap: 1,
        }}
      >
        {/* Profile */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1.5,
            px: 1,
            py: 0.75,
            borderRadius: '10px',
            justifyContent: collapsedNotHovered ? 'center' : 'flex-start',
          }}
        >
          <Box
            sx={{
              width: 34,
              height: 34,
              borderRadius: '10px',
              backgroundColor: 'rgba(255,255,255,0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <i className='tabler-user' style={{ fontSize: '1.125rem', color: '#fff' }} />
          </Box>
          {!collapsedNotHovered && (
            <Box sx={{ overflow: 'hidden' }}>
              <Typography
                noWrap
                sx={{ fontSize: '0.8125rem', fontWeight: 600, color: '#fff', lineHeight: 1.3 }}
              >
                {userName || 'User'}
              </Typography>
              <Typography
                noWrap
                sx={{ fontSize: '0.6875rem', fontWeight: 500, color: 'rgba(255,255,255,0.5)', lineHeight: 1.3 }}
              >
                {userRole || 'Admin'}
              </Typography>
            </Box>
          )}
        </Box>

        {/* Logout */}
        <Box
          role='button'
          tabIndex={0}
          aria-label='Logout'
          onClick={handleLogout}
          onKeyDown={(e) => e.key === 'Enter' && handleLogout()}
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1.5,
            px: 1.5,
            py: 0.75,
            borderRadius: '10px',
            cursor: 'pointer',
            transition: 'background-color 150ms ease',
            justifyContent: collapsedNotHovered ? 'center' : 'flex-start',
            '&:hover': {
              backgroundColor: 'rgba(255,255,255,0.1)',
            },
          }}
        >
          <i className='tabler-logout' style={{ fontSize: '1.125rem', color: 'rgba(255,255,255,0.7)' }} />
          {!collapsedNotHovered && (
            <Typography sx={{ fontSize: '0.8125rem', fontWeight: 500, color: 'rgba(255,255,255,0.7)' }}>
              Logout
            </Typography>
          )}
        </Box>
      </Box>
    </VerticalNav>
  )
}

export default Navigation
