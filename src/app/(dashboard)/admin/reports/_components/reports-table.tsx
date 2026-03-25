'use client'

import { useCallback, useState } from 'react'

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
      <TableContainer sx={{ backgroundColor: '#f9f9f9' }}>
        <Table size='small'>
          <TableHead>
            <TableRow sx={{ backgroundColor: '#e0e0e0' }}>
              <TableCell sx={{ fontWeight: 600, fontSize: '0.875rem' }}>Sl No</TableCell>
              <TableCell sx={{ fontWeight: 600, fontSize: '0.875rem' }}>Item Code</TableCell>
              <TableCell align='right' sx={{ fontWeight: 600, fontSize: '0.875rem' }}>
                Quantity
              </TableCell>
              <TableCell align='right' sx={{ fontWeight: 600, fontSize: '0.875rem' }}>
                Sales Rate
              </TableCell>
              <TableCell align='right' sx={{ fontWeight: 600, fontSize: '0.875rem' }}>
                Amount
              </TableCell>
              <TableCell align='right' sx={{ fontWeight: 600, fontSize: '0.875rem' }}>
                Tax Amount
              </TableCell>
              <TableCell align='right' sx={{ fontWeight: 600, fontSize: '0.875rem' }}>
                Discount
              </TableCell>
              <TableCell align='right' sx={{ fontWeight: 600, fontSize: '0.875rem' }}>
                Net Amount
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {children.map((child, idx) => (
              <TableRow key={child.uniqueId} sx={{ '&:hover': { backgroundColor: '#f5f5f5' } }}>
                <TableCell sx={{ fontSize: '0.813rem' }}>{idx + 1}</TableCell>
                <TableCell sx={{ fontSize: '0.813rem' }}>{child.itemCode}</TableCell>
                <TableCell align='right' sx={{ fontSize: '0.813rem' }}>
                  {child.quantity}
                </TableCell>
                <TableCell align='right' sx={{ fontSize: '0.813rem' }}>
                  {child.salesRate}
                </TableCell>
                <TableCell align='right' sx={{ fontSize: '0.813rem' }}>
                  {child.amount}
                </TableCell>
                <TableCell align='right' sx={{ fontSize: '0.813rem' }}>
                  {child.taxAmount}
                </TableCell>
                <TableCell align='right' sx={{ fontSize: '0.813rem' }}>
                  {child.discountAmount}
                </TableCell>
                <TableCell align='right' sx={{ fontSize: '0.813rem' }}>
                  {child.netAmount}
                </TableCell>
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
      <Card>
        <CardHeader title='Reports' />

        {/* Filters Section */}
        <Box sx={{ p: 3, borderBottom: '1px solid #e0e0e0' }}>
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
            <Autocomplete
              sx={{ minWidth: 300 }}
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
                <FormLabel component='legend' sx={{ fontSize: '0.875rem' }}>
                  Report Type
                </FormLabel>
                <RadioGroup
                  row
                  value={cashRevenueOption}
                  onChange={e => setCashRevenueOption(e.target.value as '0' | '1')}
                >
                  <FormControlLabel value='0' control={<Radio size='small' />} label='Normal' />
                  <FormControlLabel value='1' control={<Radio size='small' />} label='Detailed' />
                </RadioGroup>
              </FormControl>
            )}

            <DatePicker
              label='Start Date'
              value={startDate}
              onChange={newValue => setStartDate(newValue || new Date())}
              slotProps={{ textField: { size: 'small' } }}
            />

            <DatePicker
              label='End Date'
              value={endDate}
              onChange={newValue => setEndDate(newValue || new Date())}
              slotProps={{ textField: { size: 'small' } }}
            />

            <Button
              variant='contained'
              onClick={handleApplyFilters}
              disabled={!selectedReport || loading}
              sx={{ minWidth: 120 }}
              style={{ color: '#ffffff' }}
            >
              {loading ? 'Loading...' : 'Apply'}
            </Button>
          </Box>
        </Box>

        {/* Data Grid */}
        {selectedReport && (
          <Box sx={{ p: 2 }}>
            {selectedReport === 'salesDetailsReport' ? (
              
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell width={80}>Sl No</TableCell>
                        <TableCell width={70}></TableCell>
                        <TableCell>Date</TableCell>
                        <TableCell>Invoice</TableCell>
                        <TableCell>Customer</TableCell>
                        <TableCell>Mobile</TableCell>
                        <TableCell align='right'>Total Qty</TableCell>
                        <TableCell align='right'>Total Tax</TableCell>
                        <TableCell align='right'>Discount</TableCell>
                        <TableCell align='right'>Net Amount</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {rows.map((row, idx) => (
                        <>
                          <TableRow key={row.uniqueId}>
                            <TableCell>{idx + 1}</TableCell>
                            <TableCell>
                              {row.children && row.children.length > 0 && (
                                <IconButton size='small' onClick={() => handleToggleDetailPanel(row.uniqueId)}>
                                  <Icon icon={expandedRows[row.uniqueId] ? 'mdi:chevron-up' : 'mdi:chevron-down'} />
                                </IconButton>
                              )}
                            </TableCell>
                            <TableCell>{row.entryDate}</TableCell>
                            <TableCell>{row.invoice}</TableCell>
                            <TableCell>{row.cusName}</TableCell>
                            <TableCell>{row.mobile}</TableCell>
                            <TableCell align='right'>{row.totalQuantity}</TableCell>
                            <TableCell align='right'>{row.totalTax}</TableCell>
                            <TableCell align='right'>{row.totalDiscountAmount}</TableCell>
                            <TableCell align='right'>{row.totalNetAmount}</TableCell>
                          </TableRow>
                          {row.children && row.children.length > 0 && (
                            <TableRow>
                              <TableCell colSpan={10} sx={{ p: 0, border: 0 }}>
                                <Collapse in={expandedRows[row.uniqueId]} timeout='auto' unmountOnExit>
                                  <Box sx={{ p: 2, backgroundColor: '#fafafa' }}>{renderNestedTable(row.children)}</Box>
                                </Collapse>
                              </TableCell>
                            </TableRow>
                          )}
                        </>
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
                  '& .MuiDataGrid-cell': {
                    py: 1
                  }
                }}
              />
            )}

            {/* Totals Section */}
            {rows.length > 0 && Object.keys(totals).length > 0 && (
              <Box sx={{ mt: 3, p: 2, backgroundColor: '#f5f5f5', borderRadius: 1 }}>
                <Typography variant='h6' sx={{ mb: 2 }}>
                  Totals
                </Typography>
                <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 2 }}>
                  {Object.entries(totals).map(([key, value]) => {
                    const column = getReportColumns(selectedReport, cashRevenueOption).find(col => col.field === key)

                    return (
                      <Box key={key}>
                        <Typography variant='body2' color='text.secondary'>
                          {column?.headerName || key}
                        </Typography>
                        <Typography variant='h6'>{typeof value === 'number' ? value.toFixed(2) : value}</Typography>
                      </Box>
                    )
                  })}
                </Box>
              </Box>
            )}
          </Box>
        )}
      </Card>
    </LocalizationProvider>
  )
}

export default ReportsTable
