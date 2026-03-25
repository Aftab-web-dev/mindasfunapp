import React from 'react'

import { useRouter } from 'next/navigation'

function EventDetail({ data }: { data: any }) {
  const router = useRouter()

  return (
    <div className='w-full bg-white rounded-xl shadow p-6 lg:mt-[1.7rem] ml-4'>
      <h2 className='text-lg font-semibold mb-4'>Event details</h2>
      <div className='flex items-center gap-3 mb-4'>
        <div>
          <div className='font-medium'>{data.event}</div>
          <div className='text-gray-500 text-sm'>
            Date :{' '}
            <span className='text-black'>
              {' '}
              {new Date(data.event_date).toLocaleDateString(undefined, {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </span>
          </div>
        </div>
      </div>
      <div className='mb-2 flex justify-between items-center'>
        <span className='font-medium text-gray-700'>Event info</span>
        <button
          className='text-indigo-500 text-[15px] bg-transparent cursor-pointer'
          onClick={() => router.push(`/admin/events/edit-event/${data._id}`)}
        >
          Edit
        </button>
      </div>
      <div className='text-gray-500 text-sm'>
        <div>Venue: {data.venue}</div>
        <div>Venue Cost: {data.venue_cost}</div>
        <div>No of Attendees: {data.no_of_attendees}</div>
      </div>
    </div>
  )
}

export default EventDetail
