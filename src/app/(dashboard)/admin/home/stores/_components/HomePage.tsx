'use client'

import React, { useEffect, useState } from 'react'
import { Box, CircularProgress, Typography } from '@mui/material'

import StatsCard from './StatsCard'
import DataTable from './DataTable'
import PendingOrders from './Alerts'
import PopularItems from './PopularItems'

import { dashboardApi } from '@/api/dashboard-api'
import { getUser } from '@/utils/authStorage'

const demoData = [
  {
    title: 'Food & Beverages',
    revenue: '1,240 Items',
    status: true,
    status_content: 'Stocked',
    icon: 'tabler-coffee',
    statusData: [
      { item: 'Coca Cola 330ml', category: 'Drinks', stock: 248, threshold: 50, status: { label: 'In Stock', color: '' } },
      { item: 'Pepsi 330ml', category: 'Drinks', stock: 180, threshold: 50, status: { label: 'In Stock', color: '' } },
      { item: 'Nachos Cheese', category: 'Snacks', stock: 32, threshold: 40, status: { label: 'Low Stock', color: '' } },
      { item: 'Hot Dog Buns', category: 'Food', stock: 8, threshold: 30, status: { label: 'Critical', color: '' } },
      { item: 'Popcorn Large', category: 'Snacks', stock: 120, threshold: 25, status: { label: 'In Stock', color: '' } },
    ],
    pendingData: [
      { title: 'Nachos Cheese (200 pcs)', supplier: 'SnackWorld Inc.', quantity: 200, date: 'Apr 24' },
      { title: 'Hot Dog Buns (300 pcs)', supplier: 'Baker Bros.', quantity: 300, date: 'Apr 25' },
      { title: 'Juice Boxes Assorted', supplier: 'FreshDrinks Co.', quantity: 500, date: 'Apr 26' },
    ],
    popularData: [
      { title: 'Coca Cola 330ml', desc: 'Sold 520 this week', percentage: 92 },
      { title: 'Popcorn Large', desc: 'Sold 380 this week', percentage: 78 },
      { title: 'Nachos Cheese', desc: 'Sold 290 this week', percentage: 65 },
      { title: 'Ice Cream Cone', desc: 'Sold 210 this week', percentage: 48 },
    ],
  },
  {
    title: 'Merchandise',
    revenue: '680 Items',
    status: true,
    status_content: 'Good',
    icon: 'tabler-shirt',
    statusData: [
      { item: 'Midas T-Shirt (M)', category: 'Apparel', stock: 45, threshold: 20, status: { label: 'In Stock', color: '' } },
      { item: 'Midas Cap', category: 'Accessories', stock: 12, threshold: 15, status: { label: 'Low Stock', color: '' } },
      { item: 'Keychain Set', category: 'Souvenirs', stock: 200, threshold: 30, status: { label: 'In Stock', color: '' } },
      { item: 'Plush Toy Bear', category: 'Toys', stock: 5, threshold: 10, status: { label: 'Critical', color: '' } },
      { item: 'Wristband Pack', category: 'Accessories', stock: 350, threshold: 50, status: { label: 'In Stock', color: '' } },
    ],
    pendingData: [
      { title: 'Midas Caps (100 pcs)', supplier: 'PrintMax Ltd.', quantity: 100, date: 'Apr 23' },
      { title: 'Plush Toys Assorted', supplier: 'ToyLand Supply', quantity: 50, date: 'Apr 27' },
    ],
    popularData: [
      { title: 'Keychain Set', desc: 'Sold 180 this week', percentage: 88 },
      { title: 'Wristband Pack', desc: 'Sold 150 this week', percentage: 74 },
      { title: 'Midas T-Shirt', desc: 'Sold 95 this week', percentage: 52 },
    ],
  },
  {
    title: 'Prizes & Rewards',
    revenue: '3,500 Items',
    status: false,
    status_content: '5 Low',
    icon: 'tabler-trophy',
    statusData: [
      { item: 'Small Plush Toy', category: 'Tier 1', stock: 800, threshold: 100, status: { label: 'In Stock', color: '' } },
      { item: 'LED Spinner', category: 'Tier 1', stock: 420, threshold: 80, status: { label: 'In Stock', color: '' } },
      { item: 'Bluetooth Speaker', category: 'Tier 3', stock: 15, threshold: 20, status: { label: 'Low Stock', color: '' } },
      { item: 'Gaming Headset', category: 'Tier 4', stock: 3, threshold: 5, status: { label: 'Critical', color: '' } },
      { item: 'Candy Bag', category: 'Tier 1', stock: 1200, threshold: 200, status: { label: 'In Stock', color: '' } },
    ],
    pendingData: [
      { title: 'Bluetooth Speakers (30 pcs)', supplier: 'TechGear Dist.', quantity: 30, date: 'Apr 24' },
      { title: 'Gaming Headsets (10 pcs)', supplier: 'TechGear Dist.', quantity: 10, date: 'Apr 28' },
      { title: 'LED Spinners (200 pcs)', supplier: 'PartySupply Co.', quantity: 200, date: 'Apr 25' },
    ],
    popularData: [
      { title: 'Candy Bag', desc: 'Redeemed 640 this week', percentage: 95 },
      { title: 'Small Plush Toy', desc: 'Redeemed 320 this week', percentage: 72 },
      { title: 'LED Spinner', desc: 'Redeemed 210 this week', percentage: 58 },
      { title: 'Bluetooth Speaker', desc: 'Redeemed 45 this week', percentage: 30 },
    ],
  },
  {
    title: 'Consumables',
    revenue: '890 Items',
    status: true,
    status_content: 'OK',
    icon: 'tabler-box',
    statusData: [
      { item: 'Ticket Roll (Blue)', category: 'Tickets', stock: 50, threshold: 10, status: { label: 'In Stock', color: '' } },
      { item: 'Wristband (Adult)', category: 'Entry', stock: 1200, threshold: 200, status: { label: 'In Stock', color: '' } },
      { item: 'Receipt Paper', category: 'POS', stock: 18, threshold: 20, status: { label: 'Low Stock', color: '' } },
      { item: 'Sanitizer Refill', category: 'Hygiene', stock: 40, threshold: 15, status: { label: 'In Stock', color: '' } },
      { item: 'Printer Ink Cart.', category: 'POS', stock: 2, threshold: 5, status: { label: 'Critical', color: '' } },
    ],
    pendingData: [
      { title: 'Receipt Paper (50 rolls)', supplier: 'OfficeMart', quantity: 50, date: 'Apr 23' },
      { title: 'Printer Ink (10 carts)', supplier: 'OfficeMart', quantity: 10, date: 'Apr 24' },
    ],
    popularData: [
      { title: 'Wristband (Adult)', desc: 'Used 800 this week', percentage: 90 },
      { title: 'Ticket Roll (Blue)', desc: 'Used 600 this week', percentage: 82 },
      { title: 'Sanitizer Refill', desc: 'Used 25 this week', percentage: 40 },
    ],
  },
]

const HomePage = () => {
  const [statsCardArray, setStatsCardArray] = useState<any[]>([])
  const [selectedStat, setSelectedStat] = useState<any | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [user, setUser] = useState<any | null>(null)

  useEffect(() => {
    const storedUser = getUser()
    setUser(storedUser)
  }, [])

  const fetchDashboardData = async (branchId: number) => {
    try {
      setLoading(true)
      const response = await dashboardApi.getStoreData({ branchId })
      const data = response.data.data || []

      if (data.length > 0) {
        setStatsCardArray(data)
        setSelectedStat(data[0])
      } else {
        setStatsCardArray(demoData)
        setSelectedStat(demoData[0])
      }
    } catch (error) {
      console.error('Dashboard API error:', error)
      setStatsCardArray(demoData)
      setSelectedStat(demoData[0])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (user?.branchId) {
      fetchDashboardData(user.branchId)
    } else if (user && !user.branchId) {
      setStatsCardArray(demoData)
      setSelectedStat(demoData[0])
      setLoading(false)
    }
  }, [user])

  // Fallback if no user loaded after timeout
  useEffect(() => {
    const timer = setTimeout(() => {
      if (loading) {
        setStatsCardArray(demoData)
        setSelectedStat(demoData[0])
        setLoading(false)
      }
    }, 3000)
    return () => clearTimeout(timer)
  }, [loading])

  if (loading) {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
        <CircularProgress sx={{ color: '#523F99' }} />
      </Box>
    )
  }

  return (
    <Box>
      {/* Stats Cards */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)', lg: 'repeat(4, 1fr)' },
          gap: { xs: 1, sm: 1.5, md: 2 },
        }}
      >
        {statsCardArray.map((item, i) => (
          <Box key={i} onClick={() => setSelectedStat(item)}>
            <StatsCard item={item} selected={selectedStat?.title === item.title} index={i} />
          </Box>
        ))}
      </Box>

      {/* Details Section */}
      {selectedStat && (
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: '8fr 4fr' },
            gap: { xs: 2, md: 2.5 },
            mt: { xs: 2, md: 2.5 },
          }}
        >
          <DataTable statusData={selectedStat.statusData} title={selectedStat.title} />

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: { xs: 2, md: 2.5 } }}>
            <PendingOrders pendingData={selectedStat.pendingData} />
            <PopularItems popularData={selectedStat.popularData} />
          </Box>
        </Box>
      )}
    </Box>
  )
}

export default HomePage
