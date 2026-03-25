import React from 'react'

import Link from 'next/link'

export default function Bookings() {
  return (
    <>
      <Link href='/customer/event-booking/add-booking'>
        <div className='max-w-3xl mx-auto mt-10 border border-yellow-300 rounded-xl p-6 bg-white shadow'>
          <h1 className='text-2xl font-semibold text-gray-800 flex items-center gap-2 mb-6'>Book An Event</h1>
          <p className='text-gray-600 mb-4'>Book your event here.</p>
        </div>
      </Link>
  <Link href='/customer/event-booking/my-bookings'>
        <div className='max-w-3xl mx-auto mt-10 border border-yellow-300 rounded-xl p-6 bg-white shadow'>
          <h1 className='text-2xl font-semibold text-gray-800 flex items-center gap-2 mb-6'>My Bookings</h1>
          <p className='text-gray-600 mb-4'>View your bookings here.</p>
        </div>
      </Link>
    </>
  )
}
