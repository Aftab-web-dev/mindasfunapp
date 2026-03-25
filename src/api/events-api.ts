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
}
