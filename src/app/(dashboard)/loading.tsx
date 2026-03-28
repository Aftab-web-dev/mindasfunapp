import Box from '@mui/material/Box'
import Skeleton from '@mui/material/Skeleton'

const Loading = () => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, p: { xs: 2, sm: 3 } }}>
      {/* Header skeleton */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Skeleton variant='text' width={180} height={32} sx={{ borderRadius: '8px' }} />
          <Skeleton variant='text' width={120} height={20} sx={{ borderRadius: '6px' }} />
        </Box>
        <Skeleton variant='rounded' width={100} height={40} sx={{ borderRadius: '10px' }} />
      </Box>

      {/* Cards row skeleton */}
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' }, gap: 2 }}>
        {[...Array(4)].map((_, i) => (
          <Skeleton key={i} variant='rounded' height={90} sx={{ borderRadius: '14px' }} />
        ))}
      </Box>

      {/* Main content skeleton */}
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '1fr 320px' }, gap: 3 }}>
        <Skeleton variant='rounded' height={380} sx={{ borderRadius: '16px' }} />
        <Skeleton variant='rounded' height={380} sx={{ borderRadius: '16px' }} />
      </Box>
    </Box>
  )
}

export default Loading
