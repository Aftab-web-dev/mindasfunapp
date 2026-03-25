'use client'

import React, { useEffect, useState } from 'react'

import { FaSpinner } from 'react-icons/fa'

import StatsCard from './StatsCard'
import DataTable from './DataTable'
import PendingOrders from './Alerts'
import PopularItems from './PopularItems'

import { dashboardApi } from '@/api/dashboard-api'
import { getUser } from '@/utils/authStorage'

const HomePage = () => {
  const [statsCardArray, setStatsCardArray] = useState<any[]>([])
  const [selectedStat, setSelectedStat] = useState<any | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [user, setUser] = useState<any | null>(null)

  /* ------------------ Get user safely ------------------ */
  useEffect(() => {
    const storedUser = getUser()

    setUser(storedUser)
  }, [])

  /* ------------------ API Call ------------------ */
  const fetchDashboardData = async (branchId: number) => {
    try {
      setLoading(true)

      const response = await dashboardApi.getStoreData({ branchId })
      const data = response.data.data || []

      setStatsCardArray(data)

      if (data.length > 0) {
        setSelectedStat(data[0])
      }
    } catch (error) {
      console.error('Dashboard API error:', error)
    } finally {
      setLoading(false)
    }
  }

  /* ------------------ Trigger API when user exists ------------------ */
  useEffect(() => {
    if (user?.branchId) {
      fetchDashboardData(user.branchId)
    }
  }, [user])

  /* ------------------ Loading UI ------------------ */
  if (loading) {
    return (
      <div className='flex items-center justify-center h-[60vh]'>
        <FaSpinner className='animate-spin text-xl' />
      </div>
    )
  }

  /* ------------------ Empty State ------------------ */
  if (!statsCardArray.length) {
    return <div className='text-center py-10'>No dashboard data found</div>
  }

  return (
    <div>
      {/* -------- Stats Cards -------- */}
      <div className='grid lg:grid-cols-4 md:grid-cols-3 grid-cols-2 gap-4'>
        {statsCardArray.map((item, i) => (
          <div key={i} onClick={() => setSelectedStat(item)}>
            <StatsCard item={item} selected={selectedStat?.title === item.title} />
          </div>
        ))}
      </div>

      {/* -------- Details Section -------- */}
      {selectedStat && (
        <div className='md:grid md:grid-cols-12 gap-4 pt-4'>
          <div className='md:col-span-8 h-full'>
            <DataTable statusData={selectedStat.statusData} title={selectedStat.title} />
          </div>

          <div className='md:col-span-4 max-md:pt-4'>
            <PendingOrders pendingData={selectedStat.pendingData} />

            <div className='pt-4'>
              <PopularItems popularData={selectedStat.popularData} />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default HomePage
