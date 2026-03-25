'use client'
import React, { useEffect, useState } from 'react'

import { Button, InputAdornment, TextField } from '@mui/material'

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

  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768) // 768px = 48rem
    }

    handleResize() // run initially
    window.addEventListener('resize', handleResize)

    return () => window.removeEventListener('resize', handleResize)
  }, [])

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
    <div className='w-full max-w-md mx-auto px-4'>
      <div className='flex flex-col items-center pb-4 text-center'>
        <h2 className='text-2xl max-md:text-lg text-gray-800 font-semibold mb-1'>Enter Mobile Number</h2>
        <p className='text-gray-600 max-sm:text-xs md:text-sm'>We’ll send an OTP to verify your number</p>
      </div>

      <form onSubmit={handleSubmit} className=''>
        <div className='max-md:space-y-1 space-y-2'>
          <label className='text-sm max-md:text-xs font-medium  text-gray-700'>Mobile Number</label>
          <TextField
            type='tel'
            value={mobile}
            onChange={handleInputChange}
            fullWidth
            size={isMobile ? 'small' : 'medium'}
            placeholder={isMobile ? 'Enter Number' : 'Enter 10-digit mobile number'}
            inputProps={{ maxLength: 10 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position='start'>
                  <span className='text-base max-md:text-xs text-gray-600'>+91</span>
                </InputAdornment>
              ),
              classes: {
                input: 'max-md:text-xs text-base text-gray-800 placeholder-gray-400'
              }
            }}
            className='bg-white rounded-lg'
          />
        </div>

        {mobile && !isValid && (
          <>
            <p className='text-sm max-md:text-xs text-red-500 md:hidden mt-1'>*Enter a valid 10-digit number</p>

            <p className='text-sm max-md:text-xs text-red-500 max-md:hidden mt-1'>
              *Please enter a valid 10-digit mobile number
            </p>
          </>
        )}

        <Button
          type='submit'
          disabled={!isValid}
          className='w-full max-md:h-9 h-12 text-lg max-md:text-sm bg-gradient-to-r from-[#6aa0f8] to-[#b07dfd] text-white font-semibold rounded-lg shadow-none hover:shadow-md transition-shadow mt-4'
        >
          Send OTP
        </Button>
      </form>
    </div>
  )
}
