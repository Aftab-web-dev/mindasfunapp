'use client'

import { useEffect, useState } from 'react'

import { useRouter, usePathname } from 'next/navigation'

import Box from '@mui/material/Box'
import Skeleton from '@mui/material/Skeleton'

import { clearAuthData, getToken } from '@/utils/authStorage'

interface AuthProviderProps {
  children: React.ReactNode
}

const AppSkeleton = () => (
  <Box sx={{ display: 'flex', height: '100vh', backgroundColor: '#F8FAFC' }}>
    {/* Sidebar skeleton - desktop only */}
    <Box sx={{ width: 260, display: { xs: 'none', lg: 'flex' }, flexDirection: 'column', gap: 1.5, p: 2, borderRight: '1px solid rgba(0,0,0,0.06)' }}>
      <Skeleton variant='rounded' width={140} height={32} sx={{ borderRadius: '8px', mb: 2 }} />
      {[...Array(7)].map((_, i) => (
        <Skeleton key={i} variant='rounded' height={38} sx={{ borderRadius: '10px' }} />
      ))}
    </Box>
    {/* Main content skeleton */}
    <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
      {/* Top bar */}
      <Box sx={{ height: 64, px: 3, display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
        <Skeleton variant='rounded' width={160} height={28} sx={{ borderRadius: '8px' }} />
        <Skeleton variant='circular' width={36} height={36} />
      </Box>
      {/* Page content */}
      <Box sx={{ p: { xs: 2, sm: 3 }, display: 'flex', flexDirection: 'column', gap: 3 }}>
        <Skeleton variant='text' width={200} height={32} sx={{ borderRadius: '8px' }} />
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' }, gap: 2 }}>
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} variant='rounded' height={85} sx={{ borderRadius: '14px' }} />
          ))}
        </Box>
        <Skeleton variant='rounded' height={350} sx={{ borderRadius: '16px' }} />
      </Box>
    </Box>
  </Box>
)

const AuthProvider = ({ children }: AuthProviderProps) => {
  const router = useRouter()
  const pathname = usePathname()

  // Skip auth check instantly for login page — no flash
  const isLoginPage = pathname === '/login'
  const [authChecked, setAuthChecked] = useState(isLoginPage)

  useEffect(() => {
    if (isLoginPage) {
      setAuthChecked(true)

      return
    }

    const checkAuth = async () => {
      const accessToken = await getToken()

      if (!accessToken) {
        clearAuthData()
        router.replace('/login')

        return
      }

      setAuthChecked(true)
    }

    checkAuth()
  }, [router, pathname, isLoginPage])

  if (!authChecked) {
    return <AppSkeleton />
  }

  return <>{children}</>
}

export default AuthProvider
