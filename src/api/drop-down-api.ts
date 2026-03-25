import axiosConfig from './api-config'

export const dropdownApi = {
    countries: async function () {
        return await axiosConfig.post('DropDown/CountryDropDown')
    },
    states: async function ({ countryId }: { countryId: number }) {
        return await axiosConfig.post(`DropDown/StateDropDown?CountryId=${countryId}`)
    },
    city: async function ({ stateId }: { stateId: number }) {
        return await axiosConfig.post(`DropDown/CityDropDown?StateId=${stateId}`)
    },
    gender: async function () {
        return await axiosConfig.post('DropDown/GenderDropDown')
    },
    proofs: async function () {
        return await axiosConfig.post('DropDown/ProofDropDown')
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
