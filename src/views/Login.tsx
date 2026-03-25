'use client'

// React Imports
import { useState, useEffect } from 'react'

// Next Imports
import { useRouter } from 'next/navigation'

// MUI Imports
import useMediaQuery from '@mui/material/useMediaQuery'
import { styled, useTheme } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import InputAdornment from '@mui/material/InputAdornment'
import Button from '@mui/material/Button'

// Third-party Imports
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Controller, useForm } from 'react-hook-form'
import toast from 'react-hot-toast'

import { authApi } from '@/api/auth-api'

// Type Imports
import type { SystemMode } from '@core/types'

// Component Imports
import Link from '@components/Link'
import Logo from '@components/layout/shared/Logo'
import CustomTextField from '@core/components/mui/TextField'

// Config Imports
import themeConfig from '@configs/themeConfig'

// Hook Imports
import { useImageVariant } from '@core/hooks/useImageVariant'
import { setToken, setUser } from '@/utils/authStorage'

// Styled Components
const LoginIllustration = styled('img')(({ theme }) => ({
  zIndex: 2,
  blockSize: 'auto',
  maxBlockSize: 680,
  maxInlineSize: '100%',
  margin: theme.spacing(12)
}))

const MaskImg = styled('img')({
  blockSize: 'auto',
  maxBlockSize: 355,
  inlineSize: '100%',
  position: 'absolute',
  insetBlockEnd: 0,
  zIndex: -1
})

// Validation
const loginSchema = z.object({
  email: z.string().min(1, 'Email is required'),
  password: z.string().min(1, 'Password is required')
})

type typeLoginSchema = z.infer<typeof loginSchema>

const LoginV2 = ({ mode }: { mode: SystemMode }) => {
  const [isPasswordShown, setIsPasswordShown] = useState(false)
  const [loading, setLoading] = useState(false)

  // 🔥 PWA INSTALL STATE
  const [installPrompt, setInstallPrompt] = useState<any>(null)

  // Hooks
  const router = useRouter()
  const theme = useTheme()
  const hidden = useMediaQuery(theme.breakpoints.down('md'))

  const darkImg = '/images/pages/auth-mask-dark.png'
  const lightImg = '/images/pages/auth-mask-light.png'
  const darkIllustration = '/images/illustrations/auth/v2-login-dark.png'
  const lightIllustration = '/images/illustrations/auth/v2-login-light.png'

  const authBackground = useImageVariant(mode, lightImg, darkImg)
  const characterIllustration = useImageVariant(mode, lightIllustration, darkIllustration)

  // 🔥 CAPTURE INSTALL EVENT
  useEffect(() => {
    window.addEventListener('beforeinstallprompt', (e: any) => {
      e.preventDefault()
      setInstallPrompt(e)
    })
  }, [])

  // 🔥 INSTALL FUNCTION
  const handleInstall = () => {
    if (installPrompt) {
      installPrompt.prompt()
    } else {
      alert('Install not available. Please use browser menu.')
    }
  }

  const handleClickShowPassword = () => setIsPasswordShown(show => !show)

  const {
    handleSubmit,
    control,
    formState: { isSubmitting }
  } = useForm<typeLoginSchema>({
    resolver: zodResolver(loginSchema)
  })

  const onSubmit = async (values: typeLoginSchema) => {
    try {
      setLoading(true)
      const response = await authApi.postAuth({ query: values })

      if (response.status === 200) {
        toast.success('Login Successful')

        const token = response.data.token
        const userData = response.data.data[0]

        setToken(token)
        setUser(userData)

        router.push('/')
      } else {
        toast.error(response.data.message || 'Login Failed')
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Login Failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='flex bs-full justify-center'>
      <div className='flex bs-full items-center justify-center flex-1 min-bs-[100dvh] relative p-6 max-md:hidden'>
        <LoginIllustration src={characterIllustration} alt='illustration' />
        {!hidden && <MaskImg alt='mask' src={authBackground} />}
      </div>

      <div className='flex justify-center items-center bs-full bg-backgroundPaper p-6 md:p-12 md:is-[480px]'>
        <Link className='absolute block-start-5 inline-start-6'>
          <Logo />
        </Link>

        <div className='flex flex-col gap-6 is-full mbs-11'>
          <div>
            <Typography variant='h4'>
              {`Welcome to ${themeConfig.templateName}!! 👋`}
            </Typography>
            <Typography>Please sign-in to your account</Typography>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-5'>

            {/* EMAIL */}
            <Controller
              name='email'
              defaultValue=''
              control={control}
              render={({ field, fieldState }) => (
                <CustomTextField
                  {...field}
                  fullWidth
                  label='Email or Username'
                  error={!!fieldState.error}
                  helperText={fieldState.error?.message}
                />
              )}
            />

            {/* PASSWORD */}
            <Controller
              name='password'
              defaultValue=''
              control={control}
              render={({ field, fieldState }) => (
                <CustomTextField
                  {...field}
                  type={isPasswordShown ? 'text' : 'password'}
                  fullWidth
                  label='Password'
                  error={!!fieldState.error}
                  helperText={fieldState.error?.message}
                  slotProps={{
                    input: {
                      endAdornment: (
                        <InputAdornment position='end'>
                          <IconButton onClick={handleClickShowPassword}>
                            👁
                          </IconButton>
                        </InputAdornment>
                      )
                    }
                  }}
                />
              )}
            />

            {/* LOGIN BUTTON */}
            <Button fullWidth variant='contained' type='submit' disabled={loading || isSubmitting}>
              {loading ? 'Logging in...' : 'Login'}
            </Button>

            {/* 🔥 INSTALL BUTTON */}
            {installPrompt && (
              <Button
                fullWidth
                variant='outlined'
                onClick={handleInstall}
              >
                Install App
              </Button>
            )}

          </form>
        </div>
      </div>
    </div>
  )
}

export default LoginV2
