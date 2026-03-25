'use client'

// React Imports
import { useEffect, useState } from 'react'

import { useRouter } from 'next/navigation'

// MUI Imports
import Typography from '@mui/material/Typography'
import toast from 'react-hot-toast'

import { MobileNumberInput } from './MobileNumberInput'
import { OTPInput } from './OtpInput'
import RegisterForm from './RegisterForm'
import MidasLogoText from '../../../../public/svgs/MidasLogoText'

// import RegisterForm from './RegisterForm'

type VerificationStep = 'mobile' | 'otp' | 'register'

const LoginV2 = () => {
  const [step, setStep] = useState<VerificationStep>('mobile')

  const [mobileNumber, setMobileNumber] = useState('')

  const [otpVerified, setOtpVerified] = useState(false)

  const [isError, setIsError] = useState(false)

  const handleMobileSubmit = (mobile: string) => {
    setMobileNumber(mobile)
    setStep('otp')
    toast.success(`OTP Sent to ${mobile}`)
  }

  const router = useRouter()

  const handleOTPVerify = (otp: string) => {
    // Simulate OTP verification

    if (otp === '123456') {
      if (mobileNumber == '9876543210') {
        setOtpVerified(true)
        router.push('/customer/home')
      } else {
        setOtpVerified(true)
        setStep('register')
      }
    } else {
      setIsError(true)
      toast.error('Invalid OTP')
    }

    if (otpVerified) {
      toast.success('Verification Successful')
    }
  }

  const handleBackToMobile = () => {
    setStep('mobile')
    setMobileNumber('')
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

  return (
    <div className='flex justify-center items-center px-4 h-full'>
      <div
        className={`w-full max-w-4xl ${step === 'otp' && 'max-md:mx-10'} flex justify-center items-center ${step === 'register' ? '' : 'h-full'} `}
      >
        <div
          className={`flex flex-col gap-6 w-full items-center justify-center transition-all duration-300 ${
            step === 'register' ? 'w-[100%] max-md:mx-4 md:mx-10 lg:mx-0' : 'md:w-2/3 lg:w-1/2 '
          }`}
        >
          <div className='flex flex-col gap-1 items-center text-center'>
            <MidasLogoText width={isMobile ? 120 : 240} height={isMobile ? 16 : 32} />

            <Typography className='text-xl max-md:text-base pt-2'>Your Ultimate Gaming Experience</Typography>
          </div>

          <div
            className={`bg-white w-full max-w-md p-6 md:p-10 rounded-xl shadow-md transition-all duration-300 ${
              step === 'register' ? 'hidden' : ''
            }`}
          >
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
          </div>

          {step === 'register' && (
            <div className='flex justify-center w-full '>
              <RegisterForm />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default LoginV2
