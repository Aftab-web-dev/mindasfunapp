'use client'

import React, { useEffect, useState } from 'react'

import dynamic from 'next/dynamic'

import { zodResolver } from '@hookform/resolvers/zod'
import { Box, Button, Skeleton, TextField, Tooltip, Typography } from '@mui/material'
import { Controller, useForm } from 'react-hook-form'
import { z } from 'zod'
import { convertFromHTML, convertToRaw, EditorState, ContentState } from 'draft-js'
import toast from 'react-hot-toast'

import FileUpload from '@/components/custom-fields/CustomizedSingleFileUploader'

// Import Editor styles
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'
import { waiverApi } from '@/api/waiver-api'

// Dynamically import ReactDraftWysiwyg with SSR disabled
const ReactDraftWysiwyg = dynamic(() => import('react-draft-wysiwyg').then(mod => mod.Editor), { ssr: false })

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
  file: z
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

type EditData = {
  titile: string
  description: string | undefined
}

export default function WaiverFormEdit({ data, id }: { data: any; id: string }) {
  const [editorState, setEditorState] = useState(() => EditorState.createEmpty())
  const [mounted, setMounted] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)

  const [editData, setEditData] = useState<EditData>({
    titile: '',
    description: undefined
  })

  const {
    control,
    handleSubmit,
    setValue,
    reset,
    register,
    watch,
    formState: { errors, isLoading, isSubmitting }
  } = useForm<EventFormValues>({
    resolver: zodResolver(eventFormSchema),
    defaultValues: {
      title: '',
      description: undefined,
      file: null,
      fields: []
    }
  })

  const api = async () => {
    try {
      setLoading(true)

      const response = await waiverApi.getOneWaiver({ waiverId: id })

      if (response.data.status === 'success') {
        setEditData(response.data.data[0])
      }
    } catch {
      toast.error('Error Fetching Edit Data')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    api()
  }, [])

  useEffect(() => {
    if (!editData) return

    // Description → EditorState
    let editor = EditorState.createEmpty()

    if (editData.description) {
      const blocks = convertFromHTML(editData.description)

      const content = ContentState.createFromBlockArray(blocks.contentBlocks, blocks.entityMap)

      editor = EditorState.createWithContent(content)
    }

    setEditorState(editor)

    reset({
      title: editData.titile,
      description: editor

      // file: editData.file || null,
      // fields:
      //   editData.fields?.map((f: any) => ({
      //     id: f.id,
      //     required: f.required,
      //     optional: f.optional
      //   })) || []
    })

    setMounted(true)
  }, [editData, reset])

  useEffect(() => {
    if (data?.description) {
      const blocksFromHTML = convertFromHTML(data.description)

      const contentState = ContentState.createFromBlockArray(blocksFromHTML.contentBlocks, blocksFromHTML.entityMap)

      const editor = EditorState.createWithContent(contentState)

      setEditorState(editor)
      setValue('description', editor) // Sync with RHF
    }

    setMounted(true)
  }, [data, setValue])

  if (!mounted) return null

  const onSubmit = async (values: EventFormValues) => {
    let htmlContent = ''

    if (values.description) {
      const { default: draftToHtml } = await import('draftjs-to-html')

      htmlContent = draftToHtml(convertToRaw(values.description.getCurrentContent()))
    }

    const formData = {
      ...values,
      description: htmlContent
    }

    console.log('Submitted Data:', formData)
  }

  const fields = watch('fields')

  if (loading) {
    return (
      <div className='p-6 bg-[#ffffff] rounded-lg shadow-md'>
        <Skeleton variant='text' width={220} height={36} sx={{ borderRadius: '8px', mb: 3 }} />
        <Skeleton variant='rounded' height={48} sx={{ borderRadius: '10px', mb: 3 }} />
        <Skeleton variant='rounded' height={200} sx={{ borderRadius: '12px', mb: 3 }} />
        <Skeleton variant='rounded' height={48} sx={{ borderRadius: '10px', mb: 3 }} />
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 3 }}>
          {[...Array(7)].map((_, i) => (
            <Skeleton key={i} variant='rounded' width={120} height={40} sx={{ borderRadius: '10px' }} />
          ))}
        </Box>
        <Skeleton variant='rounded' width={200} height={48} sx={{ borderRadius: '12px' }} />
      </div>
    )
  }

  return (
    <form className='p-6 bg-[#ffffff] rounded-lg shadow-md' onSubmit={handleSubmit(onSubmit)}>
      <Typography variant='h5' className='font-bold text-[#4b41ba] mb-4'>
        Edit Waiver Template
      </Typography>

      <Controller
        name='title'
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            label='Waiver Form Title:'
            fullWidth
            variant='standard'
            size='small'
            error={!!errors.title}
            helperText={errors.title?.message}
          />
        )}
      />

      <div className='py-4'>
        <Controller
          name='description'
          control={control}
          render={({ field }) => (
            <ReactDraftWysiwyg
              editorState={field.value || editorState}
              onEditorStateChange={(newState: EditorState) => {
                field.onChange(newState)
                setEditorState(newState)
              }}
              placeholder='Waiver Form Description'
              editorStyle={{
                border: '1px solid grey',
                borderRadius: '5px',
                padding: '15px',
                minHeight: '200px'
              }}
              toolbar={{
                options: ['inline', 'link'],
                inline: {
                  options: ['bold', 'italic']
                }
              }}
            />
          )}
        />
      </div>

      <FileUpload
        label='Upload Waiver Form Logo'
        name='file'
        register={register}
        watch={watch}
        setValue={setValue}
        fileType={ACCEPTED_IMAGE_TYPES}
      />

      <Typography variant='body2' style={{ marginTop: '30px', color: '#555' }}>
        SELECT THE FIELDS TO INCLUDE IN THE WAIVER FORM:
      </Typography>

      {FIELD_OPTIONS?.map((opt, index) => {
        const fieldValue = fields?.find(f => f.id === opt.id)
        const isRequired = fieldValue?.required || false
        const isOptional = fieldValue?.optional || false

        return (
          <Box key={opt.id} display='flex' alignItems='center' marginY={1}>
            <Controller
              name={`fields.${index}.required`}
              control={control}
              render={({ field }) => (
                <label className='flex items-center gap-2'>
                  <input
                    type='checkbox'
                    checked={field.value}
                    onChange={e => {
                      field.onChange(e.target.checked)
                      setValue(`fields.${index}.optional`, e.target.checked ? false : isOptional)
                    }}
                    className='size-4 accent-purple-600'
                  />
                  <i className={`${opt.icon} size-5`} />
                  {opt.label}
                </label>
              )}
            />

            {isRequired && (
              <Box ml={4}>
                <Controller
                  name={`fields.${index}.optional`}
                  control={control}
                  render={({ field }) => (
                    <Tooltip title='Marking as optional means this field is not mandatory' arrow placement='top'>
                      <label className='flex items-center gap-1 cursor-pointer'>
                        <input
                          type='checkbox'
                          checked={field.value}
                          onChange={e => field.onChange(e.target.checked)}
                          className='size-4 accent-purple-600'
                        />
                        <span className='text-gray-600'>(optional)</span>
                      </label>
                    </Tooltip>
                  )}
                />
              </Box>
            )}
          </Box>
        )
      })}

      <Button disabled={isSubmitting || isLoading} variant='contained' color='primary' type='submit' className='mt-4'>
        Save Waiver Template
      </Button>
    </form>
  )
}
