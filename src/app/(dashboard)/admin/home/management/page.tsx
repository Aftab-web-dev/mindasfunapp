'use client'

import { useEffect, useState } from 'react'

import Box from '@mui/material/Box'
import Skeleton from '@mui/material/Skeleton'

import { managementDashboardApi } from '@/api/management-dashboard'
import HomePage from './_components/HomePage'

const DashboardSkeleton = () => (
  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, p: { xs: 2, sm: 3 } }}>
    <Skeleton variant='text' width={180} height={28} sx={{ borderRadius: '8px' }} />
    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' }, gap: 2 }}>
      {[...Array(8)].map((_, i) => (
        <Skeleton key={i} variant='rounded' height={85} sx={{ borderRadius: '14px' }} />
      ))}
    </Box>
    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '1fr 320px' }, gap: 3 }}>
      <Skeleton variant='rounded' height={400} sx={{ borderRadius: '16px' }} />
      <Skeleton variant='rounded' height={400} sx={{ borderRadius: '16px' }} />
    </Box>
  </Box>
)

const Page = () => {
  const [stats, setStats] = useState<any>(null)

  useEffect(() => {
    managementDashboardApi.widgetValues().then(res => {
      if (res.data?.data?.[0]) {
        setStats(res.data.data[0])
      }
    }).catch(() => {})
  }, [])

  if (!stats) {
    return <DashboardSkeleton />
  }

  return <HomePage stats={stats} />
}

export default Page
