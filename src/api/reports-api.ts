import axiosConfig from './api-config'

type params = {
    fTime: string,
    tTime: string,
    branchId: string | undefined,
    option?: number | string
}

export const reportsApi = {
    cashRevenueReport: async (params: params) => {
        const { fTime, tTime, branchId, option } = params

        const queryParams = `fTime=${fTime}&tTime=${tTime}&BranchId=${branchId}&Option=${option}`

        const response = await axiosConfig.post(`Report/CashRevenueReport?${queryParams}`)

        return response.data
    },
    gameRevenueReport: async (params: params) => {
        const { fTime, tTime, branchId } = params

        const queryParams = `fTime=${fTime}&tTime=${tTime}&BranchId=${branchId}`

        const response = await axiosConfig.post(`Report/GameRevenueReport?${queryParams}`)

        return response.data
    },
    salesReport: async (params: params) => {
        const { fTime, tTime, branchId } = params
        const queryParams = `fTime=${fTime}&tTime=${tTime}&BranchId=${branchId}`

        const response = await axiosConfig.post(`Report/SalesReport?${queryParams}`)

        return response.data

    },
    salesDetailsReport: async (params: params) => {
        const { fTime, tTime, branchId } = params
        const queryParams = `fTime=${fTime}&tTime=${tTime}&BranchId=${branchId}`

        const response = await axiosConfig.post(`Report/SalesDetailReport?${queryParams}`)

        return response.data
    },
    redeemptionReport: async (params: params) => {
        const { fTime, tTime, branchId } = params
        const queryParams = `fTime=${fTime}&tTime=${tTime}&BranchId=${branchId}`

        const response = await axiosConfig.post(`Report/RedeemptionReport?${queryParams}`)

        return response.data
    },
    redemptionSalesReport: async (params: params) => {
        const { fTime, tTime, branchId } = params

        const queryParams = `fTime=${fTime}&tTime=${tTime}&BranchId=${branchId}`

        const response = await axiosConfig.post(`Report/RedeemptionSalesReport?${queryParams}`)

        return response.data
    },
    rechargeReport: async (params: params) => {
        const { fTime, tTime, branchId } = params
        const queryParams = `fTime=${fTime}&tTime=${tTime}&BranchId=${branchId}`

        const response = await axiosConfig.post(`Report/RechargeReport?${queryParams}`)

        return response.data
    },
    rechargeRevenueReport: async (params: params) => {
        const { fTime, tTime, branchId } = params

        const queryParams = `fTime=${fTime}&tTime=${tTime}&BranchId=${branchId}`

        const response = await axiosConfig.post(`Report/RechargeRevenueReport?${queryParams}`)

        return response.data
    },
    employeeGamePlayReport: async (params: params) => {
        const { fTime, tTime, branchId } = params

        const queryParams = `fTime=${fTime}&tTime=${tTime}&BranchId=${branchId}`

        const response = await axiosConfig.post(`Report/EmployeeGamePlayReport?${queryParams}`)

        return response.data
    },
    cardLiabilityReport: async (params: params) => {
        const { fTime, tTime, branchId } = params

        const queryParams = `fTime=${fTime}&tTime=${tTime}&BranchId=${branchId}`

        const response = await axiosConfig.post(`Report/CardLiabilityReport?${queryParams}`)

        return response.data
    },
    clearCardReport: async (params: params) => {
        const { fTime, tTime, branchId } = params

        const queryParams = `fTime=${fTime}&tTime=${tTime}&BranchId=${branchId}`

        const response = await axiosConfig.post(`Report/ClearCardReport?${queryParams}`)

        return response.data
    },
    cardConsolidateReport: async (params: params) => {
        const { fTime, tTime, branchId } = params

        const queryParams = `fTime=${fTime}&tTime=${tTime}&BranchId=${branchId}`

        const response = await axiosConfig.post(`Report/CardConsolidateReport?${queryParams}`)

        return response.data
    },
    cardTransferReport: async (params: params) => {
        const { fTime, tTime, branchId } = params

        const queryParams = `fTime=${fTime}&tTime=${tTime}&BranchId=${branchId}`

        const response = await axiosConfig.post(`Report/CardTransferReport?${queryParams}`)

        return response.data
    },
    topPlayedGameReport: async (params: params) => {
        const { fTime, tTime, branchId } = params

        const queryParams = `fTime=${fTime}&tTime=${tTime}&BranchId=${branchId}`

        const response = await axiosConfig.post(`Report/TopPlayedGameReport?${queryParams}`)

        return response.data
    },
    cardVoidReport: async (params: params) => {
        const { fTime, tTime, branchId } = params

        const queryParams = `fTime=${fTime}&tTime=${tTime}&BranchId=${branchId}`

        const response = await axiosConfig.post(`Report/cardVoidReport?${queryParams}`)

        return response.data
    },

    // ==================== Membership & Offers Reports ====================
    membershipReport: async () => {
        const response = await axiosConfig.post(`Report/MemberShipReport`)
        return response.data
    },
    offersListReport: async (params: params) => {
        const { fTime, tTime, branchId } = params
        const queryParams = `fTime=${fTime}&tTime=${tTime}&BranchId=${branchId}`
        const response = await axiosConfig.post(`Report/OffersListReport?${queryParams}`)
        return response.data
    },
    happyHourReport: async (branchId: string | undefined) => {
        const queryParams = `BranchId=${branchId}`
        const response = await axiosConfig.post(`Report/HappyHourReport?${queryParams}`)
        return response.data
    },

    // ==================== Sales Reports ====================
    salesVoidReport: async (params: params) => {
        const { fTime, tTime, branchId } = params
        const queryParams = `fTime=${fTime}&tTime=${tTime}&BranchId=${branchId}`
        const response = await axiosConfig.post(`Report/SalesVoidReport?${queryParams}`)
        return response.data
    },
    salesReturnReport: async (params: params) => {
        const { fTime, tTime, branchId } = params
        const queryParams = `fTime=${fTime}&tTime=${tTime}&BranchId=${branchId}`
        const response = await axiosConfig.post(`Report/SalesReturnReport?${queryParams}`)
        return response.data
    },
    groupSaleReport: async (params: params) => {
        const { fTime, tTime, branchId } = params
        const queryParams = `fTime=${fTime}&tTime=${tTime}&BranchId=${branchId}`
        const response = await axiosConfig.post(`Report/GroupSale?${queryParams}`)
        return response.data
    },
    familyCardReport: async (params: params) => {
        const { fTime, tTime, branchId } = params
        const queryParams = `fTime=${fTime}&tTime=${tTime}&BranchId=${branchId}`
        const response = await axiosConfig.post(`Report/FamilyCardReport?${queryParams}`)
        return response.data
    },

    // ==================== Customer Reports ====================
    newCardCountReport: async (params: params) => {
        const { fTime, tTime, branchId } = params
        const queryParams = `fTime=${fTime}&tTime=${tTime}&BranchId=${branchId}`
        const response = await axiosConfig.post(`Report/NewCardCountReport?${queryParams}`)
        return response.data
    },
    newCustomerRegisterReport: async (params: params) => {
        const { fTime, tTime, branchId } = params
        const queryParams = `fTime=${fTime}&tTime=${tTime}&BranchId=${branchId}`
        const response = await axiosConfig.post(`Report/NewCustomerRegisterReport?${queryParams}`)
        return response.data
    },
    cardSummaryReport: async (params: params) => {
        const { fTime, tTime, branchId } = params
        const queryParams = `fTime=${fTime}&tTime=${tTime}&BranchId=${branchId}`
        const response = await axiosConfig.post(`Report/CardSummeryReport?${queryParams}`)
        return response.data
    },
    customerTrafficReport: async (params: params) => {
        const { fTime, tTime, branchId } = params
        const queryParams = `fTime=${fTime}&tTime=${tTime}&BranchId=${branchId}`
        const response = await axiosConfig.post(`Report/CustomerTrafficReport?${queryParams}`)
        return response.data
    },

    // ==================== POS Reports ====================
    drawerAccessReport: async (params: params) => {
        const { fTime, tTime, branchId } = params
        const queryParams = `fTime=${fTime}&tTime=${tTime}&BranchId=${branchId}`
        const response = await axiosConfig.post(`Report/DrawerAccessReport?${queryParams}`)
        return response.data
    },
    refundReport: async (params: params) => {
        const { fTime, tTime, branchId } = params
        const queryParams = `fTime=${fTime}&tTime=${tTime}&BranchId=${branchId}`
        const response = await axiosConfig.post(`Report/RefaundReport?${queryParams}`)
        return response.data
    },
    requestPointReport: async (params: params) => {
        const { fTime, tTime, branchId } = params
        const queryParams = `fTime=${fTime}&tTime=${tTime}&BranchId=${branchId}`
        const response = await axiosConfig.post(`Report/RequestPointReport?${queryParams}`)
        return response.data
    },
    thirdPartyCardTransReport: async (params: { fTime: string, tTime: string, status?: number }) => {
        const { fTime, tTime, status } = params
        const queryParams = `fTime=${fTime}&tTime=${tTime}&Status=${status}`
        const response = await axiosConfig.post(`Report/ThirdPartyCardTransReport?${queryParams}`)
        return response.data
    },

    // ==================== Advance POS Reports ====================
    creditCardActivityReport: async (params: params) => {
        const { fTime, tTime, branchId } = params
        const queryParams = `fTime=${fTime}&tTime=${tTime}&BranchId=${branchId}`
        const response = await axiosConfig.post(`Report/CreditCardActivityReport?${queryParams}`)
        return response.data
    },
    memberActivityReport: async (branchId: string | undefined) => {
        const queryParams = `BranchId=${branchId}`
        const response = await axiosConfig.post(`Report/MemberActivityReport?${queryParams}`)
        return response.data
    },
    salesComplementaryReport: async (params: params) => {
        const { fTime, tTime, branchId } = params
        const queryParams = `fTime=${fTime}&tTime=${tTime}&BranchId=${branchId}`
        const response = await axiosConfig.post(`Report/SalesComplementryReport?${queryParams}`)
        return response.data
    },
    salesComplementaryDetailReport: async (params: params) => {
        const { fTime, tTime, branchId } = params
        const queryParams = `fTime=${fTime}&tTime=${tTime}&BranchId=${branchId}`
        const response = await axiosConfig.post(`Report/SalesComplementryDetailReport?${queryParams}`)
        return response.data
    },

    // ==================== Game Revenue Reports ====================
    detailedEmployeeGamePlayReport: async (params: params & { empid?: number }) => {
        const { fTime, tTime, branchId, empid } = params
        const queryParams = `fTime=${fTime}&tTime=${tTime}&BranchId=${branchId}&empid=${empid || 0}`
        const response = await axiosConfig.post(`Report/DetailedEmployeeGamePlayReport?${queryParams}`)
        return response.data
    },

    // ==================== Redemption Reports ====================
    redemptionComplementaryReport: async (params: params) => {
        const { fTime, tTime, branchId } = params
        const queryParams = `fTime=${fTime}&tTime=${tTime}&BranchId=${branchId}`
        const response = await axiosConfig.post(`Report/RedemptionComplementryreport?${queryParams}`)
        return response.data
    },
    redemptionRedeemReport: async (params: params) => {
        const { fTime, tTime, branchId } = params
        const queryParams = `fTime=${fTime}&tTime=${tTime}&BranchId=${branchId}`
        const response = await axiosConfig.post(`Report/RedemptionRedeemreport?${queryParams}`)
        return response.data
    },
    redemptionDamagedProductsReport: async (params: params) => {
        const { fTime, tTime, branchId } = params
        const queryParams = `fTime=${fTime}&tTime=${tTime}&BranchId=${branchId}`
        const response = await axiosConfig.post(`Report/RedemptionDamagedProductsreport?${queryParams}`)
        return response.data
    },
    redemptionSalesReportNew: async (params: params) => {
        const { fTime, tTime, branchId } = params
        const queryParams = `fTime=${fTime}&tTime=${tTime}&BranchId=${branchId}`
        const response = await axiosConfig.post(`Report/RedemptionSalesreport?${queryParams}`)
        return response.data
    },

    // ==================== Inventory Reports ====================
    inventoryReport: async (params: { branchId: string | undefined, producttype: number }) => {
        const { branchId, producttype } = params
        const queryParams = `BranchId=${branchId}&producttype=${producttype}`
        const response = await axiosConfig.post(`Report/InventoryReport?${queryParams}`)
        return response.data
    },
    qtyAdjustmentReport: async (params: params) => {
        const { fTime, tTime, branchId } = params
        const queryParams = `fTime=${fTime}&tTime=${tTime}&BranchId=${branchId}`
        const response = await axiosConfig.post(`Report/QtyAdjustmentReport?${queryParams}`)
        return response.data
    },
    reorderReport: async (params: { branchId: string | undefined, ReorderCount?: number }) => {
        const { branchId, ReorderCount } = params
        const queryParams = `BranchId=${branchId}&ReorderCount=${ReorderCount || 100}`
        const response = await axiosConfig.post(`Report/ReorderReport?${queryParams}`)
        return response.data
    },

    // ==================== Party Booking Reports ====================
    partyPackListReport: async (branchId: string | undefined) => {
        const queryParams = `BranchId=${branchId}`
        const response = await axiosConfig.post(`Report/PartyPackListreport?${queryParams}`)
        return response.data
    },
    partyBookingReport: async (params: params) => {
        const { fTime, tTime, branchId } = params
        const queryParams = `fTime=${fTime}&tTime=${tTime}&BranchId=${branchId}`
        const response = await axiosConfig.post(`Report/PartyBookingreport?${queryParams}`)
        return response.data
    },
    partyBookingDetailReport: async (params: params) => {
        const { fTime, tTime, branchId } = params
        const queryParams = `fTime=${fTime}&tTime=${tTime}&BranchId=${branchId}`
        const response = await axiosConfig.post(`Report/PartyBookingdetailreport?${queryParams}`)
        return response.data
    },
    partyBookingPaymentDetailsReport: async (params: params) => {
        const { fTime, tTime, branchId } = params
        const queryParams = `fTime=${fTime}&tTime=${tTime}&BranchId=${branchId}`
        const response = await axiosConfig.post(`Report/PartybookingPaymentDetailsreport?${queryParams}`)
        return response.data
    },

    // ==================== Employee Reports ====================
    employeeListReport: async (branchId: string | undefined) => {
        const queryParams = `BranchId=${branchId}`
        const response = await axiosConfig.post(`Report/EmployeeListReport?${queryParams}`)
        return response.data
    },
    employeePaymentAdjustments: async (params: params) => {
        const { fTime, tTime, branchId } = params
        const queryParams = `fTime=${fTime}&tTime=${tTime}&BranchId=${branchId}`
        const response = await axiosConfig.post(`Report/EmployeePaymentAdjustments?${queryParams}`)
        return response.data
    },

    // ==================== Purchase Reports ====================
    purchaseReport: async (params: params) => {
        const { fTime, tTime, branchId } = params
        const queryParams = `fTime=${fTime}&tTime=${tTime}&BranchId=${branchId}`
        const response = await axiosConfig.post(`Report/PurchaseReport?${queryParams}`)
        return response.data
    },
    purchaseReturnReport: async (params: params) => {
        const { fTime, tTime, branchId } = params
        const queryParams = `fTime=${fTime}&tTime=${tTime}&BranchId=${branchId}`
        const response = await axiosConfig.post(`Report/PurchaseReturnReport?${queryParams}`)
        return response.data
    },
}
