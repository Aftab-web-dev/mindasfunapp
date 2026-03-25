'use client'

import React, { useState } from 'react'

import { useRouter } from 'next/navigation'

import { Box, Button, CircularProgress, InputAdornment, IconButton, Typography, TextField } from '@mui/material'
import { z } from 'zod'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import toast from 'react-hot-toast'

import { getUser } from '@/utils/authStorage'
import { authApi } from '@/api/auth-api'

const updateProfileSchema = z.object({
  username: z.string().min(1, 'Username is required').min(3, 'Username must be at least 3 characters'),
  password: z.string().min(1, 'Password is required').min(6, 'Password must be at least 6 characters')
})

type UpdateProfileFormValues = z.infer<typeof updateProfileSchema>

const UpdateProfile = () => {
  const user = getUser()
  const router = useRouter()
  const [isPasswordShown, setIsPasswordShown] = useState(false)
  const [loading, setLoading] = useState(false)

  const {
    control,
    handleSubmit,
    formState: { isSubmitting }
  } = useForm<UpdateProfileFormValues>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: {
      username: user?.userName
    }
  })

  const handleClickShowPassword = () => setIsPasswordShown(show => !show)

  const onSubmit = async (data: UpdateProfileFormValues) => {
    try {
      setLoading(true)
      
      const response = await authApi.updateProfile({ query: { ...data, empId: user?.employeeId } })

      if (response.data.status === 'success') {
        toast.success('Profile updated successfully!')
        router.push('/admin/home/management')
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to update profile')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <div className='p-6'>
        <form noValidate autoComplete='off' onSubmit={handleSubmit(onSubmit)}>
          <div className='flex justify-between items-center mb-6'>
            <Typography
              variant='h5'
              align='left'
              className='font-bold text-[#4b41ba] leading-[0%] text-base sm:text-lg md:text-xl lg:text-2xl'
            >
              UPDATE PROFILE
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
              <Button
                variant='contained'
                color='secondary'
                onClick={() => router.back()}
                disabled={loading || isSubmitting}
              >
                Cancel
              </Button>
              <Button variant='contained' color='primary' type='submit' disabled={loading || isSubmitting}>
                {loading || isSubmitting ? <CircularProgress size={24} /> : 'Update Profile'}
              </Button>
            </Box>
          </div>

          <div className='p-6 bg-[#ffffff] rounded-lg shadow-md mt-2'>
            <div className='grid grid-cols-1 gap-6 mb-6 mt-10'>
              <Controller
                name='username'
                defaultValue=''
                control={control}
                rules={{ required: 'Username is required' }}
                render={({ field, fieldState }) => (
                  <TextField
                    {...field}
                    autoFocus
                    fullWidth
                    label='Username'
                    placeholder='Enter your username'
                    variant='standard'
                    size='small'
                    error={!!fieldState.error}
                    helperText={fieldState.error?.message}
                  />
                )}
              />

              <Controller
                name='password'
                defaultValue=''
                control={control}
                rules={{ required: 'Password is required' }}
                render={({ field, fieldState }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label='Password'
                    placeholder='············'
                    variant='standard'
                    size='small'
                    type={isPasswordShown ? 'text' : 'password'}
                    error={!!fieldState.error}
                    helperText={fieldState.error?.message}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position='end'>
                          <IconButton
                            edge='end'
                            onClick={handleClickShowPassword}
                            onMouseDown={e => e.preventDefault()}
                            aria-label='toggle password visibility'
                          >
                            {isPasswordShown ? <i className='ri-eye-off-line' /> : <i className='ri-eye-line' />}
                          </IconButton>
                        </InputAdornment>
                      )
                    }}
                  />
                )}
              />
            </div>
          </div>
        </form>
      </div>
    </>
  )
}

export default UpdateProfile
