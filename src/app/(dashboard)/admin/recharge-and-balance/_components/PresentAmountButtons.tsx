import React from 'react'

import { Button } from '@mui/material'

interface PresetAmountButtonsProps {
  amounts: number[]
  selectedAmount: number
  onAmountSelect: (amount: number) => void
  setValue: any
}

export const PresetAmountButtons = ({
  amounts,
  selectedAmount,
  onAmountSelect,
  setValue
}: PresetAmountButtonsProps) => {
  return (
    <div className='space-y-3'>
      <label className='text-sm font-medium text-gray-700'>Quick Select Amount</label>
      <div className='flex flex-wrap gap-2'>
        {amounts.map((amount: number) => (
          <Button
            key={amount}
            type='button'
            variant={selectedAmount === amount ? 'contained' : 'outlined'}
            onClick={() => {
              onAmountSelect(amount)
              setValue('net_amount', amount)
            }}
            className='px-4 py-2 text-sm'
          >
            ₹{amount}
          </Button>
        ))}
      </div>
    </div>
  )
}
