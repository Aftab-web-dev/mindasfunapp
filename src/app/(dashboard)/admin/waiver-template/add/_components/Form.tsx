'use client'
import React from 'react'

import dynamic from 'next/dynamic'

import { useRouter } from 'next/navigation'

import { zodResolver } from '@hookform/resolvers/zod'
import { Button, TextField, Typography, Tooltip, Box, Checkbox } from '@mui/material'
import { Controller, useForm } from 'react-hook-form'
import { z } from 'zod'
import toast from 'react-hot-toast'

import FileUpload from '@/components/custom-fields/CustomizedSingleFileUploader'
import { waiverApi } from '@/api/waiver-api'
import { fileToBase64 } from '@/utils/fileToBase64'

const ReactDraftWysiwyg = dynamic(() => import('@/components/react-draft-wysiwyg'), {
  ssr: false
})

const FIELD_OPTIONS = [
  { label: 'Name', icon: 'tabler-label', id: 'name', info: 'Collect participant full name' },
  { label: 'Phone Number', icon: 'tabler-phone', id: 'number', info: 'Collect participant phone number' },
  { label: 'Email ID', icon: 'tabler-mail', id: 'email', info: 'Collect participant email address' },
  { label: 'Address', icon: 'tabler-map-pin', id: 'address', info: 'Collect participant address' },
  { label: 'Birth Date', icon: 'tabler-cake', id: 'dob', info: 'Collect participant Birth Date' },
  { label: 'File', icon: 'tabler-photo-video', id: 'file', info: 'Collect participant File Or Photo' },
  { label: 'Signature', icon: 'tabler-signature', id: 'sign', info: 'Collect participant digital signature' }
] as const

const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']

const eventFormSchema = z.object({
  title: z.string().min(1, 'Name is required'),
  description: z.any(),
  logo: z
    .any()
    .optional()
    .superRefine((val, ctx) => {
      if (val === undefined || val === null) return true
      if (typeof val === 'string') return true

      if (val instanceof File) {
        if (!ACCEPTED_IMAGE_TYPES.includes(val.type)) {
          ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Invalid image format. Only JPEG, JPG, PNG, or WEBP allowed.' })
          return false
        }
        return true
      }

      if (val instanceof FileList) {
        if (val.length === 0) return true
        if (!ACCEPTED_IMAGE_TYPES.includes(val[0].type)) {
          ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Invalid image format. Only JPEG, JPG, PNG, or WEBP allowed.' })
          return false
        }
        return true
      }

      ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Invalid file input' })
      return false
    }),
  fields: z.array(
    z.object({
      id: z.string(),
      required: z.boolean(),
      optional: z.boolean()
    })
  )
})

type EventFormValues = z.infer<typeof eventFormSchema>

export function convertToWaiverPayload(values: any) {
  const fieldMap: Record<string, string> = {
    name: 'name',
    number: 'phone',
    email: 'emailId',
    address: 'address',
    dob: 'dob',
    file: 'file',
    sign: 'signature'
  }

  const payload: any = {
    waverId: 0,
    Titile: values.title || '',
    description: values.description || '',
    status: 1
  }

  values.fields.forEach((f: any) => {
    const mappedKey = fieldMap[f.id]
    if (!mappedKey) return
    payload[mappedKey] = f.required ? 1 : 0
    payload[mappedKey + 'Opt'] = f.optional ? 1 : 0
  })

  if (values.logo !== undefined && values.logo !== null) {
    const logoVal = values.logo
    if (typeof logoVal === 'string') {
      payload.logo = logoVal
    } else if (typeof File !== 'undefined' && logoVal instanceof File) {
      payload.logo = logoVal
    } else if (typeof FileList !== 'undefined' && logoVal instanceof FileList) {
      if (logoVal.length > 0) payload.logo = logoVal[0]
    } else if (Array.isArray(logoVal) && logoVal.length > 0) {
      payload.logo = logoVal[0]
    }
  }

  return payload
}

export default function WaiverForm() {
  const router = useRouter()

  const {
    control,
    handleSubmit,
    setValue,
    register,
    watch,
    formState: { errors, isSubmitting, isLoading }
  } = useForm<EventFormValues>({
    resolver: zodResolver(eventFormSchema),
    defaultValues: {
      title: '',
      description: undefined,
      logo: undefined,
      fields: FIELD_OPTIONS.map(opt => ({
        id: opt.id,
        required: false,
        optional: false
      }))
    }
  })

  const onSubmit = async (values: EventFormValues) => {
    try {
      let htmlDescription = ''

      if (values.description) {
        const [{ convertToRaw }, { default: draftToHtml }] = await Promise.all([
          import('draft-js'),
          import('draftjs-to-html'),
        ])

        htmlDescription = draftToHtml(convertToRaw(values.description.getCurrentContent()))
      }

      const formatted = convertToWaiverPayload({
        ...values,
        description: htmlDescription
      })

      try {
        let logoFile: File | null = null
        const logoVal = values.logo

        if (logoVal) {
          if (typeof File !== 'undefined' && logoVal instanceof File) {
            logoFile = logoVal
          } else if (typeof FileList !== 'undefined' && logoVal instanceof FileList) {
            if (logoVal.length > 0) logoFile = logoVal[0]
          } else if (Array.isArray(logoVal) && logoVal.length > 0) {
            logoFile = logoVal[0]
          }
        }

        if (logoFile) {
          const dataUrl = await fileToBase64(logoFile)
          const base64Data = dataUrl.includes(',') ? dataUrl.split(',')[1] : dataUrl
          formatted.LogoContentType = logoFile.type || ''
          formatted.LogoFileName = logoFile.name || ''
          formatted.LogoData = base64Data || ''
        }
      } catch (e) {
        console.warn('Failed to convert logo to base64', e)
      }

      const addWaiver = await waiverApi.register({ body: formatted })

      if (addWaiver.status === 200) {
        toast.success('Successfully Registered...')
        router.push('/admin/waiver-template')
      } else {
        toast.error('Error creating Waiver')
      }
    } catch (error) {
      toast.error('Please Fill all the required fields')
    }
  }

  const fields = watch('fields')

  return (
    <div className='max-w-6xl mx-auto px-2 sm:px-4 py-3 sm:py-6'>
      {/* Page Header */}
      <div className='mb-4 sm:mb-8 px-1'>
        <h1 className='text-xl sm:text-2xl font-bold text-[#1E293B]'>Create Waiver</h1>
        <p className='text-xs sm:text-sm text-[#94A3B8] font-medium mt-0.5'>Design a waiver form for your customers</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className='rounded-none sm:rounded-2xl border-0 sm:border sm:border-[rgba(0,0,0,0.06)] bg-white'>
          {/* Section 1: Basic Info */}
          <Box sx={{ px: { xs: 2, sm: 3, md: 5 }, pt: { xs: 2.5, sm: 3, md: 4 }, pb: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
              <Box sx={{ width: 36, height: 36, borderRadius: '10px', backgroundColor: '#F0ECFA', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <i className='tabler-file-text' style={{ fontSize: '1.125rem', color: '#523F99' }} />
              </Box>
              <Box>
                <Typography sx={{ fontSize: '0.9375rem', fontWeight: 700, color: '#1E293B' }}>Template Details</Typography>
                <Typography sx={{ fontSize: '0.75rem', color: '#94A3B8', fontWeight: 500 }}>Title, description and branding</Typography>
              </Box>
            </Box>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              <Controller
                name='title'
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label='Waiver Form Title'
                    fullWidth
                    variant='outlined'
                    size='small'
                    error={!!errors.title}
                    helperText={errors.title?.message}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '10px',
                        backgroundColor: '#F8FAFC',
                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#523F99' }
                      }
                    }}
                  />
                )}
              />

              <Box>
                <Typography sx={{ fontSize: '0.8125rem', fontWeight: 600, color: '#475569', mb: 1 }}>Description</Typography>
                <Controller
                  name='description'
                  control={control}
                  render={({ field }) => (
                    <ReactDraftWysiwyg
                      placeholder='Write your waiver form description...'
                      editorStyle={{
                        border: '1px solid rgba(0,0,0,0.12)',
                        borderRadius: '10px',
                        padding: '12px 16px',
                        minHeight: '140px',
                        backgroundColor: '#F8FAFC',
                        fontSize: '0.875rem'
                      }}
                      editorState={field.value}
                      onEditorStateChange={(data: any) => field.onChange(data)}
                      toolbar={{
                        options: ['inline', 'link'],
                        inline: {
                          options: ['bold', 'italic'],
                          bold: { className: 'toolbar-button' },
                          italic: { className: 'toolbar-button' }
                        }
                      }}
                    />
                  )}
                />
              </Box>

              <FileUpload
                label='Upload Waiver Form Logo'
                name='logo'
                register={register}
                watch={watch}
                setValue={setValue}
                fileType={ACCEPTED_IMAGE_TYPES.join(',')}
                required={false}
              />
            </Box>
          </Box>

          {/* Divider */}
          <Box sx={{ borderTop: '1px solid rgba(0,0,0,0.06)' }} />

          {/* Section 2: Field Selection */}
          <Box sx={{ px: { xs: 2, sm: 3, md: 5 }, pt: { xs: 2.5, sm: 3, md: 4 }, pb: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
              <Box sx={{ width: 36, height: 36, borderRadius: '10px', backgroundColor: '#EEF2FF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <i className='tabler-list-check' style={{ fontSize: '1.125rem', color: '#4F46E5' }} />
              </Box>
              <Box>
                <Typography sx={{ fontSize: '0.9375rem', fontWeight: 700, color: '#1E293B' }}>Form Fields</Typography>
                <Typography sx={{ fontSize: '0.75rem', color: '#94A3B8', fontWeight: 500 }}>Select which fields to include in the waiver</Typography>
              </Box>
            </Box>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              {FIELD_OPTIONS.map((opt, index) => {
                const fieldValue = fields.find(f => f.id === opt.id)
                const isRequired = fieldValue?.required || false

                return (
                  <Box
                    key={opt.id}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      px: { xs: 1.5, sm: 2 },
                      py: 1.25,
                      borderRadius: '10px',
                      border: '1px solid',
                      borderColor: isRequired ? 'rgba(82,63,153,0.2)' : 'rgba(0,0,0,0.06)',
                      backgroundColor: isRequired ? 'rgba(82,63,153,0.02)' : 'transparent',
                      transition: 'all 0.15s ease',
                      '&:hover': { borderColor: 'rgba(82,63,153,0.15)', backgroundColor: 'rgba(82,63,153,0.01)' }
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1, sm: 1.5 }, minWidth: 0 }}>
                      <Controller
                        name={`fields.${index}.required`}
                        control={control}
                        render={({ field }) => (
                          <Checkbox
                            checked={field.value}
                            onChange={e => {
                              field.onChange(e.target.checked)
                              if (!e.target.checked) setValue(`fields.${index}.optional`, false)
                            }}
                            size='small'
                            sx={{ p: 0.5, '&.Mui-checked': { color: '#523F99' }, flexShrink: 0 }}
                          />
                        )}
                      />
                      <Box sx={{ width: { xs: 28, sm: 32 }, height: { xs: 28, sm: 32 }, borderRadius: '8px', backgroundColor: isRequired ? '#F0ECFA' : '#F1F5F9', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <i className={opt.icon} style={{ fontSize: '0.875rem', color: isRequired ? '#523F99' : '#94A3B8' }} />
                      </Box>
                      <Box sx={{ minWidth: 0 }}>
                        <Typography noWrap sx={{ fontSize: { xs: '0.75rem', sm: '0.8125rem' }, fontWeight: 600, color: '#1E293B' }}>{opt.label}</Typography>
                        <Typography noWrap sx={{ fontSize: { xs: '0.625rem', sm: '0.6875rem' }, color: '#94A3B8', display: { xs: 'none', sm: 'block' } }}>{opt.info}</Typography>
                      </Box>
                    </Box>

                    {isRequired && (
                      <Tooltip title='Mark as optional' arrow placement='top'>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, flexShrink: 0, ml: 0.5 }}>
                          <Controller
                            name={`fields.${index}.optional`}
                            control={control}
                            render={({ field }) => (
                              <Checkbox
                                checked={field.value}
                                onChange={e => field.onChange(e.target.checked)}
                                size='small'
                                sx={{ p: 0.5, '&.Mui-checked': { color: '#F59E0B' } }}
                              />
                            )}
                          />
                          <Typography sx={{ fontSize: '0.6875rem', color: '#94A3B8', fontWeight: 500, display: { xs: 'none', sm: 'block' } }}>Optional</Typography>
                        </Box>
                      </Tooltip>
                    )}
                  </Box>
                )
              })}
            </Box>
          </Box>

          {/* Divider + Submit */}
          <Box sx={{ px: { xs: 2, sm: 3, md: 5 }, py: 2.5, borderTop: '1px solid rgba(0,0,0,0.06)', display: 'flex', justifyContent: { xs: 'stretch', sm: 'flex-end' } }}>
            <Button
              disabled={isSubmitting || isLoading}
              variant='contained'
              type='submit'
              fullWidth
              disableElevation
              sx={{
                borderRadius: '12px',
                textTransform: 'none',
                fontWeight: 600,
                fontSize: '0.9375rem',
                backgroundColor: '#523F99',
                color: '#FFFFFF',
                height: { xs: 48, sm: 40 },
                maxWidth: { sm: 'fit-content' },
                px: 3.5,
                '&:hover': { backgroundColor: '#6B52C4' },
                '&.Mui-disabled': { backgroundColor: 'rgba(82,63,153,0.35)', color: 'rgba(255,255,255,0.7)' }
              }}
            >
              Save Template
            </Button>
          </Box>
        </div>
      </form>
    </div>
  )
}
