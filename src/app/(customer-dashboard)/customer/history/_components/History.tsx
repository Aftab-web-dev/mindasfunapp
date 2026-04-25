'use client'

import { useEffect, useState } from 'react'

import { MdOutlineAccessTime, MdReplay } from 'react-icons/md'

import { customerModuleApi } from '@/api/customer-module-api'

const filters = ['All', 'GamePlay', 'Recharge', 'Redemption', 'Refund', 'Consolidation', 'CardSplit', 'Purchase']

type HistoryItem = {
  title: string
  time: string
  amount: string
  status: string
  type: string
}

export default function History() {
  const [activeFilter, setActiveFilter] = useState('All')
  const [historyData, setHistoryData] = useState<HistoryItem[]>([])
  const [loading, setLoading] = useState(true)
  const [hasLedger, setHasLedger] = useState(true)

  useEffect(() => {
    if (typeof window === 'undefined') return
    const ledgerId = sessionStorage.getItem('cusLedgerId')

    if (!ledgerId) {
      setHasLedger(false)
      setLoading(false)

      return
    }

    customerModuleApi.rechargeHistory({ ledgerId }).then(res => {
      const rows: any[] = res.data?.data || []

      const mapped = rows.map((r: any) => ({
        title: r.title || r.type || 'Transaction',
        time: r.date || r.createdOn || '',
        amount: `${r.amount >= 0 ? '+' : ''}₹${r.amount}`,
        status: r.status || 'completed',
        type: r.type || 'Recharge'
      }))

      setHistoryData(mapped)
    }).catch(() => setHistoryData([])).finally(() => setLoading(false))
  }, [])

  const filteredData = activeFilter === 'All' ? historyData : historyData.filter(item => item.type === activeFilter)

  return (
    <div className='max-w-3xl mx-auto mt-10 border border-yellow-300 rounded-xl p-6 bg-white shadow'>
      <h1 className='text-2xl font-semibold text-gray-800 flex items-center gap-2 mb-6'>
        <MdOutlineAccessTime className='text-3xl text-purple-600' />
        Account History
      </h1>

      {/* Filter Tabs */}
      <div className='flex gap-2 mb-5 overflow-auto'>
        {filters.map(filter => (
          <button
            key={filter}
            onClick={() => setActiveFilter(filter)}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium transition border ${
              activeFilter === filter
                ? 'bg-purple-600 text-white border-purple-600'
                : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'
            }`}
          >
            {filter}
          </button>
        ))}
      </div>

      {/* Transactions */}
      {!hasLedger ? (
        <div className='py-10 text-center'>
          <p className='text-sm text-gray-500'>Please log in to view your history.</p>
        </div>
      ) : loading ? (
        <div className='py-10 text-center'>
          <p className='text-sm text-gray-500'>Loading...</p>
        </div>
      ) : filteredData.length === 0 ? (
        <div className='py-10 text-center'>
          <p className='text-sm text-gray-500'>No transactions yet.</p>
        </div>
      ) : (
        <div className='space-y-4'>
          {filteredData.map((item, index) => (
            <div
              key={index}
              className='flex items-center justify-between p-4 bg-gray-50 rounded-xl shadow-sm border border-gray-100'
            >
              <div className='flex items-center gap-4'>
                <div className='w-10 h-10 flex items-center justify-center bg-purple-100 rounded-full'>
                  <MdReplay className='text-green-500 text-xl' />
                </div>
                <div>
                  <h3 className='font-semibold text-gray-800'>{item.title}</h3>
                  <p className='text-sm text-gray-500'>{item.time}</p>
                </div>
              </div>
              <div className='text-right'>
                <p
                  className={`font-semibold ${item.amount.includes('+') ? 'text-green-600' : item.amount.includes('-') ? 'text-red-600' : 'text-gray-800'}`}
                >
                  {item.amount}
                </p>
                <span className='text-xs text-green-600 bg-green-100 px-2 py-0.5 rounded-full'>{item.status}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
