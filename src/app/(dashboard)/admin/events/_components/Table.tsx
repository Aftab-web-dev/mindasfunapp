'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

import Link from 'next/link'

import { Box, Button, Card, CardHeader, IconButton, TextField, Tooltip, Typography } from '@mui/material'

import { DataGrid } from '@mui/x-data-grid'
import type { GridColDef } from '@mui/x-data-grid'

import { Icon } from '@iconify/react/dist/iconify.js'

import toast from 'react-hot-toast'

import { eventsApi } from '@/api/events-api'
import { getUser } from '@/utils/authStorage'
import DeleteConfirmationDialog from '@/components/DeleteConfimationDialogBox'

const EventTable = () => {
  const buttonRef = useRef<HTMLButtonElement>(null)

  const [rows, setRows] = useState<any[]>([])

  const [openDeleteDialog, setOpenDeleteDialog] = useState(false)
  const [dialogId, setDialogId] = useState('')
  const [dialogName, setDialogName] = useState('')

  const fetchTableData = useCallback(async () => {
    try {
      const storedUserData = getUser()
      const branchId = storedUserData?.branchId.toString()

      await eventsApi.getEventsList({ branchId }).then(res => {
        setRows(res.data.data)
      })
    } catch (err) {
      toast.error('No Events')
    }
  }, [])

  useEffect(() => {
    fetchTableData()
  }, [fetchTableData])

  const deleteEvent = (id: any, name: any) => {
    setOpenDeleteDialog(true)
    setDialogId(id)
    setDialogName(name)
  }

  const deleteEventData = async (id: any) => {
    if (buttonRef.current) {
      buttonRef.current.disabled = true
    }

    try {
      // call API to delete waiver
      await eventsApi.deleteEvent({ eventId: id })

      toast.success('Event deleted successfully')

      // refresh table
      fetchTableData()
    } catch (err) {
      toast.error('Error Deleting Data')
    } finally {
      setOpenDeleteDialog(false)
    }
  }

  const columns: GridColDef<any>[] = [
    {
      flex: 0.275,
      minWidth: 190,
      field: 'date',
      headerName: 'Date',
      sortable: false,
      disableColumnMenu: true,
      renderCell: (params: any) => {
        const { row } = params

        return (
          <Box sx={{ display: 'flex', alignItems: 'center', height: '100%' }}>
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              <Typography noWrap variant='body2' sx={{ color: 'text.primary', fontWeight: 600 }}>
                {new Date(row.eventDate).toLocaleDateString()}
              </Typography>
            </Box>
          </Box>
        )
      }
    },
    {
      flex: 0.275,
      minWidth: 190,
      field: 'event',
      headerName: 'Event',
      sortable: false,
      disableColumnMenu: true,
      renderCell: (params: any) => {
        const { row } = params

        return (
          <Box sx={{ display: 'flex', alignItems: 'center', height: '100%' }}>
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              <Typography noWrap variant='body2' sx={{ color: 'text.primary', fontWeight: 600 }}>
                {row.event}
              </Typography>
            </Box>
          </Box>
        )
      }
    },

    {
      flex: 0.275,
      minWidth: 290,
      field: 'name',
      headerName: 'Name',
      sortable: false,
      disableColumnMenu: true,
      renderCell: (params: any) => {
        const { row } = params

        return (
          <Box sx={{ display: 'flex', alignItems: 'center', height: '100%' }}>
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              <Typography noWrap variant='body2' sx={{ color: 'text.primary', fontWeight: 600 }}>
                {row.name}
              </Typography>
            </Box>
          </Box>
        )
      }
    },

    {
      flex: 0.2,
      minWidth: 140,
      field: 'phone',
      headerName: 'Phone',
      sortable: false,
      disableColumnMenu: true,
      renderCell: (params: any) => {
        const row = params.row

        return (
          <Box sx={{ display: 'flex', alignItems: 'center', height: '100%' }}>
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              <Typography noWrap variant='body2' sx={{ color: 'text.primary', fontWeight: 600 }}>
                {row.phone}
              </Typography>
            </Box>
          </Box>
        )
      }
    },
    {
      flex: 0.2,
      minWidth: 140,
      field: 'net_amount',
      headerName: 'Amount',
      sortable: false,
      disableColumnMenu: true,
      renderCell: (params: any) => {
        const { row } = params

        return (
          <Box sx={{ display: 'flex', alignItems: 'center', height: '100%' }}>
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              <Typography noWrap variant='body2' sx={{ color: 'text.primary', fontWeight: 600 }}>
                {row.netAmt}
              </Typography>
            </Box>
          </Box>
        )
      }
    },
    {
      flex: 0,
      minWidth: 130,
      sortable: false,
      field: 'actions',
      headerName: 'Actions',
      disableColumnMenu: true,

      headerClassName: 'sticky-header', // Optional: if you want to style the header
      cellClassName: 'sticky-cell', // Add this line

      renderCell: ({ row }) => (
        <Box sx={{ display: 'flex', alignItems: 'center', height: '100%' }}>
          <Tooltip title='View'>
            <IconButton size='small' component={Link} href={`/admin/events/view-event/${row.id}`}>
              <Icon icon='raphael:view' fontSize={20} />
            </IconButton>
          </Tooltip>
          <Tooltip title='Edit'>
            <IconButton size='small' component={Link} href={`/admin/events/edit-event/${row.id}`}>
              <Icon icon='tabler:edit' fontSize={20} />
            </IconButton>
          </Tooltip>
          <Tooltip title='Delete'>
            <IconButton
              onClick={() => {
                // Open delete confirmation
                deleteEvent(row.id, row.name)
              }}
              size='small'
            >
              <Icon icon='tabler:trash' fontSize={20} />
            </IconButton>
          </Tooltip>
        </Box>
      )
    }
  ]

  return (
    <div className='max-w-6xl mx-auto px-3 sm:px-4 py-4 sm:py-6 min-h-[calc(100vh-64px)]'>
      <div className='rounded-2xl border border-[rgba(0,0,0,0.06)] bg-white overflow-hidden min-h-[calc(100vh-120px)] flex flex-col'>
        {/* Header inside card */}
        <Box sx={{ px: { xs: 3, sm: 4, md: 5 }, pt: { xs: 3, sm: 3, md: 4 }, pb: 2.5 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2.5 }}>
            <Box>
              <Typography sx={{ fontSize: '1.125rem', fontWeight: 700, color: '#1E293B' }}>Events</Typography>
              <Typography sx={{ fontSize: '0.8125rem', color: '#94A3B8', fontWeight: 500, mt: 0.25 }}>View and manage all booked events</Typography>
            </Box>
          </Box>
          <TextField
            fullWidth
            size='small'
            placeholder='Search by event name, customer, date...'
            InputProps={{
              startAdornment: (
                <Box sx={{ mr: 1.5, display: 'flex', color: '#94A3B8' }}>
                  <i className='tabler-search' style={{ fontSize: '1rem' }} />
                </Box>
              )
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: '12px',
                backgroundColor: '#F8FAFC',
                height: 44,
                '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(82,63,153,0.3)' },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#523F99', borderWidth: 2 }
              },
              '& .MuiOutlinedInput-input': { fontSize: '0.875rem' }
            }}
          />
        </Box>

        {/* Table */}
        {rows.length > 0 ? (
          <DataGrid
            autoHeight
            density='compact'
            rows={rows}
            columns={columns}
            getRowId={row => row.id}
            getRowHeight={() => 32}
            rowHeight={32}
            columnHeaderHeight={38}
            pagination
            sortingMode='server'
            sx={{
              border: 'none',
              '& .MuiDataGrid-columnHeaders': {
                backgroundColor: '#F8FAFC',
                borderTop: '1px solid rgba(0,0,0,0.06)',
                borderBottom: '1px solid rgba(0,0,0,0.06)'
              },
              '& .MuiDataGrid-columnHeader': { py: 0 },
              '& .MuiDataGrid-columnHeaderTitle': {
                fontSize: '0.75rem',
                fontWeight: 600,
                color: '#64748B',
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              },
              '& .MuiDataGrid-cell': {
                borderBottom: '1px solid rgba(0,0,0,0.04)',
                fontSize: '0.8125rem',
                paddingTop: '0 !important',
                paddingBottom: '0 !important',
                display: 'flex',
                alignItems: 'center',
                lineHeight: 1.2
              },
              '& .MuiDataGrid-row': { maxHeight: '32px !important', minHeight: '32px !important' },
              '& .MuiDataGrid-row:hover': {
                backgroundColor: 'rgba(82,63,153,0.02)'
              },
              '& .MuiDataGrid-virtualScrollerContent': { minHeight: '0 !important' },
              '& .MuiDataGrid-footerContainer': { minHeight: 40, borderTop: '1px solid rgba(0,0,0,0.06)' },
              '& .MuiTablePagination-root': { fontSize: '0.75rem' },
              '& .MuiTablePagination-toolbar': { minHeight: 40, paddingLeft: '8px', paddingRight: '8px' },
              '& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows': { fontSize: '0.75rem', margin: 0 },
              '& .MuiTablePagination-actions button': { padding: '4px' }
            }}
            slotProps={{
              baseButton: { size: 'medium', variant: 'tonal' },
              toolbar: {
                csvOptions: { disableToolbarButton: true },
                printOptions: { disableToolbarButton: true },
                showQuickFilter: true,
                quickFilterProps: { debounceMs: 1000 }
              }
            } as any}
          />
        ) : (
          <Box sx={{ py: 10, px: 3, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', borderTop: '1px solid rgba(0,0,0,0.06)', flex: 1 }}>
            <Box sx={{ position: 'relative', mb: 4 }}>
              <Box sx={{ width: 100, height: 100, borderRadius: '50%', backgroundColor: '#F0ECFA', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Box sx={{ width: 70, height: 70, borderRadius: '50%', backgroundColor: '#E4DDF5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <i className='tabler-calendar-event' style={{ fontSize: '2rem', color: '#523F99' }} />
                </Box>
              </Box>
              <Box sx={{ position: 'absolute', top: -6, right: -6, width: 14, height: 14, borderRadius: '50%', backgroundColor: '#523F99', opacity: 0.15 }} />
              <Box sx={{ position: 'absolute', bottom: 2, left: -10, width: 10, height: 10, borderRadius: '50%', backgroundColor: '#523F99', opacity: 0.1 }} />
              <Box sx={{ position: 'absolute', top: 10, right: -16, width: 8, height: 8, borderRadius: '50%', backgroundColor: '#06B6D4', opacity: 0.2 }} />
            </Box>
            <Typography sx={{ fontSize: '1.125rem', fontWeight: 700, color: '#1E293B', mb: 1 }}>No events yet</Typography>
            <Typography sx={{ fontSize: '0.875rem', color: '#94A3B8', mb: 1, textAlign: 'center', maxWidth: 320, lineHeight: 1.6 }}>
              Booked events will appear here. Start by creating your first event.
            </Typography>
            <Button
              variant='contained'
              component={Link}
              href='/admin/events/add-event'
              disableElevation
              startIcon={<i className='tabler-plus' style={{ fontSize: '0.875rem' }} />}
              sx={{ borderRadius: '12px', textTransform: 'none', fontWeight: 600, fontSize: '1rem', backgroundColor: '#523F99', color: '#FFFFFF', px: 5, py: 1.5, mt: 2, '&:hover': { backgroundColor: '#6B52C4', boxShadow: '0 6px 20px rgba(82, 63, 153, 0.35)' } }}
            >
              Book Your First Event
            </Button>
            <Box sx={{ display: 'flex', gap: 4, mt: 5, pt: 4, borderTop: '1px solid rgba(0,0,0,0.04)' }}>
              {[
                { icon: 'tabler-calendar-plus', label: 'Create Events', color: '#523F99' },
                { icon: 'tabler-users', label: 'Manage Guests', color: '#3B82F6' },
                { icon: 'tabler-report-analytics', label: 'Track Revenue', color: '#10B981' }
              ].map((item) => (
                <Box key={item.label} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
                  <Box sx={{ width: 40, height: 40, borderRadius: '10px', backgroundColor: `${item.color}10`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <i className={item.icon} style={{ fontSize: '1.125rem', color: item.color }} />
                  </Box>
                  <Typography sx={{ fontSize: '0.6875rem', fontWeight: 600, color: '#64748B' }}>{item.label}</Typography>
                </Box>
              ))}
            </Box>
          </Box>
        )}
      </div>

      {openDeleteDialog && (
        <DeleteConfirmationDialog
          id={dialogId}
          buttonRef={buttonRef}
          name={dialogName}
          open={true}
          setOpen={setOpenDeleteDialog}
          deleteFunction={deleteEventData}
        />
      )}
    </div>
  )
}

export default EventTable
