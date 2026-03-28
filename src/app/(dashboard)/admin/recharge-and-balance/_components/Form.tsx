'use client'
import React, { useState } from 'react'

import toast from 'react-hot-toast'

import { MobileNumberInput } from './MobileNumberInput'
import { OTPInput } from './OtpInput'
import { BalanceOperations } from './BalanceOperations'
import { CustomerCard } from './CustomerCard'
import { rechargeAndBalanceApi } from '@/api/recharge-and-balance-api'

type VerificationStep = 'mobile' | 'otp' | 'verified'

interface CustomerData {
  ledgerId: number | string
  name: string
  status: string
  cardBalance: string
  tokenBalance: string
  cashBonusBalance: string
  pointBalance: string
}

const Form = () => {
  const [step, setStep] = useState<VerificationStep>('mobile')
  const [mobileNumber, setMobileNumber] = useState('')
  const [customerData, setCustomerData] = useState<CustomerData | null>(null)
  const [isError, setIsError] = useState(false)
  const [resOtp, setResOtp] = useState(null)
  const [ledgerId, setLedgerId] = useState(null)

  const handleMobileSubmit = async (mobile: string) => {
    try {
      setMobileNumber(mobile)

      const response = await rechargeAndBalanceApi.sendPhoneNumber({ phone: mobile })

      if (response.status === 200) {
        setStep('otp')
        setResOtp(response.data.otp)
        setLedgerId(response.data.data[0].ledgerId)
        toast.success(`OTP Sent to ${mobile}. Otp - ${response.data.otp}`)
      }
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'error in handleMobileSubmit')
    }
  }

  const handleOTPVerify = async (otp: string) => {
    try {
      if (otp === resOtp) {
        if (ledgerId) {
          const getCustomerData = await rechargeAndBalanceApi.getCustomerData({ ledgerId })

          if (getCustomerData.data.status == 'success') {
            const customerData = getCustomerData.data.data[0]

            setCustomerData({
              ledgerId: ledgerId,
              name: customerData.ledgerName,
              status: customerData.status == 0 ? 'Active' : 'Inactive',
              cardBalance: customerData.cardBalance,
              tokenBalance: customerData.tokenBalance,
              cashBonusBalance: customerData.cashBonusBalance,
              pointBalance: customerData.pointBalance
            })

            setStep('verified')
            toast.success('Verification Successful')
          }
        }
      } else {
        setIsError(true)
        toast.error('Invalid OTP')
      }
    } catch (error: any) {
      toast.error(error.response.data.message || 'error in otp verify')
    }
  }

  const handleBackToMobile = () => {
    setStep('mobile')
    setMobileNumber('')
    setCustomerData(null)
  }

  return (
    <div className='max-w-6xl mx-auto px-2 sm:px-4 py-3 sm:py-6'>
      {/* Header */}
      <div className='mb-4 sm:mb-8 px-1'>
        <h1 className='text-xl sm:text-2xl font-bold text-[#1E293B]'>Recharge & Balance</h1>
        <p className='text-xs sm:text-sm text-[#94A3B8] font-medium mt-0.5'>Customer verification & balance management</p>
      </div>

      {/* Main Content */}
      <div className='grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 items-stretch'>
        {/* Left Column - Verification & Operations */}
        <div className='lg:col-span-2 space-y-6 flex flex-col'>
          {step === 'mobile' && <MobileNumberInput onSubmit={handleMobileSubmit} />}

          {step === 'otp' && (
            <OTPInput
              mobileNumber={mobileNumber}
              onVerify={handleOTPVerify}
              onBack={handleBackToMobile}
              isError={isError}
              setIsError={setIsError}
            />
          )}

          {step === 'verified' && (
            <BalanceOperations mobileNumber={mobileNumber} customerData={customerData} onBack={handleBackToMobile} />
          )}
        </div>

        {/* Right Column - Customer Info */}
        <div className='lg:col-span-1'>
          <CustomerCard customerData={customerData} mobileNumber={mobileNumber} isVerified={step === 'verified'} />
        </div>
      </div>
    </div>
  )
}

export default Form
