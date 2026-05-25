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
  mobile: z.string().nonempty('Phone Number is required').min(10, 'Phone must be at least 10 characters'),
  emailId: z.string().email('Invalid email address').or(z.literal('')).optional(),
  dob: z.date({
    required_error: 'Birth Date is required',
    invalid_type_error: 'Invalid date format'
  }),
  age: z.string().min(1, 'Age is required'),
  gender: z.coerce.number().min(1, 'Gender is required'),
  address: z.string().min(1, 'Address is required'),
  zipCode: z.string().min(1, 'Zip Code is required'),
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

type Tdropdown = {
  id: number
  value: string
}

const CustomerAdd = () => {
  const {
    control,
    handleSubmit,
    formState: { errors, isLoading, isSubmitting },
    watch,
    trigger,
    setValue
  } = useForm<CustomerFormValues>({
    resolver: zodResolver(customerFormSchema),
    defaultValues: {
      ledgerName: '',
      mobile: '',
      emailId: '',
      dob: undefined,
      age: '',
      gender: undefined,
      address: '',
      zipCode: '',
      country: undefined,
      state: undefined,
      city: undefined,
      proof: undefined,
      proofId: '',
      occupation: '',
      institute: '',
      emergencyNo: '',
      remark: ''
    }
  })

  const router = useRouter()

  const [isMobile, setIsMobile] = useState(false)
  const [tabIndex, setTabIndex] = useState<number>(0)
  const [loading, setLoading] = useState<boolean>(false)
  const [loadingCities, setLoadingCities] = useState<boolean>(true)
  const [loadingStates, setLoadingStates] = useState<boolean>(true)
  const [genders, setGenders] = useState<Tdropdown[]>()
  const [proofs, setProofs] = useState<Tdropdown[]>()
  const [countries, setCountries] = useState<Tdropdown[]>()
  const [stateList, setStateList] = useState<Tdropdown[]>([])
  const [cityList, setCityList] = useState<Tdropdown[]>([])

  const countryValue = watch('country')
  const stateValue = watch('state')

  const api = async () => {
    try {
      setLoading(true)

      const [countriesRes, proofsRes, genderRes] = await Promise.all([
        dropdownApi.countries(),
        dropdownApi.proofs(),
        dropdownApi.gender()
      ])

      if (genderRes.data.status === 'success') {
        setGenders(genderRes.data.data)
      }

      if (countriesRes.data.status === 'success') {
        setCountries(countriesRes.data.data)
      }

      if (proofsRes.data.status === 'success') {
        setProofs(proofsRes.data.data)
      }
    } catch (error) {
      toast.error('Error occurred while loading data')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    api()
  }, [])

  useEffect(() => {
    if (!countryValue) return

    const fetchStates = async () => {
      try {
        setLoadingStates(true)
        const response = await dropdownApi.states({ countryId: countryValue })

        setStateList(response.data.data)
      } catch (error) {
      } finally {
        setLoadingStates(false)
      }
    }

    fetchStates()
  }, [countryValue])

  useEffect(() => {
    if (!stateValue) return

    const fetchCities = async () => {
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

    fetchCities()
  }, [stateValue])

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768) // 768px = 48rem
    }

    handleResize() // run initially
    window.addEventListener('resize', handleResize)

    return () => window.removeEventListener('resize', handleResize)
  }, [])

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

  const onSubmit = async (data: CustomerFormValues) => {
    try {
      const body = {
        ledgerId: 0,
        ledgerName: data.ledgerName,
        mobile: data.mobile,
        emailId: data.emailId || '',
        dob: data.dob,
        age: Number(data.age),
        gender: Number(data.gender),
        country: Number(data.country),
        state: Number(data.state),
        city: Number(data.city),
        address: data.address,
        zipCode: Number(data.zipCode),
        emergencyNo: data.emergencyNo || '',
        proof: Number(data.proof),
        proofId: data.proofId,
        occupation: data.occupation || '',
        institute: data.institute || '',
        remark: data.remark || '',
        status: 1
      }

      const addCustomer = await customerApi.addCustomer({ body })

      if (addCustomer.status === 200) {
        toast.success('Successfully Registered...')
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

  return (
    <div className='max-w-6xl mx-auto px-2 sm:px-4 py-3 sm:py-6'>
      {/* Page Header */}
      <div className='mb-4 sm:mb-8 px-1'>
        <h1 className='text-xl sm:text-2xl font-bold text-[#1E293B]'>Add Customer</h1>
        <p className='text-xs sm:text-sm text-[#94A3B8] font-medium mt-0.5'>
          {tabIndex === 0 && 'Fill in personal details'}
          {tabIndex === 1 && 'Enter address information'}
          {tabIndex === 2 && 'Verification & submit'}
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Step 1: Personal Details */}
        {tabIndex === 0 && (
          <div className='rounded-none sm:rounded-2xl border-0 sm:border sm:border-[rgba(0,0,0,0.06)] bg-white'>
            <div className='px-3 sm:px-6 pt-4 sm:pt-5 pb-3 border-b border-[rgba(0,0,0,0.06)]' style={{ isolation: 'auto' }}>
              <CustomStepper currentStep={tabIndex} />
            </div>
            <div className='px-3 py-4 sm:p-6 md:p-8 relative z-20'>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-5'>
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
                          setValue('age', calculatedAge.toString(), { shouldValidate: true })
                        } else {
                          setValue('age', '', { shouldValidate: true })
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
                      value={field.value ?? ''} // Ensure controlled
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
                {genders && (
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
                        {genders?.map((gender: Tdropdown) => (
                          <MenuItem key={gender.id} value={gender.id}>
                            {gender.value}
                          </MenuItem>
                        ))}
                      </TextField>
                    )}
                  />
                )}
              </div>
              <Box sx={{ display: 'flex', justifyContent: { xs: 'stretch', sm: 'flex-end' }, mt: 3, pt: 2.5, borderTop: '1px solid rgba(0,0,0,0.06)' }}>
                <Button variant='contained' fullWidth onClick={handleNext} disableElevation sx={{ borderRadius: '12px', textTransform: 'none', fontWeight: 600, fontSize: '0.9375rem', backgroundColor: '#523F99', color: '#FFFFFF', height: { xs: 48, sm: 40 }, maxWidth: { sm: 'fit-content' }, px: 3.5, '&:hover': { backgroundColor: '#6B52C4' } }}>
                  Next
                </Button>
              </Box>
            </div>
          </div>
        )}

        {/* Step 2: Address */}
        {tabIndex === 1 && (
          <div className='rounded-none sm:rounded-2xl border-0 sm:border sm:border-[rgba(0,0,0,0.06)] bg-white'>
            <div className='px-3 sm:px-6 pt-4 sm:pt-5 pb-3 border-b border-[rgba(0,0,0,0.06)]' style={{ isolation: 'auto' }}>
              <CustomStepper currentStep={tabIndex} />
            </div>
            <div className='px-3 py-4 sm:p-6 md:p-8 relative z-20'>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-5'>
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
                      {countries?.map((country: Tdropdown) => (
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
                      error={!!errors.city}
                      helperText={errors.city?.message}
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
                      value={field.value ?? ''} // Ensure controlled
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
              <Box sx={{ display: 'flex', flexDirection: { xs: 'column-reverse', sm: 'row' }, justifyContent: { sm: 'flex-end' }, gap: 1.5, mt: 3, pt: 2.5, borderTop: '1px solid rgba(0,0,0,0.06)' }}>
                <Button variant='outlined' onClick={handlePrevi} sx={{ borderRadius: '12px', textTransform: 'none', fontWeight: 600, fontSize: '0.9375rem', height: { xs: 48, sm: 40 }, px: 3.5, borderColor: 'rgba(0,0,0,0.12)', color: '#475569', '&:hover': { borderColor: '#523F99', color: '#523F99' } }}>Back</Button>
                <Button variant='contained' onClick={handleNext} disableElevation sx={{ borderRadius: '12px', textTransform: 'none', fontWeight: 600, fontSize: '0.9375rem', backgroundColor: '#523F99', color: '#FFFFFF', height: { xs: 48, sm: 40 }, px: 3.5, '&:hover': { backgroundColor: '#6B52C4' } }}>Next</Button>
              </Box>
            </div>
          </div>
        )}

        {/* Step 3: Verification */}
        {tabIndex === 2 && (
          <div className='rounded-none sm:rounded-2xl border-0 sm:border sm:border-[rgba(0,0,0,0.06)] bg-white'>
            <div className='px-3 sm:px-6 pt-4 sm:pt-5 pb-3 border-b border-[rgba(0,0,0,0.06)]' style={{ isolation: 'auto' }}>
              <CustomStepper currentStep={tabIndex} />
            </div>
            <div className='px-3 py-4 sm:p-6 md:p-8 relative z-20'>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-5'>
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
                      {proofs?.map((proof: Tdropdown) => (
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
                      value={field.value ?? ''} // Ensure controlled
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
                      value={field.value ?? ''} // Ensure controlled
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
                      value={field.value ?? ''} // Ensure controlled
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
              <Box sx={{ display: 'flex', flexDirection: { xs: 'column-reverse', sm: 'row' }, justifyContent: { sm: 'flex-end' }, gap: 1.5, mt: 3, pt: 2.5, borderTop: '1px solid rgba(0,0,0,0.06)' }}>
                <Button variant='outlined' onClick={handlePrevi} sx={{ borderRadius: '12px', textTransform: 'none', fontWeight: 600, fontSize: '0.9375rem', height: { xs: 48, sm: 40 }, px: 3.5, borderColor: 'rgba(0,0,0,0.12)', color: '#475569', '&:hover': { borderColor: '#523F99', color: '#523F99' } }}>Back</Button>
                <Button variant='contained' type='submit' disabled={isSubmitting || isLoading} disableElevation sx={{ borderRadius: '12px', textTransform: 'none', fontWeight: 600, fontSize: '0.9375rem', backgroundColor: '#523F99', color: '#FFFFFF', height: { xs: 48, sm: 40 }, px: 3.5, '&:hover': { backgroundColor: '#6B52C4' } }}>Submit</Button>
              </Box>
            </div>
          </div>
        )}
      </form>
    </div>
  )
}

export default CustomerAdd
