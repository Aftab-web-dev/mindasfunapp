'use client'
import React, { useState } from 'react'

import { Button, InputAdornment, TextField } from '@mui/material'
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
    <div className='rounded-none sm:rounded-2xl border-0 sm:border sm:border-[rgba(0,0,0,0.06)] bg-white px-3 py-5 sm:p-6 md:p-8 flex-1'>
      {/* Header */}
      <div className='flex items-center gap-3 sm:gap-4 mb-5 sm:mb-6'>
        <div className='w-10 h-10 sm:w-12 sm:h-12 bg-[#F0ECFA] rounded-xl flex items-center justify-center flex-shrink-0'>
          <Phone className='w-4 h-4 sm:w-5 sm:h-5 text-[#523F99]' />
        </div>
        <div>
          <h2 className='text-base sm:text-lg font-bold text-[#1E293B]'>Customer Lookup</h2>
          <p className='text-xs sm:text-sm text-[#94A3B8] font-medium'>Enter mobile number to verify</p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className='space-y-5'>
        <div className='space-y-1.5'>
          <label className='text-sm font-semibold text-[#475569]'>Mobile Number</label>
          <TextField
            type='tel'
            value={mobile}
            onChange={handleInputChange}
            fullWidth
            placeholder='Enter 10-digit mobile number'
            inputProps={{ maxLength: 10 }}
            InputProps={{
              startAdornment: <InputAdornment position='start'>+91</InputAdornment>
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: '12px',
                backgroundColor: '#FAFAFA',
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#523F99'
                },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#523F99',
                  borderWidth: 2
                }
              }
            }}
          />
        </div>

        {mobile && !isValid && (
          <p className='text-xs text-red-500 font-medium'>Please enter a valid 10-digit mobile number</p>
        )}

        <Button
          type='submit'
          variant='contained'
          disabled={!isValid}
          fullWidth
          disableElevation
          sx={{
            height: 48,
            borderRadius: '12px',
            fontSize: '0.9375rem',
            fontWeight: 600,
            textTransform: 'none',
            backgroundColor: '#523F99 !important',
            color: '#FFFFFF !important',
            boxShadow: '0 4px 12px rgba(82, 63, 153, 0.3)',
            '&:hover': {
              backgroundColor: '#6B52C4 !important',
              boxShadow: '0 6px 16px rgba(82, 63, 153, 0.4)'
            },
            '&.Mui-disabled': {
              backgroundColor: 'rgba(82, 63, 153, 0.35) !important',
              color: 'rgba(255, 255, 255, 0.7) !important',
              boxShadow: 'none'
            }
          }}
        >
          Send OTP
        </Button>
      </form>
    </div>
  )
}
