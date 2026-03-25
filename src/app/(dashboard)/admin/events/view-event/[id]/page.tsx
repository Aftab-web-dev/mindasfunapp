import React from 'react'

import { data } from '../../../../../../fake-db/apps/data'
import EventView from './_components/View'

export default async function Page() {
  // const { id } = await params
  
  const viewFile = data.find(item => item._id === "567383923")

  if (!viewFile) {
    return <div>Event not found</div>
  }

  return (
    <>
      <EventView data={viewFile} />
    </>
  )
}
