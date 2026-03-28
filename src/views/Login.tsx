'use client'

// React Imports
import { useState, useEffect } from 'react'

// Next Imports
import { useRouter } from 'next/navigation'
import Image from 'next/image'

// MUI Imports
import useMediaQuery from '@mui/material/useMediaQuery'
import { useTheme } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import InputAdornment from '@mui/material/InputAdornment'
import Button from '@mui/material/Button'
import Box from '@mui/material/Box'
import CircularProgress from '@mui/material/CircularProgress'

// Third-party Imports
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Controller, useForm } from 'react-hook-form'
import toast from 'react-hot-toast'

import { authApi } from '@/api/auth-api'

// Type Imports
import type { SystemMode } from '@core/types'

// Component Imports
import MidasLogo from '../../public/svgs/MidasLogo'
import MidasLogoText from '../../public/svgs/MidasLogoText'
import CustomTextField from '@core/components/mui/TextField'

// Config Imports
import themeConfig from '@configs/themeConfig'

// Hook Imports
import { useImageVariant } from '@core/hooks/useImageVariant'
import { setToken, setUser } from '@/utils/authStorage'

// Validation
const loginSchema = z.object({
  email: z.string().min(1, 'Email is required'),
  password: z.string().min(1, 'Password is required')
})

type typeLoginSchema = z.infer<typeof loginSchema>

const LoginV2 = ({ mode }: { mode: SystemMode }) => {
  const [isPasswordShown, setIsPasswordShown] = useState(false)
  const [loading, setLoading] = useState(false)

  // PWA INSTALL STATE
  const [installPrompt, setInstallPrompt] = useState<any>(null)

  // Hooks
  const router = useRouter()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))

  const darkIllustration = '/images/illustrations/auth/v2-login-dark.png'
  const lightIllustration = '/images/illustrations/auth/v2-login-light.png'

  const characterIllustration = useImageVariant(mode, lightIllustration, darkIllustration)

  // CAPTURE INSTALL EVENT
  useEffect(() => {
    window.addEventListener('beforeinstallprompt', (e: any) => {
      e.preventDefault()
      setInstallPrompt(e)
    })
  }, [])

  // INSTALL FUNCTION
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

        // Keep loading true — don't reset, let the redirect happen
        return
      } else {
        toast.error(response.data.message || 'Login Failed')
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Login Failed')
    }

    setLoading(false)
  }

  // ─── Mobile Layout ───
  if (isMobile) {
    return (
      <Box
        sx={{
          minHeight: '100dvh',
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: '#f5f3fa',
          position: 'relative'
        }}
      >
        {/* Top: Illustration area */}
        <Box
          sx={{
            flex: '0 0 auto',
            height: '52vh',
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
            background: 'linear-gradient(160deg, #2D1B69 0%, #523F99 50%, #7C6BC4 100%)'
          }}
        >
          {/* Decorative circles */}
          <Box sx={{ position: 'absolute', top: -40, right: -40, width: 160, height: 160, borderRadius: '50%', background: 'rgba(255,255,255,0.07)' }} />
          <Box sx={{ position: 'absolute', bottom: -30, left: -30, width: 120, height: 120, borderRadius: '50%', background: 'rgba(255,255,255,0.05)' }} />
          {/* Character illustration with gentle float animation */}
          <Image
            src={characterIllustration}
            alt='Login illustration'
            width={500}
            height={700}
            priority
            style={{
              height: '100%',
              maxHeight: 700,
              width: 'auto',
              objectFit: 'contain',
              position: 'relative',
              zIndex: 1,
              filter: 'drop-shadow(0 8px 24px rgba(0,0,0,0.2))',
              animation: 'gentleFloat 4s ease-in-out infinite'
            }}
          />
          <style>{`
            @keyframes gentleFloat {
              0%, 100% { transform: translateY(0px); }
              50% { transform: translateY(-8px); }
            }
          `}</style>
        </Box>

        {/* Bottom: Form sheet overlapping the image */}
        <Box
          sx={{
            flex: 1,
            backgroundColor: '#E8E4F0',
            borderTopLeftRadius: '28px',
            borderTopRightRadius: '28px',
            mt: -30,
            position: 'relative',
            zIndex: 2,
            px: 5,
            pt: 7,
            pb: 5,
            display: 'flex',
            flexDirection: 'column'
          }}
        >
          {/* Header */}
          <Typography
            sx={{
              fontSize: '1.375rem',
              fontWeight: 700,
              color: '#1A1033',
              mb: 0.5
            }}
          >
            Welcome to {themeConfig.templateName}!!
          </Typography>
          <Typography
            sx={{
              fontSize: '0.875rem',
              color: '#8B8D97',
              mb: 4
            }}
          >
            Please sign-in to your account
          </Typography>

          {/* Form */}
          <form
            onSubmit={handleSubmit(onSubmit)}
            style={{ display: 'flex', flexDirection: 'column', flex: 1 }}
          >
            {/* Email */}
            <Controller
              name='email'
              defaultValue=''
              control={control}
              render={({ field, fieldState }) => (
                <CustomTextField
                  {...field}
                  fullWidth
                  label='Email or Username'
                  variant='standard'
                  error={!!fieldState.error}
                  helperText={fieldState.error?.message}
                  sx={{
                    mb: 3.5,
                    '& .MuiInput-underline:before': {
                      borderBottomColor: 'rgba(0,0,0,0.2)'
                    },
                    '& .MuiInput-underline:hover:before': {
                      borderBottomColor: '#523F99 !important'
                    },
                    '& .MuiInput-underline:after': {
                      borderBottomColor: '#523F99'
                    },
                    '& .MuiInputLabel-root': {
                      fontSize: '0.9375rem',
                      color: '#6B7280',
                      '&.Mui-focused': { color: '#523F99' }
                    },
                    '& .MuiInput-input': {
                      fontSize: '1.0625rem',
                      py: 2.5
                    }
                  }}
                />
              )}
            />

            {/* Password */}
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
                  variant='standard'
                  error={!!fieldState.error}
                  helperText={fieldState.error?.message}
                  sx={{
                    mb: 4.5,
                    '& .MuiInput-underline:before': {
                      borderBottomColor: 'rgba(0,0,0,0.2)'
                    },
                    '& .MuiInput-underline:hover:before': {
                      borderBottomColor: '#523F99 !important'
                    },
                    '& .MuiInput-underline:after': {
                      borderBottomColor: '#523F99'
                    },
                    '& .MuiInputLabel-root': {
                      fontSize: '0.9375rem',
                      color: '#6B7280',
                      '&.Mui-focused': { color: '#523F99' }
                    },
                    '& .MuiInput-input': {
                      fontSize: '1.0625rem',
                      py: 2.5
                    }
                  }}
                  slotProps={{
                    input: {
                      endAdornment: (
                        <InputAdornment position='end'>
                          <IconButton onClick={handleClickShowPassword} edge='end' sx={{ mb: 0.5 }}>
                            <i
                              className={isPasswordShown ? 'tabler-eye' : 'tabler-eye-off'}
                              style={{ fontSize: '1.2rem', color: '#9CA3AF' }}
                            />
                          </IconButton>
                        </InputAdornment>
                      )
                    }
                  }}
                />
              )}
            />

            {/* Sign in button */}
            <Button
              fullWidth
              variant='contained'
              type='submit'
              disabled={loading || isSubmitting}
              disableElevation
              sx={{
                height: 52,
                borderRadius: '14px',
                textTransform: 'none',
                fontWeight: 600,
                fontSize: '0.9375rem',
                backgroundColor: '#523F99',
                mb: 1.5,
                '&:hover': { backgroundColor: '#6B52C4' },
                '&.Mui-disabled': {
                  backgroundColor: 'rgba(82,63,153,0.5)',
                  color: '#fff'
                }
              }}
            >
              {loading ? (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <CircularProgress size={18} sx={{ color: '#fff' }} />
                  Signing in...
                </Box>
              ) : (
                'Log In'
              )}
            </Button>

            {/* Install button */}
            {installPrompt && (
              <Button
                fullWidth
                variant='outlined'
                onClick={handleInstall}
                sx={{
                  height: 52,
                  borderRadius: '14px',
                  textTransform: 'none',
                  fontWeight: 600,
                  fontSize: '0.875rem',
                  borderColor: '#523F99',
                  borderWidth: '1.5px',
                  color: '#523F99',
                  '&:hover': {
                    borderColor: '#6B52C4',
                    backgroundColor: 'rgba(82,63,153,0.04)',
                    borderWidth: '1.5px'
                  }
                }}
              >
                Install App
              </Button>
            )}
          </form>
        </Box>
      </Box>
    )
  }

  // ─── Desktop Layout ───
  return (
    <div className='flex bs-full justify-center'>
      {/* Left: Illustration with purple gradient */}
      <Box
        sx={{
          flex: 1,
          minHeight: '100dvh',
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
          background: 'linear-gradient(160deg, #2D1B69 0%, #523F99 50%, #7C6BC4 100%)'
        }}
      >
        {/* Decorative circles */}
        <Box sx={{ position: 'absolute', top: -80, right: -80, width: 300, height: 300, borderRadius: '50%', background: 'rgba(255,255,255,0.06)', pointerEvents: 'none' }} />
        <Box sx={{ position: 'absolute', bottom: -60, left: -60, width: 200, height: 200, borderRadius: '50%', background: 'rgba(255,255,255,0.04)', pointerEvents: 'none' }} />
        <Box sx={{ position: 'absolute', width: 340, height: 340, borderRadius: '50%', border: '2px solid rgba(255,255,255,0.08)', pointerEvents: 'none' }} />

        <Image
          src={characterIllustration}
          alt='Login illustration'
          width={600}
          height={600}
          priority
          style={{
            maxHeight: 600,
            maxWidth: '90%',
            width: 'auto',
            height: 'auto',
            objectFit: 'contain',
            position: 'relative',
            zIndex: 1,
            filter: 'drop-shadow(0 12px 32px rgba(0,0,0,0.25))',
            animation: 'gentleFloat 4s ease-in-out infinite'
          }}
        />
      </Box>

      {/* Right: Form panel */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          width: 500,
          minHeight: '100dvh',
          backgroundColor: '#E8E4F0',
          px: 7,
          py: 6,
          position: 'relative'
        }}
      >
        {/* Logo */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 5 }}>
          <MidasLogo className='text-2xl text-primary' />
          <MidasLogoText width={140} height={20} />
        </Box>

        {/* Header */}
        <Typography
          sx={{
            fontSize: '1.75rem',
            fontWeight: 700,
            color: '#1A1033',
            mb: 0.5
          }}
        >
          Welcome to {themeConfig.templateName}!!
        </Typography>
        <Typography
          sx={{
            fontSize: '0.9375rem',
            color: '#8B8D97',
            mb: 5
          }}
        >
          Please sign-in to your account
        </Typography>

        {/* Form */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          style={{ display: 'flex', flexDirection: 'column' }}
        >
          <Controller
            name='email'
            defaultValue=''
            control={control}
            render={({ field, fieldState }) => (
              <CustomTextField
                {...field}
                fullWidth
                label='Email or Username'
                variant='standard'
                error={!!fieldState.error}
                helperText={fieldState.error?.message}
                sx={{
                  mb: 4,
                  '& .MuiInput-underline:before': {
                    borderBottomColor: 'rgba(0,0,0,0.2)'
                  },
                  '& .MuiInput-underline:hover:before': {
                    borderBottomColor: '#523F99 !important'
                  },
                  '& .MuiInput-underline:after': {
                    borderBottomColor: '#523F99'
                  },
                  '& .MuiInputLabel-root': {
                    fontSize: '0.9375rem',
                    color: '#6B7280',
                    '&.Mui-focused': { color: '#523F99' }
                  },
                  '& .MuiInput-input': {
                    fontSize: '1rem',
                    py: 1.5,
                    '&:-webkit-autofill, &:-webkit-autofill:hover, &:-webkit-autofill:focus': {
                      WebkitBoxShadow: '0 0 0 100px #E8E4F0 inset',
                      WebkitTextFillColor: '#1A1033',
                      caretColor: '#1A1033',
                      borderRadius: 0,
                    },
                  }
                }}
              />
            )}
          />

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
                variant='standard'
                error={!!fieldState.error}
                helperText={fieldState.error?.message}
                sx={{
                  mb: 5,
                  '& .MuiInput-underline:before': {
                    borderBottomColor: 'rgba(0,0,0,0.2)'
                  },
                  '& .MuiInput-underline:hover:before': {
                    borderBottomColor: '#523F99 !important'
                  },
                  '& .MuiInput-underline:after': {
                    borderBottomColor: '#523F99'
                  },
                  '& .MuiInputLabel-root': {
                    fontSize: '0.9375rem',
                    color: '#6B7280',
                    '&.Mui-focused': { color: '#523F99' }
                  },
                  '& .MuiInput-input': {
                    fontSize: '1rem',
                    py: 1.5,
                    '&:-webkit-autofill, &:-webkit-autofill:hover, &:-webkit-autofill:focus': {
                      WebkitBoxShadow: '0 0 0 100px #E8E4F0 inset',
                      WebkitTextFillColor: '#1A1033',
                      caretColor: '#1A1033',
                      borderRadius: 0,
                    },
                  }
                }}
                slotProps={{
                  input: {
                    endAdornment: (
                      <InputAdornment position='end'>
                        <IconButton onClick={handleClickShowPassword} edge='end' sx={{ mb: 0.5 }}>
                          <i
                            className={isPasswordShown ? 'tabler-eye' : 'tabler-eye-off'}
                            style={{ fontSize: '1.25rem', color: '#9CA3AF' }}
                          />
                        </IconButton>
                      </InputAdornment>
                    )
                  }
                }}
              />
            )}
          />

          <Button
            fullWidth
            variant='contained'
            type='submit'
            disabled={loading || isSubmitting}
            disableElevation
            sx={{
              height: 52,
              borderRadius: '14px',
              textTransform: 'none',
              fontWeight: 600,
              fontSize: '0.9375rem',
              backgroundColor: '#523F99',
              mb: 1.5,
              transition: 'all 0.2s ease',
              '&:hover': {
                backgroundColor: '#6B52C4',
                transform: 'translateY(-1px)',
                boxShadow: '0 4px 16px rgba(82,63,153,0.35)'
              },
              '&.Mui-disabled': {
                backgroundColor: 'rgba(82,63,153,0.5)',
                color: '#fff'
              }
            }}
          >
            {loading ? (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <CircularProgress size={18} sx={{ color: '#fff' }} />
                Signing in...
              </Box>
            ) : (
              'Log In'
            )}
          </Button>

          {installPrompt && (
            <Button
              fullWidth
              variant='outlined'
              onClick={handleInstall}
              sx={{
                height: 52,
                borderRadius: '14px',
                textTransform: 'none',
                fontWeight: 600,
                fontSize: '0.875rem',
                borderColor: '#523F99',
                borderWidth: '1.5px',
                color: '#523F99',
                transition: 'all 0.2s ease',
                '&:hover': {
                  borderColor: '#6B52C4',
                  backgroundColor: 'rgba(82,63,153,0.06)',
                  borderWidth: '1.5px',
                  transform: 'translateY(-1px)'
                }
              }}
            >
              Install App
            </Button>
          )}
        </form>
      </Box>
    </div>
  )
}

export default LoginV2
