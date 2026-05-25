
import axiosConfig from './api-config'

export const waiverApi = {
    register: async ({ body }: { body: object }) => {
        return await axiosConfig.post(`Waiver/RegisterWaiverTemplate`, body, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })
    },
    waiverList: async () => {
        return await axiosConfig.post(`Waiver/WaverFormList`)
    },
    deleteWaiver: async ({ id, modifiedBy }: { id: number, modifiedBy: number }) => {
        const queryParams = `Id=${id}&ModifiedBy=${modifiedBy}`

        return await axiosConfig.post(`Waiver/DeleteWaiver?${queryParams}`)
    },
    statusChange: async ({ id, modifiedBy, active }: { id: number, modifiedBy: number | undefined, active: number }) => {
        const queryParams = `Id=${id}&Active=${active}&ModifiedBy=${modifiedBy}`

        return await axiosConfig.post(`Waiver/UpdateWaiverActive?${queryParams}`)
    },
    getOneWaiver: async ({ waiverId }: { waiverId: number | string }) => {
        const queryParams = `Id=${waiverId.toString()}`

        return await axiosConfig.post(`Waiver/WaverFormDateGet?${queryParams}`)
    },
    getCloneSourceWaiver: async ({ waiverId }: { waiverId: number | string }) => {
        const queryParams = `Id=${waiverId.toString()}`

        return await axiosConfig.post(`Waiver/WaverFormCusDateGet?${queryParams}`)
    },
    signWaiver: async ({ body }: { body: any }) => {
        return await axiosConfig.post(`Waiver/RegisterWaiverForm`, body, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })
    },
    getAllSignedWaiver: async () => {
        return await axiosConfig.post(`Waiver/WaverFormCusDataList`)
    },

    deleteSignedWaiver: async ({ id, empId }: { id: number, empId: number | undefined }) => {
        const queryParams = `Id=${id}&EmpId=${empId}`

        return await axiosConfig.post(`Waiver/DeleteCustomerWaiver?${queryParams}`)
    },

    downloadSignedWaiver: async ({ ledgerId, waiverId }: { ledgerId: number, waiverId: number }) => {
        const queryParams = `LedgerId=${ledgerId}&WaverId=${waiverId}`

        return await axiosConfig.post(`Waiver/DownloadCustomerWaiver?${queryParams}`, null, {
            responseType: 'blob'
        })
    },

    checkInWaiver: async ({ cusWaiverId, branchId }: { cusWaiverId: number | string, branchId: number | string | undefined }) => {
        const queryParams = `CusWaiverId=${cusWaiverId}&BranchId=${branchId}`

        return await axiosConfig.post(`Waiver/WaiverCheckIn?${queryParams}`)
    },

    exportCheckInHistory: async ({ waiverId, from, to, branchId }: { waiverId: number | string, from: string, to: string, branchId?: string }) => {
        const queryParams = `WaverId=${waiverId}&WaiverId=${waiverId}&from=${from}&to=${to}${branchId ? `&BranchId=${branchId}` : ''}`

        return await axiosConfig.post(`Waiver/ExportCusWaiver?${queryParams}`, null, {
            responseType: 'blob'
        })
    }
}

