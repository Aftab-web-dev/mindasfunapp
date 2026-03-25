'use client'
import React, { useState, useRef, useEffect } from 'react'

import toast from 'react-hot-toast'

import { ArrowLeft, Rotate90DegreesCcw, Shield } from '@mui/icons-material'
import { Button, Card, CardContent, CardHeader } from '@mui/material'

import { rechargeAndBalanceApi } from '@/api/recharge-and-balance-api'

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

  const handleMobileSubmit = async (mobile: string) => {
    try {
      const response = await rechargeAndBalanceApi.sendPhoneNumber({ phone: mobile })

      if (response.status === 200) {
        toast.success(`OTP Sent to ${mobile}. Otp - ${response.data.otp}`)
      }
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'error in handleMobileSubmit')
    }
  }

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
    handleMobileSubmit(mobileNumber)
  }

  const isOTPComplete = otp.every(digit => digit !== '')

  // Ensure the CardHeader is visible by removing any conflicting styles
  // Optionally, you can add a style or className to CardHeader to debug visibility
  return (
    <Card className='w-full shadow-lg border-0 bg-white/80 backdrop-blur-sm'>
      <CardHeader
        className='text-center pb-4 flex flex-col items-center'
        avatar={
          <div className='mx-auto w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-4'>
            <Shield className='w-6 h-6 text-purple-700' />
          </div>
        }
        title={<div className='text-2xl text-gray-800 pb-1'>Enter Verification Code</div>}
        subheader={<div className='text-gray-600 pb-3'>We&apos;ve sent a 6-digit code to +91 {mobileNumber}</div>}
      />
      <CardContent className='space-y-6'>
        <div className='flex flex-col items-center space-y-2'>
          <div className='flex justify-center space-x-3'>
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
                className={`w-12 h-12 text-center text-xl font-bold border-2 rounded-lg focus:outline-none transition-colors ${
                  isError ? 'border-red-500 bg-red-50' : 'border-gray-200 focus:border-purple-500'
                }`}
                maxLength={1}
              />
            ))}
          </div>
          {isError && <p className='text-red-500 text-sm'>Invalid OTP. Please try again.</p>}
        </div>

        <div className='text-center'>
          {timer > 0 ? (
            <p className='text-sm text-gray-600'>Resend OTP in {timer} seconds</p>
          ) : (
            <Button variant='text' onClick={handleResendOTP} className='text-purple-600 hover:text-purple-700'>
              <Rotate90DegreesCcw className='w-4 h-4 mr-2' />
              Resend OTP
            </Button>
          )}
        </div>

        <div className='space-y-3'>
          <Button
            onClick={handleVerify}
            disabled={!isOTPComplete}
            className='w-full h-12 text-lg bg-gradient-to-r from-[#6aa0f8] to-[#b07dfd] text-white font-semibold py-3 rounded-lg shadow-none'
          >
            Verify & Continue
          </Button>

          <Button variant='outlined' onClick={onBack} className='w-full h-12 text-lg border-2 hover:bg-gray-50'>
            <ArrowLeft className='w-4 h-4 mr-2' />
            Change Mobile Number
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
