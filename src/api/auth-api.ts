import axiosConfig from './api-config'

export const authApi = {
  postAuth: async function ({ query }: { query: { password: string, email: string } }) {
    const queryParams = `Username=${query.email}&Password=${query.password}`

    return await axiosConfig.post(`Login/CheckLogin?${queryParams}`, {}, { skipAuthRedirect: true })
  },
  updateProfile: async function ({ query }: { query: { password: string, username: string, empId: number | undefined} }) {
    const queryParams = `Username=${query.username}&Password=${query.password}&EmpId=${query.empId}`

    return await axiosConfig.post(`Login/UpdateProfile?${queryParams}`, {}, { skipAuthRedirect: true })
  }
}
