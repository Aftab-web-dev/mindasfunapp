'use client'

import React, { useState } from 'react'

import { useRouter } from 'next/navigation'

import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

import { Box, Button, TextField, Typography } from '@mui/material'
import { FaRegCreditCard } from 'react-icons/fa'
import toast from 'react-hot-toast'

import { customerModuleApi } from '@/api/customer-module-api'
import { getUser } from '@/utils/authStorage'

// ----------------- Zod Schema -----------------
const rechargeSchema = z.object({
  amount: z.coerce.number().min(1, 'Amount is required'),
  cardNumber: z.string().min(16, 'Card number must be at least 16 digits')
})

type RechargeFormData = z.infer<typeof rechargeSchema>

const Recharge = () => {
  const [success, setSuccess] = useState(false)
  const router = useRouter()

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isLoading, isSubmitting }
  } = useForm<RechargeFormData>({
    resolver: zodResolver(rechargeSchema),
    defaultValues: {
      amount: 0,
      cardNumber: ''
    }
  })

  const onSubmit = async (data: RechargeFormData) => {
    try {
      const ledgerId = typeof window !== 'undefined' ? sessionStorage.getItem('cusLedgerId') : null

      if (!ledgerId) {
        toast.error('Not logged in')

        return
      }

      const user = getUser()
      const branchId = user?.branchId

      await customerModuleApi.recharge({ amount: data.amount, ledgerId, branchId })
      setSuccess(true)
      reset()

      setTimeout(() => {
        router.push('/customer/home')
      }, 2000)
    } catch (err) {
      toast.error('Recharge failed')
    }
  }

  const selectedAmount = watch('amount')

  return (
    <Box className='max-w-3xl mx-auto p-6 mt-10 bg-white rounded-lg shadow'>
      {!success ? (
        <>
          <Typography variant='h5' className='flex items-center gap-2 mb-6 font-bold text-purple-700'>
            <FaRegCreditCard /> Recharge Options
          </Typography>

          <form onSubmit={handleSubmit(onSubmit)} className='space-y-5'>
            {/* Predefined Amount Buttons */}
            <Box>
              <Typography className='text-sm font-semibold mb-1'>Select Amount</Typography>
              <Box className='grid grid-cols-4 gap-2'>
                {[10, 20, 50, 100].map(val => (
                  <Button
                    key={val}
                    variant={selectedAmount === val ? 'contained' : 'outlined'}
                    color='secondary'
                    onClick={() => setValue('amount', val)}
                  >
                    ${val}
                  </Button>
                ))}
              </Box>
            </Box>

            {/* Custom Amount */}
            <Controller
              name='amount'
              control={control}
              render={({ field }) => (
                <TextField
                  fullWidth
                  label='Custom Amount'
                  type='number'
                  variant='outlined'
                  error={!!errors.amount}
                  helperText={errors.amount?.message}
                  {...field}
                  onChange={e => {
                    field.onChange(Number(e.target.value))
                  }}
                />
              )}
            />

            {/* Card Number */}
            <Controller
              name='cardNumber'
              control={control}
              render={({ field }) => (
                <TextField
                  fullWidth
                  label='Card Number'
                  variant='outlined'
                  placeholder='1234 5678 9012 3456'
                  error={!!errors.cardNumber}
                  helperText={errors.cardNumber?.message}
                  {...field}
                />
              )}
            />

            <Button type='submit' disabled={isSubmitting || isLoading} variant='contained' color='success' fullWidth>
              Recharge ${selectedAmount || 0}
            </Button>
          </form>
        </>
      ) : (
        <Box className='text-center'>
          <Typography variant='h5' className='text-green-600 font-bold mb-4'>
            ✅ Recharge Successful!
          </Typography>
          <Typography className='text-gray-600'>Redirecting to home page...</Typography>
        </Box>
      )}
    </Box>
  )
}

export default Recharge
