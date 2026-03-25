'use client'

import {  useState } from 'react'

import Link from 'next/link'

// import { useRouter } from 'next/navigation'

import { Box, Button, Card, CardHeader, IconButton, TextField, Tooltip, Typography } from '@mui/material'

import { DataGrid } from '@mui/x-data-grid'
import type { GridColDef } from '@mui/x-data-grid'

// import { useDebounce } from 'react-use'
import { Icon } from '@iconify/react/dist/iconify.js'

// import axios from 'axios'

// import { reqData } from '../../../../../../fake-db/apps/data'

// type SortType = 'asc' | 'desc' | undefined | null

const ReqEventTable = () => {
  // const router = useRouter()

  // const [total, setTotal] = useState<number>(0)
  // const buttonRef = useRef<HTMLButtonElement>(null)

  const [rows] = useState<any[]>([])

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

  // const fetchTableData = useCallback(
  //   async () => {
  //     try {
  //       await PeopleApi.getAll({
         
  //       }).then(res => {
  //         setTotal(res.data.data?.totalCount)
  //         setRows(res.data.data?.peoples)
  //       })
  //       setRows(reqData)
  //     } catch (err) {
        // const axiosError = err as any
        // if (axiosError.response && axiosError.response.status === 401) {
        //   // toast.error('Access Token Expired')
        //   router.push('/login')
        // } else {
        // }
  //     }
  //   },
  //   [] // Dependency array added
  // )

  // useEffect(() => {
  //   fetchTableData()
  // }, [fetchTableData])

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
                {new Date(row.event_date).toLocaleDateString()}
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
          <Tooltip title='Edit'>
            <IconButton size='small' component={Link} href={`/admin/events/edit-event/${row._id}`}>
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
      </>
    </>
  )
}

export default ReqEventTable
