'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

import { format } from 'date-fns'

import { Box, IconButton, TextField, Tooltip, Typography } from '@mui/material'

import { DataGrid } from '@mui/x-data-grid'
import type { GridColDef } from '@mui/x-data-grid'

import { Icon } from '@iconify/react/dist/iconify.js'
import toast from 'react-hot-toast'

import { waiverApi } from '@/api/waiver-api'
import { getUser } from '@/utils/authStorage'
import DeleteConfirmationDialog from '@/components/DeleteConfimationDialogBox'

const CheckInHistoryTable = () => {
  const buttonRef = useRef<HTMLButtonElement>(null)

  const [rows, setRows] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  const [openDeleteDialog, setOpenDeleteDialog] = useState(false)
  const [dialogId, setDialogId] = useState<number | string>('')
  const [dialogName, setDialogName] = useState('')

  const fetchTableData = useCallback(async () => {
    setLoading(true)

    try {
      const res = await waiverApi.getAllSignedWaiver()

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

  const openDeleteFlow = (id: number | string, name: string) => {
    setDialogId(id)
    setDialogName(name)
    setOpenDeleteDialog(true)
  }

  const deleteRecord = async (id: number | string) => {
    if (buttonRef.current) buttonRef.current.disabled = true

    try {
      const user = getUser()

      await waiverApi.deleteSignedWaiver({ id: Number(id), empId: user?.employeeId })
      toast.success('Record deleted')
      fetchTableData()
    } catch (err) {
      toast.error('Failed to delete record')
    } finally {
      setOpenDeleteDialog(false)
    }
  }

  const downloadPdf = async (ledgerId: number, waiverId: number, nameForFile?: string) => {
    try {
      const response = await waiverApi.downloadSignedWaiver({ ledgerId, waiverId })
      const blob = new Blob([response.data], { type: 'application/pdf' })
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')

      link.href = url
      link.setAttribute('download', `${nameForFile || 'signed-waiver'}.pdf`)
      document.body.appendChild(link)
      link.click()
      link.remove()
      window.URL.revokeObjectURL(url)
    } catch (err) {
      toast.error('Failed to download PDF')
    }
  }

  const columns: GridColDef<any>[] = [
    {
      flex: 1,
      minWidth: 180,
      field: 'date',
      headerName: 'Date & Time',
      sortable: false,
      disableColumnMenu: true,
      renderCell: (params: any) => {
        const raw = params.row.createdOn || params.row.checkInDate || params.row.check_date
        const d = raw ? new Date(raw) : null
        const formatted = d ? format(d, 'MMM d yyyy h:mm a') : 'N/A'

        return (
          <Box sx={{ display: 'flex', alignItems: 'center', height: '100%' }}>
            <Typography noWrap variant='body2' sx={{ color: 'text.primary', fontWeight: 600 }}>
              {formatted}
            </Typography>
          </Box>
        )
      }
    },
    {
      flex: 1,
      minWidth: 140,
      field: 'checker',
      headerName: 'Check-in By',
      sortable: false,
      disableColumnMenu: true,
      renderCell: (params: any) => (
        <Box sx={{ display: 'flex', alignItems: 'center', height: '100%' }}>
          <Typography noWrap variant='body2' sx={{ color: 'text.primary', fontWeight: 600 }}>
            {params.row.checkInByName || params.row.createdByName || params.row.createdBy || '—'}
          </Typography>
        </Box>
      )
    },
    {
      flex: 1,
      minWidth: 160,
      field: 'customer_name',
      headerName: 'Customer',
      sortable: false,
      disableColumnMenu: true,
      renderCell: (params: any) => (
        <Box sx={{ display: 'flex', alignItems: 'center', height: '100%' }}>
          <Typography noWrap variant='body2' sx={{ color: 'text.primary', fontWeight: 600 }}>
            {params.row.name || params.row.customerName || params.row.ledgerName || '—'}
          </Typography>
        </Box>
      )
    },
    {
      flex: 0,
      minWidth: 80,
      field: 'pdf',
      headerName: 'PDF',
      sortable: false,
      disableColumnMenu: true,
      renderCell: ({ row }) => (
        <Tooltip title='Download PDF'>
          <IconButton
            size='small'
            onClick={() =>
              downloadPdf(
                Number(row.ledgerId),
                Number(row.waverId ?? row.wId ?? row.waiverId),
                row.name || row.customerName
              )
            }
          >
            <i className='tabler-file-type-pdf' style={{ fontSize: '1.125rem', color: '#EF4444' }} />
          </IconButton>
        </Tooltip>
      )
    },
    {
      flex: 0,
      minWidth: 100,
      sortable: false,
      field: 'actions',
      headerName: 'Actions',
      disableColumnMenu: true,
      renderCell: ({ row }) => (
        <Box sx={{ display: 'flex', alignItems: 'center', height: '100%' }}>
          <Tooltip title='Delete'>
            <IconButton
              onClick={() => openDeleteFlow(row.id, row.name || row.customerName || 'record')}
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
      <div className='rounded-2xl border border-[rgba(0,0,0,0.06)] bg-white min-h-[calc(100vh-120px)] flex flex-col overflow-hidden'>
        <Box sx={{ px: { xs: 3, sm: 4, md: 5 }, pt: { xs: 3, sm: 3, md: 4 }, pb: 2.5 }}>
          <Box sx={{ mb: 2.5 }}>
            <Typography sx={{ fontSize: '1.125rem', fontWeight: 700, color: '#1E293B' }}>Check-in History</Typography>
            <Typography sx={{ fontSize: '0.8125rem', color: '#94A3B8', fontWeight: 500, mt: 0.25 }}>Track all customer check-in activity</Typography>
          </Box>
          <TextField
            fullWidth size='small' placeholder='Search by customer name, email...'
            InputProps={{ startAdornment: (<Box sx={{ mr: 1.5, display: 'flex', color: '#94A3B8' }}><i className='tabler-search' style={{ fontSize: '1rem' }} /></Box>) }}
            sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px', backgroundColor: '#F8FAFC', height: 44, '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(82,63,153,0.3)' }, '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#523F99', borderWidth: 2 } }, '& .MuiOutlinedInput-input': { fontSize: '0.875rem' } }}
          />
        </Box>

        {rows.length > 0 ? (
          <Box sx={{ overflow: 'auto', flex: 1 }}>
            <DataGrid
              autoHeight
              rows={rows}
              columns={columns}
              loading={loading}
              getRowId={row => row.id ?? row._id ?? `${row.ledgerId}-${row.waverId}`}
              pagination
              sortingMode='server'
              sx={{
                border: 'none',
                minWidth: 580,
                '& .MuiDataGrid-columnHeaders': { backgroundColor: '#F8FAFC', borderTop: '1px solid rgba(0,0,0,0.06)', borderBottom: '1px solid rgba(0,0,0,0.06)' },
                '& .MuiDataGrid-columnHeaderTitle': { fontSize: '0.75rem', fontWeight: 600, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.5px' },
                '& .MuiDataGrid-cell': { borderBottom: '1px solid rgba(0,0,0,0.04)', fontSize: '0.8125rem', py: 1.5 },
                '& .MuiDataGrid-row:hover': { backgroundColor: 'rgba(82,63,153,0.02)' },
                '& .MuiDataGrid-footerContainer': { borderTop: '1px solid rgba(0,0,0,0.06)' }
              }}
              slotProps={{ baseButton: { size: 'medium', variant: 'tonal' }, toolbar: { csvOptions: { disableToolbarButton: true }, printOptions: { disableToolbarButton: true }, showQuickFilter: true, quickFilterProps: { debounceMs: 1000 } } } as any}
            />
          </Box>
        ) : (
          <Box sx={{ py: { xs: 5, sm: 8 }, px: { xs: 2, sm: 3 }, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', borderTop: '1px solid rgba(0,0,0,0.06)', flex: 1 }}>
            <Box sx={{ width: 100, height: 100, borderRadius: '50%', backgroundColor: '#F0ECFA', display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 4 }}>
              <Box sx={{ width: 70, height: 70, borderRadius: '50%', backgroundColor: '#E4DDF5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <i className='tabler-checklist' style={{ fontSize: '2rem', color: '#523F99' }} />
              </Box>
            </Box>
            <Typography sx={{ fontSize: '1.125rem', fontWeight: 700, color: '#1E293B', mb: 1 }}>No check-in history</Typography>
            <Typography sx={{ fontSize: '0.875rem', color: '#94A3B8', textAlign: 'center', maxWidth: 320, lineHeight: 1.6 }}>Customer check-in records will appear here.</Typography>
          </Box>
        )}
      </div>

      {openDeleteDialog && (
        <DeleteConfirmationDialog
          id={dialogId as any}
          buttonRef={buttonRef}
          name={dialogName}
          open={true}
          setOpen={setOpenDeleteDialog}
          deleteFunction={deleteRecord}
        />
      )}
    </div>
  )
}

export default CheckInHistoryTable
