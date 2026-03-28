import axiosConfig from './api-config'

// In-memory cache for static dropdown data
const cache: Record<string, any> = {}

async function cachedPost(key: string, url: string) {
    if (cache[key]) return cache[key]
    const response = await axiosConfig.post(url)
    cache[key] = response
    return response
}

export const dropdownApi = {
    countries: async function () {
        return await cachedPost('countries', 'DropDown/CountryDropDown')
    },
    states: async function ({ countryId }: { countryId: number }) {
        return await cachedPost(`states_${countryId}`, `DropDown/StateDropDown?CountryId=${countryId}`)
    },
    city: async function ({ stateId }: { stateId: number }) {
        return await cachedPost(`city_${stateId}`, `DropDown/CityDropDown?StateId=${stateId}`)
    },
    gender: async function () {
        return await cachedPost('gender', 'DropDown/GenderDropDown')
    },
    proofs: async function () {
        return await cachedPost('proofs', 'DropDown/ProofDropDown')
    },
    event: async function ({ branchId }: { branchId: number | undefined }) {
        return await axiosConfig.post(`DropDown/EventDropDown?BranchId=${branchId}`)
    },
    venue: async function ({ branchId }: { branchId: number | undefined }) {
        return await axiosConfig.post(`DropDown/VenuDropDown?BranchId=${branchId}`)
    },
    locationList: async function () {
        return await axiosConfig.post(`DropDown/LocationList`)
    },
    cake: async function ({ branchId }: { branchId: number | undefined }) {
        return await axiosConfig.post(`DropDown/CakeDropDown?BranchId=${branchId}`)
    },
    food: async function ({ branchId }: { branchId: number | undefined }) {
        return await axiosConfig.post(`Event/EventFoodList?BranchId=${branchId}`)
    },
    gift: async function ({ branchId }: { branchId: number | undefined }) {
        return await axiosConfig.post(`Event/EventGiftList?BranchId=${branchId}`)
    },
    card: async function ({ branchId }: { branchId: number | undefined }) {
        return await axiosConfig.post(`Event/EventCardProduct?BranchId=${branchId}`)
    },
}
