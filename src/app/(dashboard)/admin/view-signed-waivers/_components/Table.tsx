'use client'

import { useCallback, useEffect, useState } from 'react'

import { Box, Button, Card, CardHeader, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Table, TableBody, TableCell, TableHead, TableRow, TextField, Tooltip, Typography } from '@mui/material'

import { DataGrid } from '@mui/x-data-grid'
import type { GridColDef } from '@mui/x-data-grid'

import { Icon } from '@iconify/react/dist/iconify.js'

import { format } from 'date-fns'

import toast from 'react-hot-toast'

import { waiverApi } from "@/api/waiver-api"
import { getUser } from "@/utils/authStorage"



const SignedWaiverTable = () => {

  const [rows, setRows] = useState<any[]>([])

  const fetchTableData = useCallback(
    async () => {
      try {
        await waiverApi.getAllSignedWaiver().then(res => {
          setRows(res.data.data)
        })
      } catch (err) {
        toast.error('Error Fetching Customers')
      }
    },
    [] // Dependency array added
  )

  useEffect(() => {
    fetchTableData()
  }, [fetchTableData])

  const [openModal, setOpenModal] = useState(false)
  const [selectedCheckIn, setSelectedCheckIn] = useState<any | null>(null)

  const handleViewCheckIn = (row: any) => {
    setSelectedCheckIn(row)
    setOpenModal(true)
  }

  const handleCheckIn = async (row: any) => {
    try {
      const user = getUser()

      await waiverApi.checkInWaiver({ cusWaiverId: row.id, branchId: user?.branchId })
      toast.success('Checked in successfully')
      fetchTableData()
    } catch (err) {
      toast.error('Check-in failed')
    }
  }

  const handleDelete = async (row: any) => {
    try {
      const user = getUser()

      await waiverApi.deleteSignedWaiver({ id: Number(row.id), empId: user?.employeeId })
      toast.success('Record deleted')
      fetchTableData()
    } catch (err) {
      toast.error('Delete failed')
    }
  }

  const handleDownload = async (row: any) => {
    try {
      const response = await waiverApi.downloadSignedWaiver({
        ledgerId: row.ledgerId,
        waiverId: row.wId
      })
      
      // Create a blob URL and trigger download
      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement('a')

      link.href = url
      link.setAttribute('download', `${row.waverName || 'waiver'}.pdf`)
      document.body.appendChild(link)
      link.click()
      link.parentNode?.removeChild(link)
      window.URL.revokeObjectURL(url)
      
      toast.success('Waiver downloaded successfully')
    } catch (err) {
      toast.error('Error downloading waiver')
    }
  }


  const columns: GridColDef<any>[] = [
    {
      flex: 1,
      minWidth: 120,
      field: 'name',
      headerName: 'Name',
      sortable: false,
      disableColumnMenu: true,
      renderCell: (params: any) => {
        const { row } = params
        const rawDate = row.signed_date
        const date = rawDate ? new Date(rawDate) : null
        const formatted = date ? format(date, 'MMM d, h:mm a') : ''

        return (
          <Box sx={{ display: 'flex', alignItems: 'center', height: '100%' }}>
            <Box sx={{ minWidth: 0 }}>
              <Typography noWrap variant='body2' sx={{ color: 'text.primary', fontWeight: 600 }}>
                {row.name}
              </Typography>
              <Typography noWrap variant='caption' sx={{ color: '#94A3B8', display: { xs: 'block', sm: 'none' } }}>
                {formatted}
              </Typography>
            </Box>
          </Box>
        )
      }
    },
    {
      flex: 0.5,
      minWidth: 160,
      field: 'signed_date',
      headerName: 'Signed Date',
      sortable: false,
      disableColumnMenu: true,
      renderCell: (params: any) => {
        const { row } = params

        const rawDate = row.signed_date
        const date = rawDate ? new Date(rawDate) : null
        const formatted = date ? format(date, 'MMM d yyyy h:mm a') : 'N/A'

        return (
          <Box sx={{ display: 'flex', alignItems: 'center', height: '100%' }}>
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              <Typography noWrap variant='body2' sx={{ color: 'text.primary', fontWeight: 600 }}>
                {formatted ?? "N/A"}
              </Typography>
            </Box>
          </Box>
        )
      }
    },
    {
      flex: 0.5,
      minWidth: 150,
      field: 'waiver_title',
      headerName: 'Waiver Title',
      sortable: false,
      disableColumnMenu: true,
      renderCell: (params: any) => {
        const { row } = params

        return (
          <Box sx={{ display: 'flex', alignItems: 'center', height: '100%' }}>
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              <Typography noWrap variant='body2' sx={{ color: 'text.primary', fontWeight: 600 }}>
                {row.waverName}
              </Typography>
            </Box>
          </Box>
        )
      }
    },

    {
      flex: 0.1,
      minWidth: 80,
      field: 'code',
      headerName: 'View and Download as PDF',
      sortable: false,
      disableColumnMenu: true,
      renderCell: (params: any) => {
        const { row } = params

          return (
            <Tooltip title='Click to download'>
              <Box onClick={() => handleDownload(row)} sx={{ display: 'flex', alignItems: 'center', height: '100%', cursor: 'pointer' }}>
                <i className='tabler-file-type-pdf' />
              </Box>
            </Tooltip>
          )
        }
    },
    {
      flex: 0.1,
      minWidth: 80,
      field: 'viewCheckIn',
      headerName: 'Check-in',
      sortable: false,
      disableColumnMenu: true,
      renderCell: (params: any) => {
        const { row } = params

        return (
          <Tooltip title='View Check-In List'>
            <Box
              sx={{ display: 'flex', alignItems: 'center', height: '100%', cursor: 'pointer' }}
              onClick={() => handleViewCheckIn(row)}
            >
              <i className='tabler-checklist' />
            </Box>
          </Tooltip>
        )
      }
    },
    {
      flex: 0,
      minWidth: 90,
      sortable: false,
      field: 'actions',
      headerName: 'Actions',
      disableColumnMenu: true,
      renderCell: ({ row }) => (
        <Box sx={{ display: 'flex', alignItems: 'center', height: '100%' }}>
          <Tooltip title='Check-In'>
            <IconButton onClick={() => handleCheckIn(row)} size='small'>
              <Icon icon='tabler:checkbox' fontSize={20} />
            </IconButton>
          </Tooltip>
          <Tooltip title='Delete'>
            <IconButton onClick={() => handleDelete(row)} size='small'>
              <Icon icon='tabler:trash' fontSize={20} />
            </IconButton>
          </Tooltip>
        </Box>
      )
    }
  ]

  const isMobileView = typeof window !== 'undefined' ? window.innerWidth < 640 : false

  return (
    <div className='max-w-6xl mx-auto px-2 sm:px-4 py-3 sm:py-6 min-h-[calc(100vh-64px)]'>
      <div className='rounded-none sm:rounded-2xl border-0 sm:border sm:border-[rgba(0,0,0,0.06)] bg-white overflow-hidden min-h-[calc(100vh-120px)] flex flex-col'>
        <Box sx={{ px: { xs: 2, sm: 4, md: 5 }, pt: { xs: 2.5, sm: 3, md: 4 }, pb: 2 }}>
          <Box sx={{ mb: 2 }}>
            <Typography sx={{ fontSize: { xs: '1.125rem', sm: '1.25rem' }, fontWeight: 700, color: '#1E293B' }}>Signed Waivers</Typography>
            <Typography sx={{ fontSize: { xs: '0.6875rem', sm: '0.8125rem' }, color: '#94A3B8', fontWeight: 500, mt: 0.25 }}>
              {rows.length > 0 ? `${rows.length} signed` : 'View all signed waiver documents'}
            </Typography>
          </Box>
          <TextField
            fullWidth size='small' placeholder='Search by name...'
            InputProps={{ startAdornment: (<Box sx={{ mr: 1, display: 'flex', color: '#94A3B8' }}><i className='tabler-search' style={{ fontSize: '1rem' }} /></Box>) }}
            sx={{ '& .MuiOutlinedInput-root': { borderRadius: '14px', backgroundColor: '#F1F5F9', height: { xs: 42, sm: 44 }, '& .MuiOutlinedInput-notchedOutline': { border: { xs: 'none', sm: '1px solid rgba(0,0,0,0.12)' } }, '&.Mui-focused': { backgroundColor: '#fff', boxShadow: { xs: '0 0 0 2px #523F99', sm: 'none' } }, '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#523F99', borderWidth: 2 } }, '& .MuiOutlinedInput-input': { fontSize: '0.875rem' } }}
          />
        </Box>

        {rows.length > 0 ? (
          <DataGrid autoHeight rows={rows} columns={columns} getRowId={row => row.id} pagination sortingMode='server'
            columnVisibilityModel={{
              signed_date: !isMobileView,
              waiver_title: !isMobileView,
              viewCheckIn: !isMobileView,
            }}
            sx={{ border: 'none', flex: 1, '& .MuiDataGrid-columnHeaders': { backgroundColor: '#F8FAFC', borderTop: '1px solid rgba(0,0,0,0.06)', borderBottom: '1px solid rgba(0,0,0,0.06)' }, '& .MuiDataGrid-columnHeaderTitle': { fontSize: '0.75rem', fontWeight: 600, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.5px' }, '& .MuiDataGrid-cell': { borderBottom: '1px solid rgba(0,0,0,0.04)', fontSize: '0.8125rem' }, '& .MuiDataGrid-row:hover': { backgroundColor: 'rgba(82,63,153,0.02)' } }}
            slotProps={{ baseButton: { size: 'medium', variant: 'tonal' }, toolbar: { csvOptions: { disableToolbarButton: true }, printOptions: { disableToolbarButton: true }, showQuickFilter: true, quickFilterProps: { debounceMs: 1000 } } } as any}
          />
        ) : (
          <Box sx={{ py: { xs: 5, sm: 8 }, px: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', borderTop: '1px solid rgba(0,0,0,0.06)', flex: 1 }}>
            <Box sx={{ width: { xs: 72, sm: 100 }, height: { xs: 72, sm: 100 }, borderRadius: '50%', backgroundColor: '#F0ECFA', display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 3 }}>
              <i className='tabler-signature' style={{ fontSize: '1.75rem', color: '#523F99' }} />
            </Box>
            <Typography sx={{ fontSize: { xs: '1rem', sm: '1.125rem' }, fontWeight: 700, color: '#1E293B', mb: 0.5 }}>No signed waivers yet</Typography>
            <Typography sx={{ fontSize: { xs: '0.8125rem', sm: '0.875rem' }, color: '#94A3B8', textAlign: 'center', maxWidth: 300, lineHeight: 1.6 }}>Signed waivers will appear here.</Typography>
          </Box>
        )}
      </div>

      <Dialog open={openModal} onClose={() => setOpenModal(false)} fullWidth maxWidth='md' PaperProps={{ sx: { borderRadius: '16px' } }}>
        <DialogTitle sx={{ fontWeight: 700, color: '#1E293B', fontSize: '1.125rem' }}>Check-in Records</DialogTitle>
        <DialogContent>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: '#F8FAFC' }}>
                {['Date', 'Check-in By', 'Notes', 'Action'].map(h => (
                  <TableCell key={h} sx={{ fontWeight: 600, fontSize: '0.75rem', color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{h}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {selectedCheckIn?.check_ins?.map((check: any, index: number) => (
                <TableRow key={index} sx={{ '&:hover': { backgroundColor: 'rgba(82,63,153,0.02)' } }}>
                  <TableCell sx={{ fontSize: '0.8125rem' }}>{format(new Date(check.date), 'yyyy/M/d H:mm')}</TableCell>
                  <TableCell sx={{ fontSize: '0.8125rem' }}>{check.email}</TableCell>
                  <TableCell sx={{ fontSize: '0.8125rem' }}>{check.notes}</TableCell>
                  <TableCell>
                    <Button size='small' sx={{ textTransform: 'none', color: '#523F99', fontWeight: 600 }}>Edit</Button>
                    <Button size='small' sx={{ textTransform: 'none', color: '#EF4444', fontWeight: 600 }}>Delete</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2.5 }}>
          <Button onClick={() => setOpenModal(false)} sx={{ borderRadius: '10px', textTransform: 'none', fontWeight: 600, color: '#475569' }}>Close</Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}

export default SignedWaiverTable
