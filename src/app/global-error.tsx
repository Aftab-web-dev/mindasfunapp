'use client'

import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'

const GlobalError = ({
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) => {
  return (
    <html lang="en">
      <body>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100vh',
            gap: 2,
            backgroundColor: '#E8E4F0',
          }}
        >
          <Typography variant="h4" sx={{ color: '#1A1033', fontWeight: 700 }}>
            Something went wrong
          </Typography>
          <Typography sx={{ color: '#8B8D97', mb: 2 }}>
            An unexpected error occurred. Please try again.
          </Typography>
          <Button
            variant="contained"
            onClick={reset}
            sx={{
              backgroundColor: '#523F99',
              '&:hover': { backgroundColor: '#6B52C4' },
              textTransform: 'none',
              borderRadius: '12px',
              px: 4,
              py: 1.5,
            }}
          >
            Try Again
          </Button>
        </Box>
      </body>
    </html>
  )
}

export default GlobalError
