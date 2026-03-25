'use client'
import React, { useState } from 'react'

import { Button, Card, CardContent, InputAdornment, TextField } from '@mui/material'
import { Phone } from 'lucide-react'

interface MobileNumberInputProps {
  onSubmit: (mobile: string) => void
}

export const MobileNumberInput = ({ onSubmit }: MobileNumberInputProps) => {
  const [mobile, setMobile] = useState('')
  const [isValid, setIsValid] = useState(false)

  const validateMobile = (value: string) => {
    const mobileRegex = /^[6-9]\d{9}$/

    return mobileRegex.test(value)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 10)

    setMobile(value)
    setIsValid(validateMobile(value))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (isValid) {
      onSubmit(mobile)
    }
  }

  return (
    <Card className='w-full shadow-lg border-0 bg-white/80 backdrop-blur-sm'>
      <div className='flex flex-col items-center pt-8 pb-2'>
        <div className='w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-4'>
          <Phone className='w-8 h-8 text-purple-500' />
        </div>
        <h2 className='text-2xl text-gray-800 font-semibold mb-1'>Customer Lookup</h2>
        <div className='text-gray-600 text-center'>Enter customer mobile number to begin verification</div>
      </div>
      <CardContent>
        <form onSubmit={handleSubmit} className='space-y-6'>
          <div className='space-y-2'>
            <label className='text-sm font-medium text-gray-700'>Mobile Number</label>

            <TextField
              type='tel'
              value={mobile}
              onChange={handleInputChange}
              fullWidth
              placeholder='Enter 10-digit mobile number'
              className=' h-12 text-lg border-2 focus:border-purple-500 transition-colors'
              inputProps={{ maxLength: 10 }}
              InputProps={{
                startAdornment: <InputAdornment position='start'>+91</InputAdornment>
              }}
            />
          </div>
          {mobile && !isValid && <p className='text-sm text-red-500'>Please enter a valid 10-digit mobile number</p>}

          <Button
            type='submit'
            disabled={!isValid}
            className='w-full h-12 text-lg bg-gradient-to-r from-[#6aa0f8] to-[#b07dfd] text-white font-semibold py-3 rounded-lg shadow-none'
          >
            Send OTP
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
