import React from 'react'

import EventView from './_components/View'
import { eventsApi } from '@/api/events-api'

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  try {
    const res = await eventsApi.getOneEvent({ eventId: id })
    const viewFile = res?.data?.data?.[0] || res?.data?.data || null

    if (!viewFile) {
      return <div>Event not found</div>
    }

    return <EventView data={viewFile} />
  } catch (err) {
    return <div>Event not found</div>
  }
}
