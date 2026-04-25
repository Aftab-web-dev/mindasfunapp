'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

import Link from 'next/link'

import { Box, Button, IconButton, TextField, Tooltip, Typography } from '@mui/material'

import { DataGrid } from '@mui/x-data-grid'
import type { GridColDef } from '@mui/x-data-grid'

import { Icon } from '@iconify/react/dist/iconify.js'

import toast from 'react-hot-toast'

import { eventsApi } from '@/api/events-api'
import { getUser } from '@/utils/authStorage'
import DeleteConfirmationDialog from '@/components/DeleteConfimationDialogBox'

const ReqEventTable = () => {
  const buttonRef = useRef<HTMLButtonElement>(null)

  const [rows, setRows] = useState<any[]>([])
  const [loading, setLoading] = useState<boolean>(false)

  const [openDeleteDialog, setOpenDeleteDialog] = useState(false)
  const [dialogId, setDialogId] = useState('')
  const [dialogName, setDialogName] = useState('')

  const fetchTableData = useCallback(async () => {
    setLoading(true)

    try {
      const storedUserData = getUser()
      const branchId = storedUserData?.branchId

      const res = await eventsApi.getPendingEventRequests({ branchId })

      setRows(res.data?.data || [])
    } catch (err) {
      setRows([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchTableData()
  }, [fetchTableData])

  const approveRequest = async (id: number | string) => {
    try {
      const storedUserData = getUser()
      const branchId = storedUserData?.branchId
      const approvedBy = storedUserData?.employeeId

      await eventsApi.approveEvent({ id, approvedBy, branchId })
      toast.success('Event approved successfully')
      fetchTableData()
    } catch (err) {
      toast.error('Failed to approve event')
    }
  }

  const openDeleteFlow = (id: any, name: any) => {
    setOpenDeleteDialog(true)
    setDialogId(id)
    setDialogName(name)
  }

  const deleteEventData = async (id: any) => {
    if (buttonRef.current) buttonRef.current.disabled = true

    try {
      await eventsApi.deleteEvent({ eventId: id })
      toast.success('Request deleted successfully')
      fetchTableData()
    } catch (err) {
      toast.error('Error deleting request')
    } finally {
      setOpenDeleteDialog(false)
    }
  }

  const columns: GridColDef<any>[] = [
    {
      flex: 0.275,
      minWidth: 190,
      field: 'eventDate',
      headerName: 'Date',
      sortable: false,
      disableColumnMenu: true,
      renderCell: (params: any) => (
        <Box sx={{ display: 'flex', alignItems: 'center', height: '100%' }}>
          <Typography noWrap variant='body2' sx={{ color: 'text.primary', fontWeight: 600 }}>
            {params.row.eventDate ? new Date(params.row.eventDate).toLocaleDateString() : '—'}
          </Typography>
        </Box>
      )
    },
    {
      flex: 0.275,
      minWidth: 190,
      field: 'event',
      headerName: 'Event',
      sortable: false,
      disableColumnMenu: true,
      renderCell: (params: any) => (
        <Box sx={{ display: 'flex', alignItems: 'center', height: '100%' }}>
          <Typography noWrap variant='body2' sx={{ color: 'text.primary', fontWeight: 600 }}>
            {params.row.event}
          </Typography>
        </Box>
      )
    },
    {
      flex: 0.275,
      minWidth: 290,
      field: 'name',
      headerName: 'Name',
      sortable: false,
      disableColumnMenu: true,
      renderCell: (params: any) => (
        <Box sx={{ display: 'flex', alignItems: 'center', height: '100%' }}>
          <Typography noWrap variant='body2' sx={{ color: 'text.primary', fontWeight: 600 }}>
            {params.row.name}
          </Typography>
        </Box>
      )
    },
    {
      flex: 0.2,
      minWidth: 140,
      field: 'phone',
      headerName: 'Phone',
      sortable: false,
      disableColumnMenu: true,
      renderCell: (params: any) => (
        <Box sx={{ display: 'flex', alignItems: 'center', height: '100%' }}>
          <Typography noWrap variant='body2' sx={{ color: 'text.primary', fontWeight: 600 }}>
            {params.row.phone}
          </Typography>
        </Box>
      )
    },
    {
      flex: 0,
      minWidth: 170,
      sortable: false,
      field: 'actions',
      headerName: 'Actions',
      disableColumnMenu: true,
      headerClassName: 'sticky-header',
      cellClassName: 'sticky-cell',
      renderCell: ({ row }) => (
        <Box sx={{ display: 'flex', alignItems: 'center', height: '100%' }}>
          <Tooltip title='View'>
            <IconButton size='small' component={Link} href={`/admin/events/view-event/${row.id}`}>
              <Icon icon='raphael:view' fontSize={20} />
            </IconButton>
          </Tooltip>
          <Tooltip title='Approve'>
            <IconButton size='small' onClick={() => approveRequest(row.id)}>
              <Icon icon='tabler:circle-check' fontSize={20} color='#10B981' />
            </IconButton>
          </Tooltip>
          <Tooltip title='Delete'>
            <IconButton onClick={() => openDeleteFlow(row.id, row.name)} size='small'>
              <Icon icon='tabler:trash' fontSize={20} />
            </IconButton>
          </Tooltip>
        </Box>
      )
    }
  ]

  const pending = rows.filter(r => r.status === 0 || r.status === 2).length
  const approved = rows.filter(r => r.status === 1).length
  const declined = rows.filter(r => r.status === 3).length

  return (
    <div className='max-w-6xl mx-auto px-2 sm:px-4 py-3 sm:py-6 min-h-[calc(100vh-64px)]'>
      {/* Status summary cards */}
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: { xs: 1.5, sm: 2 }, mb: { xs: 2, sm: 3 } }}>
        {[
          { label: 'Total Requests', value: rows.length, icon: 'tabler-inbox', color: '#523F99', bg: '#F0ECFA' },
          { label: 'Pending', value: pending, icon: 'tabler-clock', color: '#F59E0B', bg: '#FFF7ED' },
          { label: 'Approved', value: approved, icon: 'tabler-circle-check', color: '#10B981', bg: '#ECFDF5' },
          { label: 'Declined', value: declined, icon: 'tabler-circle-x', color: '#EF4444', bg: '#FEF2F2' }
        ].map((stat) => (
          <Box
            key={stat.label}
            sx={{
              borderRadius: '14px',
              backgroundColor: '#FFFFFF',
              boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
              p: { xs: 2, sm: 2.5 },
              display: 'flex',
              alignItems: 'center',
              gap: { xs: 1.5, sm: 2 },
            }}
          >
            <Box sx={{ width: { xs: 36, sm: 42 }, height: { xs: 36, sm: 42 }, borderRadius: '10px', backgroundColor: stat.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <i className={stat.icon} style={{ fontSize: '1.125rem', color: stat.color }} />
            </Box>
            <Box>
              <Typography sx={{ fontSize: { xs: '1.125rem', sm: '1.25rem' }, fontWeight: 700, color: '#1E293B', lineHeight: 1.2 }}>{stat.value}</Typography>
              <Typography noWrap sx={{ fontSize: { xs: '0.6875rem', sm: '0.75rem' }, fontWeight: 500, color: '#94A3B8' }}>{stat.label}</Typography>
            </Box>
          </Box>
        ))}
      </Box>

      {/* Main card */}
      <div className='rounded-none sm:rounded-2xl border-0 sm:border sm:border-[rgba(0,0,0,0.06)] bg-white overflow-hidden min-h-[calc(100vh-280px)] flex flex-col'>
        <Box sx={{ px: { xs: 2, sm: 3, md: 5 }, pt: { xs: 2.5, sm: 3, md: 4 }, pb: 2 }}>
          <Box sx={{ mb: 2 }}>
            <Typography sx={{ fontSize: { xs: '1rem', sm: '1.125rem' }, fontWeight: 700, color: '#1E293B' }}>Incoming Requests</Typography>
            <Typography sx={{ fontSize: { xs: '0.75rem', sm: '0.8125rem' }, color: '#94A3B8', fontWeight: 500, mt: 0.25 }}>Review and manage customer event requests</Typography>
          </Box>
          <TextField
            fullWidth
            size='small'
            placeholder='Search requests by name, phone...'
            InputProps={{
              startAdornment: (
                <Box sx={{ mr: 1, display: 'flex', color: '#94A3B8' }}>
                  <i className='tabler-search' style={{ fontSize: '1rem' }} />
                </Box>
              )
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: '14px',
                backgroundColor: '#F1F5F9',
                height: { xs: 42, sm: 44 },
                '& .MuiOutlinedInput-notchedOutline': { border: { xs: 'none', sm: '1px solid rgba(0,0,0,0.12)' } },
                '&.Mui-focused': { backgroundColor: '#fff', boxShadow: { xs: '0 0 0 2px #F59E0B', sm: 'none' } },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#F59E0B', borderWidth: 2 },
              },
              '& .MuiOutlinedInput-input': { fontSize: '0.875rem' }
            }}
          />
        </Box>

        {rows.length > 0 ? (
          <DataGrid
            autoHeight
            rows={rows}
            columns={columns}
            loading={loading}
            getRowId={row => row.id}
            pagination
            sortingMode='server'
            sx={{
              border: 'none',
              '& .MuiDataGrid-columnHeaders': {
                backgroundColor: '#FFFBEB',
                borderTop: '1px solid rgba(0,0,0,0.06)',
                borderBottom: '1px solid rgba(0,0,0,0.06)'
              },
              '& .MuiDataGrid-columnHeaderTitle': {
                fontSize: '0.75rem',
                fontWeight: 600,
                color: '#92400E',
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              },
              '& .MuiDataGrid-cell': {
                borderBottom: '1px solid rgba(0,0,0,0.04)',
                fontSize: '0.8125rem'
              },
              '& .MuiDataGrid-row:hover': {
                backgroundColor: 'rgba(245,158,11,0.03)'
              }
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
          <Box sx={{ py: { xs: 5, sm: 8 }, px: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', borderTop: '1px solid rgba(0,0,0,0.06)', flex: 1 }}>
            <Box sx={{ width: { xs: 72, sm: 100 }, height: { xs: 72, sm: 100 }, borderRadius: '50%', backgroundColor: '#FFF7ED', display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 3 }}>
              <i className='tabler-inbox' style={{ fontSize: '1.75rem', color: '#F59E0B' }} />
            </Box>

            <Typography sx={{ fontSize: { xs: '1rem', sm: '1.125rem' }, fontWeight: 700, color: '#1E293B', mb: 0.5 }}>
              No incoming requests
            </Typography>
            <Typography sx={{ fontSize: { xs: '0.8125rem', sm: '0.875rem' }, color: '#94A3B8', textAlign: 'center', maxWidth: 300, lineHeight: 1.6, mb: 1 }}>
              When customers submit event requests, they'll appear here for your review.
            </Typography>

            <Box sx={{ display: 'flex', gap: { xs: 3, sm: 4 }, mt: 4, pt: 3, borderTop: '1px solid rgba(0,0,0,0.04)' }}>
              {[
                { icon: 'tabler-inbox', label: 'Receive', color: '#F59E0B' },
                { icon: 'tabler-checks', label: 'Review', color: '#10B981' },
                { icon: 'tabler-calendar-check', label: 'Confirm', color: '#523F99' }
              ].map((item) => (
                <Box key={item.label} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0.75 }}>
                  <Box sx={{ width: 40, height: 40, borderRadius: '10px', backgroundColor: `${item.color}10`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <i className={item.icon} style={{ fontSize: '1.125rem', color: item.color }} />
                  </Box>
                  <Typography sx={{ fontSize: '0.6875rem', fontWeight: 600, color: '#64748B', textAlign: 'center' }}>{item.label}</Typography>
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

export default ReqEventTable
