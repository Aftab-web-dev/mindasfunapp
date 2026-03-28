import Box from '@mui/material/Box'
import Skeleton from '@mui/material/Skeleton'

const Loading = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        height: '100vh',
        backgroundColor: '#E8E4F0',
      }}
    >
      {/* Left illustration area */}
      <Box sx={{ flex: 1, display: { xs: 'none', md: 'flex' }, alignItems: 'center', justifyContent: 'center' }}>
        <Skeleton variant='rounded' width='60%' height='50%' sx={{ borderRadius: '20px' }} />
      </Box>

      {/* Right form area */}
      <Box sx={{ width: { xs: '100%', md: 500 }, display: 'flex', flexDirection: 'column', justifyContent: 'center', px: { xs: 4, md: 7 }, gap: 3 }}>
        <Skeleton variant='rounded' width={140} height={28} sx={{ borderRadius: '8px' }} />
        <Skeleton variant='text' width={220} height={36} sx={{ borderRadius: '8px' }} />
        <Skeleton variant='text' width={180} height={20} sx={{ borderRadius: '6px' }} />
        <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 3 }}>
          <Skeleton variant='rounded' height={48} sx={{ borderRadius: '10px' }} />
          <Skeleton variant='rounded' height={48} sx={{ borderRadius: '10px' }} />
          <Skeleton variant='rounded' height={52} sx={{ borderRadius: '14px' }} />
        </Box>
      </Box>
    </Box>
  )
}

export default Loading
