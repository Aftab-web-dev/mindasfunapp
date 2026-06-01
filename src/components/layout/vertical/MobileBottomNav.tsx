'use client'

import { usePathname, useRouter } from 'next/navigation'
import { useCallback, useEffect, useState } from 'react'

// MUI Imports
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import useMediaQuery from '@mui/material/useMediaQuery'
import { useTheme } from '@mui/material/styles'

// Auth Imports
import { getUser, clearAuthData } from '@/utils/authStorage'

// Component Imports
import MobileSubItemsDrawer from './MobileSubItemsDrawer'
import MobileProfileDrawer from './MobileProfileDrawer'

const BRAND = '#523F99'
const BRAND_BG = 'rgba(82, 63, 153, 0.07)'

type SubItem = { label: string; href: string; icon?: string }

type TabItem = {
  id: string
  label: string
  icon: string
  href?: string
  matchPaths: string[]
  children?: SubItem[]
}

const tabs: TabItem[] = [
  {
    id: 'home',
    label: 'Home',
    icon: 'tabler-smart-home',
    href: '/admin/home/management',
    matchPaths: ['/admin/home']
  },
  {
    id: 'events',
    label: 'Events',
    icon: 'tabler-calendar-event',
    matchPaths: ['/admin/events'],
    children: [
      { label: 'Add an Event', href: '/admin/events/add-event', icon: 'tabler-plus' },
      { label: 'Request Events', href: '/admin/events/req-event', icon: 'tabler-send' },
      { label: 'View Events', href: '/admin/events', icon: 'tabler-list' }
    ]
  },
  {
    id: 'customers',
    label: 'Customers',
    icon: 'tabler-users',
    matchPaths: ['/admin/customers'],
    children: [
      { label: 'Add a Customer', href: '/admin/customers/add-customer', icon: 'tabler-user-plus' },
      { label: 'View Customers', href: '/admin/customers', icon: 'tabler-list' }
    ]
  },
  {
    id: 'more',
    label: 'More',
    icon: 'tabler-grid-dots',
    matchPaths: ['/admin/recharge', '/admin/waiver', '/admin/view-signed', '/admin/check-in', '/admin/export-waiver'],
    children: [
      { label: 'Recharge & Balance', href: '/admin/recharge-and-balance', icon: 'tabler-recharging' },
      { label: 'Register Template', href: '/admin/waiver-template/add', icon: 'tabler-file-plus' },
      { label: 'Waiver Templates', href: '/admin/waiver-template', icon: 'tabler-file-check' },
      { label: 'Signed Waivers', href: '/admin/view-signed-waivers', icon: 'tabler-file-check' },
      { label: 'Check-in History', href: '/admin/check-in-history', icon: 'tabler-history' },
      { label: 'Export Data', href: '/admin/export-waiver-data', icon: 'tabler-download' }
    ]
  },
  {
    id: 'reports',
    label: 'Reports',
    icon: 'tabler-file-text',
    href: '/admin/reports',
    matchPaths: ['/admin/reports']
  }
]

const MobileBottomNav = () => {
  const pathname = usePathname()
  const router = useRouter()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('lg'))
  const [openDrawer, setOpenDrawer] = useState<string | null>(null)
  const [userName, setUserName] = useState('')
  const [userEmail, setUserEmail] = useState('')

  useEffect(() => {
    const user = getUser()

    if (user) {
      setUserName(user.employeeName || user.userName || 'User')
      setUserEmail(user.userName || '')
    }
  }, [])

  const handleCloseDrawer = useCallback(() => {
    setOpenDrawer(null)
  }, [])

  const handleLogout = useCallback(() => {
    setOpenDrawer(null)
    clearAuthData()
    router.push('/login')
  }, [router])

  const handleTabClick = useCallback((tab: TabItem) => {
    if (tab.id === 'profile') {
      setOpenDrawer('profile')
    } else if (tab.children) {
      setOpenDrawer(tab.id)
    } else if (tab.href) {
      router.push(tab.href)
    }
  }, [router])

  if (!isMobile) return null

  const isTabActive = (tab: TabItem) => tab.matchPaths.some(p => pathname.startsWith(p))
  const activeDrawerTab = tabs.find(t => t.id === openDrawer)

  return (
    <>
      {/* Bottom Tab Bar */}
      <Box
        component='nav'
        role='navigation'
        aria-label='Mobile navigation'
        sx={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: theme.zIndex.appBar + 1,
          backgroundColor: '#fff',
          borderTop: '1px solid',
          borderColor: 'divider',
          display: 'flex',
          alignItems: 'stretch',
          height: 60,
          boxShadow: '0 -1px 12px rgba(0,0,0,0.08)',
          paddingBottom: 'env(safe-area-inset-bottom, 0px)'
        }}
      >
        {tabs.map(tab => {
          const active = isTabActive(tab)
          const isOpen = openDrawer === tab.id

          return (
            <Box
              key={tab.id}
              role='button'
              tabIndex={0}
              aria-label={tab.label}
              onClick={() => handleTabClick(tab)}
              onKeyDown={(e) => e.key === 'Enter' && handleTabClick(tab)}
              sx={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                position: 'relative',
                WebkitTapHighlightColor: 'transparent',
                userSelect: 'none',
                py: 0.75
              }}
            >
              {/* Active pill behind icon */}
              <Box
                sx={{
                  width: 48,
                  height: 28,
                  borderRadius: '14px',
                  backgroundColor: active || isOpen ? BRAND_BG : 'transparent',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'background-color 200ms ease'
                }}
              >
                <i
                  className={tab.icon}
                  style={{
                    fontSize: '1.25rem',
                    color: active || isOpen ? BRAND : theme.palette.text.disabled,
                    transition: 'color 200ms ease'
                  }}
                />
              </Box>
              <Typography
                sx={{
                  fontSize: '0.6rem',
                  fontWeight: active || isOpen ? 700 : 500,
                  color: active || isOpen ? BRAND : 'text.disabled',
                  lineHeight: 1,
                  letterSpacing: '0.1px',
                  mt: 0.25
                }}
              >
                {tab.label}
              </Typography>
            </Box>
          )
        })}
      </Box>

      {/* Sub-items Drawer */}
      <MobileSubItemsDrawer
        open={openDrawer !== null && openDrawer !== 'profile'}
        tab={activeDrawerTab}
        onClose={handleCloseDrawer}
      />

      {/* Profile Drawer */}
      <MobileProfileDrawer
        open={openDrawer === 'profile'}
        userName={userName}
        userEmail={userEmail}
        onClose={handleCloseDrawer}
        onLogout={handleLogout}
      />
    </>
  )
}

export default MobileBottomNav
