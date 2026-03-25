import React from 'react'

import { Button, IconButton, Box, Typography } from '@mui/material'
import { Close as CloseIcon } from '@mui/icons-material'

interface FileUploadProps {
  label?: string
  value?: File | string | null
  onChange: (value: File | null) => void
  error?: boolean
  helperText?: string
  fileType?: string
}

const CheckingFileUpload: React.FC<FileUploadProps> = ({
  label = 'Upload Report',
  value,
  onChange,
  error,
  helperText,
  fileType = '.pdf,image/jpeg,image/jpg,image/png,image/webp'
}) => {
  const fileUrl =
    value && typeof value !== 'string' && value instanceof File
      ? URL.createObjectURL(value)
      : typeof value === 'string'
        ? value.startsWith('uploads')
          ? process.env.NEXT_PUBLIC_STORAGE_URL + value
          : value
        : null

  const handleRemoveFile = () => {
    onChange(null)
  }

  const filePreviewStyle: React.CSSProperties = {
    width: '100%',
    height: '375px',
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
          sx={{ mt: 2, mb: 1 }}
        >
          {label}
          <input
            type='file'
            accept={fileType}
            hidden
            onChange={(e) => {
              const file = e.target.files?.[0]

              if (file) onChange(file)
            }}
          />
        </Button>
      ) : (
        <Box position='relative' mt={2}>
          {value instanceof File && value.type.startsWith('image') ? (
            <img src={fileUrl} alt='preview' style={filePreviewStyle} />
          ) : (
            <embed src={fileUrl} style={filePreviewStyle} type='application/pdf' />
          )}

          <IconButton
            onClick={handleRemoveFile}
            sx={{
              position: 'absolute',
              top: 8,
              right: 8,
              backgroundColor: 'white',
              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
              '&:hover': { backgroundColor: 'white' },
              zIndex: 1
            }}
          >
            <CloseIcon />
          </IconButton>
        </Box>
      )}

      {error && (
        <Typography variant='body2' color='red' mt={1}>
          {helperText}
        </Typography>
      )}
    </div>
  )
}

export default CheckingFileUpload
