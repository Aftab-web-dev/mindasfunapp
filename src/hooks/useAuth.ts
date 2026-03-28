'use client'

import { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { getUser, clearAuthData } from '@/utils/authStorage'

export const useAuth = () => {
  const router = useRouter()
  const [userName, setUserName] = useState('')
  const [userRole, setUserRole] = useState('')

  useEffect(() => {
    const user = getUser()

    if (user) {
      setUserName(user.employeeName || user.userName || 'User')
      setUserRole(user.userAccountTypeId === 1 ? 'Admin' : 'User')
    }
  }, [])

  const handleLogout = useCallback(() => {
    clearAuthData()
    router.push('/login')
  }, [router])

  return { userName, userRole, handleLogout }
}
