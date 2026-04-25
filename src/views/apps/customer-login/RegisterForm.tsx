import React, { useEffect, useState } from 'react'

import { useRouter } from 'next/navigation'

import { Box, Button, MenuItem, TextField, Typography } from '@mui/material'
import { z } from 'zod'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import toast from 'react-hot-toast'

import CustomStepper from './ProgressBar'
import AppReactDatepicker from '@/libs/styles/AppReactDatepicker'
import CleavePhone from './CleavePhone'
import CleaveProofId from './CleaveProofId'
import CleaveZipCode from './CleaveZipCode'
import { customerModuleApi } from '@/api/customer-module-api'

const steps = ['', '', '']

const eventFormSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  phone: z.string().nonempty('Phone Number is required').min(10, 'Phone must be at least 10 characters'),
  email: z.string().email('Invalid email address').optional(),
  dob: z.date({
    required_error: 'Birth Date is required',
    invalid_type_error: 'Invalid date format'
  }),
  age: z.string().min(1, 'Age is required'),
  gender: z.string().min(1, 'Gender is required'),
  address: z.string().min(1, 'Address is required'),
  zip_code: z.string().min(1, 'Zip Code is required'),
  country: z.string().min(1, 'Country is required'),
  state: z.string().min(1, 'State is required'),
  city: z.string().min(1, 'City is required'),
  proof: z.string().min(1, 'Proof is required'),
  proof_id: z.string().min(1, 'Proof Id is required'),
  occupation: z.string().optional(),
  institute: z.string().optional(),
  emergency_contact: z.string().optional(),
  remark: z.string().optional()
})

type EventFormValues = z.infer<typeof eventFormSchema>

const RegisterForm = () => {
  const {
    control,
    handleSubmit,
    formState: { errors, isLoading, isSubmitting },
    trigger // <-- add this
  } = useForm<EventFormValues>({
    resolver: zodResolver(eventFormSchema)
  })

  const [tabIndex, setTabIndex] = useState(0)

  const handleNext = async () => {
    let fieldsToValidate: (keyof EventFormValues)[] = []

    if (tabIndex === 0) {
      fieldsToValidate = ['name', 'phone', 'email', 'dob', 'age', 'gender']
    } else if (tabIndex === 1) {
      fieldsToValidate = ['address', 'city', 'state', 'country', 'zip_code']
    }

    const isValid = await trigger(fieldsToValidate)

    if (isValid && tabIndex < steps.length - 1) {
      setTabIndex(tabIndex + 1)
    }
  }

  const handlePrevi = () => {
    if (tabIndex < steps.length + 1) {
      setTabIndex(tabIndex - 1)
    }
  }

  const router = useRouter()

  const onSubmit = async (data: EventFormValues) => {
    try {
      const payload = {
        ledgerId: 0,
        ledgerName: data.name,
        mobile: data.phone,
        emailId: data.email || '',
        dob: data.dob,
        age: Number(data.age),
        gender: Number(data.gender) || 0,
        country: Number(data.country) || 0,
        state: Number(data.state) || 0,
        city: Number(data.city) || 0,
        address: data.address,
        zipCode: Number(data.zip_code) || 0,
        emergencyNo: data.emergency_contact || '',
        proof: Number(data.proof) || 0,
        proofId: data.proof_id,
        occupation: data.occupation || '',
        institute: data.institute || '',
        remark: data.remark || '',
        status: 1
      }

      const res = await customerModuleApi.register({ body: payload })
      const returnedId = res.data?.data?.ledgerId ?? res.data?.data?.id

      if (typeof window !== 'undefined' && returnedId) {
        sessionStorage.setItem('cusLedgerId', String(returnedId))
        sessionStorage.setItem('cusPhone', data.phone)
      }

      toast.success('Successfully Registered')
      router.push('/customer/home')
    } catch (err) {
      toast.error('Registration failed')
    }
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
    <div className='w-full'>
      <div className='p-6 bg-[#ffffff] rounded-lg mb-5 shadow-md max-md:w-full'>
        <CustomStepper currentStep={tabIndex} />
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className='max-md:w-full'>
        <div className='flex justify-between items-center text-center'>
          <Typography
            variant='h5'
            align='left'
            gutterBottom
            className='font-bold text-[#4b41ba] leading-[0%] text-base sm:text-lg md:text-xl lg:text-2xl'
          >
            REGISTER HERE
          </Typography>
          {/* Next Button */}
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: { xs: 2, md: 4 }, paddingBottom: '10px' }}>
            {tabIndex > 0 && (
              <Button
                variant='contained'
                color='primary'
                onClick={handlePrevi}
                disabled={tabIndex < 1}
                className='max-md:text-xs max-md:px-3 minWidth'
              >
                {isMobile ? <i className='tabler-chevron-left size-4' /> : 'Back'}
              </Button>
            )}
            {tabIndex < 2 && (
              <Button
                variant='contained'
                color='primary'
                onClick={handleNext}
                disabled={tabIndex === steps.length - 1}
                className='max-md:text-xs max-md:px-3 minWidth'
              >
                {isMobile ? <i className='tabler-chevron-right size-4' /> : 'Next'}
              </Button>
            )}
            {tabIndex == 2 && (
              <Button variant='contained' color='primary' type='submit' disabled = {isSubmitting || isLoading} className='max-md:text-xs max-md:px-3 minWidth'>
                {isMobile ? <i className='tabler-brand-telegram size-4' /> : 'Submit'}
              </Button>
            )}
          </Box>
        </div>
        {tabIndex === 0 && (
          <>
            <div className='p-6 bg-[#ffffff] rounded-lg shadow-md mt-2 max-sm:mb-10'>
              <div className='grid sm:grid-cols-2 gap-6 sm:mb-6 mb-3 sm:mt-10'>
                <Controller
                  name='name'
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label='Name'
                      fullWidth
                      variant='standard'
                      size='small'
                      error={!!errors.name}
                      helperText={errors.name?.message}
                    />
                  )}
                />

                <Controller
                  name='phone'
                  control={control}
                  render={({ field: { onChange, onBlur, value, ref } }) => (
                    <TextField
                      label='Phone'
                      fullWidth
                      variant='standard'
                      size='small'
                      style={{ marginTop: '2px' }}
                      error={!!errors.phone}
                      helperText={errors.phone?.message}
                      InputProps={{
                        inputComponent: CleavePhone as any
                      }}
                      inputProps={{
                        onChange,
                        onBlur,
                        value,
                        ref
                      }}
                    />
                  )}
                />

                <Controller
                  name='email'
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label='Email (Optional)'
                      fullWidth
                      variant='standard'
                      size='small'
                      error={!!errors.email}
                      helperText={errors.email?.message}
                    />
                  )}
                />
                <Controller
                  name='dob'
                  control={control}
                  rules={{ required: 'Birth Date is required' }}
                  render={({ field }) => (
                    <AppReactDatepicker
                      showYearDropdown
                      showMonthDropdown
                      className='w-full'
                      dateFormat='dd/MM/yyyy'
                      selected={field.value}
                      onChange={field.onChange}
                      placeholderText='DD/MM/YYYY'
                      customInput={
                        <TextField
                          fullWidth
                          label='Birth Date'
                          variant='standard'
                          placeholder='DD-MM-YYYY'
                          error={!!errors.dob}
                          helperText={typeof errors.dob?.message === 'string' ? errors.dob.message : undefined}
                        />
                      }
                    />
                  )}
                />

                <Controller
                  name='age'
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label='Age'
                      fullWidth
                      variant='standard'
                      size='small'
                      style={{ marginTop: '3px' }}
                      error={!!errors.age}
                      helperText={errors.age?.message}
                    />
                  )}
                />
                <Controller
                  name='gender'
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      value={field.value ?? ''} // Ensure controlled
                      label='Gender'
                      select
                      fullWidth
                      size='small'
                      variant='standard'
                      error={!!errors.gender}
                      helperText={errors.gender?.message}
                    >
                      <MenuItem disabled>--Select Gender--</MenuItem>
                      <MenuItem value='male'>Male</MenuItem>
                      <MenuItem value='female'>Female</MenuItem>
                    </TextField>
                  )}
                />
              </div>
            </div>
          </>
        )}

        {tabIndex === 1 && (
          <>
            <div className='p-6 bg-[#ffffff] rounded-lg shadow-md mt-2 max-sm:mb-10'>
              <div className='grid sm:grid-cols-2 gap-6 sm:mb-6 mb-3 sm:mt-10'>
                <Controller
                  name='country'
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      value={field.value ?? ''} // Ensure controlled
                      label='Country'
                      select
                      fullWidth
                      size='small'
                      variant='standard'
                      error={!!errors.country}
                      helperText={errors.country?.message}
                    >
                      <MenuItem disabled>--Select Country--</MenuItem>
                      <MenuItem value='ind'>India</MenuItem>
                      <MenuItem value='uae'>UAE</MenuItem>
                    </TextField>
                  )}
                />
                <Controller
                  name='state'
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      value={field.value ?? ''} // Ensure controlled
                      label='State'
                      select
                      fullWidth
                      size='small'
                      variant='standard'
                      error={!!errors.state}
                      helperText={errors.state?.message}
                    >
                      <MenuItem disabled>--Select State--</MenuItem>
                      <MenuItem value='KL'>Kerala</MenuItem>
                      <MenuItem value='DL'>New Delhi</MenuItem>
                    </TextField>
                  )}
                />
                <Controller
                  name='city'
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label='City'
                      fullWidth
                      variant='standard'
                      size='small'
                      error={!!errors.address}
                      helperText={errors.address?.message}
                    />
                  )}
                />
                <Controller
                  name='address'
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label='Address'
                      fullWidth
                      variant='standard'
                      size='small'
                      error={!!errors.address}
                      helperText={errors.address?.message}
                    />
                  )}
                />
                <Controller
                  name='zip_code'
                  control={control}
                  render={({ field: { onChange, onBlur, value, ref } }) => (
                    <TextField
                      label='Zip Code'
                      fullWidth
                      variant='standard'
                      size='small'
                      style={{ marginTop: '2px' }}
                      error={!!errors.zip_code}
                      helperText={errors.zip_code?.message}
                      InputProps={{
                        inputComponent: CleaveZipCode as any
                      }}
                      inputProps={{
                        onChange,
                        onBlur,
                        value,
                        ref
                      }}
                    />
                  )}
                />

                <Controller
                  name='emergency_contact'
                  control={control}
                  render={({ field: { onChange, onBlur, value, ref } }) => (
                    <TextField
                      label='Contact Emergency (Optional)'
                      fullWidth
                      variant='standard'
                      size='small'
                      style={{ marginTop: '2px' }}
                      error={!!errors.emergency_contact}
                      helperText={errors.emergency_contact?.message}
                      InputProps={{
                        inputComponent: CleavePhone as any
                      }}
                      inputProps={{
                        onChange,
                        onBlur,
                        value,
                        ref
                      }}
                    />
                  )}
                />
              </div>
            </div>
          </>
        )}
        {tabIndex === 2 && (
          <>
            <div className='p-6 bg-[#ffffff] rounded-lg shadow-md mt-2 max-sm:mb-10'>
              <div className='grid sm:grid-cols-2 gap-6 sm:mb-6 mb-3 sm:mt-10'>
                <Controller
                  name='proof'
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      value={field.value ?? ''} // Ensure controlled
                      label='Proof'
                      select
                      fullWidth
                      size='small'
                      variant='standard'
                      error={!!errors.proof}
                      helperText={errors.proof?.message}
                    >
                      <MenuItem disabled>--Select Proof--</MenuItem>
                      <MenuItem value='aadhar'>Aadhar</MenuItem>
                    </TextField>
                  )}
                />

                <Controller
                  name='proof_id'
                  control={control}
                  render={({ field: { onChange, onBlur, value, ref } }) => (
                    <TextField
                      label='Proof ID'
                      fullWidth
                      variant='standard'
                      size='small'
                      style={{ marginTop: '2px' }}
                      error={!!errors.proof_id}
                      helperText={errors.proof_id?.message}
                      InputProps={{
                        inputComponent: CleaveProofId as any
                      }}
                      inputProps={{
                        onChange,
                        onBlur,
                        value,
                        ref
                      }}
                    />
                  )}
                />

                <Controller
                  name='occupation'
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label='Occupation (Optional)'
                      fullWidth
                      variant='standard'
                      size='small'
                      style={{ marginTop: '2px' }}
                      error={!!errors.occupation}
                      helperText={errors.occupation?.message}
                    />
                  )}
                />
                <Controller
                  name='institute'
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label='Institute (Optional)'
                      fullWidth
                      variant='standard'
                      size='small'
                      style={{ marginTop: '2px' }}
                      error={!!errors.institute}
                      helperText={errors.institute?.message}
                    />
                  )}
                />

                <Controller
                  name='remark'
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label='Remark (optional)'
                      fullWidth
                      variant='standard'
                      size='small'
                      style={{ marginTop: '2px' }}
                      error={!!errors.remark}
                      helperText={errors.remark?.message}
                    />
                  )}
                />
              </div>
            </div>
          </>
        )}
      </form>
    </div>
  )
}

export default RegisterForm
