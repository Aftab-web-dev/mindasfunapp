import axiosConfig from './api-config'

export const managementDashboardApi = {
  widgetValues: async function () {
    return await axiosConfig.post(`MangementDashBoard/ManagementValues`)
  }
}

