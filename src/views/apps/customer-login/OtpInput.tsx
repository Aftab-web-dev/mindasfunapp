'use client'
import React, { useState, useRef, useEffect } from 'react'

import { ArrowLeft, Rotate90DegreesCcw } from '@mui/icons-material'
import { Button } from '@mui/material'

interface OTPInputProps {
  mobileNumber: string
  onVerify: (otp: string) => void
  onBack: () => void
  isError: boolean
  setIsError: (error: boolean) => void
}

export const OTPInput = ({ mobileNumber, onVerify, onBack, isError, setIsError }: OTPInputProps) => {
  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const [timer, setTimer] = useState(30)
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  // Use either prop error state or local error state

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer(prev => (prev > 0 ? prev - 1 : 0))
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  const handleInputChange = (index: number, value: string) => {
    if (value.length > 1) return

    // Clear error states when user modifies any input

    const newOtp = [...otp]

    newOtp[index] = value
    setOtp(newOtp)

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  const handleVerify = () => {
    const otpString = otp.join('')

    if (otpString.length === 6) {
      try {
        onVerify(otpString)
      } catch (error) {}
    }
  }

  const handleResendOTP = () => {
    setTimer(30)
    setOtp(['', '', '', '', '', ''])
    inputRefs.current[0]?.focus()
  }

  const isOTPComplete = otp.every(digit => digit !== '')

  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 640) // 640px = 40rem
    }

    handleResize() // run initially
    window.addEventListener('resize', handleResize)

    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Ensure the CardHeader is visible by removing any conflicting styles
  // Optionally, you can add a style or className to CardHeader to debug visibility
  return (
    <div className='w-full px-4  md:px-6'>
      <div className='max-w-md mx-auto'>
        <div className='text-center pb-4 flex flex-col items-center'>
          <div className='text-lg md:text-2xl text-gray-800 pb-1'>Enter Verification Code</div>
          <div className='text-gray-600 text-sm md:text-base pb-3'>
            We&apos;ve sent a 6-digit code{isMobile && <br />} to
            <span className='font-medium'> +91 {mobileNumber}</span>
          </div>
        </div>

        <div className='space-y-6'>
          {/* OTP Inputs */}
          <div className='flex flex-col items-center space-y-2'>
            <div className='flex justify-center space-x-2 sm:space-x-3'>
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={el => {
                    inputRefs.current[index] = el
                  }}
                  type='text'
                  autoFocus={index === 0}
                  value={digit}
                  onChange={e => handleInputChange(index, e.target.value)}
                  onKeyDown={e => {
                    handleKeyDown(index, e)
                    setIsError(false)
                  }}
                  className={`w-8 h-8 sm:w-12 sm:h-12 text-center sm:text-xl sm:font-bold font-medium border-2 rounded-lg focus:outline-none transition-colors ${
                    isError ? 'border-red-500 bg-red-50' : 'border-gray-200 focus:border-purple-500'
                  }`}
                  maxLength={1}
                />
              ))}
            </div>
            {isError && (
              <p className='sm:text-sm text-xs text-red-500 -mt-1 sm:-mt-2'>Invalid OTP. Please try again.</p>
            )}
            {/* Resend */}
            <div className='text-center -mt-6'>
              {timer > 0 ? (
                <p className='text-sm max-md:text-xs text-gray-600'>Resend OTP in {timer} seconds</p>
              ) : (
                <div
                  onClick={handleResendOTP}
                  className='text-purple-600 hover:text-purple-700 flex items-center md:text-sm mt-1 text-xs justify-center cursor-pointer'
                >
                  <Rotate90DegreesCcw className='md:w-4 md:h-4 md:mr-1 h-3 w-3 -mt-[2px]' />
                  <p>Resend OTP</p>
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className='space-y-3'>
            {isMobile && (
              <div className=' text-sm  flex justify-center'>
                <div className='flex items-center justify-center group w-fit'>
                  <ArrowLeft className='w-4 h-4 group-hover:text-purple-400 cursor-pointer' onClick={onBack} />
                  <p className='group-hover:text-purple-400 cursor-pointer' onClick={onBack}>
                    Change Mobile Number
                  </p>
                </div>
              </div>
            )}
            <Button
              onClick={handleVerify}
              disabled={!isOTPComplete}
              className='w-full max-sm:h-9 h-12 text-lg max-sm:text-sm bg-gradient-to-r from-[#6aa0f8] to-[#b07dfd] text-white font-semibold rounded-lg shadow-none hover:shadow-md transition-shadow'
            >
              Verify & Login
            </Button>

            {!isMobile && (
              <Button
                variant='outlined'
                onClick={onBack}
                className='w-full h-11 sm:h-12 text-base sm:text-lg sm:border-2 hover:bg-gray-50'
              >
                <ArrowLeft className='w-4 h-4 mr-2' />
                Change Mobile Number
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
