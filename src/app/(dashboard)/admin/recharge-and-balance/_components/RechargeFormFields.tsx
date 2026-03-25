import React, { useEffect } from 'react'

import { Controller } from 'react-hook-form'
import type { FieldErrors } from 'react-hook-form'

import { CalculateOutlined } from '@mui/icons-material'
import { MenuItem, TextareaAutosize, TextField } from '@mui/material'

interface RechargeFormValues {
  amount: number
  discount: number
  cgst: number
  sgst: number
  igst: number
  vat: number
  tax_amount: number
  card_price: number
  net_amount: number
  remarks: string
  g_note: string
}

interface RechargeFormFieldsProps {
  control: any
  errors: FieldErrors<RechargeFormValues>
  net_amount: number
  setValue: any
  getValues: any
  taxData: any[]
}

export const RechargeFormFields = ({
  control,
  errors,
  net_amount,
  setValue,
  getValues,
  taxData
}: RechargeFormFieldsProps) => {
  const taxType = taxData.length > 0 ? taxData[0].taxType : 'GST'

  const calculateTaxAmount = (cgst: number, sgst: number, igst: number, vat: number) => {
    const amount = getValues('amount') || 0
    const discount = getValues('discount') || 0
    const baseAmount = amount - discount

    let taxAmt = 0

    if (taxType === 'GST') {
      taxAmt = baseAmount * ((cgst + sgst + igst) / 100)
    } else if (taxType === 'VAT') {
      taxAmt = baseAmount * (vat / 100)
    }

    return Number(taxAmt.toFixed(2))
  }

  const recalculateAll = () => {
    const amount = getValues('amount') || 0
    const discount = getValues('discount') || 0
    const cgst = getValues('cgst') || 0
    const sgst = getValues('sgst') || 0
    const igst = getValues('igst') || 0
    const vat = getValues('vat') || 0
    const cardPrice = getValues('card_price') || 0

    const taxAmt = calculateTaxAmount(cgst, sgst, igst, vat)
    const netAmt = amount - discount + taxAmt + cardPrice

    setValue('tax_amount', taxAmt)
    setValue('net_amount', netAmt)
  }

  useEffect(() => {
    recalculateAll()
  }, [net_amount])
  

  return (
    <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
      <div className='space-y-1 flex flex-col '>
        <label className='text-sm font-medium text-gray-700'>Recharge Amount</label>
        <Controller
          name='amount'
          control={control}
          render={({ field }) => (
            <TextField
              type='number'
              variant='outlined'
              {...field}
              value={field.value || ''}
              onChange={e => {
                const value = Number((e.target as HTMLInputElement).value) || 0

                field.onChange(value)
                recalculateAll()
              }}
              placeholder='Enter amount'
              className='h-11'
              inputProps={{
                inputMode: 'numeric',
                pattern: '[0-9]*',
                onWheel: e => (e.currentTarget as HTMLInputElement).blur(),
                className: 'no-spinner'
              }}
            />
          )}
        />
        {errors.amount && <p className='text-sm text-red-500 pt-2'>*{errors.amount.message}</p>}
      </div>

      <div className='space-y-1 flex flex-col '>
        <label className='text-sm font-medium text-gray-700'>Discount</label>
        <Controller
          name='discount'
          control={control}
          render={({ field }) => (
            <TextField
              type='number'
              {...field}
              value={field.value || ''}
              onChange={e => {
                const value = Number((e.target as HTMLInputElement).value) || 0

                field.onChange(value)
                recalculateAll()
              }}
              placeholder='Enter discount'
              className='h-11'
              inputProps={{
                inputMode: 'numeric',
                pattern: '[0-9]*',
                onWheel: e => (e.currentTarget as HTMLInputElement).blur(),
                className: 'no-spinner'
              }}
            />
          )}
        />
      </div>

      <div className='space-y-1 flex flex-col '>
        <label className='text-sm font-medium text-gray-700'>Tax Type</label>
        <TextField value={taxType} disabled className='h-11 bg-gray-50' />
      </div>

      {taxType === 'VAT' ? (
        <div className='space-y-1 flex flex-col'>
          <label className='text-sm font-medium text-gray-700'>VAT%</label>
          <Controller
            name='vat'
            control={control}
            defaultValue={taxData[0]?.vatPrcnt || 5}
            render={({ field }) => (
              <TextField
                select
                {...field}
                value={field.value?.toString() || '5'}
                onChange={e => {
                  const vat = Number(e.target.value) || 0

                  field.onChange(vat)
                  recalculateAll()
                }}
                className='h-11'
              >
                <MenuItem value='0'>0%</MenuItem>
                <MenuItem value='5'>5%</MenuItem>
                <MenuItem value='12'>12%</MenuItem>
                <MenuItem value='18'>18%</MenuItem>
                <MenuItem value='28'>28%</MenuItem>
              </TextField>
            )}
          />
        </div>
      ) : (
        <>
          {/* CGST */}
          <div className='space-y-1 flex flex-col'>
            <label className='text-sm font-medium text-gray-700'>CGST%</label>
            <Controller
              name='cgst'
              control={control}
              defaultValue={taxData[0]?.cgstPrcnt || 2.5}
              render={({ field }) => (
                <TextField
                  select
                  {...field}
                  value={field.value?.toString() || '2.5'}
                  onChange={e => {
                    const cgst = Number(e.target.value) || 0

                    field.onChange(cgst)
                    recalculateAll()
                  }}
                  className='h-11'
                >
                  <MenuItem value='0'>0%</MenuItem>
                  <MenuItem value='2.5'>2.5%</MenuItem>
                  <MenuItem value='6'>6%</MenuItem>
                  <MenuItem value='9'>9%</MenuItem>
                  <MenuItem value='14'>14%</MenuItem>
                </TextField>
              )}
            />
          </div>

          {/* SGST */}
          <div className='space-y-1 flex flex-col'>
            <label className='text-sm font-medium text-gray-700'>SGST%</label>
            <Controller
              name='sgst'
              control={control}
              defaultValue={taxData[0]?.sgstPrcnt || 2.5}
              render={({ field }) => (
                <TextField
                  select
                  {...field}
                  value={field.value?.toString() || '2.5'}
                  onChange={e => {
                    const sgst = Number(e.target.value) || 0

                    field.onChange(sgst)
                    recalculateAll()
                  }}
                  className='h-11'
                >
                  <MenuItem value='0'>0%</MenuItem>
                  <MenuItem value='2.5'>2.5%</MenuItem>
                  <MenuItem value='6'>6%</MenuItem>
                  <MenuItem value='9'>9%</MenuItem>
                  <MenuItem value='14'>14%</MenuItem>
                </TextField>
              )}
            />
          </div>

          {/* IGST */}
          <div className='space-y-1 flex flex-col'>
            <label className='text-sm font-medium text-gray-700'>IGST%</label>
            <Controller
              name='igst'
              control={control}
              defaultValue={taxData[0]?.igstPrcnt || 0}
              render={({ field }) => (
                <TextField
                  select
                  {...field}
                  value={field.value?.toString() || '0'}
                  onChange={e => {
                    const igst = Number(e.target.value) || 0

                    field.onChange(igst)
                    recalculateAll()
                  }}
                  className='h-11'
                >
                  <MenuItem value='0'>0%</MenuItem>
                  <MenuItem value='5'>5%</MenuItem>
                  <MenuItem value='12'>12%</MenuItem>
                  <MenuItem value='18'>18%</MenuItem>
                  <MenuItem value='28'>28%</MenuItem>
                </TextField>
              )}
            />
          </div>
        </>
      )}

      <div className='space-y-1 flex flex-col '>
        <label className='text-sm font-medium text-gray-700'>Tax Amount</label>
        <Controller
          name='tax_amount'
          control={control}
          render={({ field }) => (
            <TextField
              type='number'
              {...field}
              value={field.value || ''}
              inputProps={{ readOnly: true }}
              className='h-11 bg-gray-50'
            />
          )}
        />
      </div>

      <div className='space-y-1 flex flex-col '>
        <label className='text-sm font-medium text-gray-700'>Card Price</label>
        <Controller
          name='card_price'
          control={control}
          render={({ field }) => (
            <TextField
              type='number'
              {...field}
              value={field.value || ''}
              onChange={e => {
                const value = Number((e.target as HTMLInputElement).value) || 0

                field.onChange(value)
                recalculateAll()
              }}
              placeholder='Enter card price'
              className='h-11'
              inputProps={{
                inputMode: 'numeric',
                pattern: '[0-9]*',
                onWheel: e => (e.currentTarget as HTMLInputElement).blur(),
                className: 'no-spinner'
              }}
            />
          )}
        />
      </div>

      <div className='space-y-1 flex flex-col '>
        <label className='text-sm font-medium text-gray-700'>Net Amount</label>
        <div className='h-11 px-3 py-[1.6563rem] bg-gray-50 border rounded-md flex items-center'>
          <CalculateOutlined className='w-4 h-4 mr-2 text-gray-500' />
          <span className='font-medium'>₹{net_amount?.toFixed(2) || '0.00'}</span>
        </div>
      </div>

      <div className='space-y-1 flex flex-col '>
        <label className='text-sm font-medium text-gray-700'>G Note</label>
        <Controller
          name='g_note'
          control={control}
          render={({ field }) => <TextField {...field} placeholder='Enter G Note' className='h-11' />}
        />
      </div>

      <div className='md:col-span-2 space-y-1 flex flex-col '>
        <label className='text-sm font-medium text-gray-700'>Remarks</label>
        <Controller
          name='remarks'
          control={control}
          render={({ field }) => (
            <TextareaAutosize
              {...field}
              placeholder='Add any notes or remarks'
              minRows={3}
              style={{
                border: '1px solid #ccc',
                borderRadius: '6px',
                padding: '8px',
                resize: 'vertical',
                fontFamily: 'inherit',
                fontSize: '15px'
              }}
            />
          )}
        />
      </div>
    </div>
  )
}

export default RechargeFormFields
