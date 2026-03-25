// @/config/reportConfig.ts

export interface ReportColumn {
  field: string
  headerName: string
  flex?: number
  minWidth?: number
  type?: 'string' | 'number'
}

export interface ReportType {
  value: string
  label: string
}

export const reportTypes: ReportType[] = [
  { value: 'cardConsolidateReport', label: 'Card Consolidate Report' },
  { value: 'cardLiabilityReport', label: 'Card Liability Report' },
  { value: 'cardTransferReport', label: 'Card Transfer Report' },
  { value: 'cashRevenueReport', label: 'Cash Revenue Report' },
  { value: 'clearCardReport', label: 'Clear Card Report' },
  { value: 'employeeGamePlayReport', label: 'Employee Game Play Report' },
  { value: 'gameRevenueReport', label: 'Game Revenue Report' },
  { value: 'rechargeReport', label: 'Recharge Report' },
  { value: 'rechargeRevenueReport', label: 'Recharge Revenue Report' },
  { value: 'redemptionSalesReport', label: 'Redemption Sales Report' },
  { value: 'redeemptionReport', label: 'Redemption Report' },
  { value: 'salesDetailsReport', label: 'Sales Details Report' },
  { value: 'salesReport', label: 'Sales Report' },
  { value: 'topPlayedGameReport', label: 'Top Played Game Report' },
  { value: 'cardVoidReport', label: 'Card Void Report Report' },
]

const reportColumns: Record<string, ReportColumn[]> = {
  cashRevenueReportNormal: [
    { field: 'entryDate', headerName: 'Date', flex: 0.15, minWidth: 120 },
    { field: 'creditcard', headerName: 'Credit Card', flex: 0.12, minWidth: 120, type: 'number' },
    { field: 'debitcard', headerName: 'Debit Card', flex: 0.12, minWidth: 120, type: 'number' },
    { field: 'upi', headerName: 'UPI', flex: 0.1, minWidth: 100, type: 'number' },
    { field: 'bankingonline', headerName: 'Online Banking', flex: 0.15, minWidth: 130, type: 'number' },
    { field: 'cash', headerName: 'Cash', flex: 0.1, minWidth: 100, type: 'number' },
    { field: 'others', headerName: 'Others', flex: 0.1, minWidth: 100, type: 'number' },
    { field: 'total', headerName: 'Total', flex: 0.12, minWidth: 120, type: 'number' }
  ],
  cashRevenueReportDetailed: [
    { field: 'entryDate', headerName: 'Date', flex: 0.15, minWidth: 120 },
    { field: 'system', headerName: 'System', flex: 0.2, minWidth: 150 },
    { field: 'saleType', headerName: 'Sale Type', flex: 0.15, minWidth: 120 },
    { field: 'creditcard', headerName: 'Credit Card', flex: 0.12, minWidth: 120, type: 'number' },
    { field: 'debitcard', headerName: 'Debit Card', flex: 0.12, minWidth: 120, type: 'number' },
    { field: 'upi', headerName: 'UPI', flex: 0.1, minWidth: 100, type: 'number' },
    { field: 'bankingonline', headerName: 'Online Banking', flex: 0.15, minWidth: 130, type: 'number' },
    { field: 'cash', headerName: 'Cash', flex: 0.1, minWidth: 100, type: 'number' },
    { field: 'others', headerName: 'Others', flex: 0.1, minWidth: 100, type: 'number' },
    { field: 'total', headerName: 'Total', flex: 0.12, minWidth: 120, type: 'number' }
  ],
  gameRevenueReport: [
    { field: 'game', headerName: 'Game', flex: 0.25, minWidth: 150 },
    { field: 'cashBalance', headerName: 'Cash Balance', flex: 0.15, minWidth: 130, type: 'number' },
    { field: 'cashBonusBalance', headerName: 'Cash Bonus', flex: 0.15, minWidth: 130, type: 'number' },
    { field: 'tokenBalance', headerName: 'Token Balance', flex: 0.15, minWidth: 130, type: 'number' },
    { field: 'pointBalance', headerName: 'Point Balance', flex: 0.15, minWidth: 130, type: 'number' },
    { field: 'loyalityPoint', headerName: 'Loyalty Points', flex: 0.15, minWidth: 130, type: 'number' },
    { field: 'total', headerName: 'Total', flex: 0.15, minWidth: 120, type: 'number' }
  ],
  salesReport: [
    { field: 'entryDate', headerName: 'Date', flex: 0.15, minWidth: 120 },
    { field: 'invoice', headerName: 'Invoice', flex: 0.2, minWidth: 150 },
    { field: 'customerName', headerName: 'Customer Name', flex: 0.2, minWidth: 150 },
    { field: 'mobile', headerName: 'Mobile', flex: 0.15, minWidth: 120 },
    { field: 'totalQuantity', headerName: 'Quantity', flex: 0.1, minWidth: 100, type: 'number' },
    { field: 'totalTax', headerName: 'Tax', flex: 0.1, minWidth: 100, type: 'number' },
    { field: 'discountAmount', headerName: 'Discount', flex: 0.12, minWidth: 110, type: 'number' },
    { field: 'netAmount', headerName: 'Net Amount', flex: 0.15, minWidth: 120, type: 'number' }
  ],
  salesDetailsReport: [
    { field: 'entryDate', headerName: 'Date', flex: 0.12, minWidth: 120 },
    { field: 'invoice', headerName: 'Invoice', flex: 0.15, minWidth: 150 },
    { field: 'cusName', headerName: 'Customer', flex: 0.15, minWidth: 150 },
    { field: 'mobile', headerName: 'Mobile', flex: 0.12, minWidth: 120 },
    { field: 'totalQuantity', headerName: 'Total Qty', flex: 0.1, minWidth: 100, type: 'number' },
    { field: 'totalTax', headerName: 'Total Tax', flex: 0.1, minWidth: 100, type: 'number' },
    { field: 'totalDiscountAmount', headerName: 'Discount', flex: 0.1, minWidth: 100, type: 'number' },
    { field: 'totalNetAmount', headerName: 'Net Amount', flex: 0.12, minWidth: 120, type: 'number' }
  ],
  redeemptionReport: [
    { field: 'entryDate', headerName: 'Date', flex: 0.15, minWidth: 150 },
    { field: 'name', headerName: 'Name', flex: 0.15, minWidth: 130 },
    { field: 'mobile', headerName: 'Mobile', flex: 0.12, minWidth: 120 },
    { field: 'iCardNo', headerName: 'Card No', flex: 0.15, minWidth: 130 },
    { field: 'product', headerName: 'Product', flex: 0.15, minWidth: 150 },
    { field: 'barCode', headerName: 'Barcode', flex: 0.12, minWidth: 120 },
    { field: 'point', headerName: 'Points', flex: 0.1, minWidth: 100, type: 'number' },
    { field: 'qty', headerName: 'Quantity', flex: 0.1, minWidth: 100, type: 'number' },
    { field: 'net', headerName: 'Net', flex: 0.12, minWidth: 110, type: 'number' }
  ],
  redemptionSalesReport: [
    { field: 'entryDate', headerName: 'Date', flex: 0.15, minWidth: 150 },
    { field: 'invoice', headerName: 'Invoice', flex: 0.15, minWidth: 140 },
    { field: 'cusName', headerName: 'Customer', flex: 0.15, minWidth: 140 },
    { field: 'mobile', headerName: 'Mobile', flex: 0.12, minWidth: 120 },
    { field: 'itemCode', headerName: 'Item Code', flex: 0.15, minWidth: 130 },
    { field: 'itemBarCode', headerName: 'Barcode', flex: 0.12, minWidth: 120 },
    { field: 'discountAmount', headerName: 'Discount', flex: 0.1, minWidth: 100, type: 'number' },
    { field: 'quantity', headerName: 'Quantity', flex: 0.1, minWidth: 100, type: 'number' },
    { field: 'taxAmount', headerName: 'Tax', flex: 0.1, minWidth: 100, type: 'number' },
    { field: 'salesRate', headerName: 'Rate', flex: 0.1, minWidth: 100, type: 'number' },
    { field: 'netAmount', headerName: 'Net Amount', flex: 0.12, minWidth: 120, type: 'number' }
  ],
  rechargeReport: [
    { field: 'entryDate', headerName: 'Date', flex: 0.2, minWidth: 170 },
    { field: 'ledgerCode', headerName: 'Ledger Code', flex: 0.15, minWidth: 130 },
    { field: 'ledgerName', headerName: 'Ledger Name', flex: 0.2, minWidth: 150 },
    { field: 'mobile', headerName: 'Mobile', flex: 0.15, minWidth: 120 },
    { field: 'payType', headerName: 'Payment Type', flex: 0.15, minWidth: 130 },
    { field: 'netAmt', headerName: 'Net Amount', flex: 0.15, minWidth: 120, type: 'number' },
    { field: 'iCardNo', headerName: 'Card No', flex: 0.15, minWidth: 130 }
  ],
  rechargeRevenueReport: [
    { field: 'entryDate', headerName: 'Date', flex: 0.2, minWidth: 170 },
    { field: 'creditcard', headerName: 'Credit Card', flex: 0.12, minWidth: 120, type: 'number' },
    { field: 'debitcard', headerName: 'Debit Card', flex: 0.12, minWidth: 120, type: 'number' },
    { field: 'upi', headerName: 'UPI', flex: 0.1, minWidth: 100, type: 'number' },
    { field: 'bankingonline', headerName: 'Online Banking', flex: 0.15, minWidth: 140, type: 'number' },
    { field: 'cash', headerName: 'Cash', flex: 0.1, minWidth: 100, type: 'number' },
    { field: 'others', headerName: 'Others', flex: 0.1, minWidth: 100, type: 'number' },
    { field: 'total', headerName: 'Total', flex: 0.12, minWidth: 120, type: 'number' }
  ],
  employeeGamePlayReport: [
    { field: 'employeeName', headerName: 'Employee Name', flex: 0.3, minWidth: 180 },
    { field: 'iCardNo', headerName: 'Card No', flex: 0.25, minWidth: 150 },
    { field: 'game', headerName: 'Game', flex: 0.25, minWidth: 150 },
    { field: 'noOfPlayed', headerName: 'Times Played', flex: 0.2, minWidth: 130, type: 'number' }
  ],
  cardLiabilityReport: [
    { field: 'entryDate', headerName: 'Date', flex: 0.12, minWidth: 120 },
    { field: 'icardNo', headerName: 'Card No', flex: 0.15, minWidth: 130 },
    { field: 'ledgerName', headerName: 'Name', flex: 0.15, minWidth: 140 },
    { field: 'cardBalance', headerName: 'Card Balance', flex: 0.12, minWidth: 130, type: 'number' },
    { field: 'cashBonusBalance', headerName: 'Cash Bonus', flex: 0.12, minWidth: 130, type: 'number' },
    { field: 'tokenBalance', headerName: 'Token Balance', flex: 0.12, minWidth: 130, type: 'number' },
    { field: 'pointBalance', headerName: 'Point Balance', flex: 0.12, minWidth: 130, type: 'number' },
    { field: 'lastUsedOn', headerName: 'Last Used On', flex: 0.15, minWidth: 150 },
    { field: 'lastUsedAt', headerName: 'Last Used At', flex: 0.15, minWidth: 150 }
  ],
  clearCardReport: [
    { field: 'entryDate', headerName: 'Date', flex: 0.12, minWidth: 120 },
    { field: 'icard', headerName: 'Card No', flex: 0.15, minWidth: 130 },
    { field: 'customerName', headerName: 'Name', flex: 0.15, minWidth: 140 },
    { field: 'mobile', headerName: 'Mobile Number', flex: 0.12, minWidth: 130 },
  ],
  cardConsolidateReport: [
    { field: 'entryDate', headerName: 'Date', flex: 0.12, minWidth: 120 },
    { field: 'name', headerName: 'Name', flex: 0.15, minWidth: 130 },
    { field: 'iCardNo', headerName: 'Card No', flex: 0.15, minWidth: 140 },
    { field: 'totalCardBalance', headerName: 'Total Card Balance', flex: 0.12, minWidth: 130, type: 'number' },
    { field: 'totalTokenBalance', headerName: 'Total Token Balance', flex: 0.12, minWidth: 130, type: 'number' },
    { field: 'totalBonusBalance', headerName: 'Total Bonus Balance', flex: 0.12, minWidth: 130, type: 'number' },
    { field: 'totalPointBalance', headerName: 'Total Point Balance', flex: 0.12, minWidth: 130, type: 'number' },
    { field: 'subName', headerName: 'Sub Name', flex: 0.12, minWidth: 130 },
    { field: 'subIcardNo', headerName: 'sub I Card No', flex: 0.12, minWidth: 130 },
    { field: 'cardBalance', headerName: 'Card Balance', flex: 0.12, minWidth: 130, type: 'number' },
    { field: 'tokenBalance', headerName: 'Token Balance', flex: 0.12, minWidth: 130, type: 'number' },
    { field: 'bonusBalance', headerName: 'Bonus Balance', flex: 0.12, minWidth: 130, type: 'number' },
    { field: 'pointBalance', headerName: 'Point Balance', flex: 0.12, minWidth: 130, type: 'number' },
  ],
  cardTransferReport: [
    { field: 'entryDate', headerName: 'Date', flex: 0.12, minWidth: 120 },
    { field: 'name', headerName: 'Name', flex: 0.15, minWidth: 130 },
    { field: 'iCardNo', headerName: 'Card No', flex: 0.15, minWidth: 140 },
    { field: 'totalCardBalance', headerName: 'Total Card Balance', flex: 0.12, minWidth: 130, type: 'number' },
    { field: 'totalTokenBalance', headerName: 'Total Token Balance', flex: 0.12, minWidth: 130, type: 'number' },
    { field: 'totalBonusBalance', headerName: 'Total Bonus Balance', flex: 0.12, minWidth: 130, type: 'number' },
    { field: 'totalPointBalance', headerName: 'Total Point Balance', flex: 0.12, minWidth: 130, type: 'number' },
    { field: 'subName', headerName: 'Sub Name', flex: 0.12, minWidth: 130 },
    { field: 'subIcardNo', headerName: 'sub I Card No', flex: 0.12, minWidth: 130 },
    { field: 'cardBalance', headerName: 'Card Balance', flex: 0.12, minWidth: 130, type: 'number' },
    { field: 'tokenBalance', headerName: 'Token Balance', flex: 0.12, minWidth: 130, type: 'number' },
    { field: 'bonusBalance', headerName: 'Bonus Balance', flex: 0.12, minWidth: 130, type: 'number' },
    { field: 'pointBalance', headerName: 'Point Balance', flex: 0.12, minWidth: 130, type: 'number' },
  ],
  topPlayedGameReport: [
    { field: 'game', headerName: 'Game', flex: 0.12, minWidth: 120 },
    { field: 'playCount', headerName: 'Play Count', flex: 0.15, minWidth: 130 },
    { field: 'amount', headerName: 'Amount', flex: 0.15, minWidth: 140, type: 'number' },
    { field: 'macId', headerName: 'Mac Id', flex: 0.12, minWidth: 130 },
  ],
  cardVoidReport: [
    { field: 'entryDate', headerName: 'Date', flex: 0.12, minWidth: 120 },
    { field: 'invoiceNo', headerName: 'Invoice No', flex: 0.12, minWidth: 120 },
    { field: 'iCardNo', headerName: 'Card No', flex: 0.12, minWidth: 120 },
    { field: 'ledgerName', headerName: 'Nsme', flex: 0.15, minWidth: 130 },
    { field: 'balance', headerName: 'Balance', flex: 0.15, minWidth: 140, type: 'number' },
    { field: 'amount', headerName: 'Amount', flex: 0.12, minWidth: 130, type: 'number' },
    { field: 'currentBalance', headerName: 'Current Balance', flex: 0.12, minWidth: 130, type: 'number' },
  ]
}

export const getReportColumns = (reportType: string, cashRevenueOption?: string): ReportColumn[] => {
  if (reportType === 'cashRevenueReport') {
    return cashRevenueOption === '1' ? reportColumns.cashRevenueReportDetailed : reportColumns.cashRevenueReportNormal
  }

  return reportColumns[reportType] || []
}
