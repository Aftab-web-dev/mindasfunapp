import axiosConfig from './api-config'

type GraphParams = { productOrGame?: number | string, day?: number | string }

export const managementDashboardApi = {
  widgetValues: async function () {
    return await axiosConfig.post(`MangementDashBoard/ManagementValues`)
  },
  gameRevenueGraph: async function ({ game = 0, day = 0 }: { game?: number | string, day?: number | string }) {
    return await axiosConfig.post(`MangementDashBoard/GameRevenueGraph?Game=${game}&Day=${day}`)
  },
  productRevenueGraph: async function ({ product = 0, day = 0 }: { product?: number | string, day?: number | string }) {
    return await axiosConfig.post(`MangementDashBoard/ProductRevenueGraph?Product=${product}&Day=${day}`)
  },
  redemptionRevenueGraph: async function ({ product = 0, day = 0 }: { product?: number | string, day?: number | string }) {
    return await axiosConfig.post(`MangementDashBoard/RedemptionRevenueGraph?Product=${product}&Day=${day}`)
  },
  eventRevenueGraph: async function ({ day = 0 }: { day?: number | string }) {
    return await axiosConfig.post(`MangementDashBoard/EventRevenueGraph?Day=${day}`)
  },
  fbRevenueGraph: async function ({ product = 0, day = 0 }: { product?: number | string, day?: number | string }) {
    return await axiosConfig.post(`MangementDashBoard/FBRevenueGraph?Product=${product}&Day=${day}`)
  },
  trampolineRevenueGraph: async function ({ product = 0, day = 0 }: { product?: number | string, day?: number | string }) {
    return await axiosConfig.post(`MangementDashBoard/TrampolineRevenueGraph?Product=${product}&Day=${day}`)
  },
  bowlingRevenueGraph: async function ({ product = 0, day = 0 }: { product?: number | string, day?: number | string }) {
    return await axiosConfig.post(`MangementDashBoard/BowlingRevenueGraph?Product=${product}&Day=${day}`)
  },
  upcomingEvent: async function () {
    return await axiosConfig.post(`MangementDashBoard/UpcomingEvent`)
  },
  mainGraph: async function ({ day = 1 }: { day?: number | string } = {}) {
    return await axiosConfig.post(`MangementDashBoard/MainGraph?day=${day}`)
  }
}

// Exported type for consumers
export type { GraphParams }
