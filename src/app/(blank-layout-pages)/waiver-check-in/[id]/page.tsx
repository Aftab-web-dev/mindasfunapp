import { waiverApi } from '@/api/waiver-api'
import CheckIn from '@/views/apps/waiver/CheckIn'
import { customerApi } from '@/api/customer-api'


const api = async (waiverId: string) => {
  const response = await waiverApi.getOneWaiver({ waiverId })
   const  customers = await customerApi.getAllCustomers()

   const data = {
    customers: customers.data.data,
    waiverData: response.data.data[0]
   }

  return data
}

 

async function page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  const data = await api(id)

  const waiverData = data.waiverData
  const customers = data.customers

  if (!waiverData) {
    return <div>Waiver not found</div>
  }
  

  return <CheckIn data={waiverData} customers ={customers} />
}

export default page

