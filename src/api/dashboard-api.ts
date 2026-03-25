import axiosConfig from './api-config'

export const dashboardApi = {
    getStoreData: async function ({ branchId }: { branchId: number }) {

        return await axiosConfig.post(`/Store/InventoryValues?BranchId=${branchId}`,)
    },
}
