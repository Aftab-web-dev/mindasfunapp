import axiosConfig from './api-config'

export const eventsApi = {

  getEventsList:  async function ({ branchId }: { branchId: any }) {
    return await axiosConfig.post(`Event/GetEventList?BranchId=${branchId}`)
  },
  getOneCustomer:  async function ({ledgerId}: { ledgerId: any } ) {
    return await axiosConfig.post(`Customer/GetCustomerData?LedgerId=${ledgerId}`)
  },
  updateCustomer:  async function ({ body,ledgerId }: { body: any,ledgerId: any  }) {
    return await axiosConfig.post(`Customer/AddOrEditCustomer?LedgerId=${ledgerId}`, body)
  },
}
