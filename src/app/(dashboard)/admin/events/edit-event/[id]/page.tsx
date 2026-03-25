import React from 'react'

import EventAddForm from './_components/Form'
import { data, reqData } from '../../../../../../fake-db/apps/data'

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const editFile = data.find(item => item._id === id) || reqData.find(item => item._id === id)

  if (!editFile) {
    return <div>Event not found</div>
  }

  return (
    <>
      <EventAddForm data={editFile} />
    </>
  )
}
