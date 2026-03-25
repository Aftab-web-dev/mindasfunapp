import React from 'react'

import { ArrowLeft } from '@mui/icons-material'
import { Button } from '@mui/material'

interface RechargeActionButtonsProps {
  onBack: () => void
}

export const RechargeActionButtons = ({ onBack }: RechargeActionButtonsProps) => {
  return (
    <div className='space-y-3'>
      <Button
        type='submit'
        className='w-full h-12 text-lg bg-gradient-to-r from-[#6aa0f8] to-[#b07dfd] text-white font-semibold py-3 rounded-lg shadow-none'
      >
        Process Recharge
      </Button>

      <Button
        type='button'
        variant='outlined'
        onClick={onBack}
        className='w-full h-12 text-lg border-2 hover:bg-gray-50'
      >
        <ArrowLeft className='w-4 h-4 mr-2' />
        New Customer Search
      </Button>
    </div>
  )
}
