'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

import Link from 'next/link'

import { useRouter } from 'next/navigation'

import {
  Box,
  Button,
  Chip,
  IconButton,
  Menu,
  MenuItem,
  TextField,
  Tooltip,
  Typography
} from '@mui/material'

import { Icon } from '@iconify/react/dist/iconify.js'

import toast from 'react-hot-toast'

import { waiverApi } from '@/api/waiver-api'
import DeleteConfirmationDialog from '@/components/DeleteConfimationDialogBox'
import { getUser } from '@/utils/authStorage'

const WaiverTable = () => {
  const router = useRouter()
  const buttonRef = useRef<HTMLButtonElement>(null)

  const [rows, setRows] = useState<any[]>([])
  const [search, setSearch] = useState('')
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false)
  const [dialogId, setDialogId] = useState('')
  const [dialogName, setDialogName] = useState('')

  const fetchTableData = useCallback(async () => {
    try {
      const res = await waiverApi.waiverList()

      setRows(res.data.data)
    } catch (err) {
      const axiosError = err as any

      if (axiosError.response && axiosError.response.status === 401) {
        toast.error('Access Token Expired')
        router.push('/login')
      } else {
        console.error('Internal Server Error')
      }
    }
  }, [])

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
      await waiverApi.deleteWaiver({ id: Number(id), modifiedBy: 1 })
      toast.success('Waiver deleted successfully')
      fetchTableData()
    } catch {
      toast.error('Error Deleting Data')
    } finally {
      setOpenDeleteDialog(false)
    }
  }

  const handleStatusChange = async (id: string, active: number) => {
    try {
      const user = getUser()
      const changeStatus = active === 1 ? 0 : 1

      await waiverApi.statusChange({ id: Number(id), modifiedBy: user?.employeeId, active: changeStatus })
      toast.success('Updated Successfully')
      fetchTableData()
    } catch (err) {
      toast.error((err as any).response?.data?.message || 'Something went wrong')
    }
  }

  const handleDownloadPDF = async (row: any) => {
    const { jsPDF } = await import('jspdf')
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

    doc.setFontSize(14)
    doc.setFont('helvetica', 'bold')
    doc.text(row.titile || 'Waiver', 20, y)
    y += sectionGap

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

    if (row.name === 1) { checkOverflow(); doc.setFont('helvetica', 'bold'); doc.text('Please fill your name:', 20, y); y += lineGap; doc.line(20, y, 90, y); doc.line(100, y, 170, y); y += sectionGap }
    if (row.dob === 1) { checkOverflow(); doc.setFont('helvetica', 'bold'); doc.text('Date of Birth (DD/MM/YYYY):', 20, y); y += lineGap; doc.line(20, y, 60, y); y += sectionGap }
    if (row.emailId === 1) { checkOverflow(); doc.setFont('helvetica', 'bold'); doc.text('Email:', 20, y); y += lineGap; doc.line(20, y, 170, y); y += sectionGap }
    if (row.address === 1) { checkOverflow(); doc.setFont('helvetica', 'bold'); doc.text('Address:', 20, y); y += lineGap; doc.line(20, y, 170, y); y += lineGap; doc.line(20, y, 170, y); y += sectionGap }
    if (row.phone === 1) { checkOverflow(); doc.setFont('helvetica', 'bold'); doc.text('Phone number:', 20, y); y += lineGap; doc.line(20, y, 170, y); y += sectionGap }
    if (row.signature === 1) { checkOverflow(); doc.setFont('helvetica', 'bold'); doc.text('Your signature:', 20, y); y += lineGap; doc.setFillColor('#dcdcdc' as any); doc.rect(20, y, 170, 40, 'F'); y += 50 }

    doc.setFontSize(10)
    doc.setTextColor(150)
    doc.text('MidasFun\u00A9', 105, 285, { align: 'center' })

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

  // Action menu state
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

  // Filtered rows
  const filteredRows = rows.filter(row =>
    (row.titile || '').toLowerCase().includes(search.toLowerCase())
  )

  // Count fields enabled in a waiver
  const getFieldCount = (row: any) => {
    let count = 0

    if (row.name === 1) count++
    if (row.dob === 1) count++
    if (row.emailId === 1) count++
    if (row.address === 1) count++
    if (row.phone === 1) count++
    if (row.signature === 1) count++
    if (row.file === 1) count++

    return count
  }

  return (
    <Box sx={{ maxWidth: 900, mx: 'auto', px: { xs: 2, sm: 3 }, py: { xs: 2, sm: 4 }, minHeight: 'calc(100vh - 64px)' }}>

      {/* Header - app style sticky top bar */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2.5 }}>
        <Box>
          <Typography sx={{ fontSize: { xs: '1.25rem', sm: '1.5rem' }, fontWeight: 800, color: '#1E293B' }}>
            Waivers
          </Typography>
          <Typography sx={{ fontSize: '0.75rem', color: '#94A3B8', fontWeight: 500 }}>
            {rows.length} template{rows.length !== 1 ? 's' : ''}
          </Typography>
        </Box>
        <Button
          variant='contained'
          component={Link}
          href='/admin/waiver-template/add'
          disableElevation
          sx={{
            borderRadius: '12px',
            textTransform: 'none',
            fontWeight: 600,
            fontSize: '0.875rem',
            backgroundColor: '#523F99',
            color: '#fff',
            height: { xs: 40, sm: 42 },
            px: { xs: 2.5, sm: 3 },
            minWidth: 0,
            '&:hover': { backgroundColor: '#6B52C4' },
          }}
        >
          <i className='tabler-plus' style={{ fontSize: '1rem', marginRight: 6 }} />
          Add
        </Button>
      </Box>

      {/* Search bar */}
      <TextField
        fullWidth
        size='small'
        placeholder='Search templates...'
        value={search}
        onChange={e => setSearch(e.target.value)}
        InputProps={{
          startAdornment: (
            <Box sx={{ mr: 1, display: 'flex', color: '#94A3B8' }}>
              <i className='tabler-search' style={{ fontSize: '1.125rem' }} />
            </Box>
          ),
        }}
        sx={{
          mb: 2.5,
          '& .MuiOutlinedInput-root': {
            borderRadius: '14px',
            backgroundColor: '#F1F5F9',
            height: 46,
            border: 'none',
            '& .MuiOutlinedInput-notchedOutline': { border: 'none' },
            '&.Mui-focused': { backgroundColor: '#fff', boxShadow: '0 0 0 2px #523F99' },
          },
          '& .MuiOutlinedInput-input': { fontSize: '0.9375rem' },
        }}
      />

      {/* Cards */}
      {filteredRows.length > 0 ? (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
          {filteredRows.map((row) => (
            <Box
              key={row.waverId}
              sx={{
                borderRadius: '16px',
                backgroundColor: '#fff',
                boxShadow: '0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)',
                overflow: 'hidden',
                transition: 'box-shadow 0.2s ease',
                '&:active': { transform: 'scale(0.995)' },
                '&:hover': { boxShadow: '0 4px 12px rgba(0,0,0,0.08)' },
              }}
            >
              {/* Main content area */}
              <Box
                sx={{ p: { xs: 2, sm: 2.5 }, display: 'flex', alignItems: 'center', gap: 1.5, cursor: 'pointer' }}
                onClick={() => router.push(`/waiver-check-in/${row.waverId}`)}
              >
                {/* Icon */}
                <Box
                  sx={{
                    width: 44,
                    height: 44,
                    borderRadius: '12px',
                    background: row.active
                      ? 'linear-gradient(135deg, rgba(82,63,153,0.12), rgba(82,63,153,0.06))'
                      : '#F1F5F9',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <i className='tabler-file-check' style={{ fontSize: '1.25rem', color: row.active ? '#523F99' : '#94A3B8' }} />
                </Box>

                {/* Title + subtitle */}
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography sx={{ fontSize: '0.9375rem', fontWeight: 600, color: '#1E293B', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {row.titile}
                  </Typography>
                  <Typography sx={{ fontSize: '0.6875rem', color: '#94A3B8', fontWeight: 500, mt: 0.25 }}>
                    {getFieldCount(row)} field{getFieldCount(row) !== 1 ? 's' : ''}
                  </Typography>
                </Box>

                {/* Toggle */}
                <Box
                  onClick={(e) => { e.stopPropagation(); handleStatusChange(row.waverId, row.active) }}
                  sx={{
                    width: 48,
                    height: 28,
                    borderRadius: 14,
                    backgroundColor: row.active ? '#059669' : '#E2E8F0',
                    position: 'relative',
                    cursor: 'pointer',
                    transition: 'background-color 0.25s ease',
                    flexShrink: 0,
                  }}
                >
                  <Box
                    sx={{
                      width: 22,
                      height: 22,
                      borderRadius: '50%',
                      backgroundColor: '#fff',
                      boxShadow: '0 1px 3px rgba(0,0,0,0.15)',
                      position: 'absolute',
                      top: 3,
                      left: row.active ? 23 : 3,
                      transition: 'left 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                    }}
                  />
                </Box>

                {/* More actions */}
                <IconButton
                  size='small'
                  onClick={(e) => { e.stopPropagation(); handleMenuClick(e, row.waverId) }}
                  sx={{ color: '#94A3B8', flexShrink: 0 }}
                >
                  <Icon icon='tabler:dots-vertical' fontSize={20} />
                </IconButton>
              </Box>

              {/* Bottom bar: chips + QR */}
              <Box
                sx={{
                  px: { xs: 2, sm: 2.5 },
                  pb: { xs: 1.5, sm: 2 },
                  pt: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: 1,
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, flexWrap: 'wrap' }}>
                  {row.name === 1 && <Chip label='Name' size='small' sx={{ height: 24, fontSize: '0.6875rem', fontWeight: 600, backgroundColor: 'rgba(82,63,153,0.08)', color: '#523F99' }} />}
                  {row.emailId === 1 && <Chip label='Email' size='small' sx={{ height: 24, fontSize: '0.6875rem', fontWeight: 600, backgroundColor: 'rgba(6,182,212,0.08)', color: '#0891B2' }} />}
                  {row.phone === 1 && <Chip label='Phone' size='small' sx={{ height: 24, fontSize: '0.6875rem', fontWeight: 600, backgroundColor: 'rgba(245,158,11,0.08)', color: '#D97706' }} />}
                  {row.signature === 1 && <Chip label='Signature' size='small' sx={{ height: 24, fontSize: '0.6875rem', fontWeight: 600, backgroundColor: 'rgba(16,185,129,0.08)', color: '#059669' }} />}
                  {row.dob === 1 && <Chip label='DOB' size='small' sx={{ height: 24, fontSize: '0.6875rem', fontWeight: 600, backgroundColor: 'rgba(239,68,68,0.08)', color: '#DC2626' }} />}
                  {row.address === 1 && <Chip label='Address' size='small' sx={{ height: 24, fontSize: '0.6875rem', fontWeight: 600, backgroundColor: 'rgba(249,115,22,0.08)', color: '#EA580C' }} />}
                </Box>
                <Tooltip title='Download QR'>
                  <IconButton
                    size='small'
                    onClick={() => GenerateQR(row.waverId, row.titile)}
                    sx={{ color: '#94A3B8', '&:hover': { color: '#523F99' } }}
                  >
                    <i className='tabler-qrcode' style={{ fontSize: '1.125rem' }} />
                  </IconButton>
                </Tooltip>
              </Box>

              {/* Shared menu (rendered once per card) */}
              <Menu
                anchorEl={menuAnchorEl}
                open={menuRowId === row.waverId && Boolean(menuAnchorEl)}
                onClose={handleMenuClose}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                slotProps={{
                  paper: {
                    sx: { borderRadius: '14px', boxShadow: '0 8px 30px rgba(0,0,0,0.12)', minWidth: 200, py: 0.5 },
                  },
                }}
              >
                <MenuItem onClick={() => { navigator.clipboard.writeText(`${window.location.origin}/waiver-check-in/${row.waverId}`); toast.success('Link copied!'); handleMenuClose() }} sx={{ fontSize: '0.875rem', py: 1.5, gap: 1.5 }}>
                  <Icon icon='tabler:clipboard-list' fontSize={20} /> Copy Link
                </MenuItem>
                <MenuItem component={Link} target='_blank' href={`/waiver-check-in/${row.waverId}`} onClick={handleMenuClose} sx={{ fontSize: '0.875rem', py: 1.5, gap: 1.5 }}>
                  <Icon icon='raphael:view' fontSize={20} /> Preview
                </MenuItem>
                <MenuItem component={Link} href={`/admin/waiver-template/edit/${row.waverId}`} onClick={handleMenuClose} sx={{ fontSize: '0.875rem', py: 1.5, gap: 1.5 }}>
                  <Icon icon='tabler:edit' fontSize={20} /> Edit
                </MenuItem>
                <MenuItem component={Link} href={`/admin/waiver-template/add?waverId=${row.waverId}`} onClick={handleMenuClose} sx={{ fontSize: '0.875rem', py: 1.5, gap: 1.5 }}>
                  <Icon icon='tabler:copy-plus' fontSize={20} /> Clone
                </MenuItem>
                <MenuItem onClick={() => { handleMenuClose(); handleDownloadPDF(row) }} sx={{ fontSize: '0.875rem', py: 1.5, gap: 1.5 }}>
                  <Icon icon='tabler:file-type-pdf' fontSize={20} /> Download PDF
                </MenuItem>
                <Box sx={{ mx: 2, my: 0.5, borderTop: '1px solid rgba(0,0,0,0.06)' }} />
                <MenuItem onClick={() => { deleteWaiver(row.waverId, row.titile); handleMenuClose() }} sx={{ fontSize: '0.875rem', py: 1.5, gap: 1.5, color: '#EF4444' }}>
                  <Icon icon='tabler:trash' fontSize={20} /> Delete
                </MenuItem>
              </Menu>
            </Box>
          ))}
        </Box>
      ) : (
        <Box sx={{ py: 10, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <Box sx={{ width: 80, height: 80, borderRadius: '50%', backgroundColor: '#F0ECFA', display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 3 }}>
            <i className='tabler-file-check' style={{ fontSize: '2rem', color: '#523F99' }} />
          </Box>
          <Typography sx={{ fontSize: '1.125rem', fontWeight: 700, color: '#1E293B', mb: 0.5 }}>
            {search ? 'No results' : 'No templates yet'}
          </Typography>
          <Typography sx={{ fontSize: '0.875rem', color: '#94A3B8', textAlign: 'center', maxWidth: 280, lineHeight: 1.6, mb: 3 }}>
            {search ? 'Try a different search term.' : 'Create your first waiver to get started.'}
          </Typography>
          {!search && (
            <Button
              variant='contained'
              component={Link}
              href='/admin/waiver-template/add'
              disableElevation
              sx={{ borderRadius: '12px', textTransform: 'none', fontWeight: 600, backgroundColor: '#523F99', px: 4, py: 1.25, '&:hover': { backgroundColor: '#6B52C4' } }}
            >
              Create Template
            </Button>
          )}
        </Box>
      )}

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
    </Box>
  )
}

export default WaiverTable
