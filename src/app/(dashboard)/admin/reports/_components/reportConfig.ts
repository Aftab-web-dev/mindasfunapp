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

export interface ReportCategory {
  label: string
  icon: string
  reports: ReportType[]
}

export const reportCategories: ReportCategory[] = [
    {
        label: 'Revenue Reports',
        icon: 'tabler-coin-rupee',
        reports: [
          { value: 'cashRevenueReport', label: 'Cash Revenue Report' },
          { value: 'gameRevenueReport', label: 'Game Revenue Report' },
        ]
      },
  {
    label: 'Sales Reports',
    icon: 'tabler-chart-bar',
    reports: [
      { value: 'salesReport', label: 'Sales Report' },
      { value: 'salesDetailsReport', label: 'Sales Details Report' },
      { value: 'salesVoidReport', label: 'Sales Void Report' },
      { value: 'salesReturnReport', label: 'Sales Return Report' },
      { value: 'groupSaleReport', label: 'Group Sale Report' },
      { value: 'familyCardReport', label: 'Family Card Report' },
      { value: 'salesComplementaryReport', label: 'Sales Complementary Report' },
      { value: 'salesComplementaryDetailReport', label: 'Sales Complementary Detail Report' },
    ]
  },
  {
    label: 'Card Reports',
    icon: 'tabler-credit-card',
    reports: [
      { value: 'cardLiabilityReport', label: 'Card Liability Report' },
      { value: 'cardConsolidateReport', label: 'Card Consolidate Report' },
      { value: 'cardTransferReport', label: 'Card Transfer Report' },
      { value: 'cardVoidReport', label: 'Card Void Report' },
      { value: 'cardSummaryReport', label: 'Card Summary Report' },
      { value: 'clearCardReport', label: 'Clear Card Report' },
      { value: 'newCardCountReport', label: 'New Card Count Report' },
    ]
  },
  {
    label: 'Redemption Reports',
    icon: 'tabler-gift',
    reports: [
      { value: 'redeemptionReport', label: 'Redemption Report' },
      { value: 'redemptionSalesReport', label: 'Redemption Sales Report' },
      { value: 'redemptionComplementaryReport', label: 'Redemption Complementary Report' },
      { value: 'redemptionRedeemReport', label: 'Redemption Redeem Report' },
      { value: 'redemptionDamagedProductsReport', label: 'Redemption Damaged Products Report' },
      { value: 'redemptionSalesReportNew', label: 'Redemption Sales Report New' },
    ]
  },
  {
    label: 'Recharge Reports',
    icon: 'tabler-bolt',
    reports: [
      { value: 'rechargeReport', label: 'Recharge Report' },
      { value: 'rechargeRevenueReport', label: 'Recharge Revenue Report' },
    ]
  },
  {
    label: 'Game Reports',
    icon: 'tabler-player-play',
    reports: [
      { value: 'employeeGamePlayReport', label: 'Employee Game Play Report' },
      { value: 'topPlayedGameReport', label: 'Top Played Game Report' },
      { value: 'detailedEmployeeGamePlayReport', label: 'Detailed Employee Game Play Report' },
    ]
  },
  {
    label: 'Membership & Offers',
    icon: 'tabler-award',
    reports: [
      { value: 'membershipReport', label: 'Membership Report' },
      { value: 'offersListReport', label: 'Offers List Report' },
      { value: 'happyHourReport', label: 'Happy Hour Report' },
    ]
  },
  {
    label: 'Customer Reports',
    icon: 'tabler-users',
    reports: [
      { value: 'newCustomerRegisterReport', label: 'New Customer Register Report' },
      { value: 'customerTrafficReport', label: 'Customer Traffic Report' },
    ]
  },
  {
    label: 'POS Reports',
    icon: 'tabler-shopping-cart',
    reports: [
      { value: 'drawerAccessReport', label: 'Drawer Access Report' },
      { value: 'refundReport', label: 'Refund Report' },
      { value: 'requestPointReport', label: 'Request Point Report' },
      { value: 'thirdPartyCardTransReport', label: 'Third Party Card Transaction Report' },
    ]
  },
  {
    label: 'Advance POS',
    icon: 'tabler-device-analytics',
    reports: [
      { value: 'creditCardActivityReport', label: 'Credit Card Activity Report' },
      { value: 'memberActivityReport', label: 'Member Activity Report' },
    ]
  },
  {
    label: 'Inventory Reports',
    icon: 'tabler-package',
    reports: [
      { value: 'inventoryReport', label: 'Inventory Report' },
      { value: 'qtyAdjustmentReport', label: 'Qty Adjustment Report' },
      { value: 'reorderReport', label: 'Reorder Report' },
    ]
  },
  {
    label: 'Party Booking',
    icon: 'tabler-calendar-event',
    reports: [
      { value: 'partyPackListReport', label: 'Party Pack List Report' },
      { value: 'partyBookingReport', label: 'Party Booking Report' },
      { value: 'partyBookingDetailReport', label: 'Party Booking Detail Report' },
      { value: 'partyBookingPaymentDetailsReport', label: 'Party Booking Payment Details Report' },
    ]
  },
  {
    label: 'Employee Reports',
    icon: 'tabler-badge',
    reports: [
      { value: 'employeeListReport', label: 'Employee List Report' },
      { value: 'employeePaymentAdjustments', label: 'Employee Payment Adjustments' },
    ]
  },
  {
    label: 'Purchase Reports',
    icon: 'tabler-truck',
    reports: [
      { value: 'purchaseReport', label: 'Purchase Report' },
      { value: 'purchaseReturnReport', label: 'Purchase Return Report' },
    ]
  },
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
    { field: 'ledgerName', headerName: 'Name', flex: 0.15, minWidth: 130 },
    { field: 'balance', headerName: 'Balance', flex: 0.15, minWidth: 140, type: 'number' },
    { field: 'amount', headerName: 'Amount', flex: 0.12, minWidth: 130, type: 'number' },
    { field: 'currentBalance', headerName: 'Current Balance', flex: 0.12, minWidth: 130, type: 'number' },
  ],
  cardSummaryReport: [
    { field: 'entryDate', headerName: 'Date', flex: 0.12, minWidth: 120 },
    { field: 'iCardNo', headerName: 'Card No', flex: 0.15, minWidth: 130 },
    { field: 'ledgerName', headerName: 'Customer Name', flex: 0.15, minWidth: 140 },
    { field: 'cardBalance', headerName: 'Card Balance', flex: 0.12, minWidth: 130, type: 'number' },
    { field: 'status', headerName: 'Status', flex: 0.1, minWidth: 100 },
    { field: 'lastUsedOn', headerName: 'Last Used On', flex: 0.15, minWidth: 150 },
  ],
  creditCardActivityReport: [
    { field: 'entryDate', headerName: 'Date', flex: 0.12, minWidth: 120 },
    { field: 'iCardNo', headerName: 'Card No', flex: 0.15, minWidth: 130 },
    { field: 'customerName', headerName: 'Customer Name', flex: 0.15, minWidth: 140 },
    { field: 'amount', headerName: 'Amount', flex: 0.12, minWidth: 120, type: 'number' },
    { field: 'approvalCode', headerName: 'Approval Code', flex: 0.12, minWidth: 120 },
    { field: 'status', headerName: 'Status', flex: 0.1, minWidth: 100 },
  ],
  customerTrafficReport: [
    { field: 'entryDate', headerName: 'Date', flex: 0.15, minWidth: 120 },
    { field: 'timeSlot', headerName: 'Time Slot', flex: 0.15, minWidth: 130 },
    { field: 'count', headerName: 'Count', flex: 0.1, minWidth: 100, type: 'number' },
    { field: 'gender', headerName: 'Gender', flex: 0.1, minWidth: 100 },
  ],
  detailedEmployeeGamePlayReport: [
    { field: 'entryDate', headerName: 'Date', flex: 0.12, minWidth: 120 },
    { field: 'employeeName', headerName: 'Employee Name', flex: 0.2, minWidth: 150 },
    { field: 'iCardNo', headerName: 'Card No', flex: 0.15, minWidth: 130 },
    { field: 'game', headerName: 'Game', flex: 0.15, minWidth: 130 },
    { field: 'noOfPlayed', headerName: 'Times Played', flex: 0.12, minWidth: 110, type: 'number' },
    { field: 'amount', headerName: 'Amount', flex: 0.12, minWidth: 110, type: 'number' },
  ],
  drawerAccessReport: [
    { field: 'entryDate', headerName: 'Date', flex: 0.12, minWidth: 120 },
    { field: 'userName', headerName: 'User Name', flex: 0.15, minWidth: 130 },
    { field: 'openTime', headerName: 'Open Time', flex: 0.12, minWidth: 110 },
    { field: 'closeTime', headerName: 'Close Time', flex: 0.12, minWidth: 110 },
    { field: 'openingBalance', headerName: 'Opening Balance', flex: 0.15, minWidth: 130, type: 'number' },
    { field: 'closingBalance', headerName: 'Closing Balance', flex: 0.15, minWidth: 130, type: 'number' },
  ],
  employeeListReport: [
    { field: 'employeeName', headerName: 'Employee Name', flex: 0.2, minWidth: 150 },
    { field: 'designation', headerName: 'Designation', flex: 0.15, minWidth: 130 },
    { field: 'department', headerName: 'Department', flex: 0.15, minWidth: 130 },
    { field: 'mobile', headerName: 'Mobile', flex: 0.15, minWidth: 120 },
    { field: 'email', headerName: 'Email', flex: 0.2, minWidth: 150 },
    { field: 'joinDate', headerName: 'Join Date', flex: 0.12, minWidth: 120 },
  ],
  employeePaymentAdjustments: [
    { field: 'entryDate', headerName: 'Date', flex: 0.12, minWidth: 120 },
    { field: 'employeeName', headerName: 'Employee Name', flex: 0.2, minWidth: 150 },
    { field: 'amount', headerName: 'Amount', flex: 0.12, minWidth: 120, type: 'number' },
    { field: 'type', headerName: 'Type', flex: 0.12, minWidth: 110 },
    { field: 'reason', headerName: 'Reason', flex: 0.25, minWidth: 180 },
  ],
  familyCardReport: [
    { field: 'entryDate', headerName: 'Date', flex: 0.12, minWidth: 120 },
    { field: 'iCardNo', headerName: 'Card No', flex: 0.15, minWidth: 130 },
    { field: 'memberName', headerName: 'Member Name', flex: 0.15, minWidth: 140 },
    { field: 'relation', headerName: 'Relation', flex: 0.12, minWidth: 110 },
    { field: 'balance', headerName: 'Balance', flex: 0.12, minWidth: 120, type: 'number' },
  ],
  groupSaleReport: [
    { field: 'entryDate', headerName: 'Date', flex: 0.12, minWidth: 120 },
    { field: 'invoice', headerName: 'Invoice', flex: 0.15, minWidth: 130 },
    { field: 'groupName', headerName: 'Group Name', flex: 0.15, minWidth: 140 },
    { field: 'totalAmount', headerName: 'Total Amount', flex: 0.12, minWidth: 120, type: 'number' },
    { field: 'discountAmount', headerName: 'Discount', flex: 0.12, minWidth: 110, type: 'number' },
    { field: 'netAmount', headerName: 'Net Amount', flex: 0.12, minWidth: 120, type: 'number' },
  ],
  happyHourReport: [
    { field: 'day', headerName: 'Day', flex: 0.12, minWidth: 110 },
    { field: 'startTime', headerName: 'Start Time', flex: 0.12, minWidth: 110 },
    { field: 'endTime', headerName: 'End Time', flex: 0.12, minWidth: 110 },
    { field: 'discountPercent', headerName: 'Discount %', flex: 0.12, minWidth: 110, type: 'number' },
    { field: 'gameType', headerName: 'Game Type', flex: 0.15, minWidth: 130 },
  ],
  inventoryReport: [
    { field: 'productCode', headerName: 'Product Code', flex: 0.15, minWidth: 130 },
    { field: 'productName', headerName: 'Product Name', flex: 0.2, minWidth: 150 },
    { field: 'category', headerName: 'Category', flex: 0.12, minWidth: 110 },
    { field: 'openingStock', headerName: 'Opening Stock', flex: 0.12, minWidth: 110, type: 'number' },
    { field: 'received', headerName: 'Received', flex: 0.1, minWidth: 100, type: 'number' },
    { field: 'issued', headerName: 'Issued', flex: 0.1, minWidth: 100, type: 'number' },
    { field: 'closingStock', headerName: 'Closing Stock', flex: 0.12, minWidth: 110, type: 'number' },
  ],
  memberActivityReport: [
    { field: 'memberName', headerName: 'Member Name', flex: 0.2, minWidth: 150 },
    { field: 'iCardNo', headerName: 'Card No', flex: 0.15, minWidth: 130 },
    { field: 'activity', headerName: 'Activity', flex: 0.2, minWidth: 150 },
    { field: 'entryDate', headerName: 'Date', flex: 0.12, minWidth: 120 },
    { field: 'points', headerName: 'Points', flex: 0.1, minWidth: 100, type: 'number' },
  ],
  membershipReport: [
    { field: 'customerName', headerName: 'Customer Name', flex: 0.2, minWidth: 150 },
    { field: 'mobile', headerName: 'Mobile', flex: 0.15, minWidth: 120 },
    { field: 'membershipType', headerName: 'Membership Type', flex: 0.15, minWidth: 130 },
    { field: 'startDate', headerName: 'Start Date', flex: 0.12, minWidth: 120 },
    { field: 'endDate', headerName: 'End Date', flex: 0.12, minWidth: 120 },
    { field: 'points', headerName: 'Points', flex: 0.1, minWidth: 100, type: 'number' },
    { field: 'status', headerName: 'Status', flex: 0.1, minWidth: 100 },
  ],
  newCardCountReport: [
    { field: 'entryDate', headerName: 'Date', flex: 0.15, minWidth: 120 },
    { field: 'cardType', headerName: 'Card Type', flex: 0.15, minWidth: 130 },
    { field: 'count', headerName: 'Count', flex: 0.1, minWidth: 100, type: 'number' },
    { field: 'issuedBy', headerName: 'Issued By', flex: 0.15, minWidth: 130 },
  ],
  newCustomerRegisterReport: [
    { field: 'entryDate', headerName: 'Date', flex: 0.12, minWidth: 120 },
    { field: 'customerName', headerName: 'Customer Name', flex: 0.2, minWidth: 150 },
    { field: 'mobile', headerName: 'Mobile', flex: 0.15, minWidth: 120 },
    { field: 'email', headerName: 'Email', flex: 0.2, minWidth: 150 },
    { field: 'iCardNo', headerName: 'Card No', flex: 0.15, minWidth: 130 },
  ],
  offersListReport: [
    { field: 'offerName', headerName: 'Offer Name', flex: 0.2, minWidth: 150 },
    { field: 'description', headerName: 'Description', flex: 0.25, minWidth: 200 },
    { field: 'discountType', headerName: 'Discount Type', flex: 0.12, minWidth: 110 },
    { field: 'discountValue', headerName: 'Discount Value', flex: 0.12, minWidth: 110, type: 'number' },
    { field: 'startDate', headerName: 'Start Date', flex: 0.12, minWidth: 120 },
    { field: 'endDate', headerName: 'End Date', flex: 0.12, minWidth: 120 },
    { field: 'status', headerName: 'Status', flex: 0.1, minWidth: 100 },
  ],
  partyBookingDetailReport: [
    { field: 'bookingDate', headerName: 'Booking Date', flex: 0.12, minWidth: 120 },
    { field: 'customerName', headerName: 'Customer Name', flex: 0.15, minWidth: 140 },
    { field: 'packName', headerName: 'Pack Name', flex: 0.15, minWidth: 130 },
    { field: 'eventDate', headerName: 'Event Date', flex: 0.12, minWidth: 120 },
    { field: 'totalAmount', headerName: 'Total Amount', flex: 0.12, minWidth: 120, type: 'number' },
    { field: 'status', headerName: 'Status', flex: 0.1, minWidth: 100 },
  ],
  partyBookingPaymentDetailsReport: [
    { field: 'bookingDate', headerName: 'Booking Date', flex: 0.12, minWidth: 120 },
    { field: 'customerName', headerName: 'Customer Name', flex: 0.15, minWidth: 140 },
    { field: 'amount', headerName: 'Amount', flex: 0.12, minWidth: 120, type: 'number' },
    { field: 'paymentMode', headerName: 'Payment Mode', flex: 0.12, minWidth: 120 },
    { field: 'transactionId', headerName: 'Transaction ID', flex: 0.15, minWidth: 130 },
  ],
  partyBookingReport: [
    { field: 'bookingDate', headerName: 'Booking Date', flex: 0.12, minWidth: 120 },
    { field: 'customerName', headerName: 'Customer Name', flex: 0.15, minWidth: 140 },
    { field: 'mobile', headerName: 'Mobile', flex: 0.15, minWidth: 120 },
    { field: 'packName', headerName: 'Pack Name', flex: 0.15, minWidth: 130 },
    { field: 'totalAmount', headerName: 'Total Amount', flex: 0.12, minWidth: 120, type: 'number' },
    { field: 'advance', headerName: 'Advance', flex: 0.1, minWidth: 100, type: 'number' },
    { field: 'balance', headerName: 'Balance', flex: 0.1, minWidth: 100, type: 'number' },
  ],
  partyPackListReport: [
    { field: 'packName', headerName: 'Pack Name', flex: 0.2, minWidth: 150 },
    { field: 'description', headerName: 'Description', flex: 0.25, minWidth: 200 },
    { field: 'price', headerName: 'Price', flex: 0.12, minWidth: 110, type: 'number' },
    { field: 'capacity', headerName: 'Capacity', flex: 0.1, minWidth: 100, type: 'number' },
  ],
  purchaseReport: [
    { field: 'entryDate', headerName: 'Date', flex: 0.12, minWidth: 120 },
    { field: 'invoiceNo', headerName: 'Invoice No', flex: 0.15, minWidth: 130 },
    { field: 'supplierName', headerName: 'Supplier Name', flex: 0.15, minWidth: 140 },
    { field: 'product', headerName: 'Product', flex: 0.15, minWidth: 130 },
    { field: 'quantity', headerName: 'Quantity', flex: 0.1, minWidth: 100, type: 'number' },
    { field: 'rate', headerName: 'Rate', flex: 0.1, minWidth: 100, type: 'number' },
    { field: 'amount', headerName: 'Amount', flex: 0.12, minWidth: 110, type: 'number' },
    { field: 'totalAmount', headerName: 'Total Amount', flex: 0.12, minWidth: 120, type: 'number' },
  ],
  purchaseReturnReport: [
    { field: 'entryDate', headerName: 'Date', flex: 0.12, minWidth: 120 },
    { field: 'invoiceNo', headerName: 'Invoice No', flex: 0.15, minWidth: 130 },
    { field: 'supplierName', headerName: 'Supplier Name', flex: 0.15, minWidth: 140 },
    { field: 'product', headerName: 'Product', flex: 0.15, minWidth: 130 },
    { field: 'quantity', headerName: 'Quantity', flex: 0.1, minWidth: 100, type: 'number' },
    { field: 'amount', headerName: 'Amount', flex: 0.12, minWidth: 110, type: 'number' },
    { field: 'reason', headerName: 'Reason', flex: 0.2, minWidth: 150 },
  ],
  qtyAdjustmentReport: [
    { field: 'entryDate', headerName: 'Date', flex: 0.12, minWidth: 120 },
    { field: 'productCode', headerName: 'Product Code', flex: 0.15, minWidth: 130 },
    { field: 'productName', headerName: 'Product Name', flex: 0.2, minWidth: 150 },
    { field: 'adjustmentType', headerName: 'Adjustment Type', flex: 0.15, minWidth: 130 },
    { field: 'qty', headerName: 'Quantity', flex: 0.1, minWidth: 100, type: 'number' },
    { field: 'reason', headerName: 'Reason', flex: 0.2, minWidth: 150 },
  ],
  redemptionComplementaryReport: [
    { field: 'entryDate', headerName: 'Date', flex: 0.12, minWidth: 120 },
    { field: 'name', headerName: 'Customer Name', flex: 0.15, minWidth: 140 },
    { field: 'iCardNo', headerName: 'Card No', flex: 0.15, minWidth: 130 },
    { field: 'product', headerName: 'Product', flex: 0.15, minWidth: 130 },
    { field: 'point', headerName: 'Points', flex: 0.1, minWidth: 100, type: 'number' },
    { field: 'qty', headerName: 'Quantity', flex: 0.1, minWidth: 100, type: 'number' },
  ],
  redemptionDamagedProductsReport: [
    { field: 'entryDate', headerName: 'Date', flex: 0.12, minWidth: 120 },
    { field: 'product', headerName: 'Product', flex: 0.2, minWidth: 150 },
    { field: 'barCode', headerName: 'Barcode', flex: 0.15, minWidth: 130 },
    { field: 'qty', headerName: 'Quantity', flex: 0.1, minWidth: 100, type: 'number' },
    { field: 'reason', headerName: 'Reason', flex: 0.2, minWidth: 150 },
  ],
  redemptionRedeemReport: [
    { field: 'entryDate', headerName: 'Date', flex: 0.12, minWidth: 120 },
    { field: 'name', headerName: 'Customer Name', flex: 0.15, minWidth: 140 },
    { field: 'iCardNo', headerName: 'Card No', flex: 0.15, minWidth: 130 },
    { field: 'product', headerName: 'Product', flex: 0.15, minWidth: 130 },
    { field: 'point', headerName: 'Points', flex: 0.1, minWidth: 100, type: 'number' },
    { field: 'qty', headerName: 'Quantity', flex: 0.1, minWidth: 100, type: 'number' },
    { field: 'net', headerName: 'Net', flex: 0.12, minWidth: 110, type: 'number' },
  ],
  redemptionSalesReportNew: [
    { field: 'entryDate', headerName: 'Date', flex: 0.12, minWidth: 120 },
    { field: 'invoice', headerName: 'Invoice', flex: 0.15, minWidth: 130 },
    { field: 'cusName', headerName: 'Customer', flex: 0.15, minWidth: 140 },
    { field: 'product', headerName: 'Product', flex: 0.15, minWidth: 130 },
    { field: 'quantity', headerName: 'Quantity', flex: 0.1, minWidth: 100, type: 'number' },
    { field: 'salesRate', headerName: 'Rate', flex: 0.1, minWidth: 100, type: 'number' },
    { field: 'netAmount', headerName: 'Net Amount', flex: 0.12, minWidth: 120, type: 'number' },
  ],
  refundReport: [
    { field: 'entryDate', headerName: 'Date', flex: 0.12, minWidth: 120 },
    { field: 'invoiceNo', headerName: 'Invoice No', flex: 0.15, minWidth: 130 },
    { field: 'customerName', headerName: 'Customer Name', flex: 0.15, minWidth: 140 },
    { field: 'amount', headerName: 'Amount', flex: 0.12, minWidth: 120, type: 'number' },
    { field: 'reason', headerName: 'Reason', flex: 0.2, minWidth: 150 },
    { field: 'refundBy', headerName: 'Refund By', flex: 0.15, minWidth: 130 },
  ],
  reorderReport: [
    { field: 'productCode', headerName: 'Product Code', flex: 0.15, minWidth: 130 },
    { field: 'productName', headerName: 'Product Name', flex: 0.2, minWidth: 150 },
    { field: 'currentStock', headerName: 'Current Stock', flex: 0.12, minWidth: 110, type: 'number' },
    { field: 'reorderLevel', headerName: 'Reorder Level', flex: 0.12, minWidth: 110, type: 'number' },
    { field: 'reorderQty', headerName: 'Reorder Qty', flex: 0.1, minWidth: 100, type: 'number' },
    { field: 'supplier', headerName: 'Supplier', flex: 0.15, minWidth: 130 },
  ],
  requestPointReport: [
    { field: 'entryDate', headerName: 'Date', flex: 0.12, minWidth: 120 },
    { field: 'customerName', headerName: 'Customer Name', flex: 0.15, minWidth: 140 },
    { field: 'iCardNo', headerName: 'Card No', flex: 0.15, minWidth: 130 },
    { field: 'points', headerName: 'Points', flex: 0.1, minWidth: 100, type: 'number' },
    { field: 'status', headerName: 'Status', flex: 0.1, minWidth: 100 },
  ],
  salesComplementaryDetailReport: [
    { field: 'entryDate', headerName: 'Date', flex: 0.12, minWidth: 120 },
    { field: 'invoice', headerName: 'Invoice', flex: 0.15, minWidth: 130 },
    { field: 'customerName', headerName: 'Customer', flex: 0.15, minWidth: 140 },
    { field: 'product', headerName: 'Product', flex: 0.15, minWidth: 130 },
    { field: 'quantity', headerName: 'Quantity', flex: 0.1, minWidth: 100, type: 'number' },
    { field: 'rate', headerName: 'Rate', flex: 0.1, minWidth: 100, type: 'number' },
    { field: 'amount', headerName: 'Amount', flex: 0.12, minWidth: 110, type: 'number' },
  ],
  salesComplementaryReport: [
    { field: 'entryDate', headerName: 'Date', flex: 0.12, minWidth: 120 },
    { field: 'invoice', headerName: 'Invoice', flex: 0.15, minWidth: 130 },
    { field: 'customerName', headerName: 'Customer Name', flex: 0.15, minWidth: 140 },
    { field: 'product', headerName: 'Product', flex: 0.15, minWidth: 130 },
    { field: 'quantity', headerName: 'Quantity', flex: 0.1, minWidth: 100, type: 'number' },
    { field: 'amount', headerName: 'Amount', flex: 0.12, minWidth: 110, type: 'number' },
  ],
  salesReturnReport: [
    { field: 'entryDate', headerName: 'Date', flex: 0.12, minWidth: 120 },
    { field: 'invoiceNo', headerName: 'Invoice No', flex: 0.15, minWidth: 130 },
    { field: 'customerName', headerName: 'Customer Name', flex: 0.15, minWidth: 140 },
    { field: 'mobile', headerName: 'Mobile', flex: 0.15, minWidth: 120 },
    { field: 'returnAmount', headerName: 'Return Amount', flex: 0.12, minWidth: 120, type: 'number' },
    { field: 'reason', headerName: 'Reason', flex: 0.2, minWidth: 150 },
  ],
  salesVoidReport: [
    { field: 'entryDate', headerName: 'Date', flex: 0.12, minWidth: 120 },
    { field: 'invoiceNo', headerName: 'Invoice No', flex: 0.15, minWidth: 130 },
    { field: 'customerName', headerName: 'Customer Name', flex: 0.15, minWidth: 140 },
    { field: 'mobile', headerName: 'Mobile', flex: 0.15, minWidth: 120 },
    { field: 'amount', headerName: 'Amount', flex: 0.12, minWidth: 110, type: 'number' },
    { field: 'voidReason', headerName: 'Void Reason', flex: 0.2, minWidth: 150 },
    { field: 'voidBy', headerName: 'Void By', flex: 0.12, minWidth: 110 },
  ],
  thirdPartyCardTransReport: [
    { field: 'entryDate', headerName: 'Date', flex: 0.12, minWidth: 120 },
    { field: 'iCardNo', headerName: 'Card No', flex: 0.15, minWidth: 130 },
    { field: 'amount', headerName: 'Amount', flex: 0.12, minWidth: 120, type: 'number' },
    { field: 'transactionType', headerName: 'Transaction Type', flex: 0.15, minWidth: 130 },
    { field: 'status', headerName: 'Status', flex: 0.1, minWidth: 100 },
    { field: 'remarks', headerName: 'Remarks', flex: 0.2, minWidth: 150 },
  ],
}

export const getReportColumns = (reportType: string, cashRevenueOption?: string): ReportColumn[] => {
  if (reportType === 'cashRevenueReport') {
    return cashRevenueOption === '1' ? reportColumns.cashRevenueReportDetailed : reportColumns.cashRevenueReportNormal
  }

  return reportColumns[reportType] || []
}
