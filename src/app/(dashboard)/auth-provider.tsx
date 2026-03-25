'use client'

import { useEffect, useState } from 'react'

import { useRouter, usePathname } from 'next/navigation'

import { CircularProgress } from '@mui/material'

import { clearAuthData, getToken } from '@/utils/authStorage'

interface AuthProviderProps {
  children: React.ReactNode
}

const AuthProvider = ({ children }: AuthProviderProps) => {
  const router = useRouter()
  const pathname = usePathname()
  const [authChecked, setAuthChecked] = useState(false)

  useEffect(() => {
    const checkAuth = async () => {
      // ✅ Skip auth check on login page
      if (pathname === '/login') {
        setAuthChecked(true)

        return
      }

      const accessToken = await getToken()

      if (!accessToken) {
        clearAuthData()
        router.replace('/login')
        
        return
      }

      setAuthChecked(true)
    }

    checkAuth()
  }, [router, pathname])

  if (!authChecked) {
    return (
      <div
        style={{
          display: 'flex',
          height: '100vh',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <CircularProgress />
      </div>
    )
  }

  return <>{children}</>
}

export default AuthProvider
