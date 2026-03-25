'use client'
import React, { useEffect, useState } from 'react'

import { Plus } from 'lucide-react'
import { zodResolver } from '@hookform/resolvers/zod'
import { Card, CardContent, CardHeader } from '@mui/material'
import { useForm, useWatch } from 'react-hook-form'
import toast from 'react-hot-toast'

import { z } from 'zod'

import { PresetAmountButtons } from './PresentAmountButtons'

import { RechargeFormFields } from './RechargeFormFields'
import { FinalPriceDisplay } from './FinalPriceDisplay'
import { RechargeActionButtons } from './RechargeActionButtons'
import { rechargeAndBalanceApi } from '@/api/recharge-and-balance-api'
import { getUser } from '@/utils/authStorage'

// import { rechargeAndBalanceApi } from '@/api/recharge-and-balance-api'

const rechargeSchema = z.object({
  amount: z.number().min(1, 'Recharge Amount is required'),
  discount: z.number().min(0),
  gst: z.number().min(0),
  tax_amount: z.number().min(0),
  card_price: z.number().min(0),
  net_amount: z.number().min(0),
  remarks: z.string(),
  g_note: z.string()
})

type RechargeFormValues = z.infer<typeof rechargeSchema>

interface CustomerData {
  ledgerId: number | string
  name: string
  status: string
  cardBalance: string
  tokenBalance: string
  cashBonusBalance: string
  pointBalance: string
}

interface BalanceOperationsProps {
  mobileNumber: string
  customerData: CustomerData | null
  onBack: () => void
}

export const BalanceOperations = ({ mobileNumber, customerData, onBack }: BalanceOperationsProps) => {
  const presetAmounts = [100, 200, 300, 500, 1000]

  const [taxData, setTaxData] = useState([])

useEffect(() => {
  const api = async () => {
    try {
      const userData = getUser()
      const locId = userData?.branchId

      const response = await rechargeAndBalanceApi.getGst({ locId })

      if (response.status === 200) {
        const gstData = response.data.data
        
        setTaxData(gstData)
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "error")
    }
  }

  api()
}, [])

  const {
    control,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors },
    watch
  } = useForm<RechargeFormValues>({
    resolver: zodResolver(rechargeSchema),
    defaultValues: {
      amount: 0,
      discount: 0,
      gst: 0,
      tax_amount: 0,
      card_price: 0,
      net_amount: 0,
      remarks: '',
      g_note: ''
    }
  })

  // Use useWatch instead of watch() for useEffect

  const {
    amount = 0,
    discount = 0,
    gst = 0,
    card_price = 0
  } = useWatch({
    control,
    name: ['amount', 'discount', 'gst', 'card_price']
  }) as {
    amount?: number
    discount?: number
    gst?: number
    card_price?: number
  }

  const net_amount = watch('net_amount') || 0

  useEffect(() => {
    const tax_amount = (amount - discount) * (gst / 100)
    const calculatedNet_amount = amount - discount + tax_amount + card_price

    setValue('tax_amount', Number(tax_amount.toFixed(2)))
    setValue('net_amount', Number(calculatedNet_amount.toFixed(2)))
  }, [amount, discount, gst, card_price, setValue])

  const handlePresetAmount = (amount: number) => {
    setValue('amount', amount)
  }

  const onSubmit = async (values: RechargeFormValues) => {
    try {
      const storedUserData = getUser()
      const branchId = storedUserData?.branchId.toString()

      const body = {
        ...values,
        branchId,
        ledgerId: customerData?.ledgerId
      }

      const response = await rechargeAndBalanceApi.recharge({ body })

      if (response.status === 200) {
        setTimeout(() => {
          window.location.reload()
        }, 2000)
        toast.success(response.data.message)
      }
    } catch (error) {
      toast.error('Error')
    }
  }

  return (
    <Card className='w-full shadow-lg border-0 bg-white/80 backdrop-blur-sm'>
      <CardHeader
        className='flex items-center space-x-3 border-b'
        avatar={
          <div className='w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center'>
            <Plus className='w-5 h-5 text-purple-700' />
          </div>
        }
        title={<div className='text-2xl text-gray-800'>Customer Recharge</div>}
        subheader={
          <div className='text-gray-600'>
            {customerData?.name} - +91 {mobileNumber}
          </div>
        }
      />

      <CardContent className='space-y-6 pt-6'>
        <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
          <PresetAmountButtons
            amounts={presetAmounts}
            selectedAmount={amount || 0}
            onAmountSelect={handlePresetAmount}
            setValue={setValue}
          />

          <RechargeFormFields
            control={control}
            errors={errors}
            net_amount={net_amount}
            setValue={setValue}
            getValues={getValues}
            taxData={taxData}
          />

          <FinalPriceDisplay net_amount={net_amount} />

          <RechargeActionButtons onBack={onBack} />
        </form>
      </CardContent>
    </Card>
  )
}
