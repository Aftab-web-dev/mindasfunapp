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
    <>
      <>
        <Card>
          <CardHeader
            title='Event List'
            action={
              <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                <TextField size='small' placeholder='Search...' value={''} onChange={() => {}} />
                <Button
                  size='medium'
                  variant='contained'
                  component={Link}
                  href={`/admin/events/add-event`}
                  style={{ color: '#ffffff' }}
                >
                  Book Event
                </Button>
              </Box>
            }
          />
          <DataGrid
            autoHeight
            rows={rows || []}
            columns={columns}
            getRowId={row => row.id}
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
            deleteFunction={deleteEventData}
          />
        )}
      </>
    </>
  )
}

export default EventTable
