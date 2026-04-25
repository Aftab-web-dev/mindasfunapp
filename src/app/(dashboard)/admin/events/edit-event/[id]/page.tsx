import React from 'react'

import EventAddForm from './_components/Form'
import { eventsApi } from '@/api/events-api'

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  try {
    const res = await eventsApi.getOneEvent({ eventId: id })
    const editFile = res?.data?.data?.[0] || res?.data?.data || null

    if (!editFile) {
      return <div>Event not found</div>
    }

    return <EventAddForm data={editFile} />
  } catch (err) {
    return <div>Event not found</div>
  }
}
