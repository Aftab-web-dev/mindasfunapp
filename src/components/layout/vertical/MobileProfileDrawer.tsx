'use client'

import Link from 'next/link'

// MUI Imports
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Drawer from '@mui/material/Drawer'
import Avatar from '@mui/material/Avatar'
import Button from '@mui/material/Button'
import { useTheme } from '@mui/material/styles'

const BRAND = '#523F99'

type Props = {
  open: boolean
  userName: string
  userEmail: string
  onClose: () => void
  onLogout: () => void
}

const MobileProfileDrawer = ({ open, userName, userEmail, onClose, onLogout }: Props) => {
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
          pb: 'calc(env(safe-area-inset-bottom, 0px) + 68px)',
          boxShadow: '0 -8px 30px rgba(0,0,0,0.12)'
        }
      }}
    >
      {/* Drag handle */}
      <Box sx={{ display: 'flex', justifyContent: 'center', pt: 1.5, pb: 1 }}>
        <Box sx={{ width: 32, height: 4, borderRadius: 2, backgroundColor: 'rgba(0,0,0,0.12)' }} />
      </Box>

      {/* Profile card */}
      <Box sx={{ px: 2.5, pb: 2.5 }}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            p: 2,
            borderRadius: '16px',
            backgroundColor: 'rgba(0,0,0,0.02)',
            border: '1px solid',
            borderColor: 'divider'
          }}
        >
          <Avatar
            src='/images/avatars/Profile.png'
            alt={`${userName}'s profile`}
            sx={{
              width: 52,
              height: 52,
              border: '3px solid',
              borderColor: BRAND,
              boxShadow: '0 2px 8px rgba(82,63,153,0.2)'
            }}
          />
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography sx={{ fontWeight: 700, fontSize: '1rem', color: 'text.primary', lineHeight: 1.3 }}>
              {userName || 'User'}
            </Typography>
            <Typography
              sx={{
                fontSize: '0.8rem',
                color: 'text.secondary',
                lineHeight: 1.4,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap'
              }}
            >
              {userEmail || ''}
            </Typography>
          </Box>
          {/* Online indicator */}
          <Box
            sx={{
              width: 10,
              height: 10,
              borderRadius: '50%',
              backgroundColor: '#22c55e',
              border: '2px solid #fff',
              boxShadow: '0 0 0 1px rgba(34,197,94,0.3)',
              flexShrink: 0,
              alignSelf: 'flex-start',
              mt: 0.5
            }}
          />
        </Box>

        {/* Profile actions */}
        <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 0.5 }}>
          <Link href='/admin/profile' onClick={onClose} style={{ textDecoration: 'none' }}>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1.5,
                px: 1.5,
                py: 1.25,
                borderRadius: '12px',
                transition: 'all 150ms ease',
                '&:hover': { backgroundColor: 'rgba(0,0,0,0.03)' },
                '&:active': { transform: 'scale(0.98)' }
              }}
            >
              <Box
                sx={{
                  width: 36,
                  height: 36,
                  borderRadius: '10px',
                  backgroundColor: 'rgba(0,0,0,0.04)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <i className='tabler-user' style={{ fontSize: '1.05rem', color: theme.palette.text.secondary }} />
              </Box>
              <Typography sx={{ fontSize: '0.875rem', fontWeight: 500, color: 'text.primary', flex: 1 }}>
                My Profile
              </Typography>
              <i className='tabler-chevron-right' style={{ fontSize: '0.9rem', color: theme.palette.text.disabled }} />
            </Box>
          </Link>

          <Link href='/admin/help' onClick={onClose} style={{ textDecoration: 'none' }}>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1.5,
                px: 1.5,
                py: 1.25,
                borderRadius: '12px',
                transition: 'all 150ms ease',
                '&:hover': { backgroundColor: 'rgba(0,0,0,0.03)' },
                '&:active': { transform: 'scale(0.98)' }
              }}
            >
              <Box
                sx={{
                  width: 36,
                  height: 36,
                  borderRadius: '10px',
                  backgroundColor: 'rgba(0,0,0,0.04)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <i className='tabler-help-circle' style={{ fontSize: '1.05rem', color: theme.palette.text.secondary }} />
              </Box>
              <Typography sx={{ fontSize: '0.875rem', fontWeight: 500, color: 'text.primary', flex: 1 }}>
                Help & Support
              </Typography>
              <i className='tabler-chevron-right' style={{ fontSize: '0.9rem', color: theme.palette.text.disabled }} />
            </Box>
          </Link>
        </Box>

        {/* Logout button */}
        <Button
          fullWidth
          variant='contained'
          onClick={onLogout}
          sx={{
            mt: 2,
            py: 1.25,
            borderRadius: '12px',
            backgroundColor: '#ef4444',
            textTransform: 'none',
            fontWeight: 600,
            fontSize: '0.875rem',
            boxShadow: '0 2px 8px rgba(239,68,68,0.3)',
            '&:hover': {
              backgroundColor: '#dc2626',
              boxShadow: '0 4px 12px rgba(239,68,68,0.4)'
            }
          }}
          endIcon={<i className='tabler-logout' style={{ fontSize: '1.1rem' }} />}
        >
          Logout
        </Button>
      </Box>
    </Drawer>
  )
}

export default MobileProfileDrawer
