'use client'

import React, { useCallback, useEffect, useState } from 'react'

import {
  Box,
  Button,
  Typography,
  Collapse,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableContainer,
  RadioGroup,
  FormControlLabel,
  Radio,
  FormControl,
  FormLabel,
  useMediaQuery,
  useTheme,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material'
import { DataGrid } from '@mui/x-data-grid'
import type { GridColDef } from '@mui/x-data-grid'
import { Icon } from '@iconify/react/dist/iconify.js'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers'

import toast from 'react-hot-toast'
import { useSearchParams } from 'next/navigation'

import { reportCategories, getReportColumns } from './reportConfig'
import { reportsApi } from '@/api/reports-api'
import { getUser } from '@/utils/authStorage'

const ReportsTable = () => {
  const searchParams = useSearchParams()
  const [mainCategory, setMainCategory] = useState<string>('games') // 'games' | 'fb'
  const [selectedSubCategory, setSelectedSubCategory] = useState<string>('') // e.g. "POS Revenue Report"
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

  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('lg'))

  useEffect(() => {
    const type = searchParams.get('type')
    const categoryParam = searchParams.get('category')
    const subcategoryParam = searchParams.get('subcategory')

    if (type) {
      // Find which main category and subcategory this report type belongs to
      let foundCategoryKey = 'games'
      let foundSubCategoryLabel = ''

      for (const mainCat of reportCategories) {
        if (mainCat.subCategories) {
          for (const subCat of mainCat.subCategories) {
            if (subCat.reports.some(r => r.value === type)) {
              foundCategoryKey = mainCat.label.toLowerCase() === 'f&b' ? 'fb' : 'games'
              foundSubCategoryLabel = subCat.label
              break
            }
          }
        }
      }

      setMainCategory(foundCategoryKey)
      setSelectedSubCategory(foundSubCategoryLabel)
      setSelectedReport(type)
      setRows([])
      setExpandedRows({})
      setCashRevenueOption('0')
    } else if (subcategoryParam) {
      // Find which main category this subcategory belongs to
      let foundCategoryKey = 'games'
      for (const mainCat of reportCategories) {
        if (mainCat.subCategories?.some(sc => sc.label === subcategoryParam)) {
          foundCategoryKey = mainCat.label.toLowerCase() === 'f&b' ? 'fb' : 'games'
          break
        }
      }
      setMainCategory(foundCategoryKey)
      setSelectedSubCategory(subcategoryParam)
      setSelectedReport('')
      setRows([])
      setExpandedRows({})
    } else if (categoryParam) {
      const catKey = categoryParam.toLowerCase() === 'fb' ? 'fb' : 'games'
      setMainCategory(catKey)
      setSelectedSubCategory('')
      setSelectedReport('')
      setRows([])
      setExpandedRows({})
    }
  }, [searchParams])

  const formatDate = (date: Date) => {
    const yyyy = date.getFullYear()
    const mm = String(date.getMonth() + 1).padStart(2, '0')
    const dd = String(date.getDate()).padStart(2, '0')

    return `${dd}-${mm}-${yyyy}`
  }

  const formatDateForApi = (date: Date) => {
    const yyyy = date.getFullYear()
    const mm = String(date.getMonth() + 1).padStart(2, '0')
    const dd = String(date.getDate()).padStart(2, '0')

    return `${yyyy}-${mm}-${dd}`
  }

  const activeMainCategoryData = reportCategories.find(
    c => (c.label.toLowerCase() === 'f&b' ? 'fb' : 'games') === mainCategory
  )
  const subCategoriesList = activeMainCategoryData?.subCategories || []

  const activeSubCategoryData = subCategoriesList.find(
    sc => sc.label === selectedSubCategory
  )
  const reportsList = activeSubCategoryData?.reports || []

  const selectedReportLabel = reportCategories
    .flatMap(c => {
      if (c.subCategories) {
        return c.subCategories.flatMap(sc => sc.reports)
      }
      return c.reports || []
    })
    .find(r => r.value === selectedReport)?.label

  const handleApplyFilters = useCallback(async () => {
    if (!selectedReport) {
      toast.error('Please select a report from the main menu')

      return
    }

    setLoading(true)

    try {
      const storedUserData = getUser()
      const branchId = storedUserData?.branchId.toString()

      const params = {
        fTime: formatDateForApi(startDate),
        tTime: formatDateForApi(endDate),
        branchId
      }

      let response

      if (selectedReport === 'cashRevenueReport') {
        response = await reportsApi.cashRevenueReport({ ...params, option: cashRevenueOption })
      } else if (selectedReport === 'fbCashRevenueReport') {
        response = await reportsApi.fbCashRevenueReport({ ...params, option: cashRevenueOption })
      } else if (selectedReport === 'gameRevenueReport') {
        response = await reportsApi.gameRevenueReport(params)
      } else if (selectedReport === 'salesReport') {
        response = await reportsApi.salesReport(params)
      } else if (selectedReport === 'fbSalesReport') {
        response = await reportsApi.fbSalesReport(params)
      } else if (selectedReport === 'salesDetailsReport') {
        response = await reportsApi.salesDetailsReport(params)
      } else if (selectedReport === 'fbSalesDetailsReport') {
        response = await reportsApi.fbSalesDetailsReport(params)
      } else if (selectedReport === 'redeemptionReport') {
        response = await reportsApi.redeemptionReport(params)
      } else if (selectedReport === 'redemptionSalesReport') {
        response = await reportsApi.redemptionSalesReport(params)
      } else if (selectedReport === 'rechargeReport') {
        response = await reportsApi.rechargeReport(params)
      } else if (selectedReport === 'rechargeRevenueReport') {
        response = await reportsApi.rechargeRevenueReport(params)

      } else if (selectedReport === 'cardLiabilityReport') {
        response = await reportsApi.cardLiabilityReport(params)
      } else if (selectedReport === 'clearCardReport') {
        response = await reportsApi.clearCardReport(params)
      } else if (selectedReport === 'cardConsolidateReport') {
        response = await reportsApi.cardConsolidateReport(params)

      } else if (selectedReport === 'topPlayedGameReport') {
        response = await reportsApi.topPlayedGameReport(params)
      } else if (selectedReport === 'cardVoidReport') {
        response = await reportsApi.cardVoidReport(params)
      } else if (selectedReport === 'cardSummaryReport') {
        response = await reportsApi.cardSummaryReport(params)
      } else if (selectedReport === 'creditCardActivityReport') {
        response = await reportsApi.creditCardActivityReport(params)
      } else if (selectedReport === 'customerTrafficReport') {
        response = await reportsApi.customerTrafficReport(params)
      } else if (selectedReport === 'detailedEmployeeGamePlayReport') {
        response = await reportsApi.detailedEmployeeGamePlayReport(params)
      } else if (selectedReport === 'drawerAccessReport') {
        response = await reportsApi.drawerAccessReport(params)
      } else if (selectedReport === 'employeeListReport') {
        response = await reportsApi.employeeListReport(branchId)
      } else if (selectedReport === 'employeePaymentAdjustments') {
        response = await reportsApi.employeePaymentAdjustments(params)
      } else if (selectedReport === 'familyCardReport') {
        response = await reportsApi.familyCardReport(params)
      } else if (selectedReport === 'groupSaleReport') {
        response = await reportsApi.groupSaleReport(params)
      } else if (selectedReport === 'happyHourReport') {
        response = await reportsApi.happyHourReport(branchId)
      } else if (selectedReport === 'inventoryReport') {
        response = await reportsApi.inventoryReport({ branchId, producttype: 0 })
      } else if (selectedReport === 'memberActivityReport') {
        response = await reportsApi.memberActivityReport(branchId)
      } else if (selectedReport === 'membershipReport') {
        response = await reportsApi.membershipReport()
      } else if (selectedReport === 'newCardCountReport') {
        response = await reportsApi.newCardCountReport(params)
      } else if (selectedReport === 'newCustomerRegisterReport') {
        response = await reportsApi.newCustomerRegisterReport(params)
      } else if (selectedReport === 'offersListReport') {
        response = await reportsApi.offersListReport(params)
      } else if (selectedReport === 'partyBookingDetailReport') {
        response = await reportsApi.partyBookingDetailReport(params)
      } else if (selectedReport === 'partyBookingPaymentDetailsReport') {
        response = await reportsApi.partyBookingPaymentDetailsReport(params)
      } else if (selectedReport === 'partyBookingReport') {
        response = await reportsApi.partyBookingReport(params)
      } else if (selectedReport === 'partyPackListReport') {
        response = await reportsApi.partyPackListReport(branchId)
      } else if (selectedReport === 'purchaseReport') {
        response = await reportsApi.purchaseReport(params)
      } else if (selectedReport === 'purchaseReturnReport') {
        response = await reportsApi.purchaseReturnReport(params)
      } else if (selectedReport === 'qtyAdjustmentReport') {
        response = await reportsApi.qtyAdjustmentReport(params)
      } else if (selectedReport === 'redemptionComplementaryReport') {
        response = await reportsApi.redemptionComplementaryReport(params)
      } else if (selectedReport === 'redemptionDamagedProductsReport') {
        response = await reportsApi.redemptionDamagedProductsReport(params)
      } else if (selectedReport === 'redemptionRedeemReport') {
        response = await reportsApi.redemptionRedeemReport(params)
      } else if (selectedReport === 'redemptionSalesReportNew') {
        response = await reportsApi.redemptionSalesReportNew(params)
      } else if (selectedReport === 'refundReport') {
        response = await reportsApi.refundReport(params)
      } else if (selectedReport === 'reorderReport') {
        response = await reportsApi.reorderReport({ branchId })
      } else if (selectedReport === 'requestPointReport') {
        response = await reportsApi.requestPointReport(params)
      } else if (selectedReport === 'salesComplementaryDetailReport') {
        response = await reportsApi.salesComplementaryDetailReport(params)
      } else if (selectedReport === 'salesComplementaryReport') {
        response = await reportsApi.salesComplementaryReport(params)
      } else if (selectedReport === 'salesReturnReport') {
        response = await reportsApi.salesReturnReport(params)
      } else if (selectedReport === 'salesVoidReport') {
        response = await reportsApi.salesVoidReport(params)
      } else if (selectedReport === 'thirdPartyCardTransReport') {
        response = await reportsApi.thirdPartyCardTransReport({ fTime: formatDateForApi(startDate), tTime: formatDateForApi(endDate), status: 1 })

      } else {
        throw new Error('Invalid report type')
      }

      if (selectedReport === 'salesDetailsReport' || selectedReport === 'fbSalesDetailsReport') {
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

  const handleExportPDF = async () => {
    if (rows.length === 0) return

    setLoading(true)
    try {
      const { jsPDF } = await import('jspdf')
      const autoTableModule = await import('jspdf-autotable')
      // Safe resolution for both CommonJS and ES Module dynamic imports
      const autoTable = autoTableModule.default || (autoTableModule as any).autoTable

      const doc = new jsPDF()

      // Document Title
      doc.setFontSize(16)
      doc.setFont('helvetica', 'bold')
      doc.text(selectedReportLabel || 'Report', 14, 20)

      doc.setFontSize(10)
      doc.setFont('helvetica', 'normal')
      doc.text(`Date Range: ${formatDate(startDate)} to ${formatDate(endDate)}`, 14, 28)

      // Resolve columns dynamically (exclude helper/interactive columns)
      const activeCols = columns
        .filter(col => col.field !== 'slNo' && col.field !== 'expand' && col.headerName !== '')
        .map(col => ({ header: col.headerName, dataKey: col.field }))

      const headers = [['Sl No', ...activeCols.map(c => c.header || '')]]
      const body: any[] = []

      rows.forEach((row, index) => {
        // Parent row
        body.push([
          index + 1,
          ...activeCols.map(c => row[c.dataKey] ?? '')
        ])

        // Add child transactions if they exist (e.g. for salesDetailsReport)
        if (row.children && row.children.length > 0) {
          row.children.forEach((child: any) => {
            body.push([
              '', // Empty Sl No for child items
              `  └─ Item: ${child.itemCode || ''} | Qty: ${child.quantity || 0} | Rate: ${child.salesRate || 0} | Net: ${child.netAmount || 0}`,
              ...activeCols.slice(1).map(() => '')
            ])
          })
        }
      })

      // Generate Table using jspdf-autotable
      autoTable(doc, {
        head: headers,
        body: body,
        startY: 35,
        theme: 'striped',
        styles: { fontSize: 8, cellPadding: 2 },
        headStyles: { fillColor: [82, 63, 153], textColor: [255, 255, 255] }, // Brand color #523F99
        margin: { top: 35 }
      })

      const fileName = `${selectedReport || 'report'}_${formatDate(new Date())}.pdf`
      doc.save(fileName)
      toast.success('PDF exported successfully')
    } catch (err) {
      console.error('Error generating PDF:', err)
      toast.error('Failed to export PDF')
    } finally {
      setLoading(false)
    }
  }

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
    selectedReport === 'salesDetailsReport' || selectedReport === 'fbSalesDetailsReport'
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
      <div className='max-w-[1600px] mx-auto px-2 sm:px-4 py-3 sm:py-6'>
        <div className='flex flex-col gap-6 min-h-[calc(100vh-120px)]'>
          {/* Main Content Area */}
          <div className='flex-1 rounded-2xl border border-[rgba(0,0,0,0.06)] bg-white flex flex-col overflow-hidden'>
            {/* Header */}
            <Box sx={{ px: { xs: 2, sm: 4, md: 5 }, pt: { xs: 2.5, sm: 3, md: 4 }, pb: 1.5, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <Box>
                <Typography sx={{ fontSize: { xs: '1.125rem', sm: '1.25rem' }, fontWeight: 700, color: '#1E293B' }}>
                  Reports Center - {mainCategory === 'fb' ? 'F&B' : (selectedSubCategory || 'Games')}
                </Typography>
                <Typography sx={{ fontSize: { xs: '0.6875rem', sm: '0.8125rem' }, color: '#94A3B8', fontWeight: 500, mt: 0.25 }}>
                  {selectedReportLabel || 'Select a report type below'}
                </Typography>
              </Box>
            </Box>

            {/* Mobile Category & Subcategory Selectors */}
            {isMobile && (
              <Box sx={{ px: { xs: 2, sm: 4, md: 5 }, pb: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', sm: 'row' } }}>
                  <FormControl size='small' fullWidth sx={{ minWidth: 200 }}>
                    <InputLabel id='mobile-category-label' sx={{ color: '#64748B' }}>Category</InputLabel>
                    <Select
                      labelId='mobile-category-label'
                      id='mobile-category'
                      value={mainCategory}
                      label='Category'
                      onChange={e => {
                        const val = e.target.value
                        setMainCategory(val)
                        setSelectedSubCategory('')
                        setSelectedReport('')
                        setRows([])
                      }}
                      sx={{ borderRadius: '12px', backgroundColor: '#F8FAFC' }}
                    >
                      <MenuItem value='games'>Games</MenuItem>
                      <MenuItem value='fb'>F&B</MenuItem>
                    </Select>
                  </FormControl>

                  <FormControl size='small' fullWidth sx={{ minWidth: 200 }} disabled={!mainCategory}>
                    <InputLabel id='mobile-subcategory-label' sx={{ color: '#64748B' }}>Sub Category</InputLabel>
                    <Select
                      labelId='mobile-subcategory-label'
                      id='mobile-subcategory'
                      value={selectedSubCategory}
                      label='Sub Category'
                      onChange={e => {
                        setSelectedSubCategory(e.target.value)
                        setSelectedReport('')
                        setRows([])
                      }}
                      sx={{ borderRadius: '12px', backgroundColor: '#F8FAFC' }}
                    >
                      {subCategoriesList.map(sc => (
                        <MenuItem key={sc.label} value={sc.label}>
                          {sc.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Box>
              </Box>
            )}

            {/* Filters Section */}
            {selectedSubCategory && (
              <Box sx={{ px: { xs: 2, sm: 4, md: 5 }, pb: 2.5, borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
                <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', lg: 'row' }, alignItems: { lg: 'flex-end' } }}>
                  <Box sx={{ display: 'flex', gap: 2, flex: 1, flexDirection: { xs: 'column', sm: 'row' } }}>
                    <FormControl size='small' fullWidth sx={{ minWidth: 260 }}>
                      <InputLabel id='report-select-label' sx={{ color: '#64748B' }}>Select Report</InputLabel>
                      <Select
                        labelId='report-select-label'
                        id='report-select'
                        value={selectedReport}
                        label='Select Report'
                        onChange={e => {
                          setSelectedReport(e.target.value)
                          setRows([])
                        }}
                        sx={{ borderRadius: '12px', backgroundColor: '#F8FAFC' }}
                      >
                        {reportsList.map(r => (
                          <MenuItem key={r.value} value={r.value}>
                            {r.label}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Box>

                  {(selectedReport === 'cashRevenueReport' || selectedReport === 'fbCashRevenueReport') && (
                    <FormControl component='fieldset' sx={{ minWidth: 200 }}>
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

                  <Box sx={{ display: 'flex', gap: 1.5, flex: 1 }}>
                    <DatePicker
                      label='Start'
                      value={startDate}
                      onChange={newValue => setStartDate(newValue || new Date())}
                      slotProps={{
                        textField: {
                          size: 'small',
                          fullWidth: true,
                          sx: { '& .MuiOutlinedInput-root': { borderRadius: '12px', backgroundColor: '#F8FAFC' } }
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
                          sx: { '& .MuiOutlinedInput-root': { borderRadius: '12px', backgroundColor: '#F8FAFC' } }
                        }
                      }}
                    />
                  </Box>

                  <Button
                    variant='contained'
                    onClick={handleApplyFilters}
                    disabled={!selectedReport || loading}
                    disableElevation
                    sx={{
                      borderRadius: '12px',
                      textTransform: 'none',
                      fontWeight: 600,
                      fontSize: '0.9375rem',
                      backgroundColor: '#523F99',
                      height: 40,
                      px: 4,
                      '&:hover': { backgroundColor: '#6B52C4' }
                    }}
                  >
                    {loading ? 'Loading...' : 'Generate Report'}
                  </Button>

                  <Button
                    variant='outlined'
                    onClick={handleExportPDF}
                    disabled={rows.length === 0 || loading}
                    disableElevation
                    startIcon={<Icon icon='tabler-file-type-pdf' />}
                    sx={{
                      borderRadius: '12px',
                      textTransform: 'none',
                      fontWeight: 600,
                      fontSize: '0.9375rem',
                      borderColor: '#523F99',
                      color: '#523F99',
                      height: 40,
                      px: 4,
                      '&:hover': { borderColor: '#6B52C4', backgroundColor: 'rgba(82,63,153,0.04)' },
                      '&.Mui-disabled': { borderColor: 'rgba(0,0,0,0.12)', color: 'rgba(0,0,0,0.26)' }
                    }}
                  >
                    Export PDF
                  </Button>
                </Box>
              </Box>
            )}

            {/* Data Area */}
            {selectedReport ? (
              <Box sx={{ p: { xs: 1, sm: 2 }, flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                <Box sx={{ flex: 1, overflow: 'auto' }}>
                  {selectedReport === 'salesDetailsReport' || selectedReport === 'fbSalesDetailsReport' ? (
                    <TableContainer>
                      <Table stickyHeader size='small'>
                        <TableHead>
                          <TableRow>
                            {['Sl No', '', 'Date', 'Invoice', 'Customer', 'Mobile'].map((h) => (
                              <TableCell key={h} sx={{ fontWeight: 600, fontSize: '0.75rem', color: '#64748B', backgroundColor: '#F8FAFC' }}>
                                {h}
                              </TableCell>
                            ))}
                            {['Total Qty', 'Total Tax', 'Discount', 'Net Amount'].map((h) => (
                              <TableCell key={h} align='right' sx={{ fontWeight: 600, fontSize: '0.75rem', color: '#64748B', backgroundColor: '#F8FAFC' }}>
                                {h}
                              </TableCell>
                            ))}
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {rows.map((row, idx) => (
                            <React.Fragment key={row.uniqueId}>
                              <TableRow hover>
                                <TableCell sx={{ fontSize: '0.8125rem' }}>{idx + 1}</TableCell>
                                <TableCell>
                                  {row.children && row.children.length > 0 && (
                                    <IconButton size='small' onClick={() => handleToggleDetailPanel(row.uniqueId)} sx={{ color: '#523F99' }}>
                                      <Icon icon={expandedRows[row.uniqueId] ? 'mdi:chevron-up' : 'mdi:chevron-down'} />
                                    </IconButton>
                                  )}
                                </TableCell>
                                <TableCell sx={{ fontSize: '0.8125rem' }}>{row.entryDate}</TableCell>
                                <TableCell sx={{ fontSize: '0.8125rem', fontWeight: 500 }}>{row.invoice}</TableCell>
                                <TableCell sx={{ fontSize: '0.8125rem' }}>{row.cusName}</TableCell>
                                <TableCell sx={{ fontSize: '0.8125rem' }}>{row.mobile}</TableCell>
                                <TableCell align='right' sx={{ fontSize: '0.8125rem' }}>{row.totalQuantity}</TableCell>
                                <TableCell align='right' sx={{ fontSize: '0.8125rem' }}>{row.totalTax}</TableCell>
                                <TableCell align='right' sx={{ fontSize: '0.8125rem' }}>{row.totalDiscountAmount}</TableCell>
                                <TableCell align='right' sx={{ fontSize: '0.8125rem', fontWeight: 600 }}>{row.totalNetAmount}</TableCell>
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
                      density='compact'
                      loading={loading}
                      rows={rows}
                      columns={columns}
                      getRowId={row => row.uniqueId || row.id || Math.random()}
                      getRowHeight={() => 32}
                      disableRowSelectionOnClick
                      pagination
                      pageSizeOptions={[25, 50, 100]}
                      initialState={{ pagination: { paginationModel: { pageSize: 25 } } }}
                      sx={{
                        border: 'none',
                        '& .MuiDataGrid-columnHeaders': { backgroundColor: '#F8FAFC' },
                        '& .MuiDataGrid-cell': { borderBottom: '1px solid rgba(0,0,0,0.04)', fontSize: '0.8125rem' },
                        '& .MuiDataGrid-row:hover': { backgroundColor: 'rgba(82,63,153,0.02)' }
                      }}
                    />
                  )}
                </Box>

                {/* Totals Summary */}
                {rows.length > 0 && Object.keys(totals).length > 0 && (
                  <Box sx={{ mt: 2, p: 2, backgroundColor: '#F8FAFC', borderRadius: '12px', border: '1px solid rgba(0,0,0,0.06)' }}>
                    <Typography sx={{ fontSize: '0.75rem', fontWeight: 700, color: '#1E293B', mb: 1.5, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                      Summary Totals
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5 }}>
                      {Object.entries(totals).map(([key, value]) => {
                        const column = getReportColumns(selectedReport, cashRevenueOption).find(col => col.field === key)

                        return (
                          <Box key={key} sx={{ px: 2, py: 1.25, backgroundColor: '#FFFFFF', borderRadius: '10px', border: '1px solid rgba(0,0,0,0.04)', minWidth: 140 }}>
                            <Typography sx={{ fontSize: '0.625rem', fontWeight: 600, color: '#94A3B8', textTransform: 'uppercase', mb: 0.5 }}>
                              {column?.headerName || key}
                            </Typography>
                            <Typography sx={{ fontSize: '1rem', fontWeight: 700, color: '#523F99' }}>
                              {typeof value === 'number' ? value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : value}
                            </Typography>
                          </Box>
                        )
                      })}
                    </Box>
                  </Box>
                )}
              </Box>
            ) : (
              /* Empty State */
              <Box sx={{ py: 10, px: 3, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flex: 1 }}>
                <Box sx={{ width: 80, height: 80, borderRadius: '50%', backgroundColor: '#F0ECFA', display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 3 }}>
                  <i className={mainCategory === 'fb' ? 'tabler-tools-kitchen-2' : 'tabler-device-gamepad-2'} style={{ fontSize: '2.5rem', color: '#523F99' }} />
                </Box>
                <Typography sx={{ fontSize: '1.25rem', fontWeight: 700, color: '#1E293B', mb: 1 }}>
                  {mainCategory === 'fb' ? 'F&B Reports' : (selectedSubCategory || 'Games Reports')}
                </Typography>
                <Typography sx={{ fontSize: '0.875rem', color: '#94A3B8', textAlign: 'center', maxWidth: 400, lineHeight: 1.6 }}>
                  {mainCategory === 'fb' && !selectedSubCategory
                    ? 'There are no reports configured for the F&B category yet.'
                    : selectedSubCategory
                    ? 'Select a Report from the dropdown menu above to view analytics.'
                    : isMobile
                    ? 'Select a report category and subcategory from the dropdowns above to get started.'
                    : 'Select a report category from the sidebar menu to get started.'}
                </Typography>
              </Box>
            )}
          </div>
        </div>
      </div>
    </LocalizationProvider>
  )
}

export default ReportsTable
