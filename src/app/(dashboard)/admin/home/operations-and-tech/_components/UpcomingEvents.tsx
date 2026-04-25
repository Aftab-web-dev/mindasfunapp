'use client'

import { useEffect, useState } from 'react'

import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Table from '@mui/material/Table'
import TableRow from '@mui/material/TableRow'
import TableBody from '@mui/material/TableBody'
import TableHead from '@mui/material/TableHead'
import TableCell from '@mui/material/TableCell'
import Typography from '@mui/material/Typography'
import CardHeader from '@mui/material/CardHeader'
import TableContainer from '@mui/material/TableContainer'

import { format } from 'date-fns'

import OptionMenu from '@/@core/components/option-menu'
import { managementDashboardApi } from '@/api/management-dashboard'

interface DataType {
  title: string
  date: string
  subTitle: string
}

const UpcomingEvents = () => {
  const [data, setData] = useState<DataType[]>([])

  useEffect(() => {
    managementDashboardApi.upcomingEvent().then(res => {
      const items: any[] = res.data?.data || []

      const mapped = items.map((row: any) => ({
        title: row.name || row.customerName || row.ledgerName || 'Event',
        subTitle: row.event || row.eventName || row.eventDescription || 'Event',
        date: row.eventDate ? format(new Date(row.eventDate), 'd MMM') : ''
      }))

      setData(mapped)
    }).catch(() => setData([]))
  }, [])

  return (
    <div>
      <Card sx={{ width: '100%', height: '100%' }}>
        <CardHeader
          title='Upcoming Events'
          action={
            <OptionMenu
              options={['Show all entries', 'Refresh', 'Download']}
              iconButtonProps={{
                size: 'small',
                sx: { color: 'text.disabled' }
              }}
            />
          }
        />
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow
                sx={{
                  '& .MuiTableCell-root': {
                    py: '16px',
                    color: 'text.secondary',
                    px: { xs: '12px', sm: '24px' },
                    borderTop: theme => `1px solid ${theme.palette.divider}`
                  }
                }}
              >
                <TableCell className='text-start'>Events</TableCell>
                <TableCell className='text-end'>Date</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.length === 0 && (
                <TableRow>
                  <TableCell colSpan={2} sx={{ textAlign: 'center', py: 4, color: 'text.disabled', border: 0 }}>
                    No upcoming events
                  </TableCell>
                </TableRow>
              )}
              {data.map((row: DataType, i: number) => (
                <TableRow
                  key={i}
                  sx={{
                    '& .MuiTableCell-root': {
                      border: 0,
                      px: { xs: '12px', sm: '24px' },
                      pb: '16px'
                    },
                    '&:first-of-type .MuiTableCell-root': {
                      pt: theme => `${theme.spacing(4.5)} !important`
                    }
                  }}
                >
                  <TableCell>
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        paddingBlock: '2px',
                        '& img': { mr: { xs: 2, sm: 4 } }
                      }}
                    >
                      <Box
                        sx={{
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'flex-start'
                        }}
                      >
                        <Typography
                          noWrap
                          sx={{
                            fontWeight: 500,
                            color: 'text.primary',
                            fontSize: { xs: '14px', sm: 'inherit' }
                          }}
                        >
                          {row.title}
                        </Typography>
                        <Typography
                          noWrap
                          variant='body2'
                          sx={{
                            color: 'text.disabled',
                            fontSize: { xs: '12px', sm: 'inherit' }
                          }}
                        >
                          {row.subTitle}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography
                      noWrap
                      sx={{
                        fontWeight: 500,
                        fontSize: { xs: '13px', sm: '15px' },
                        color: 'text.primary',
                        textAlign: 'end'
                      }}
                    >
                      {row.date}
                    </Typography>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>
    </div>
  )
}

export default UpcomingEvents
