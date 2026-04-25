import axiosConfig from './api-config'

export const rechargeAndBalanceApi = {
    sendPhoneNumber: async function ({ phone }: { phone: any }) {
        const queryParams = `Ph=${phone}`

        return await axiosConfig.post(`Recharge/VerifyNumber?${queryParams}`, {})
    },
    getCustomerData: async ({ ledgerId }: { ledgerId: number | string }) => {
        const queryParams = `ledgerId=${ledgerId.toString()}`

        return await axiosConfig.post(`Recharge/GetCustomerDetails?${queryParams}`, {})
    },
    getGst: async ({ locId }: { locId: number | undefined }) => {
        const queryParams = `locId=${locId}`

        return await axiosConfig.post(`Recharge/GetTaxDetails?${queryParams}`, {})
    },
    recharge: async ({ body }: { body: any }) => {
        const params = new URLSearchParams()

        params.set('Amount', String(body.amount ?? 0))
        params.set('Discount', String(body.discount ?? 0))

        if (body.taxPercentage !== undefined && body.taxPercentage !== null) {
            params.set('TaxPercentage', String(body.taxPercentage))
        }

        params.set('TaxAmount', String(body.tax_amount ?? 0))
        params.set('LedgerId', String(body.ledgerId ?? ''))
        params.set('NetAmount', String(body.net_amount ?? 0))
        params.set('GNote', String(body.g_note ?? ''))
        params.set('Remark', String(body.remarks ?? ''))
        params.set('BranchId', String(body.branchId ?? ''))

        return await axiosConfig.post(`Recharge/Recharge?${params.toString()}`, {})
    }
}
