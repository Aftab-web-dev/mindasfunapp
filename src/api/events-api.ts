import axiosConfig from './api-config'

export const eventsApi = {
  addEvent: async function ({ body }: { body: any }) {
    return await axiosConfig.post(`Event/AddEditEventBooking`, body)
  },
  getEventsList: async function ({ branchId }: { branchId: any }) {
    return await axiosConfig.post(`Event/GetEventList?BranchId=${branchId}`)
  },
  getOneEvent: async function ({ eventId }: { eventId: any }) {
    return await axiosConfig.post(`Event/GetEventListById?EventId=${eventId}`)
  },
  deleteEvent: async function ({ eventId }: { eventId: any }) {
    return await axiosConfig.post(`Event/DeleteEvent?Id=${eventId}`)
  },
  getPendingEventRequests: async function ({ branchId }: { branchId: any }) {
    return await axiosConfig.post(`Event/GetApprPendingEventList?BranchId=${branchId}`)
  },
  approveEvent: async function ({ id, approvedBy, branchId }: { id: number | string, approvedBy: number | string | undefined, branchId: number | string | undefined }) {
    const queryParams = `Id=${id}&ApprovedBy=${approvedBy}&BranchId=${branchId}`

    return await axiosConfig.post(`Event/ApproveEvent?${queryParams}`)
  },
  eventCardProduct: async function ({ branchId }: { branchId: number | undefined }) {
    return await axiosConfig.post(`Event/EventCardProduct?BranchId=${branchId}`)
  },
  eventFoodList: async function ({ branchId }: { branchId: number | undefined }) {
    return await axiosConfig.post(`Event/EventFoodList?BranchId=${branchId}`)
  },
  eventGiftList: async function ({ branchId }: { branchId: number | undefined }) {
    return await axiosConfig.post(`Event/EventGiftList?BranchId=${branchId}`)
  },
}
