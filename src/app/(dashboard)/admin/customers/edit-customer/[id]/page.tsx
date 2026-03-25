import React from 'react'

import CustomerEdit from './_components/CustomerEdit'
import { customerApi } from '@/api/customer-api'
import { dropdownApi } from '@/api/drop-down-api'

const getCustomer = async (ledgerId: any) => {
  const customer = await customerApi.getOneCustomer({ ledgerId })

  return customer.data.data[0]
}

const getDropdownData = async () => {
  const genders = await dropdownApi.gender()
  const countries = await dropdownApi.countries()
  const proofs = await dropdownApi.proofs()

  const data = {
    genders: genders.data.data,
    countries: countries.data.data,
    proofs: proofs.data.data
  }

  return data
}

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  const editFile = await getCustomer(id)

  const dropdownData = await getDropdownData()

  if (!editFile) {
    return <div>Customer not found</div>
  }

  return (
    <>
      <CustomerEdit
        data={editFile}
        genders={dropdownData.genders}
        countries={dropdownData.countries}
        proofs={dropdownData.proofs}
      />
    </>
  )
}
