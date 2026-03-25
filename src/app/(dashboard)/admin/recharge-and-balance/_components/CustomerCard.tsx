import React from 'react'

import { Badge, Card, CardContent, CardHeader } from '@mui/material'
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
      <Card className='w-full shadow-lg border-0 bg-white/60 backdrop-blur-sm'>
        <CardHeader
          className='text-center flex flex-col items-center'
          avatar={
            <div className='mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4'>
              <User className='w-8 h-8 text-gray-400' />
            </div>
          }
          title={<div className='text-xl text-gray-600 pb-2'>Customer Information</div>}
          subheader={
            <div className='text-center pb-5'>
              <p className='text-gray-500'>
                {mobileNumber ? 'Please verify OTP to view customer details' : 'Enter mobile number to search customer'}
              </p>
            </div>
          }
        />
      </Card>
    )
  }

  return (
    <Card className='w-full shadow-lg border-0 bg-white/90 backdrop-blur-sm'>
      <CardHeader
        className='text-center flex flex-col items-center border-b'
        avatar={
          <div className='mx-auto w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-4'>
            <User className='w-8 h-8 text-purple-700' />
          </div>
        }
        title={<div className='text-xl text-gray-800'>Customer Information</div>}
      />

      <CardContent className='space-y-6 pt-6'>
        <div className='text-center space-y-2'>
          <h3 className='text-lg font-semibold text-gray-800'>{customerData.name}</h3>
          <p className='text-sm text-gray-600'>+91 {mobileNumber}</p>
          <Badge variant='standard' className='bg-green-100 rounded-sm px-2 text-green-700'>
            {customerData.status}
          </Badge>
        </div>

        <div className='space-y-4'>
          <div className='flex items-center justify-between p-3 bg-blue-50 rounded-lg'>
            <div className='flex items-center space-x-3'>
              <CreditCard className='w-5 h-5 text-blue-600' />
              <span className='text-sm font-medium text-gray-700'>Card Balance</span>
            </div>
            <span className='font-bold text-blue-600'>{customerData.cardBalance}</span>
          </div>

          <div className='flex items-center justify-between p-3 bg-purple-50 rounded-lg'>
            <div className='flex items-center space-x-3'>
              <Coins className='w-5 h-5 text-purple-600' />
              <span className='text-sm font-medium text-gray-700'>Token Balance</span>
            </div>
            <span className='font-bold text-purple-600'>{customerData.tokenBalance}</span>
          </div>

          <div className='flex items-center justify-between p-3 bg-green-50 rounded-lg'>
            <div className='flex items-center space-x-3'>
              <Gift className='w-5 h-5 text-green-600' />
              <span className='text-sm font-medium text-gray-700'>Cash Bonus</span>
            </div>
            <span className='font-bold text-green-600'>{customerData.cashBonusBalance}</span>
          </div>

          <div className='flex items-center justify-between p-3 bg-orange-50 rounded-lg'>
            <div className='flex items-center space-x-3'>
              <Award className='w-5 h-5 text-orange-600' />
              <span className='text-sm font-medium text-gray-700'>Point Balance</span>
            </div>
            <span className='font-bold text-orange-600'>{customerData.pointBalance}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
