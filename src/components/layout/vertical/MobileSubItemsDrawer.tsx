'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

// MUI Imports
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Drawer from '@mui/material/Drawer'
import { useTheme } from '@mui/material/styles'

const BRAND = '#523F99'
const BRAND_BG = 'rgba(82, 63, 153, 0.07)'
const BRAND_BG_HOVER = 'rgba(82, 63, 153, 0.12)'

type SubItem = { label: string; href: string; icon?: string }

type TabItem = {
  id: string
  label: string
  icon: string
  href?: string
  matchPaths: string[]
  children?: SubItem[]
}

type Props = {
  open: boolean
  tab: TabItem | undefined
  onClose: () => void
}

const MobileSubItemsDrawer = ({ open, tab, onClose }: Props) => {
  const pathname = usePathname()
  const theme = useTheme()

  return (
    <Drawer
      anchor='bottom'
      open={open}
      onClose={onClose}
      slotProps={{
        backdrop: {
          sx: { backgroundColor: 'rgba(0,0,0,0.3)' }
        }
      }}
      PaperProps={{
        sx: {
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          maxHeight: '65vh',
          pb: 'calc(env(safe-area-inset-bottom, 0px) + 68px)',
          boxShadow: '0 -8px 30px rgba(0,0,0,0.12)'
        }
      }}
    >
      {/* Drag handle */}
      <Box sx={{ display: 'flex', justifyContent: 'center', pt: 1.5, pb: 1 }}>
        <Box sx={{ width: 32, height: 4, borderRadius: 2, backgroundColor: 'rgba(0,0,0,0.12)' }} />
      </Box>

      {/* Sheet header */}
      {tab && (
        <Box sx={{ px: 2, pb: 2, display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box
            sx={{
              width: 40,
              height: 40,
              borderRadius: '12px',
              background: `linear-gradient(135deg, ${BRAND} 0%, rgba(82,63,153,0.7) 100%)`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 2px 8px rgba(82,63,153,0.25)'
            }}
          >
            <i className={tab.icon} style={{ fontSize: '1.2rem', color: '#fff' }} />
          </Box>
          <Box>
            <Typography sx={{ fontWeight: 700, fontSize: '1rem', color: 'text.primary', lineHeight: 1.3 }}>
              {tab.label}
            </Typography>
            <Typography sx={{ fontSize: '0.75rem', color: 'text.disabled', lineHeight: 1.3 }}>
              {tab.children?.length} options
            </Typography>
          </Box>
        </Box>
      )}

      {/* Sub-items list */}
      <Box sx={{ px: 1.5, pb: 1 }}>
        {tab?.children?.map(item => {
          const active = pathname === item.href || pathname.startsWith(item.href + '/')

          return (
            <Link key={item.href} href={item.href} onClick={onClose} style={{ textDecoration: 'none' }}>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1.5,
                  px: 1.5,
                  py: 1.25,
                  mb: 0.5,
                  borderRadius: '12px',
                  backgroundColor: active ? BRAND_BG : 'transparent',
                  transition: 'all 150ms ease',
                  '&:hover': {
                    backgroundColor: active ? BRAND_BG_HOVER : 'rgba(0,0,0,0.03)'
                  },
                  '&:active': {
                    transform: 'scale(0.98)'
                  }
                }}
              >
                <Box
                  sx={{
                    width: 36,
                    height: 36,
                    borderRadius: '10px',
                    backgroundColor: active ? BRAND : 'rgba(0,0,0,0.04)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    transition: 'all 150ms ease'
                  }}
                >
                  <i
                    className={item.icon || 'tabler-circle'}
                    style={{
                      fontSize: '1.05rem',
                      color: active ? '#fff' : theme.palette.text.secondary
                    }}
                  />
                </Box>
                <Typography
                  sx={{
                    fontSize: '0.875rem',
                    fontWeight: active ? 600 : 400,
                    color: active ? BRAND : 'text.primary',
                    flex: 1
                  }}
                >
                  {item.label}
                </Typography>
                {active && (
                  <Box sx={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: BRAND, flexShrink: 0 }} />
                )}
                {!active && (
                  <i className='tabler-chevron-right' style={{ fontSize: '0.9rem', color: theme.palette.text.disabled }} />
                )}
              </Box>
            </Link>
          )
        })}
      </Box>
    </Drawer>
  )
}

export default MobileSubItemsDrawer
