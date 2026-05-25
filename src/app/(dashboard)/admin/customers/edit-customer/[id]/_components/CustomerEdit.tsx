'use client'
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
import { dropdownApi } from '@/api/drop-down-api'
import { customerApi } from '@/api/customer-api'

const steps = ['', '', '']

const customerFormSchema = z.object({
  ledgerName: z.string().min(1, 'Name is required'),

  mobile: z.string().nonempty('Phone Number is required').min(10),

  emailId: z.string().email('Invalid email address').or(z.literal('')).optional(),

  dob: z.coerce.date({
    required_error: 'Birth Date is required',
    invalid_type_error: 'Invalid date format'
  }),

  age: z.coerce
    .number({
      required_error: 'Age is required',
      invalid_type_error: 'Age must be a number'
    })
    .min(1, 'Age must be greater than 0'),

  gender: z.coerce.number().min(1, 'Gender is required'),

  address: z.string().min(1, 'Address is required'),

  zipCode: z.coerce
    .number({
      required_error: 'Age is required',
      invalid_type_error: 'Age must be a number'
    })
    .min(1, 'Age must be greater than 0'),

  country: z.coerce.number().min(1, 'Country is required'),
  state: z.coerce.number().min(1, 'State is required'),
  city: z.coerce.number().min(1, 'City is required'),

  proof: z.coerce.number().min(1, 'Proof is required'),

  proofId: z.string().min(1, 'Proof Id is required'),

  occupation: z.string().optional(),
  institute: z.string().optional(),
  emergencyNo: z.string().optional(),
  remark: z.string().optional()
})

type CustomerFormValues = z.infer<typeof customerFormSchema>

type data = {
  ledgerId: string
  ledgerName: string
  mobile: string
  emailId: string
  dob: Date
  gender: number
  age: string
  ledgerAddress: string
  cCountry: number
  state: number
  city: number
  proof: number
  proofNo: string
  occupation: string
  cInstitute: string
  emergencyNo: string
  remarks: string
  zipCode: string
  cEmergency: string
}

type props = {
  genders: []
  countries: []
  proofs: []
  data: data
}

type Tdropdown = {
  id: number
  value: string
}

const CustomerEdit = ({ data, genders, countries, proofs }: props) => {
  const {
    control,
    handleSubmit,
    watch,
    formState: { errors, isLoading, isSubmitting },
    trigger,
    setValue
  } = useForm<CustomerFormValues>({
    resolver: zodResolver(customerFormSchema),
    defaultValues: {
      ledgerName: data.ledgerName || '',
      mobile: data.mobile || '',
      emailId: data.emailId || '',
      dob: data.dob ? new Date(data.dob) : undefined,
      age: Number(data.age) ?? undefined,
      gender: data.gender || undefined,
      address: data.ledgerAddress || undefined,
      country: data.cCountry || undefined,
      state: data.state || undefined,
      city: data.city || undefined,
      proof: data.proof || undefined,
      occupation: data.occupation || undefined,
      remark: data.remarks || undefined,
      zipCode: Number(data.zipCode) || undefined,
      emergencyNo: data.cEmergency || undefined,
      proofId: data.proofNo || undefined,
      institute: data.cInstitute || undefined
    }
  })

  const [tabIndex, setTabIndex] = useState(0)
  const [stateList, setStateList] = useState<Tdropdown[]>([])
  const [cityList, setCityList] = useState<Tdropdown[]>([])
  const [loadingCities, setLoadingCities] = useState(true)
  const [loadingStates, setLoadingStates] = useState(true)

  const countryValue = watch('country')
  const stateValue = watch('state')

  useEffect(() => {
    if (!countryValue) return

    const fetchStates = async () => {
      try {
        setLoadingStates(true)
        const response = await dropdownApi.states({ countryId: countryValue })

        setStateList(response.data.data)
      } catch (error) {
        console.error('Failed to load states:', error)
      } finally {
        setLoadingStates(false)
      }
    }

    fetchStates()
  }, [countryValue])

  useEffect(() => {
    if (!stateValue) return

    const fetchStates = async () => {
      try {
        setLoadingCities(true)
        const response = await dropdownApi.city({ stateId: stateValue })

        setCityList(response.data.data)
      } catch (error) {
        console.error('Failed to load states:', error)
      } finally {
        setLoadingCities(false)
      }
    }

    fetchStates()
  }, [stateValue])

  const handleNext = async () => {
    let fieldsToValidate: (keyof CustomerFormValues)[] = []

    if (tabIndex === 0) {
      fieldsToValidate = ['ledgerName', 'mobile', 'emailId', 'dob', 'age', 'gender']
    } else if (tabIndex === 1) {
      fieldsToValidate = ['address', 'city', 'state', 'country', 'zipCode']
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

  const onSubmit = async (values: any) => {
    try {
      const formData = {
        ...values,
        ledgerId: data.ledgerId,
        status: 1
      }

      const editCustomer = await customerApi.addCustomer({ body: formData })

      if (editCustomer.status === 200) {
        toast.success('Successfully Updated...')
        router.push('/admin/customers')
      }
    } catch (error) {
      console.error('Submit customer error:', error)
      const axiosError = error as any
      let message = 'Error'
      const responseData = axiosError.response?.data
      if (responseData) {
        if (responseData.errors && typeof responseData.errors === 'object') {
          message = Object.entries(responseData.errors)
            .map(([field, msgs]) => `${field}: ${Array.isArray(msgs) ? msgs.join(', ') : msgs}`)
            .join(' | ')
        } else if (responseData.Errors && typeof responseData.Errors === 'object') {
          message = Object.entries(responseData.Errors)
            .map(([field, msgs]) => `${field}: ${Array.isArray(msgs) ? msgs.join(', ') : msgs}`)
            .join(' | ')
        } else {
          message = responseData.message || responseData.Message || axiosError.message || 'Error'
        }
      } else {
        message = axiosError.message || 'Error'
      }
      toast.error(message, { duration: 6000 })
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
            CUSTOMER EDIT
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
                  name='ledgerName'
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      value={field.value ?? ''}
                      label='Name'
                      fullWidth
                      variant='standard'
                      size='small'
                      error={!!errors.ledgerName}
                      helperText={errors.ledgerName?.message}
                    />
                  )}
                />

                <Controller
                  name='mobile'
                  control={control}
                  render={({ field: { onChange, onBlur, value, ref } }) => (
                    <TextField
                      label='Phone'
                      fullWidth
                      variant='standard'
                      size='small'
                      style={{ marginTop: '2px' }}
                      error={!!errors.mobile}
                      helperText={errors.mobile?.message}
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
                  name='emailId'
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      value={field.value ?? ''}
                      label='Email (Optional)'
                      fullWidth
                      variant='standard'
                      size='small'
                      error={!!errors.emailId}
                      helperText={errors.emailId?.message}
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
                      scrollableYearDropdown
                      yearDropdownItemNumber={120}
                      className='w-full'
                      dateFormat='dd/MM/yyyy'
                      selected={field.value}
                      onChange={val => {
                        field.onChange(val)
                        if (val) {
                          const today = new Date()
                          let calculatedAge = today.getFullYear() - val.getFullYear()
                          const monthDiff = today.getMonth() - val.getMonth()
                          if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < val.getDate())) {
                            calculatedAge--
                          }
                          setValue('age', calculatedAge, { shouldValidate: true })
                        } else {
                          setValue('age', 0, { shouldValidate: true })
                        }
                      }}
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
                      value={field.value ?? ''}
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
                      {genders.map((gender: Tdropdown) => (
                        <MenuItem key={gender.id} value={gender.id}>
                          {gender.value}
                        </MenuItem>
                      ))}
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
                      {countries.map((country: Tdropdown) => (
                        <MenuItem key={country.id} value={country.id}>
                          {country.value}
                        </MenuItem>
                      ))}
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
                      {loadingStates ? (
                        <MenuItem disabled>Loading...</MenuItem>
                      ) : (
                        stateList.map((state: Tdropdown) => (
                          <MenuItem key={state.id} value={state.id}>
                            {state.value}
                          </MenuItem>
                        ))
                      )}
                    </TextField>
                  )}
                />
                <Controller
                  name='city'
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      value={field.value ?? ''} // Ensure controlled
                      label='City'
                      select
                      fullWidth
                      size='small'
                      variant='standard'
                      error={!!errors.state}
                      helperText={errors.state?.message}
                    >
                      {loadingCities ? (
                        <MenuItem disabled>Loading...</MenuItem>
                      ) : (
                        cityList.map((city: Tdropdown) => (
                          <MenuItem key={city.id} value={city.id}>
                            {city.value}
                          </MenuItem>
                        ))
                      )}
                    </TextField>
                  )}
                />
                <Controller
                  name='address'
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      value={field.value ?? ''}
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
                  name='zipCode'
                  control={control}
                  render={({ field: { onChange, onBlur, value, ref } }) => (
                    <TextField
                      label='Zip Code'
                      fullWidth
                      variant='standard'
                      size='small'
                      style={{ marginTop: '2px' }}
                      error={!!errors.zipCode}
                      helperText={errors.zipCode?.message}
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
                  name='emergencyNo'
                  control={control}
                  render={({ field: { onChange, onBlur, value, ref } }) => (
                    <TextField
                      label='Contact Emergency (Optional)'
                      fullWidth
                      variant='standard'
                      size='small'
                      style={{ marginTop: '2px' }}
                      error={!!errors.emergencyNo}
                      helperText={errors.emergencyNo?.message}
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
                      {proofs.map((proof: Tdropdown) => (
                        <MenuItem key={proof.id} value={proof.id}>
                          {proof.value}
                        </MenuItem>
                      ))}
                    </TextField>
                  )}
                />

                <Controller
                  name='proofId'
                  control={control}
                  render={({ field: { onChange, onBlur, value, ref } }) => (
                    <TextField
                      label='Proof ID'
                      fullWidth
                      variant='standard'
                      size='small'
                      style={{ marginTop: '2px' }}
                      error={!!errors.proofId}
                      helperText={errors.proofId?.message}
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
                      value={field.value ?? ''}
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
                      value={field.value ?? ''}
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
                      value={field.value ?? ''}
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

export default CustomerEdit
