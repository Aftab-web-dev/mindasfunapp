import axiosConfig from './api-config'

export const rechargeAndBalanceApi = {
    sendPhoneNumber: async function ({ phone }: { phone: any }) {
        const queryParams = `Ph=${phone}`

        return await axiosConfig.post(`Recharge/VerifyNumber?${queryParams}`)
    },
    getCustomerData: async ({ ledgerId }: { ledgerId: number | string }) => {
        const queryParams = `ledgerId=${ledgerId.toString()}`

        return await axiosConfig.post(`Recharge/GetCustomerDetails?${queryParams}`)
    },
    getGst: async ({ locId }: { locId: number | undefined }) => {
        const queryParams = `locId=${locId}`

        return await axiosConfig.post(`Recharge/GetTaxDetails?${queryParams}`)
    },
    recharge: async ({ body }: { body: any }) => {
        const queryParams = `Amount=${body.amount}&Discount=${body.discount}&${body.taxPercentage && `TaxPercentage=${body.taxPercentage}&`}TaxAmount=${body.tax_amount}&LedgerId=${body.ledgerId}&NetAmount=${body.net_amount}&GNote=${body.g_note}&Remark=${body.remarks}&BranchId=${body.branchId}`

        return await axiosConfig.post(`Recharge/Recharge?${queryParams}`)
    }
}
