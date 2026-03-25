import React from 'react'

import WaiverFormEdit from './_components/Form'

import { waiverTemplate } from '@/fake-db/apps/data'

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  const editFile = waiverTemplate.find(item => item._id === id)

  return <WaiverFormEdit data={editFile} id={id} />
}
