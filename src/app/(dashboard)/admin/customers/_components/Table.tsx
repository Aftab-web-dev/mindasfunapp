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
                {row.ledgerName}
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
                {row.mobile}
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
          {/* <Tooltip title='View'>
            <IconButton size='small' component={Link} href={`{`/admin/customers/${row._id}`}`}>
              <Icon icon='raphael:view' fontSize={20} />
            </IconButton>
          </Tooltip> */}
          <Tooltip title='Edit'>
            <IconButton size='small' component={Link} href={`/admin/customers/edit-customer/${row.ledgerId}`}>
              <Icon icon='tabler:edit' fontSize={20} />
            </IconButton>
          </Tooltip>
          <Tooltip title='Delete'>
            <IconButton
              onClick={() => {
                deleteCustomer(row.ledgerId, row.ledgerName)
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
    <>
      <>
        <Card>
          <CardHeader
            title='Customers List'
            action={
              <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                <TextField size='small' placeholder='Search...' value={''} onChange={() => {}} />
                <Button
                  size='medium'
                  variant='contained'
                  component={Link}
                  href={`/admin/customers/add-customer`}
                  style={{ color: '#ffffff' }}
                >
                  Add Customer
                </Button>
              </Box>
            }
          />
          <DataGrid
            autoHeight
            rows={rows || []}
            columns={columns}
            getRowId={row => row.ledgerId}
            pagination
            sortingMode='server'
            slotProps={
              {
                baseButton: {
                  size: 'medium',
                  variant: 'tonal'
                },
                toolbar: {
                  csvOptions: { disableToolbarButton: true },
                  printOptions: { disableToolbarButton: true },
                  showQuickFilter: true,
                  quickFilterProps: { debounceMs: 1000 }
                }
              } as any
            }
          />
        </Card>
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
      </>
    </>
  )
}

export default CustomerTable
