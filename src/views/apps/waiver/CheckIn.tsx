'use client'
import { useEffect, useMemo, useRef, useState } from 'react'

import Image from 'next/image'

import { z } from 'zod'
import { useForm, Controller } from 'react-hook-form'
import type { FieldError } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Box, Button, Modal, TextField, Typography } from '@mui/material'
import { SignatureCanvas } from 'react-signature-canvas'
import toast from 'react-hot-toast'

import AppReactDatepicker from '@/libs/styles/AppReactDatepicker'
import CheckingFileUpload from '@/components/custom-fields/CheckingFileUpload'
import { getUser } from '@/utils/authStorage'
import { waiverApi } from '@/api/waiver-api'
import { base64ToFile } from '@/utils/fileToBase64'
import CustomerAutocomplete from '@/components/CustomerAutocomplete'
import { populateFormWithCustomer } from '@/utils/customerUtils'

/* ================================
 ✅ SCHEMA (REAL BACKEND LOGIC)
================================ */
export const getSchema = (data: any) => {
  const baseFields: z.ZodRawShape = {}

  baseFields['selectedCustomer'] = z
  .object({
    ledgerId: z.number({
      required_error: 'Please Select a Customer'
    })
  })
  .nullable()
  .refine(val => val !== null, {
    message: 'Please Select a Customer'
  })

  // ✅ NAME
  if (data.name === 1) {
    if (data.nameOpt === 1) {
      baseFields['name'] = z.object({
        first: z.string().optional().or(z.literal('')),
        last: z.string().optional().or(z.literal(''))
      })
    } else {
      baseFields['name'] = z.object({
        first: z.string().min(1, 'First name is required'),
        last: z.string().min(1, 'Last name is required')
      })
    }
  }

  // ✅ PHONE
  if (data.phone === 1) {
    if (data.phoneOpt === 1) {
      baseFields['phone_number'] = z.string().min(10).optional().or(z.literal(''))
    } else {
      baseFields['phone_number'] = z.string().min(10, 'Mobile number must be at least 10 digits')
    }
  }

  // ✅ EMAIL
  if (data.emailId === 1) {
    if (data.emailIdOpt === 1) {
      baseFields['email'] = z.string().email('Invalid email').optional().or(z.literal(''))
    } else {
      baseFields['email'] = z.string().email('Invalid email')
    }
  }

  // ✅ ADDRESS
  if (data.address === 1) {
    if (data.addressOpt === 1) {
      baseFields['address'] = z.string().optional().or(z.literal(''))
    } else {
      baseFields['address'] = z.string().min(1, 'Address is required')
    }
  }

  // ✅ DOB
  if (data.dob === 1) {
    if (data.dobOpt === 1) {
      baseFields['dob'] = z.date().optional()
    } else {
      baseFields['dob'] = z.date({ required_error: 'Birth date is required' })
    }
  }

  // ✅ SIGNATURE
  const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']

  if (data.signature === 1) {
    if (data.signatureOpt === 1) {
      baseFields['sign'] = z
        .any()
        .refine(v => typeof v === 'string' || (typeof v === 'object' && ACCEPTED_IMAGE_TYPES.includes(v?.type)), {
          message: 'Invalid sign format'
        })
        .optional()
    } else {
      baseFields['sign'] = z
        .any()
        .refine(v => typeof v === 'string' || (typeof v === 'object' && ACCEPTED_IMAGE_TYPES.includes(v?.type)), {
          message: 'Invalid sign format'
        })
    }
  }

  // ✅ FILE
  const ACCEPTED_TYPES = [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/webp',
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ]

  if (data.file === 1) {
    if (data.fileOpt === 1) {
      baseFields['file'] = z
        .any()
        .refine((v: any) => typeof v === 'string' || (typeof v === 'object' && ACCEPTED_TYPES.includes(v?.type)), {
          message: 'Invalid file format'
        })
        .optional()
    } else {
      baseFields['file'] = z
        .any()
        .refine((v: any) => typeof v === 'string' || (typeof v === 'object' && ACCEPTED_TYPES.includes(v?.type)), {
          message: 'Invalid file format'
        })
    }
  }

  return z.object(baseFields)
}

type Tdata = {
  waverId: number
  titile: string
  description: string
  name: number
  nameOpt: number
  phone: number
  phoneOpt: number
  emailId: number
  emailIdOpt: number
  address: number
  addressOpt: number
  dob: number
  dobOpt: number
  file: any
  fileOpt: number
  signature: number
  signatureOpt: number
  active: number
  status: number
}

type TCustomer = {
  ledgerId: number
  ledgerName: string
  mobile: string
}

const CheckIn = ({ data, customers }: { data: Tdata; customers: TCustomer[] }) => {
  const schema = useMemo(() => getSchema(data), [data])

  const user = getUser()

  type FormData = z.infer<ReturnType<typeof getSchema>>

  const [savedSignature, setSavedSignature] = useState<string | null>(null)
  const [isSignatureModalOpen, setSignatureModalOpen] = useState(false)
  const sigCanvasRef = useRef<SignatureCanvas>(null)
  const [showFullDescription, setShowFullDescription] = useState(false)
  const [isDescriptionClamped, setIsDescriptionClamped] = useState(false)
  const descriptionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (descriptionRef.current) {
      const lineHeight = parseInt(getComputedStyle(descriptionRef.current).lineHeight) || 24
      const maxHeight = lineHeight * 10
      const actualHeight = descriptionRef.current.scrollHeight

      setIsDescriptionClamped(actualHeight > maxHeight)
    }
  }, [])

  const {
    handleSubmit,
    control,
    setValue,
    formState: { errors, isLoading, isSubmitting }
  } = useForm<FormData>({
    resolver: zodResolver(schema)
  })

  const [formSubmitted] = useState(false)
  const [countdown, setCountdown] = useState(3)

  const onSubmit = async (formData: FormData) => {
    try {
      const payload = new FormData()

      payload.append('wId', String(data.waverId))
      payload.append('name', formData.name?.first || '')
      payload.append('lastName', formData.name?.last || '')
      payload.append('address', formData.address || '')
      payload.append('email', formData.email || '')
      payload.append('phNo', formData.phone_number || '')
      payload.append('WaverName', data.titile || '')
      payload.append('dob', formData.dob ? new Date(formData.dob).toISOString() : '')
      payload.append('status', '1')
      payload.append('branchId', user?.branchId ? String(user.branchId) : '')

      // ✅ append selected customer ledgerId
      if (formData.selectedCustomer?.ledgerId) {
        payload.append('ledgerId', String(formData.selectedCustomer.ledgerId))
      }

      // ✅ signature
      let signFile: File | null = null

      if (typeof formData.sign === 'string') {
        signFile = base64ToFile(
          formData.sign,
          `${formData.name?.first || 'user'}_${formData.name?.last || ''}_signature.png`,
          'image/png'
        )
      } else if (formData.sign instanceof File) {
        signFile = formData.sign
      }

      if (signFile) {
        payload.append('signature', signFile)
      }

      // ✅ file upload
      if (formData.file instanceof File) {
        payload.append('file', formData.file)
      }

      const res = await waiverApi.signWaiver({ body: payload })

      if (res.status) {
        toast.success('Submit Successfully')
      }
    } catch (error) {
      console.error(error)
      toast.error('Submission failed')
    }
  }

  useEffect(() => {
    if (formSubmitted) {
      const timer = setInterval(() => {
        setCountdown((prev: any) => {
          if (prev <= 1) {
            clearInterval(timer)
            window.location.reload()

            return 0
          }

          return prev - 1
        })
      }, 1000)

      return () => clearInterval(timer)
    }
  }, [formSubmitted])

  const nameErrors = errors.name as { first?: FieldError; last?: FieldError } | undefined

  useEffect(() => {
    if (isSignatureModalOpen && savedSignature) {
      const timer = setTimeout(() => {
        sigCanvasRef.current?.clear()
        sigCanvasRef.current?.fromDataURL(savedSignature)
      }, 100)

      return () => clearTimeout(timer)
    }
  }, [isSignatureModalOpen, savedSignature])

  if (formSubmitted) {
    return (
      <div className='flex flex-col items-center justify-center h-screen bg-white text-center'>
        <h1 className='text-2xl font-semibold'>Thank you! We have received your waiver.</h1>
        <p className='mt-4'>
          This page will automatically jump back to a new waiver page in <b>{countdown}</b> second
          {countdown !== 1 && 's'}
        </p>
      </div>
    )
  }

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className='bg-black w-full h-full py-40'>
          <Box className='~p-2/6 bg-[#ffffff] rounded-lg shadow-md w-[70%]' sx={{ mx: 'auto' }}>
            <div className='py-10 flex flex-col items-center'>
              {data.file && (
                <div className='w-[10rem] h-[10rem] relative'>
                  <Image src={data.file} alt={'Logo'} fill className='object-fill' />
                </div>
              )}

              <Typography variant='h4' gutterBottom textAlign='center'>
                {data.titile}
              </Typography>

              {data.description && (
                <div className='px-0/10 w-full max-w-4xl'>
                  <div
                    ref={descriptionRef}
                    className={`transition-all duration-300 overflow-hidden ${
                      !showFullDescription && isDescriptionClamped ? 'max-h-[240px]' : 'max-h-[none]'
                    } `}
                    style={{
                      textAlign: 'center',
                      wordBreak: 'break-word'
                    }}
                    dangerouslySetInnerHTML={{ __html: data.description }}
                  />
                  {isDescriptionClamped && (
                    <Button
                      type='button'
                      onClick={() => setShowFullDescription(!showFullDescription)}
                      className='text-blue-500 hover:text-blue-700 mt-2 text-sm font-medium mx-auto block'
                    >
                      {showFullDescription ? 'Read Less' : 'Read More'}
                    </Button>
                  )}
                </div>
              )}
            </div>

            <div className='grid grid-cols-1 gap-4 mb-6'>
              <CustomerAutocomplete
                customers={customers as any}
                control={control}
                name='selectedCustomer'
                label='Search & Select Customer'
                onCustomerSelect={customer => {
                  populateFormWithCustomer(customer, setValue)
                  toast.success(`Customer ${customer.ledgerName} selected`)
                }}
                error={!!errors.selectedCustomer}
                helperText={errors.selectedCustomer?.message?.toString() || ''}
              />
            </div>

            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              {data.name === 1 && (
                <>
                  <Controller
                    name='name.first'
                    control={control}
                    render={({ field }: any) => (
                      <TextField
                        label={data.nameOpt === 1 ? 'First Name (optional)' : 'First Name'}
                        fullWidth
                        {...field}
                        error={!!nameErrors?.first}
                        helperText={nameErrors?.first?.message || ''}
                        InputLabelProps={{ shrink: field.value ? true : undefined }}
                      />
                    )}
                  />
                  <Controller
                    name='name.last'
                    control={control}
                    render={({ field }: any) => (
                      <TextField
                        label={data.nameOpt === 1 ? 'Last Name (optional)' : 'Last Name'}
                        fullWidth
                        {...field}
                        error={!!nameErrors?.last}
                        helperText={nameErrors?.last?.message || ''}
                        InputLabelProps={{ shrink: field.value ? true : undefined }}
                      />
                    )}
                  />
                </>
              )}

              {data.phone === 1 && (
                <Controller
                  name='phone_number'
                  control={control}
                  render={({ field }: any) => (
                    <TextField
                      label={data.phoneOpt === 1 ? 'Mobile Number (optional)' : 'Mobile Number'}
                      fullWidth
                      type='number'
                      {...field}
                      error={!!errors.phone_number}
                      helperText={errors.phone_number?.message?.toString() || ''}
                      InputLabelProps={{ shrink: field.value ? true : undefined }}
                    />
                  )}
                />
              )}

              {data.emailId === 1 && (
                <Controller
                  name='email'
                  control={control}
                  render={({ field }: any) => (
                    <TextField
                      label={data.emailIdOpt === 1 ? 'Email (optional)' : 'Email'}
                      fullWidth
                      {...field}
                      error={!!errors.email}
                      helperText={errors.email?.message?.toString() || ''}
                      InputLabelProps={{ shrink: field.value ? true : undefined }}
                    />
                  )}
                />
              )}

              {data.address === 1 && (
                <Controller
                  name='address'
                  control={control}
                  render={({ field }: any) => (
                    <TextField
                      label={data.addressOpt === 1 ? 'Address (optional)' : 'Address'}
                      fullWidth
                      {...field}
                      error={!!errors.address}
                      helperText={errors.address?.message?.toString() || ''}
                      InputLabelProps={{ shrink: field.value ? true : undefined }}
                    />
                  )}
                />
              )}

              {data.dob === 1 && (
                <Controller
                  name='dob'
                  control={control}
                  render={({ field }: any) => (
                    <AppReactDatepicker
                      showYearDropdown
                      showMonthDropdown
                      className='w-full'
                      dateFormat='dd/MM/yyyy'
                      selected={field.value}
                      onChange={(date: any) => field.onChange(date)}
                      placeholderText='DD/MM/YYYY'
                      customInput={
                        <TextField
                          fullWidth
                          label={data.dobOpt === 1 ? 'Birth Date (optional)' : 'Birth Date'}
                          error={!!errors.dob}
                          helperText={errors.dob?.message?.toString() || ''}
                        />
                      }
                    />
                  )}
                />
              )}
            </div>

            {data.file === 1 && (
              <Controller
                name='file'
                control={control}
                render={({ field }: any) => (
                  <CheckingFileUpload
                    label={data.fileOpt === 1 ? 'Upload File (optional)' : 'Upload File'}
                    value={field.value}
                    onChange={(file: any) => field.onChange(file)}
                    error={!!errors.file}
                    helperText={errors.file?.message?.toString() || ''}
                  />
                )}
              />
            )}

            {data.signature === 1 && (
              <div className='mt-6'>
                <Typography variant='subtitle1'>
                  {data.signatureOpt === 1 ? 'Signature (optional)' : 'Signature'}
                </Typography>

                {savedSignature ? (
                  <div className='cursor-pointer flex flex-col' onClick={() => setSignatureModalOpen(true)}>
                    <img src={savedSignature} alt='Saved Signature' className='border h-32 w-[50%]' />
                    <Typography variant='caption' color='primary'>
                      Click to Edit Signature
                    </Typography>
                  </div>
                ) : (
                  <Button variant='outlined' onClick={() => setSignatureModalOpen(true)}>
                    Add Signature
                  </Button>
                )}

                {errors.sign && <p style={{ color: 'red', fontSize: 'small' }}>{`${errors.sign.message}`}</p>}
              </div>
            )}

            <Button type='submit' disabled={isSubmitting || isLoading} variant='contained' sx={{ mt: 5 }}>
              Submit
            </Button>
          </Box>
        </div>
      </form>

      <Modal open={isSignatureModalOpen} onClose={() => setSignatureModalOpen(false)}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 400,
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 4,
            borderRadius: 2
          }}
        >
          <Typography variant='h6' gutterBottom>
            Sign Below
          </Typography>
          <SignatureCanvas
            ref={sigCanvasRef}
            penColor='black'
            canvasProps={{ width: 360, height: 150, className: 'sigCanvas border' }}
          />
          <Box display='flex' justifyContent='space-between' mt={2}>
            <div>
              <Button variant='outlined' onClick={() => sigCanvasRef.current?.clear()}>
                Clear
              </Button>
              <Button variant='text' onClick={() => setSignatureModalOpen(false)}>
                Cancel
              </Button>
            </div>
            <Button
              variant='contained'
              onClick={() => {
                const canvas = sigCanvasRef.current

                if (canvas && !canvas.isEmpty()) {
                  const signatureDataUrl = canvas.toDataURL('image/png')

                  setSavedSignature(signatureDataUrl)
                  setValue('sign', signatureDataUrl)
                  setSignatureModalOpen(false)
                }
              }}
            >
              Save
            </Button>
          </Box>
        </Box>
      </Modal>
    </>
  )
}

export default CheckIn
