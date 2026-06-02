import axiosConfig from './api-config'

type GraphParams = {
  from: string
  to: string
  game?: number | string
  product?: number | string
}

export const managementDashboardApi = {
  widgetValues: async function ({ from, to }: { from: string; to: string }) {
    return await axiosConfig.post(`MangementDashBoard/ManagementValues?from=${from}&to=${to}`)
  },

  gameRevenueGraph: async function ({ game = 0, from, to }: { game?: number | string; from: string; to: string }) {
    return await axiosConfig.post(`MangementDashBoard/GameRevenueGraph?from=${from}&to=${to}&Game=${game}`)
  },
  productRevenueGraph: async function ({ product = 0, from, to }: { product?: number | string; from: string; to: string }) {
    return await axiosConfig.post(`MangementDashBoard/ProductRevenueGraph?from=${from}&to=${to}&Product=${product}`)
  },
  redemptionRevenueGraph: async function ({ product = 0, from, to }: { product?: number | string; from: string; to: string }) {
    return await axiosConfig.post(`MangementDashBoard/RedemptionRevenueGraph?from=${from}&to=${to}&Product=${product}`)
  },
  eventRevenueGraph: async function ({ event = 0, from, to }: { event?: number | string; from: string; to: string }) {
    return await axiosConfig.post(`MangementDashBoard/EventRevenueGraph?from=${from}&to=${to}&Event=${event}`)
  },
  fbRevenueGraph: async function ({ product = 0, from, to }: { product?: number | string; from: string; to: string }) {
    return await axiosConfig.post(`MangementDashBoard/FBRevenueGraph?from=${from}&to=${to}&Product=${product}`)
  },
  trampolineRevenueGraph: async function ({ product = 0, from, to }: { product?: number | string; from: string; to: string }) {
    return await axiosConfig.post(`MangementDashBoard/TrampolineRevenueGraph?from=${from}&to=${to}&Product=${product}`)
  },
  bowlingRevenueGraph: async function ({ product = 0, from, to }: { product?: number | string; from: string; to: string }) {
    return await axiosConfig.post(`MangementDashBoard/BowlingRevenueGraph?from=${from}&to=${to}&Product=${product}`)
  },
  upcomingEvent: async function (params?: { from: string; to: string }) {
    const query = params ? `?from=${params.from}&to=${params.to}` : ''
    return await axiosConfig.post(`MangementDashBoard/UpcomingEvent${query}`)
  },
  mainGraph: async function ({ from, to }: { from: string; to: string }) {
    return await axiosConfig.post(`MangementDashBoard/MainGraph?from=${from}&to=${to}`)
  },
  topGameRevenue: async function ({ from, to, branchId, topOff }: { from: string; to: string; branchId: number | string; topOff: number }) {
    return await axiosConfig.post(`MangementDashBoard/TopGameRevenue?from=${from}&to=${to}&BranchId=${branchId}&TopOff=${topOff}`)
  },
  topProductRevenue: async function ({ from, to, branchId, topOff }: { from: string; to: string; branchId: number | string; topOff: number }) {
    return await axiosConfig.post(`MangementDashBoard/TopProductRevenue?from=${from}&to=${to}&BranchId=${branchId}&TopOff=${topOff}`)
  }
}

// Exported type for consumers
export type { GraphParams }

