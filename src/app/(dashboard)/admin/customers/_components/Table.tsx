'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

import Link from 'next/link'

import { Box, Button, Card, CardHeader, IconButton, TextField, Tooltip, Typography } from '@mui/material'

import { DataGrid } from '@mui/x-data-grid'
import type { GridColDef } from '@mui/x-data-grid'

import { Icon } from '@iconify/react/dist/iconify.js'

import toast from 'react-hot-toast'

import { customerApi } from '@/api/customer-api'
import DeleteConfirmationDialog from '@/components/DeleteConfimationDialogBox'
import { getUser } from '@/utils/authStorage'

// type SortType = 'asc' | 'desc' | undefined | null

const CustomerTable = () => {
  const buttonRef = useRef<HTMLButtonElement>(null)

  const [rows, setRows] = useState<any[]>([])

  const [openDeleteDialog, setOpenDeleteDialog] = useState(false)
  const [dialogId, setDialogId] = useState('')

  const [dialogName, setDialogName] = useState('')

  const fetchTableData = useCallback(
    async () => {
      try {
        await customerApi.getAllCustomers().then(res => {
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

  const deleteCustomer = (id: any, name: any) => {
    setOpenDeleteDialog(true)
    setDialogId(id)
    setDialogName(name)
  }

  const deleteCustomerData = async (id: any) => {
    if (buttonRef.current) {
      buttonRef.current.disabled = true
    }

    try {
      const user = getUser()

      await customerApi.deleteCustomer({ id: id, EmpId: user?.employeeId })

      toast.success('Waiver deleted successfully')

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
      flex: 1,
      minWidth: 120,
      field: 'name',
      headerName: 'Name',
      sortable: false,
      disableColumnMenu: true,
      renderCell: (params: any) => {
        const { row } = params

        return (
          <Box sx={{ display: 'flex', alignItems: 'center', height: '100%' }}>
            <Box sx={{ minWidth: 0 }}>
              <Typography noWrap variant='body2' sx={{ color: 'text.primary', fontWeight: 600 }}>
                {row.ledgerName}
              </Typography>
              <Typography noWrap variant='caption' sx={{ color: '#94A3B8', display: { xs: 'block', sm: 'none' } }}>
                {row.mobile}
              </Typography>
            </Box>
          </Box>
        )
      }
    },

    {
      flex: 0.5,
      minWidth: 120,
      field: 'phone',
      headerName: 'Phone',
      sortable: false,
      disableColumnMenu: true,
      renderCell: (params: any) => {
        const row = params.row

        return (
          <Box sx={{ display: 'flex', alignItems: 'center', height: '100%' }}>
            <Typography noWrap variant='body2' sx={{ color: 'text.primary', fontWeight: 600 }}>
              {row.mobile}
            </Typography>
          </Box>
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
          <Tooltip title='Edit'>
            <IconButton size='small' component={Link} href={`/admin/customers/edit-customer/${row.ledgerId}`}>
              <Icon icon='tabler:edit' fontSize={18} />
            </IconButton>
          </Tooltip>
          <Tooltip title='Delete'>
            <IconButton
              onClick={() => {
                deleteCustomer(row.ledgerId, row.ledgerName)
              }}
              size='small'
            >
              <Icon icon='tabler:trash' fontSize={18} />
            </IconButton>
          </Tooltip>
        </Box>
      )
    }
  ]

  return (
    <div className='max-w-6xl mx-auto px-2 sm:px-4 py-3 sm:py-6 min-h-[calc(100vh-64px)]'>
      <div className='rounded-none sm:rounded-2xl border-0 sm:border sm:border-[rgba(0,0,0,0.06)] bg-white overflow-hidden min-h-[calc(100vh-120px)] flex flex-col'>
        <Box sx={{ px: { xs: 2, sm: 4, md: 5 }, pt: { xs: 2.5, sm: 3, md: 4 }, pb: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Box>
              <Typography sx={{ fontSize: { xs: '1.125rem', sm: '1.25rem' }, fontWeight: 700, color: '#1E293B' }}>Customers</Typography>
              <Typography sx={{ fontSize: { xs: '0.6875rem', sm: '0.8125rem' }, color: '#94A3B8', fontWeight: 500, mt: 0.25 }}>
                {rows.length > 0 ? `${rows.length} customers` : 'View and manage all customers'}
              </Typography>
            </Box>
            <Button
              variant='contained'
              component={Link}
              href='/admin/customers/add-customer'
              disableElevation
              startIcon={<i className='tabler-plus' style={{ fontSize: '0.875rem' }} />}
              sx={{ borderRadius: '10px', textTransform: 'none', fontWeight: 600, fontSize: '0.875rem', backgroundColor: '#523F99', color: '#FFFFFF', height: { xs: 36, sm: 40 }, px: { xs: 2, sm: 3 }, '&:hover': { backgroundColor: '#6B52C4' } }}
            >
              <Box component='span' sx={{ display: { xs: 'none', sm: 'inline' } }}>Add Customer</Box>
              <Box component='span' sx={{ display: { xs: 'inline', sm: 'none' } }}>Add</Box>
            </Button>
          </Box>
          <TextField
            fullWidth
            size='small'
            placeholder='Search by name, phone...'
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
                '&.Mui-focused': { backgroundColor: '#fff', boxShadow: { xs: '0 0 0 2px #523F99', sm: 'none' } },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#523F99', borderWidth: 2 },
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
            getRowId={row => row.ledgerId}
            pagination
            sortingMode='server'
            columnVisibilityModel={{ phone: typeof window !== 'undefined' ? window.innerWidth >= 640 : true }}
            sx={{
              border: 'none',
              '& .MuiDataGrid-columnHeaders': { backgroundColor: '#F8FAFC', borderTop: '1px solid rgba(0,0,0,0.06)', borderBottom: '1px solid rgba(0,0,0,0.06)' },
              '& .MuiDataGrid-columnHeaderTitle': { fontSize: '0.75rem', fontWeight: 600, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.5px' },
              '& .MuiDataGrid-cell': { borderBottom: '1px solid rgba(0,0,0,0.04)', fontSize: '0.8125rem' },
              '& .MuiDataGrid-row:hover': { backgroundColor: 'rgba(82,63,153,0.02)' },
            }}
            slotProps={{ baseButton: { size: 'medium', variant: 'tonal' }, toolbar: { csvOptions: { disableToolbarButton: true }, printOptions: { disableToolbarButton: true }, showQuickFilter: true, quickFilterProps: { debounceMs: 1000 } } } as any}
          />
        ) : (
          <Box sx={{ py: { xs: 5, sm: 8 }, px: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', borderTop: '1px solid rgba(0,0,0,0.06)', flex: 1 }}>
            <Box sx={{ width: { xs: 72, sm: 100 }, height: { xs: 72, sm: 100 }, borderRadius: '50%', backgroundColor: '#F0ECFA', display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 3 }}>
              <i className='tabler-users' style={{ fontSize: '1.75rem', color: '#523F99' }} />
            </Box>
            <Typography sx={{ fontSize: { xs: '1rem', sm: '1.125rem' }, fontWeight: 700, color: '#1E293B', mb: 0.5 }}>No customers yet</Typography>
            <Typography sx={{ fontSize: { xs: '0.8125rem', sm: '0.875rem' }, color: '#94A3B8', textAlign: 'center', maxWidth: 300, lineHeight: 1.6, mb: 3 }}>
              Start by adding your first customer.
            </Typography>
            <Button
              variant='contained'
              component={Link}
              href='/admin/customers/add-customer'
              disableElevation
              startIcon={<i className='tabler-plus' style={{ fontSize: '0.875rem' }} />}
              sx={{ borderRadius: '12px', textTransform: 'none', fontWeight: 600, backgroundColor: '#523F99', px: 4, py: 1.25, '&:hover': { backgroundColor: '#6B52C4' } }}
            >
              Add Customer
            </Button>
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
          deleteFunction={deleteCustomerData}
        />
      )}
    </div>
  )
}

export default CustomerTable
