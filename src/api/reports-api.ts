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
}
