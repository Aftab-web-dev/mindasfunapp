'use client'

import { useState } from 'react'

import { FaGamepad } from 'react-icons/fa'
import { MdFastfood, MdOutlineAccessTime, MdReplay } from 'react-icons/md'
import { GiVrHeadset } from 'react-icons/gi'

// import { BsCreditCard } from 'react-icons/bs'

const filters = ['All', 'GamePlay', 'Recharge', 'Redemption', 'Refund', 'Consolidation', 'CardSplit', 'Purchase']

const historyData = [
  {
    title: 'Game Session',
    time: 'Today, 2:30 PM',
    amount: '₹15.00',
    status: 'completed',
    type: 'GamePlay',
    icon: <FaGamepad className='text-purple-600 text-xl' />
  },
  {
    title: 'Account Recharge',
    time: 'Today, 12:15 PM',
    amount: '+₹50.00',
    status: 'completed',
    type: 'Recharge',
    icon: <MdReplay className='text-green-500 text-xl' />
  },
  {
    title: 'Account Recharge',
    time: 'Today, 12:15 PM',
    amount: '-₹50.00',
    status: 'completed',
    type: 'Redemption',
    icon: <MdReplay className='text-green-500 text-xl' />
  },
  {
    title: 'Food Purchase',
    time: 'Yesterday, 6:45 PM',
    amount: '₹12.50',
    status: 'completed',
    type: 'Spending',
    icon: <MdFastfood className='text-purple-600 text-xl' />
  },
  {
    title: 'VR Experience',
    time: 'Yesterday, 3:20 PM',
    amount: '₹25.00',
    status: 'completed',
    type: 'Spending',
    icon: <GiVrHeadset className='text-purple-600 text-xl' />
  },
  {
    title: 'Account Recharge',
    time: '3 days ago',
    amount: '+₹100.00',
    status: 'completed',
    type: 'Recharge',
    icon: <MdReplay className='text-green-500 text-xl' />
  },
  {
    title: 'Game Session',
    time: '5 days ago',
    amount: '₹20.00',
    status: 'completed',
    type: 'Spending',
    icon: <FaGamepad className='text-purple-600 text-xl' />
  }
]

export default function History() {
  const [activeFilter, setActiveFilter] = useState('All')

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
      <div className='space-y-4'>
        {filteredData.map((item, index) => (
          <div
            key={index}
            className='flex items-center justify-between p-4 bg-gray-50 rounded-xl shadow-sm border border-gray-100'
          >
            <div className='flex items-center gap-4'>
              <div className='w-10 h-10 flex items-center justify-center bg-purple-100 rounded-full'>{item.icon}</div>
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
    </div>
  )
}
