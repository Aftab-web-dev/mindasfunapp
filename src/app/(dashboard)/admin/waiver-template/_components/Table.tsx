'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

import Link from 'next/link'

import { useRouter } from 'next/navigation'

import {
  Box,
  Button,
  Card,
  CardHeader,
  IconButton,
  Menu,
  MenuItem,
  Switch,
  TextField,
  Tooltip,
  Typography
} from '@mui/material'

import { DataGrid } from '@mui/x-data-grid'
import type { GridColDef } from '@mui/x-data-grid'

import { Icon } from '@iconify/react/dist/iconify.js'

import { jsPDF } from 'jspdf'

import toast from 'react-hot-toast'

import { waiverApi } from '@/api/waiver-api'
import DeleteConfirmationDialog from '@/components/DeleteConfimationDialogBox'
import { getUser } from '@/utils/authStorage'

const WaiverTable = () => {
  const router = useRouter()
  const buttonRef = useRef<HTMLButtonElement>(null)

  const [rows, setRows] = useState<any[]>([])

  const [openDeleteDialog, setOpenDeleteDialog] = useState(false)
  const [dialogId, setDialogId] = useState('')

  const [dialogName, setDialogName] = useState('')

  const fetchTableData = useCallback(
    async () => {
      try {
        await waiverApi
          .waiverList()

          .then(res => {
            setRows(res.data.data)
          })
      } catch (err) {
        const axiosError = err as any

        if (axiosError.response && axiosError.response.status === 401) {
          toast.error('Access Token Expired')
          router.push('/login')
        } else {
          console.error('Internal Server Error')
        }
      }
    },
    [] // Dependency array added
  )

  useEffect(() => {
    fetchTableData()
  }, [fetchTableData])

  const deleteWaiver = (id: any, name: any) => {
    setOpenDeleteDialog(true)
    setDialogId(id)
    setDialogName(name)
  }

  const deleteWaiverData = async (id: any) => {
    if (buttonRef.current) {
      buttonRef.current.disabled = true
    }

    try {
      // call API to delete waiver
      await waiverApi.deleteWaiver({ id: Number(id), modifiedBy: 1 })

      toast.success('Waiver deleted successfully')

      // refresh table
      fetchTableData()
    } catch (err) {
      toast.error('Error Deleting Data')
    } finally {
      setOpenDeleteDialog(false)
    }
  }

  const handleStatusChange = async (id: string, active: number) => {
    try {
      const user = getUser()

      const changeStatus = active === 1 ? 0 : 1

      await waiverApi.statusChange({ id: Number(id), modifiedBy: user?.employeeId, active : changeStatus })

      toast.success('Updated Successfully')
      fetchTableData()
    } catch (err) {
      toast.error((err as any).response.data.message || 'Something went wrong')
    }
  }

  const handleDownloadPDF = (row: any) => {
    const doc = new jsPDF()

    let y = 30
    const lineGap = 8
    const sectionGap = 14
    const pageHeight = 280

    const checkOverflow = () => {
      if (y > pageHeight) {
        doc.addPage()
        y = 30
      }
    }

    // ✅ TITLE (ALWAYS ON FIRST PAGE)
    doc.setFontSize(14)
    doc.setFont('helvetica', 'bold')
    doc.text(row.titile || 'Waiver', 20, y)
    y += sectionGap

    // ✅ DESCRIPTION (DRAWN LINE BY LINE — NO FORCED PAGE BREAK)
    if (row.description) {
      doc.setFontSize(12)
      doc.setFont('helvetica', 'normal')

      const descLines = doc.splitTextToSize(row.description, 170)

      descLines.forEach((line: string) => {
        checkOverflow()
        doc.text(line, 20, y)
        y += lineGap
      })

      y += sectionGap
    }

    // ✅ NAME
    if (row.name === 1) {
      checkOverflow()
      doc.setFont('helvetica', 'bold')
      doc.text('Please fill your name:', 20, y)
      y += lineGap
      doc.line(20, y, 90, y)
      doc.line(100, y, 170, y)
      y += sectionGap
    }

    // ✅ DOB
    if (row.dob === 1) {
      checkOverflow()
      doc.setFont('helvetica', 'bold')
      doc.text('Date of Birth (DD/MM/YYYY):', 20, y)
      y += lineGap
      doc.line(20, y, 60, y)
      y += sectionGap
    }

    // ✅ EMAIL
    if (row.emailId === 1) {
      checkOverflow()
      doc.setFont('helvetica', 'bold')
      doc.text('Email:', 20, y)
      y += lineGap
      doc.line(20, y, 170, y)
      y += sectionGap
    }

    // ✅ ADDRESS
    if (row.address === 1) {
      checkOverflow()
      doc.setFont('helvetica', 'bold')
      doc.text('Address:', 20, y)
      y += lineGap
      doc.line(20, y, 170, y)
      y += lineGap
      doc.line(20, y, 170, y)
      y += sectionGap
    }

    // ✅ PHONE
    if (row.phone === 1) {
      checkOverflow()
      doc.setFont('helvetica', 'bold')
      doc.text('Phone number:', 20, y)
      y += lineGap
      doc.line(20, y, 170, y)
      y += sectionGap
    }

    // ✅ SIGNATURE
    if (row.signature === 1) {
      checkOverflow()
      doc.setFont('helvetica', 'bold')
      doc.text('Your signature:', 20, y)
      y += lineGap
      doc.setFillColor('#dcdcdc' as any)
      doc.rect(20, y, 170, 40, 'F')
      y += 50
    }

    // ✅ FOOTER (LAST PAGE ONLY)
    doc.setFontSize(10)
    doc.setTextColor(150)
    doc.text('MidasFun©', 105, 285, { align: 'center' })

    // ✅ SAFE FILE NAME
    const safeTitle = row.titile?.replace(/[^a-z0-9]/gi, '_').toLowerCase() || 'waiver'

    doc.save(`waiver-${safeTitle}.pdf`)
  }

  function GenerateQR(id: string, title: string) {
    const link = `${window.location.origin}/waiver-check-in/${id}`

    import('qrcode').then(QRCode => {
      QRCode.toDataURL(link, { width: 300 }, (err: any, url: string) => {
        if (!err) {
          const a = document.createElement('a')

          a.href = url
          a.download = `waiver-${title}-qrcode.png`
          document.body.appendChild(a)
          a.click()
          document.body.removeChild(a)
        }
      })
    })
  }

  // State for action menu
  const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLElement>(null)
  const [menuRowId, setMenuRowId] = useState<string | null>(null)

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>, rowId: string) => {
    setMenuAnchorEl(event.currentTarget)
    setMenuRowId(rowId)
  }

  const handleMenuClose = () => {
    setMenuAnchorEl(null)
    setMenuRowId(null)
  }

  const columns: GridColDef<any>[] = [
    {
      flex: 0.275,
      minWidth: 290,
      field: 'title',
      headerName: 'Name',
      sortable: false,
      disableColumnMenu: true,
      renderCell: (params: any) => {
        const { row } = params

        return (
          <Button onClick={() => router.push(`/waiver-check-in/${row.waverId}`)} style={{ textTransform: 'none' }}>
            <Box  sx={{ display: 'flex', alignItems: 'center', height: '100%' }}>
              <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                <Typography noWrap variant='body2' sx={{ color: 'text.primary', fontWeight: 600 }}>
                  {row.titile}
                </Typography>
              </Box>
            </Box>
          </Button>
        )
      }
    },
    {
      flex: 0.275,
      minWidth: 200,
      field: 'active',
      headerName: 'Active',
      sortable: false,
      disableColumnMenu: true,
      renderCell: params => {
        const { row } = params

        return (
          <Switch
            checked={row.active}
            onChange={() => handleStatusChange(row.waverId, row.active)}
            inputProps={{ 'aria-label': 'controlled' }}
          />
        )
      }
    },
    {
      flex: 0.1,
      minWidth: 80,
      field: 'code',
      headerName: 'QR Code',
      sortable: false,
      disableColumnMenu: true,
      renderCell: (params: any) => {
        const { row } = params

        return (
          <Tooltip title='Click to download QR Code'>
            <Box sx={{ display: 'flex', alignItems: 'center', height: '100%', cursor: 'pointer' }}>
              <i className='tabler-qrcode' onClick={() => GenerateQR(row.waverId, row.titile)} />
            </Box>
          </Tooltip>
        )
      }
    },
    {
      flex: 0.0,
      minWidth: 80,
      sortable: false,
      field: 'actions',
      headerName: 'Actions',
      disableColumnMenu: true,
      renderCell: (params: any) => {
        const { row } = params

        return (
          <>
            <IconButton size='small' onClick={event => handleMenuClick(event, row.waverId)}>
              <Icon icon='tabler:dots-vertical' fontSize={20} />
            </IconButton>
            <Menu
              anchorEl={menuAnchorEl}
              open={menuRowId === row.waverId && Boolean(menuAnchorEl)}
              onClose={handleMenuClose}
              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
              transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
              <MenuItem
                onClick={() => {
                  const link = `${window.location.origin}/waiver-check-in/${row.waverId}`

                  navigator.clipboard.writeText(link)
                  handleMenuClose()
                }}
              >
                <Icon icon='tabler:clipboard-list' fontSize={18} style={{ marginRight: 8 }} />
                Copy Link
              </MenuItem>
              <MenuItem
                component={Link}
                target='_blank'
                href={`/waiver-check-in/${row.waverId}`}
                onClick={handleMenuClose}
              >
                <Icon icon='raphael:view' fontSize={18} style={{ marginRight: 8 }} />
                View
              </MenuItem>
              <MenuItem component={Link} href={`/admin/waiver-template/edit/${row.waverId}`} onClick={handleMenuClose}>
                <Icon icon='tabler:edit' fontSize={18} style={{ marginRight: 8 }} />
                Edit
              </MenuItem>
              <MenuItem
                component={Link}
                href={`/admin/waiver-template/add?waverId=${row.waverId}`}
                onClick={handleMenuClose}
              >
                <Icon icon='tabler:copy-plus' fontSize={18} style={{ marginRight: 8 }} />
                Clone
              </MenuItem>
              <MenuItem
                onClick={() => {
                  // Clone logic here
                  handleMenuClose()
                  handleDownloadPDF(row)
                }}
              >
                <Icon icon='tabler:file-type-pdf' fontSize={18} style={{ marginRight: 8 }} />
                Download PDF
              </MenuItem>
              <MenuItem
                onClick={() => {
                  // Open delete confirmation
                  deleteWaiver(row.waverId, row.titile)
                  handleMenuClose()
                }}
              >
                <Icon icon='tabler:trash' fontSize={18} style={{ marginRight: 8 }} />
                Delete
              </MenuItem>
            </Menu>
          </>
        )
      }
    }
  ]

  return (
    <>
        <Card>
          <CardHeader
            title='Waiver List'
            action={
              <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                <TextField size='small' placeholder='Search...' value={''} onChange={() => {}} />
                <Button
                  size='medium'
                  variant='contained'
                  component={Link}
                  href={`/admin/waiver-template/add`}
                  style={{ color: '#ffffff' }}
                >
                  Add Waiver Template
                </Button>
              </Box>
            }
          />
          <DataGrid
            autoHeight
            rows={rows || []}
            columns={columns}
            getRowId={(row : any) => row.waverId}
            pagination
            sortingMode='server'
            sx={{
              '& .MuiDataGrid-row': {
                cursor: 'pointer',
                '&:hover': {
                  backgroundColor: 'action.hover'
                }
              }
            }}
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
            deleteFunction={deleteWaiverData}
          />
        )}
        </>
      )
  
}

export default WaiverTable
