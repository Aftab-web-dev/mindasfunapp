import axiosConfig from './api-config'

export const customerApi = {
  addCustomer: async function ({ body }: { body: {} }) {
    return await axiosConfig.post(`Customer/AddOrEditCustomer`, body)
  },
  getAllCustomers: async function () {
    return await axiosConfig.post(`Customer/GetCustomerList`)
  },
  getOneCustomer: async function ({ ledgerId }: { ledgerId: any }) {
    return await axiosConfig.post(`Customer/GetCustomerData?LedgerId=${ledgerId}`)
  },
  deleteCustomer: async function ({ id, EmpId }: { id: string | number, EmpId: number | undefined }) {
    return await axiosConfig.post(`Customer/DeleteCustomer?LedgerId=${id}&EmpId=${EmpId}`)
  }
}
