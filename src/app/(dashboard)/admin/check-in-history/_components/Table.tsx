'use client'

import { useCallback, useEffect, useState } from 'react'

import Link from 'next/link'

import { format } from 'date-fns'


// import { useRouter } from 'next/navigation'

import { Box, Card, CardHeader, IconButton, TextField, Tooltip, Typography } from '@mui/material'

import { DataGrid } from '@mui/x-data-grid'
import type { GridColDef } from '@mui/x-data-grid'

// import { useDebounce } from 'react-use'
import { Icon } from '@iconify/react/dist/iconify.js'


import { historyCheckIn } from '@/fake-db/apps/data'

// import axios from 'axios'

// type SortType = 'asc' | 'desc' | undefined | null

const CheckInHistoryTable = () => {
  // const router = useRouter()

  // const [total, setTotal] = useState<number>(0)
  // const buttonRef = useRef<HTMLButtonElement>(null)

  const [rows, setRows] = useState<any[]>([])

  // const [openDeleteDialog, setOpenDeleteDialog] = useState(false)
  // const [dialogId, setDialogId] = useState('')

  // const [dialogName, setDialogName] = useState('')

  // //setTotal
  // const [searchValue, setSearchValue] = useState<string>('')

  // const [paginationModel, setPaginationModel] = useState({
  //   page: 0,
  //   pageSize: 15
  // })

  // const query = useDebounce(searchValue, 1000)

  const fetchTableData = useCallback(
    async () => {
      try {
        // await PeopleApi.getAll({
        //   query: { sort, q, page: paginationModel.page + 1 }
        // }).then(res => {
        //   setTotal(res.data.data?.totalCount)
        //   setRows(res.data.data?.peoples)
        // })
        setRows(historyCheckIn)
      } catch (err) {
        // const axiosError = err as any
        // if (axiosError.response && axiosError.response.status === 401) {
        //   // toast.error('Access Token Expired')
        //   router.push('/login')
        // } else {
        // }
      }
    },
    [] // Dependency array added
  )

  useEffect(() => {
    fetchTableData()
  }, [fetchTableData])

  // const handleSearch = (value: string) => {
  //   setSearchValue(value)
  // }

  // //Delete section
  // const deletePeople = (id: any, name: any) => {
  //   setOpenDeleteDialog(true)
  //   setDialogId(id)
  //   setDialogName(name)
  // }

  // //People Delete function
  // const deletePeopleData = async (id: any) => {
  //   if (buttonRef.current) {
  //     buttonRef.current.disabled = true
  //   }

  // try {
  //   const response = await PeopleApi.delete(id)
  //   // toast.success(response?.data?.message)
  //   fetchTableData('asc', query)
  // } catch (error) {
  //   if (axios.isAxiosError(error)) {
  //     if (error.response) {
  //       // toast.error(error.response.data.message)
  //     } else {
  //       // toast.error('An error occurred.')
  //     }
  //   } else {
  //     // toast.error('An unexpected error occurred.')
  //   }
  //   if (buttonRef.current) {
  //     buttonRef.current.disabled = false
  //   }
  // } finally {
  //   setOpenDeleteDialog(false)
  // }

  // const [openModal, setOpenModal] = useState(false)
  // const [selectedCheckIn, setSelectedCheckIn] = useState<any | null>(null)

  // const handleViewCheckIn = (row: any) => {
  //   setSelectedCheckIn(row)
  //   setOpenModal(true)
  // }

  const columns: GridColDef<any>[] = [
    {
      flex: 0.275,
      minWidth: 290,
      field: 'date',
      headerName: ' Checked Date & Time',
      sortable: false,
      disableColumnMenu: true,
      renderCell: (params: any) => {
        const { row } = params

        const rawDate = row.check_date
        const date = rawDate ? new Date(rawDate) : null
        const formatted = date ? format(date, 'MMM d yyyy h:mm a') : 'N/A'

        return (
          <Box sx={{ display: 'flex', alignItems: 'center', height: '100%' }}>
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              <Typography noWrap variant='body2' sx={{ color: 'text.primary', fontWeight: 600 }}>
                {formatted}
              </Typography>
            </Box>
          </Box>
        )
      }
    },
    {
      flex: 0.275,
      minWidth: 290,
      field: 'checker',
      headerName: 'Check-in By',
      sortable: false,
      disableColumnMenu: true,
      renderCell: (params: any) => {
        const { row } = params

        return (
          <Box sx={{ display: 'flex', alignItems: 'center', height: '100%' }}>
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              <Typography noWrap variant='body2' sx={{ color: 'text.primary', fontWeight: 600 }}>
                {row.checker_email}
              </Typography>
            </Box>
          </Box>
        )
      }
    },

    {
      flex: 0.275,
      minWidth: 290,
      field: 'customer_name',
      headerName: 'Customer Name',
      sortable: false,
      disableColumnMenu: true,
      renderCell: (params: any) => {
        const { row } = params

        return (
          <Box sx={{ display: 'flex', alignItems: 'center', height: '100%' }}>
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              <Typography noWrap variant='body2' sx={{ color: 'text.primary', fontWeight: 600 }}>
                {row.customer_details.name}
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
      renderCell: () =>
        // params: any "its inside the renderCell function Brackt"
        {
          // const { row } = params

          return (
            <Tooltip title='Click to download'>
              <Box sx={{ display: 'flex', alignItems: 'center', height: '100%', cursor: 'pointer' }}>
                <i className='tabler-file-type-pdf' />
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
          <Tooltip title='Edit'>
            <IconButton size='small' component={Link} href={`#`}>
              <Icon icon='tabler:edit' fontSize={20} />
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
            title='Check-in History'
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
            getRowId={row => row._id}
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
        {/* <Dialog open={openModal} onClose={() => setOpenModal(false)} fullWidth maxWidth='md'>
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
        </Dialog> */}
      </>
    </>
  )
}

export default CheckInHistoryTable
