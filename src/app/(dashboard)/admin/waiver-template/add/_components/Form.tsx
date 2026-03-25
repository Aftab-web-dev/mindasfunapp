'use client'
import React from 'react'

import dynamic from 'next/dynamic'

import { useRouter } from 'next/navigation'

import { zodResolver } from '@hookform/resolvers/zod'
import { Button, TextField, Typography, Tooltip, Box } from '@mui/material'
import { Controller, useForm } from 'react-hook-form'
import { z } from 'zod'
import draftToHtml from 'draftjs-to-html'
import { convertToRaw } from 'draft-js'
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
      // If no value is provided, it's valid (optional)
      if (val === undefined || val === null) {
        return true
      }

      // If it's a string (existing file path), it's valid
      if (typeof val === 'string') {
        return true
      }

      // If it's a File object, check its type
      if (val instanceof File) {
        if (!ACCEPTED_IMAGE_TYPES.includes(val.type)) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'Invalid image format. Only JPEG, JPG, PNG, or WEBP allowed.'
          })

          return false
        }

        return true
      }

      // If it's a FileList (from input), check the first file
      if (val instanceof FileList) {
        if (val.length === 0) return true // Empty FileList is treated as no file

        if (!ACCEPTED_IMAGE_TYPES.includes(val[0].type)) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'Invalid image format. Only JPEG, JPG, PNG, or WEBP allowed.'
          })

          return false
        }

        return true
      }

      // If none of the above, it's invalid
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Invalid file input'
      })

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

// Convert form → final backend structure
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

  // Include logo in payload (handles string path, File, FileList or array)
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
      const htmlDescription = values.description
        ? draftToHtml(convertToRaw(values.description.getCurrentContent()))
        : ''

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
    <form className='p-6 bg-[#ffffff] rounded-lg shadow-md' onSubmit={handleSubmit(onSubmit)}>
      <Typography variant='h5' align='left' gutterBottom className='font-bold text-[#4b41ba]'>
        Create Waiver Template
      </Typography>

      <div className='pb-4'>
        <Controller
          name='title'
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label='Waiver Form Title:'
              fullWidth
              style={{ marginTop: '20px' }}
              variant='standard'
              size='small'
              error={!!errors.title}
              helperText={errors.title?.message}
            />
          )}
        />
      </div>

      {/* Description (ReactDraftWysiwyg) */}
      <div className='py-4'>
        <Controller
          name='description'
          control={control}
          render={({ field }) => (
            <ReactDraftWysiwyg
              placeholder='Waiver Form Description'
              editorStyle={{
                border: '1px solid grey',
                borderRadius: '5px',
                padding: '15px'
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
      </div>

      <FileUpload
        label='Upload Waiver Form Logo'
        name='logo'
        register={register}
        watch={watch}
        setValue={setValue}
        fileType={ACCEPTED_IMAGE_TYPES.join(',')} // Pass as comma-separated string
        required={false}
      />

      {/* Fields Selection */}
      <div style={{ marginTop: '30px', fontSize: 13, color: '#555' }}>
        SELECT THE FIELDS TO INCLUDE IN THE WAIVER FORM:
      </div>
      <div style={{ marginBottom: 16 }}>
        {FIELD_OPTIONS.map((opt, index) => {
          const fieldValue = fields.find(f => f.id === opt.id)
          const isRequired = fieldValue?.required || false
          const isOptional = fieldValue?.optional || false

          return (
            <Box key={opt.id} display='flex' alignItems='center' marginBottom={2}>
              <Controller
                name={`fields.${index}.required`}
                control={control}
                render={({ field }) => (
                  <label style={{ display: 'flex', alignItems: 'center' }}>
                    <input
                      type='checkbox'
                      checked={field.value}
                      onChange={e => {
                        field.onChange(e.target.checked)
                        setValue(`fields.${index}.optional`, e.target.checked ? false : isOptional)
                      }}
                      style={{ accentColor: '#A354FF', marginRight: 8 }}
                      className='size-4'
                    />
                    <span className='mr-1 pt-[5px] ml-3'>
                      <i className={`size-5 ${opt.icon}`} />
                    </span>
                    {opt.label}
                  </label>
                )}
              />

              {isRequired && (
                <Box ml={2} display='flex' alignItems='center'>
                  <Controller
                    name={`fields.${index}.optional`}
                    control={control}
                    render={({ field }) => (
                      <Tooltip
                        title='Marking as optional means this field will not be mandatory for participants to fill out'
                        arrow
                        placement='top'
                      >
                        <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                          <input
                            type='checkbox'
                            checked={field.value}
                            onChange={e => field.onChange(e.target.checked)}
                            style={{ accentColor: '#A354FF', marginRight: 8 }}
                            className='size-4'
                          />
                          <span style={{ color: '#666' }}>(optional)</span>
                        </label>
                      </Tooltip>
                    )}
                  />
                </Box>
              )}
            </Box>
          )
        })}
      </div>

      <Button disabled={isSubmitting || isLoading} variant='contained' color='primary' type='submit' className='mt-2'>
        Save Waiver Template
      </Button>
    </form>
  )
}
