import axiosConfig from './api-config'

export const customerModuleApi = {
    login: async function ({ phone }: { phone: string | number }) {
        return await axiosConfig.post(`CusModule/CusLogin?Ph=${phone}`, {}, { skipAuthRedirect: true })
    },
    register: async function ({ body }: { body: any }) {
        return await axiosConfig.post(`CusModule/RegOrEditCustomer`, body)
    },
    getCustomerData: async function ({ ledgerId }: { ledgerId: number | string }) {
        return await axiosConfig.post(`CusModule/GetCustomerData?LedgerID=${ledgerId}`)
    },
    addOrEditEventBooking: async function ({ body }: { body: any }) {
        return await axiosConfig.post(`CusModule/AddEditEventBooking`, body)
    },
    getEventList: async function ({ ledgerId }: { ledgerId: number | string }) {
        return await axiosConfig.post(`CusModule/GetEventList?LedgerId=${ledgerId}`)
    },
    recharge: async function ({ amount, ledgerId, branchId }: { amount: number | string, ledgerId: number | string, branchId: number | string | undefined }) {
        const queryParams = `Amount=${amount}&LedgerId=${ledgerId}&BranchId=${branchId}`

        return await axiosConfig.post(`CusModule/Recharge?${queryParams}`)
    },
    rechargeHistory: async function ({ ledgerId }: { ledgerId: number | string }) {
        return await axiosConfig.post(`CusModule/RechargeHistory?LedgerId=${ledgerId}`)
    },
    waiverList: async function () {
        return await axiosConfig.post(`CusModule/WaverFormList`)
    },
    waiverSingleData: async function ({ ledgerId }: { ledgerId: number | string }) {
        return await axiosConfig.post(`CusModule/WaverSingleData?LedgerId=${ledgerId}`)
    }
}
