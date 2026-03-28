import React from 'react'

import { Award, Coins, CreditCard, Gift, User } from 'lucide-react'

interface CustomerData {
  name: string
  status: string
  cardBalance: string
  tokenBalance: string
  cashBonusBalance: string
  pointBalance: string
}

interface CustomerCardProps {
  customerData: CustomerData | null
  mobileNumber: string
  isVerified: boolean
}

export const CustomerCard = ({ customerData, mobileNumber, isVerified }: CustomerCardProps) => {
  if (!isVerified || !customerData) {
    return (
      <div className='rounded-none sm:rounded-2xl border-0 sm:border sm:border-[rgba(0,0,0,0.06)] bg-white px-3 py-6 sm:p-6 md:p-8 h-full flex flex-col justify-center'>
        <div className='flex flex-col items-center text-center'>
          <div className='w-12 h-12 sm:w-14 sm:h-14 bg-[#F1F5F9] rounded-full flex items-center justify-center mb-3'>
            <User className='w-5 h-5 sm:w-6 sm:h-6 text-[#94A3B8]' />
          </div>
          <h3 className='text-base sm:text-lg font-bold text-[#1E293B] mb-0.5'>Customer Information</h3>
          <p className='text-xs sm:text-sm text-[#94A3B8] font-medium'>
            {mobileNumber ? 'Verify OTP to view details' : 'Enter mobile number to search'}
          </p>
        </div>
      </div>
    )
  }

  const balanceItems = [
    { icon: CreditCard, label: 'Card Balance', value: customerData.cardBalance, color: '#3B82F6', bg: '#EFF6FF' },
    { icon: Coins, label: 'Token Balance', value: customerData.tokenBalance, color: '#523F99', bg: '#F0ECFA' },
    { icon: Gift, label: 'Cash Bonus', value: customerData.cashBonusBalance, color: '#059669', bg: '#ECFDF5' },
    { icon: Award, label: 'Point Balance', value: customerData.pointBalance, color: '#EA580C', bg: '#FFF7ED' }
  ]

  return (
    <div className='rounded-none sm:rounded-2xl border-0 sm:border sm:border-[rgba(0,0,0,0.06)] bg-white overflow-hidden'>
      {/* Header */}
      <div className='px-3 sm:px-6 pt-4 sm:pt-6 pb-3 sm:pb-4 border-b border-[rgba(0,0,0,0.06)]'>
        <div className='flex items-center gap-3'>
          <div className='w-11 h-11 bg-[#F0ECFA] rounded-full flex items-center justify-center flex-shrink-0'>
            <User className='w-5 h-5 text-[#523F99]' />
          </div>
          <div className='min-w-0'>
            <h3 className='text-base font-bold text-[#1E293B] truncate'>{customerData.name}</h3>
            <p className='text-xs text-[#94A3B8] font-medium'>+91 {mobileNumber}</p>
          </div>
          <span className='ml-auto px-2.5 py-0.5 rounded-md text-xs font-semibold bg-[#ECFDF5] text-[#059669] flex-shrink-0'>
            {customerData.status}
          </span>
        </div>
      </div>

      {/* Balance Items */}
      <div className='p-3 sm:p-4 space-y-2'>
        {balanceItems.map((item) => (
          <div
            key={item.label}
            className='flex items-center justify-between px-4 py-3 rounded-xl'
            style={{ backgroundColor: item.bg }}
          >
            <div className='flex items-center gap-3'>
              <item.icon className='w-[18px] h-[18px]' style={{ color: item.color }} />
              <span className='text-sm font-medium text-[#475569]'>{item.label}</span>
            </div>
            <span className='text-sm font-bold' style={{ color: item.color }}>
              {item.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
