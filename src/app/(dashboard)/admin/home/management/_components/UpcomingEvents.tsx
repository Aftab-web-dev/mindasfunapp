import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Avatar from '@mui/material/Avatar'

interface DataType {
  title: string
  date: string
  subTitle: string
}

const data: DataType[] = [
  { title: 'John Doe', subTitle: 'Birthday Party', date: '22 Apr' },
  { title: 'John Doe', subTitle: 'Birthday Party', date: '22 Apr' },
  { title: 'John Doe', subTitle: 'Birthday Party', date: '22 Apr' },
  { title: 'John Doe', subTitle: 'Birthday Party', date: '22 Apr' }
]

const eventColors = ['#523F99', '#3B82F6', '#10B981', '#F59E0B']

const UpcomingEvents = () => {
  return (
    <Box
      sx={{
        borderRadius: '16px',
        background: '#FFFFFF',
        boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
        overflow: 'hidden',
        height: '100%'
      }}
    >
      <Box sx={{ px: 3, pt: 2.5, pb: 1.5 }}>
        <Typography sx={{ fontSize: '1rem', fontWeight: 700, color: '#1E293B' }}>
          Upcoming Events
        </Typography>
        <Typography sx={{ fontSize: '0.8125rem', color: '#94A3B8', fontWeight: 500 }}>
          {data.length} events scheduled
        </Typography>
      </Box>

      <Box sx={{ px: 2, pb: 2.5, display: 'flex', flexDirection: 'column', gap: 0.5 }}>
        {data.map((row, i) => (
          <Box
            key={i}
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1.5,
              px: 1.5,
              py: 1.25,
              borderRadius: '10px',
              transition: 'background-color 0.15s ease',
              '&:hover': { backgroundColor: '#FAFAFA' }
            }}
          >
            <Avatar
              sx={{
                width: 38,
                height: 38,
                backgroundColor: `${eventColors[i % 4]}10`,
                color: eventColors[i % 4],
                fontSize: '0.875rem',
                fontWeight: 700
              }}
            >
              <i className='tabler-calendar-event' style={{ fontSize: '1.125rem' }} />
            </Avatar>

            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography sx={{ fontSize: '0.8125rem', fontWeight: 600, color: '#1E293B', lineHeight: 1.3 }} noWrap>
                {row.title}
              </Typography>
              <Typography sx={{ fontSize: '0.6875rem', color: '#94A3B8', fontWeight: 500 }} noWrap>
                {row.subTitle}
              </Typography>
            </Box>

            <Box
              sx={{
                px: 1.25,
                py: 0.4,
                borderRadius: '6px',
                backgroundColor: '#F0ECFA',
                flexShrink: 0
              }}
            >
              <Typography sx={{ fontSize: '0.6875rem', fontWeight: 600, color: '#523F99' }}>
                {row.date}
              </Typography>
            </Box>
          </Box>
        ))}
      </Box>
    </Box>
  )
}

export default UpcomingEvents
