'use client'

import React, { useCallback, useState } from 'react'

import {
  Box,
  Button,
  Card,
  CardHeader,
  TextField,
  Typography,
  Collapse,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableContainer,
  Autocomplete,
  RadioGroup,
  FormControlLabel,
  Radio,
  FormControl,
  FormLabel
} from '@mui/material'
import { DataGrid } from '@mui/x-data-grid'
import type { GridColDef } from '@mui/x-data-grid'
import { Icon } from '@iconify/react/dist/iconify.js'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers'

import toast from 'react-hot-toast'

import { reportTypes, getReportColumns } from './reportConfig'
import { reportsApi } from '@/api/reports-api'
import { getUser } from '@/utils/authStorage'

const ReportsTable = () => {
  const [selectedReport, setSelectedReport] = useState<string>('')
  const [cashRevenueOption, setCashRevenueOption] = useState<'0' | '1'>('0')

  const [startDate, setStartDate] = useState<Date>(() => {
    const date = new Date()

    return new Date(date.getFullYear(), date.getMonth(), 1)
  })

  const [endDate, setEndDate] = useState<Date>(() => {
    const date = new Date()

    return new Date(date.getFullYear(), date.getMonth() + 1, 0)
  })

  const [rows, setRows] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [expandedRows, setExpandedRows] = useState<Record<string, boolean>>({})

  const formatDate = (date: Date) => {
    const yyyy = date.getFullYear()
    const mm = String(date.getMonth() + 1).padStart(2, '0')
    const dd = String(date.getDate()).padStart(2, '0')

    return `${yyyy}-${mm}-${dd}`
  }

  const handleApplyFilters = useCallback(async () => {
    if (!selectedReport) {
      toast.error('Please select a report type')

      return
    }

    setLoading(true)

    try {
      const storedUserData = getUser()
      const branchId = storedUserData?.branchId.toString()

      const params = {
        fTime: formatDate(startDate),
        tTime: formatDate(endDate),
        branchId
      }

      let response

      if (selectedReport === 'cashRevenueReport') {
        response = await reportsApi.cashRevenueReport({ ...params, option: cashRevenueOption })
      } else if (selectedReport === 'gameRevenueReport') {
        response = await reportsApi.gameRevenueReport(params)
      } else if (selectedReport === 'salesReport') {
        response = await reportsApi.salesReport(params)
      } else if (selectedReport === 'salesDetailsReport') {
        response = await reportsApi.salesDetailsReport(params)
      } else if (selectedReport === 'redeemptionReport') {
        response = await reportsApi.redeemptionReport(params)
      } else if (selectedReport === 'redemptionSalesReport') {
        response = await reportsApi.redemptionSalesReport(params)
      } else if (selectedReport === 'rechargeReport') {
        response = await reportsApi.rechargeReport(params)
      } else if (selectedReport === 'rechargeRevenueReport') {
        response = await reportsApi.rechargeRevenueReport(params)
      } else if (selectedReport === 'employeeGamePlayReport') {
        response = await reportsApi.employeeGamePlayReport(params)
      } else if (selectedReport === 'cardLiabilityReport') {
        response = await reportsApi.cardLiabilityReport(params)
      } else if (selectedReport === 'clearCardReport') {
        response = await reportsApi.clearCardReport(params)
      } else if (selectedReport === 'cardConsolidateReport') {
        response = await reportsApi.cardConsolidateReport(params)
      } else if (selectedReport === 'cardTransferReport') {
        response = await reportsApi.cardTransferReport(params)
      } else if (selectedReport === 'topPlayedGameReport') {
        response = await reportsApi.topPlayedGameReport(params)
      } else if (selectedReport === 'cardVoidReport') {
        response = await reportsApi.cardVoidReport(params)
      } else {
        throw new Error('Invalid report type')
      }

      // For SalesDetailsReport, group by id
      if (selectedReport === 'salesDetailsReport') {
        const grouped = groupSalesDetails(response.data || response)

        setRows(grouped)
      } else {
        setRows(response.data || response)
      }

      toast.success('Report loaded successfully')
    } catch (error) {
      console.error('Error fetching report:', error)
      toast.error('Error loading report')
      setRows([])
    } finally {
      setLoading(false)
    }
  }, [selectedReport, startDate, endDate, cashRevenueOption])

  const groupSalesDetails = (data: any[]) => {
    const grouped: Record<string, any> = {}

    data.forEach((item, index) => {
      if (!grouped[item.salesMasterId]) {
        grouped[item.salesMasterId] = {
          ...item,
          uniqueId: `parent-${item.salesMasterId}`,
          children: []
        }
      }

      grouped[item.salesMasterId].children.push({
        ...item,
        uniqueId: `child-${item.salesMasterId}-${index}`
      })
    })

    return Object.values(grouped)
  }

  const calculateTotals = () => {
    if (rows.length === 0) return {}

    const totals: Record<string, number> = {}

    const numericFields = getReportColumns(selectedReport, cashRevenueOption)
      .filter(col => col.type === 'number')
      .map(col => col.field)

    numericFields.forEach(field => {
      totals[field] = rows.reduce((sum, row) => {
        const value = parseFloat(row[field]) || 0

        return sum + value
      }, 0)
    })

    return totals
  }

  const renderNestedTable = (children: any[]) => {
    return (
      <TableContainer sx={{ backgroundColor: '#F8FAFC', borderRadius: '10px' }}>
        <Table size='small'>
          <TableHead>
            <TableRow sx={{ backgroundColor: '#F0ECFA' }}>
              {['Sl No', 'Item Code', 'Quantity', 'Sales Rate', 'Amount', 'Tax Amount', 'Discount', 'Net Amount'].map((h, i) => (
                <TableCell key={h} align={i > 1 ? 'right' : 'left'} sx={{ fontWeight: 600, fontSize: '0.75rem', color: '#523F99', textTransform: 'uppercase', letterSpacing: '0.5px', borderBottom: '1px solid rgba(82,63,153,0.1)' }}>
                  {h}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {children.map((child, idx) => (
              <TableRow key={child.uniqueId} sx={{ '&:hover': { backgroundColor: 'rgba(82,63,153,0.02)' } }}>
                <TableCell sx={{ fontSize: '0.8125rem', color: '#475569', borderBottom: '1px solid rgba(0,0,0,0.04)' }}>{idx + 1}</TableCell>
                <TableCell sx={{ fontSize: '0.8125rem', color: '#1E293B', fontWeight: 500, borderBottom: '1px solid rgba(0,0,0,0.04)' }}>{child.itemCode}</TableCell>
                {[child.quantity, child.salesRate, child.amount, child.taxAmount, child.discountAmount, child.netAmount].map((val, i) => (
                  <TableCell key={i} align='right' sx={{ fontSize: '0.8125rem', color: '#1E293B', borderBottom: '1px solid rgba(0,0,0,0.04)' }}>
                    {val}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    )
  }

  const columns: GridColDef<any>[] =
    selectedReport === 'salesDetailsReport'
      ? [
          {
            field: 'slNo',
            headerName: 'Sl No',
            width: 80,
            sortable: false,
            disableColumnMenu: true,
            renderCell: (params: any) => {
              return params.api.getAllRowIds().indexOf(params.id) + 1
            }
          },
          {
            field: 'expand',
            headerName: '',
            width: 70,
            sortable: false,
            disableColumnMenu: true,
            renderCell: (params: any) => {
              if (params.row.children && params.row.children.length > 0) {
                return (
                  <IconButton size='small' onClick={() => handleToggleDetailPanel(params.row.uniqueId)}>
                    <Icon icon={expandedRows[params.row.uniqueId] ? 'mdi:chevron-up' : 'mdi:chevron-down'} />
                  </IconButton>
                )
              }

              return null
            }
          },
          {
            field: 'entryDate',
            headerName: 'Date',
            flex: 0.15,
            minWidth: 120,
            sortable: false,
            disableColumnMenu: true
          },
          {
            field: 'invoice',
            headerName: 'Invoice',
            flex: 0.2,
            minWidth: 150,
            sortable: false,
            disableColumnMenu: true
          },
          {
            field: 'cusName',
            headerName: 'Customer',
            flex: 0.2,
            minWidth: 150,
            sortable: false,
            disableColumnMenu: true
          },
          {
            field: 'mobile',
            headerName: 'Mobile',
            flex: 0.15,
            minWidth: 120,
            sortable: false,
            disableColumnMenu: true
          },
          {
            field: 'totalQuantity',
            headerName: 'Total Qty',
            flex: 0.1,
            minWidth: 100,
            type: 'number',
            sortable: false,
            disableColumnMenu: true
          },
          {
            field: 'totalTax',
            headerName: 'Total Tax',
            flex: 0.1,
            minWidth: 100,
            type: 'number',
            sortable: false,
            disableColumnMenu: true
          },
          {
            field: 'totalDiscountAmount',
            headerName: 'Discount',
            flex: 0.1,
            minWidth: 100,
            type: 'number',
            sortable: false,
            disableColumnMenu: true
          },
          {
            field: 'totalNetAmount',
            headerName: 'Net Amount',
            flex: 0.15,
            minWidth: 120,
            type: 'number',
            sortable: false,
            disableColumnMenu: true
          }
        ]
      : [
          {
            field: 'slNo',
            headerName: 'Sl No',
            width: 80,
            sortable: false,
            align: 'left' as const,
            headerAlign: 'left' as const,
            disableColumnMenu: true,
            renderCell: (params: any) => {
              return params.api.getAllRowIds().indexOf(params.id) + 1
            }
          },
          ...getReportColumns(selectedReport, cashRevenueOption).map(col => ({
            field: col.field,
            headerName: col.headerName,
            flex: col.flex || 0.15,
            minWidth: col.minWidth || 120,
            type: col.type || 'string',
            sortable: false,
            disableColumnMenu: true,
            align: 'left' as const,
            headerAlign: 'left' as const
          }))
        ]

  const handleToggleDetailPanel = (rowId: string) => {
    setExpandedRows(prev => ({
      ...prev,
      [rowId]: !prev[rowId]
    }))
  }

  const totals = calculateTotals()

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <div className='max-w-6xl mx-auto px-2 sm:px-4 py-3 sm:py-6 min-h-[calc(100vh-64px)]'>
        <div className='rounded-none sm:rounded-2xl border-0 sm:border sm:border-[rgba(0,0,0,0.06)] bg-white min-h-[calc(100vh-120px)] flex flex-col overflow-hidden'>
          {/* Header */}
          <Box sx={{ px: { xs: 2, sm: 4, md: 5 }, pt: { xs: 2.5, sm: 3, md: 4 }, pb: 1.5 }}>
            <Typography sx={{ fontSize: { xs: '1.125rem', sm: '1.25rem' }, fontWeight: 700, color: '#1E293B' }}>Reports</Typography>
            <Typography sx={{ fontSize: { xs: '0.6875rem', sm: '0.8125rem' }, color: '#94A3B8', fontWeight: 500, mt: 0.25 }}>Generate and view business reports</Typography>
          </Box>

          {/* Filters Section */}
          <Box sx={{ px: { xs: 2, sm: 4, md: 5 }, pb: 2.5, borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
            <Box sx={{ display: 'flex', gap: 2, flexDirection: 'column' }}>
              <Autocomplete
                sx={{
                  width: '100%',
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '12px',
                    backgroundColor: '#F8FAFC',
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#523F99' }
                  }
                }}
                options={reportTypes}
                getOptionLabel={option => option.label}
                value={reportTypes.find(r => r.value === selectedReport) || null}
                onChange={(_, newValue) => {
                  setSelectedReport(newValue?.value || '')
                  setRows([])
                  setExpandedRows({})
                  setCashRevenueOption('0')
                }}
                renderInput={params => <TextField {...params} label='Select Report' size='small' />}
              />

              {selectedReport === 'cashRevenueReport' && (
                <FormControl component='fieldset'>
                  <FormLabel component='legend' sx={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748B' }}>
                    Report Type
                  </FormLabel>
                  <RadioGroup
                    row
                    value={cashRevenueOption}
                    onChange={e => setCashRevenueOption(e.target.value as '0' | '1')}
                  >
                    <FormControlLabel value='0' control={<Radio size='small' sx={{ '&.Mui-checked': { color: '#523F99' } }} />} label='Normal' />
                    <FormControlLabel value='1' control={<Radio size='small' sx={{ '&.Mui-checked': { color: '#523F99' } }} />} label='Detailed' />
                  </RadioGroup>
                </FormControl>
              )}

              <Box sx={{ display: 'flex', gap: 1.5 }}>
                <DatePicker
                  label='Start'
                  value={startDate}
                  onChange={newValue => setStartDate(newValue || new Date())}
                  slotProps={{
                    textField: {
                      size: 'small',
                      fullWidth: true,
                      sx: { flex: 1, '& .MuiOutlinedInput-root': { borderRadius: '12px', backgroundColor: '#F8FAFC', '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#523F99' } }, '& .MuiInputLabel-root': { fontSize: '0.8125rem' } }
                    }
                  }}
                />
                <DatePicker
                  label='End'
                  value={endDate}
                  onChange={newValue => setEndDate(newValue || new Date())}
                  slotProps={{
                    textField: {
                      size: 'small',
                      fullWidth: true,
                      sx: { flex: 1, '& .MuiOutlinedInput-root': { borderRadius: '12px', backgroundColor: '#F8FAFC', '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#523F99' } }, '& .MuiInputLabel-root': { fontSize: '0.8125rem' } }
                    }
                  }}
                />
              </Box>

              <Button
                variant='contained'
                onClick={handleApplyFilters}
                disabled={!selectedReport || loading}
                disableElevation
                fullWidth
                sx={{
                  borderRadius: '12px',
                  textTransform: 'none',
                  fontWeight: 600,
                  fontSize: '0.9375rem',
                  backgroundColor: '#523F99',
                  color: '#FFFFFF',
                  height: { xs: 48, sm: 40 },
                  width: { md: 'auto' },
                  '&:hover': { backgroundColor: '#6B52C4' },
                  '&.Mui-disabled': { backgroundColor: 'rgba(82,63,153,0.35)', color: 'rgba(255,255,255,0.7)' }
                }}
              >
                {loading ? 'Loading...' : 'Generate Report'}
              </Button>
            </Box>
          </Box>

          {/* Data Grid or Empty State */}
          {selectedReport ? (
            <Box sx={{ p: { xs: 1, sm: 2 }, flex: 1, overflow: 'auto' }}>
            {selectedReport === 'salesDetailsReport' ? (
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow sx={{ backgroundColor: '#F8FAFC' }}>
                        {['Sl No', '', 'Date', 'Invoice', 'Customer', 'Mobile'].map((h) => (
                          <TableCell key={h} sx={{ fontWeight: 600, fontSize: '0.75rem', color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.5px', borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
                            {h}
                          </TableCell>
                        ))}
                        {['Total Qty', 'Total Tax', 'Discount', 'Net Amount'].map((h) => (
                          <TableCell key={h} align='right' sx={{ fontWeight: 600, fontSize: '0.75rem', color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.5px', borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
                            {h}
                          </TableCell>
                        ))}
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {rows.map((row, idx) => (
                        <React.Fragment key={row.uniqueId}>
                          <TableRow sx={{ '&:hover': { backgroundColor: 'rgba(82,63,153,0.02)' } }}>
                            <TableCell sx={{ fontSize: '0.8125rem', color: '#475569', borderBottom: '1px solid rgba(0,0,0,0.04)' }}>{idx + 1}</TableCell>
                            <TableCell sx={{ borderBottom: '1px solid rgba(0,0,0,0.04)' }}>
                              {row.children && row.children.length > 0 && (
                                <IconButton size='small' onClick={() => handleToggleDetailPanel(row.uniqueId)} sx={{ color: '#523F99' }}>
                                  <Icon icon={expandedRows[row.uniqueId] ? 'mdi:chevron-up' : 'mdi:chevron-down'} />
                                </IconButton>
                              )}
                            </TableCell>
                            <TableCell sx={{ fontSize: '0.8125rem', color: '#1E293B', borderBottom: '1px solid rgba(0,0,0,0.04)' }}>{row.entryDate}</TableCell>
                            <TableCell sx={{ fontSize: '0.8125rem', color: '#1E293B', fontWeight: 500, borderBottom: '1px solid rgba(0,0,0,0.04)' }}>{row.invoice}</TableCell>
                            <TableCell sx={{ fontSize: '0.8125rem', color: '#1E293B', borderBottom: '1px solid rgba(0,0,0,0.04)' }}>{row.cusName}</TableCell>
                            <TableCell sx={{ fontSize: '0.8125rem', color: '#475569', borderBottom: '1px solid rgba(0,0,0,0.04)' }}>{row.mobile}</TableCell>
                            <TableCell align='right' sx={{ fontSize: '0.8125rem', color: '#1E293B', borderBottom: '1px solid rgba(0,0,0,0.04)' }}>{row.totalQuantity}</TableCell>
                            <TableCell align='right' sx={{ fontSize: '0.8125rem', color: '#1E293B', borderBottom: '1px solid rgba(0,0,0,0.04)' }}>{row.totalTax}</TableCell>
                            <TableCell align='right' sx={{ fontSize: '0.8125rem', color: '#1E293B', borderBottom: '1px solid rgba(0,0,0,0.04)' }}>{row.totalDiscountAmount}</TableCell>
                            <TableCell align='right' sx={{ fontSize: '0.8125rem', fontWeight: 600, color: '#1E293B', borderBottom: '1px solid rgba(0,0,0,0.04)' }}>{row.totalNetAmount}</TableCell>
                          </TableRow>
                          {row.children && row.children.length > 0 && (
                            <TableRow>
                              <TableCell colSpan={10} sx={{ p: 0, border: 0 }}>
                                <Collapse in={expandedRows[row.uniqueId]} timeout='auto' unmountOnExit>
                                  <Box sx={{ p: 2, backgroundColor: '#FAFBFC' }}>{renderNestedTable(row.children)}</Box>
                                </Collapse>
                              </TableCell>
                            </TableRow>
                          )}
                        </React.Fragment>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              
            ) : (
              <DataGrid
                autoHeight
                loading={loading}
                rows={rows}
                columns={columns}
                getRowId={row => row.uniqueId || row.id || Math.random()}
                disableRowSelectionOnClick
                pagination
                pageSizeOptions={[10, 25, 50, 100]}
                initialState={{
                  pagination: { paginationModel: { pageSize: 25 } }
                }}
                sx={{
                  border: 'none',
                  '& .MuiDataGrid-columnHeaders': { backgroundColor: '#F8FAFC', borderBottom: '1px solid rgba(0,0,0,0.06)' },
                  '& .MuiDataGrid-columnHeaderTitle': { fontSize: '0.75rem', fontWeight: 600, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.5px' },
                  '& .MuiDataGrid-cell': { borderBottom: '1px solid rgba(0,0,0,0.04)', fontSize: '0.8125rem', py: 1 },
                  '& .MuiDataGrid-row:hover': { backgroundColor: 'rgba(82,63,153,0.02)' }
                }}
              />
            )}

            {/* Totals Section */}
            {rows.length > 0 && Object.keys(totals).length > 0 && (
              <Box sx={{ mt: 3, p: 3, backgroundColor: '#F8FAFC', borderRadius: '12px', border: '1px solid rgba(0,0,0,0.06)' }}>
                <Typography sx={{ fontSize: '0.875rem', fontWeight: 700, color: '#1E293B', mb: 2 }}>
                  Summary Totals
                </Typography>
                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: 'repeat(2, 1fr)', sm: 'repeat(auto-fit, minmax(180px, 1fr))' }, gap: 2 }}>
                  {Object.entries(totals).map(([key, value]) => {
                    const column = getReportColumns(selectedReport, cashRevenueOption).find(col => col.field === key)

                    return (
                      <Box key={key} sx={{ p: 2, backgroundColor: '#FFFFFF', borderRadius: '10px', border: '1px solid rgba(0,0,0,0.04)' }}>
                        <Typography sx={{ fontSize: '0.6875rem', fontWeight: 600, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.5px', mb: 0.5 }}>
                          {column?.headerName || key}
                        </Typography>
                        <Typography sx={{ fontSize: '1.125rem', fontWeight: 700, color: '#1E293B' }}>
                          {typeof value === 'number' ? value.toFixed(2) : value}
                        </Typography>
                      </Box>
                    )
                  })}
                </Box>
              </Box>
            )}
          </Box>
          ) : (
            /* Empty State - No report selected */
            <Box sx={{ py: { xs: 5, sm: 8 }, px: { xs: 2, sm: 3 }, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flex: 1 }}>
              <Box sx={{ position: 'relative', mb: 4 }}>
                <Box sx={{ width: 100, height: 100, borderRadius: '50%', backgroundColor: '#F0ECFA', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Box sx={{ width: 70, height: 70, borderRadius: '50%', backgroundColor: '#E4DDF5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <i className='tabler-report-analytics' style={{ fontSize: '2rem', color: '#523F99' }} />
                  </Box>
                </Box>
                <Box sx={{ position: 'absolute', top: -6, right: -6, width: 14, height: 14, borderRadius: '50%', backgroundColor: '#523F99', opacity: 0.15 }} />
                <Box sx={{ position: 'absolute', bottom: 2, left: -10, width: 10, height: 10, borderRadius: '50%', backgroundColor: '#10B981', opacity: 0.15 }} />
              </Box>
              <Typography sx={{ fontSize: '1.125rem', fontWeight: 700, color: '#1E293B', mb: 1 }}>Select a report to get started</Typography>
              <Typography sx={{ fontSize: '0.875rem', color: '#94A3B8', textAlign: 'center', maxWidth: 340, lineHeight: 1.6 }}>
                Choose a report type from the dropdown above, set your date range, and click Generate Report.
              </Typography>
              <Box sx={{ display: 'flex', gap: 4, mt: 5, pt: 4, borderTop: '1px solid rgba(0,0,0,0.04)' }}>
                {[
                  { icon: 'tabler-coin-rupee', label: 'Revenue Reports', color: '#523F99' },
                  { icon: 'tabler-credit-card', label: 'Card Reports', color: '#3B82F6' },
                  { icon: 'tabler-chart-bar', label: 'Sales Reports', color: '#10B981' }
                ].map((item) => (
                  <Box key={item.label} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
                    <Box sx={{ width: 40, height: 40, borderRadius: '10px', backgroundColor: `${item.color}10`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <i className={item.icon} style={{ fontSize: '1.125rem', color: item.color }} />
                    </Box>
                    <Typography sx={{ fontSize: '0.6875rem', fontWeight: 600, color: '#64748B' }}>{item.label}</Typography>
                  </Box>
                ))}
              </Box>
            </Box>
          )}
        </div>
      </div>
    </LocalizationProvider>
  )
}

export default ReportsTable
