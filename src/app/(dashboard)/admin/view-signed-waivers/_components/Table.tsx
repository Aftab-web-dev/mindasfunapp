'use client'

import { useCallback, useEffect, useState } from 'react'

import { Box, Button, Card, CardHeader, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Table, TableBody, TableCell, TableHead, TableRow, TextField, Tooltip, Typography } from '@mui/material'

import { DataGrid } from '@mui/x-data-grid'
import type { GridColDef } from '@mui/x-data-grid'

import { Icon } from '@iconify/react/dist/iconify.js'

import { format } from 'date-fns'

import toast from 'react-hot-toast'

import { waiverApi } from "@/api/waiver-api"



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
      flex: 0.275,
      minWidth: 290,
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
      flex: 0.275,
      minWidth: 290,
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
      flex: 0.0,
      minWidth: 130,
      sortable: false,
      field: 'actions',
      headerName: 'Actions',
      disableColumnMenu: true,
      renderCell: ({}) => (
        <Box sx={{ display: 'flex', alignItems: 'center', height: '100%' }}>
          {/* <Tooltip title='View'>
            <IconButton size='small' component={Link} href={`#`}>
              <Icon icon='raphael:view' fontSize={20} />
            </IconButton>
          </Tooltip> */}
          {/* <Tooltip title='Edit'>
            <IconButton size='small' component={Link} href={`#`}>
              <Icon icon='tabler:edit' fontSize={20} />
            </IconButton>
          </Tooltip> */}
          <Tooltip title='Check-In'>
            <IconButton onClick={() => {}} size='small'>
              <Icon icon='tabler:checkbox' fontSize={20} />
            </IconButton>
          </Tooltip>
          <Tooltip title='Delete'>
            <IconButton onClick={() => {}} size='small'>
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
            title='Signed Waivers'
            action={
              <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                <TextField size='small' placeholder='Search...' value={''} onChange={() => {}} />
              </Box>
            }
          />
          <DataGrid
            autoHeight
            rows={rows || []}

            // rowCount={total}
            columns={columns}
            getRowId={row => row.id}
            pagination
            sortingMode='server'
            
            // paginationMode='server'

            // pageSizeOptions={[15, 50]}
            // paginationModel={paginationModel}
            // onPaginationModelChange={setPaginationModel}
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

                  // value: searchValue,
                  // clearSearch: () => handleSearch(''),
                  // onChange: (event: ChangeEvent<HTMLInputElement>) => handleSearch(event.target.value)
                }
              } as any
            }
          />
        </Card>
        {/* {openDeleteDialog && (
          <DeleteConfirmationDialog
            id={dialogId}
            buttonRef={buttonRef}
            name={dialogName}
            open={true}
            setOpen={setOpenDeleteDialog}
            deleteFunction={deletePeopleData}
          />
        )} */}
        <Dialog open={openModal} onClose={() => setOpenModal(false)} fullWidth maxWidth='md'>
          <DialogTitle>Check-in Records</DialogTitle>
          <DialogContent>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Date</TableCell>
                  <TableCell>Check-in By</TableCell>
                  <TableCell>Notes</TableCell>
                  <TableCell>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {selectedCheckIn?.check_ins?.map((check: any, index: number) => (
                  <TableRow key={index}>
                    <TableCell>{format(new Date(check.date), 'yyyy/M/d H:mm')}</TableCell>
                    <TableCell>{check.email}</TableCell>
                    <TableCell>{check.notes}</TableCell>
                    <TableCell>
                      <Button size='small'>Edit</Button>
                      <Button size='small' color='error'>
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenModal(false)}>Close</Button>
          </DialogActions>
        </Dialog>
      </>
    </>
  )
}

export default SignedWaiverTable
