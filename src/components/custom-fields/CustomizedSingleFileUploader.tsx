import React from 'react'

import { Button, IconButton, Box } from '@mui/material'
import { Close as CloseIcon } from '@mui/icons-material'
import type { UseFormRegister, UseFormWatch, UseFormSetValue } from 'react-hook-form'

interface FileUploadProps {
  register: UseFormRegister<any>
  watch: UseFormWatch<any>
  setValue: UseFormSetValue<any>
  name: string
  label?: string
  previewWidth?: number | string
  previewHeight?: number | string
  fileType?: string | string[]
  required?: boolean // Add this prop
}

const FileUpload: React.FC<FileUploadProps> = ({
  register,
  watch,
  setValue,
  name,
  label = 'Upload Report',
  fileType = '.pdf',
  previewWidth = '100%',
  previewHeight = 375,
  required = false
}) => {
  const file = watch(name)

  const fileUrl = React.useMemo(() => {
    if (!file) return null

    // Handle FileList case
    if (file instanceof FileList) {
      return file.length > 0 ? URL.createObjectURL(file[0]) : null
    }

    // Handle File case
    if (file instanceof File) {
      return URL.createObjectURL(file)
    }

    // Handle string case (existing file path)
    if (typeof file === 'string') {
      return file.startsWith('uploads') ? process.env.NEXT_PUBLIC_STORAGE_URL + file : file
    }

    return null
  }, [file])

  const isImage = React.useMemo(() => {
    if (!fileUrl) return false

    // Check for FileList
    if (file instanceof FileList) {
      return file.length > 0 && file[0].type?.startsWith('image')
    }

    // Check for File
    if (file instanceof File) {
      return file.type?.startsWith('image')
    }

    // Check for string path
    if (typeof file === 'string') {
      return /\.(jpe?g|png|webp)$/i.test(file)
    }

    return false
  }, [file, fileUrl])

  const handleRemoveFile = () => {
    setValue(name, null, { shouldValidate: true })
  }

  const filePreviewStyle: React.CSSProperties = {
    width: typeof previewWidth === 'number' ? `${previewWidth}px` : previewWidth,
    height: typeof previewHeight === 'number' ? `${previewHeight}px` : previewHeight,
    maxWidth: '100%',
    objectFit: 'contain',
    borderRadius: 8,
    boxShadow: '0px 1px 3px rgba(0,0,0,0.2)'
  }

  return (
    <div>
      {!fileUrl ? (
        <Button
          variant='outlined'
          component='label'
          sx={{
            marginTop: 2,
            marginBottom: 4,
            width: { xs: '100%', sm: 'auto' },
            fontSize: { xs: '0.95rem', sm: '1rem' }
          }}
        >
          {label}
          <input
            type='file'
            accept={Array.isArray(fileType) ? fileType.join(',') : fileType}
            style={{ display: 'none' }}
            {...register(name, {
              required: required ? 'File is required' : false // Conditionally apply required
            })}
          />
        </Button>
      ) : (
        <Box
          position='relative'
          display='flex'
          justifyContent='center'
          alignItems='center'
          marginTop={2}
          sx={{ width: '100%' }}
        >
          {isImage ? (
            <img key={file[0]?.name} alt='preview' src={fileUrl} style={filePreviewStyle} />
          ) : (
            <embed
              key={file[0]?.name}
              src={fileUrl}
              style={filePreviewStyle}
              type={file[0]?.type || 'application/pdf'}
            />
          )}

          <IconButton
            onClick={handleRemoveFile}
            sx={{
              position: 'absolute',
              top: { xs: 4, sm: 8 },
              right: { xs: 4, sm: 8 },
              backgroundColor: 'white',
              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
              '&:hover': {
                backgroundColor: 'white'
              },
              zIndex: 1,
              width: { xs: 28, sm: 36 },
              height: { xs: 28, sm: 36 }
            }}
          >
            <CloseIcon sx={{ fontSize: { xs: 18, sm: 24 } }} />
          </IconButton>
        </Box>
      )}
    </div>
  )
}

export default FileUpload
