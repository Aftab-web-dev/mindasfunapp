import { managementDashboardApi } from '@/api/management-dashboard'
import HomePage from './_components/HomePage'

const api = async () => {
  const statsCards = await managementDashboardApi.widgetValues()

  const data = { statsCards: statsCards.data.data }

  return data
}

const page = async () => {
  const apiData = await api()

  return (
    <div>
      <HomePage stats = {apiData.statsCards[0]} />
    </div>
  )
}

export default page
