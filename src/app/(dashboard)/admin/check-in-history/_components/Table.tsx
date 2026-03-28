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
      flex: 1,
      minWidth: 160,
      field: 'date',
      headerName: 'Date & Time',
      sortable: false,
      disableColumnMenu: true,
      renderCell: (params: any) => {
        const { row } = params

        const rawDate = row.check_date
        const date = rawDate ? new Date(rawDate) : null
        const formatted = date ? format(date, 'MMM d yyyy h:mm a') : 'N/A'

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
      renderCell: (params: any) => {
        const { row } = params

        return (
          <Box sx={{ display: 'flex', alignItems: 'center', height: '100%' }}>
            <Typography noWrap variant='body2' sx={{ color: 'text.primary', fontWeight: 600 }}>
              {row.checker_email}
            </Typography>
          </Box>
        )
      }
    },

    {
      flex: 1,
      minWidth: 130,
      field: 'customer_name',
      headerName: 'Customer',
      sortable: false,
      disableColumnMenu: true,
      renderCell: (params: any) => {
        const { row } = params

        return (
          <Box sx={{ display: 'flex', alignItems: 'center', height: '100%' }}>
            <Typography noWrap variant='body2' sx={{ color: 'text.primary', fontWeight: 600 }}>
              {row.customer_details.name}
            </Typography>
          </Box>
        )
      }
    },

    {
      flex: 0,
      minWidth: 50,
      field: 'code',
      headerName: 'PDF',
      sortable: false,
      disableColumnMenu: true,
      renderCell: () => {
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
      flex: 0,
      minWidth: 100,
      sortable: false,
      field: 'actions',
      headerName: 'Actions',
      disableColumnMenu: true,
      renderCell: ({}) => (
        <Box sx={{ display: 'flex', alignItems: 'center', height: '100%' }}>
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
          <DataGrid autoHeight rows={rows} columns={columns} getRowId={row => row._id} pagination sortingMode='server'
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
    </div>
  )
}

export default CheckInHistoryTable
