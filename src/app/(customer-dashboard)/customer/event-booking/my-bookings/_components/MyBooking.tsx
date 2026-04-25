'use client'

import { useEffect, useState } from 'react'

import { format } from 'date-fns'

import { customerModuleApi } from '@/api/customer-module-api'

type BookingItem = {
  title: string
  time: string
  amount: string
  status: string
  type: string
}

export default function MyBooking() {
  const [bookings, setBookings] = useState<BookingItem[]>([])

  useEffect(() => {
    if (typeof window === 'undefined') return
    const ledgerId = sessionStorage.getItem('cusLedgerId')

    if (!ledgerId) {
      setBookings([])

      return
    }

    customerModuleApi.getEventList({ ledgerId }).then(res => {
      const rows: any[] = res.data?.data || []

      const mapped = rows.map((r: any) => ({
        title: r.event || r.eventName || r.name || 'Event Booking',
        time: r.eventDate ? format(new Date(r.eventDate), "MMM d yyyy, h:mm a") : '',
        amount: `₹${r.netAmt ?? r.amount ?? 0}`,
        status: r.status === 1 ? 'Approved' : r.status === 2 ? 'Pending' : r.status === 3 ? 'Declined' : 'Pending',
        type: 'Booking'
      }))

      setBookings(mapped)
    }).catch(() => setBookings([]))
  }, [])

  return (
    <div className='max-w-3xl mx-auto mt-10 border border-yellow-300 rounded-xl p-6 bg-white shadow'>
      <h1 className='text-2xl font-semibold text-gray-800 flex items-center gap-2 mb-6'>
        My Booking
      </h1>

      <div className='space-y-4'>
        {bookings.length === 0 && (
          <p className='text-sm text-gray-500'>No bookings yet.</p>
        )}
        {bookings.map((item, index) => (
          <div
            key={index}
            className='flex items-center justify-between p-4 bg-gray-50 rounded-xl shadow-sm border border-gray-100'
          >
            <div className='flex items-center gap-4'>
              <div>
                <h3 className='font-semibold text-gray-800'>{item.title}</h3>
                <p className='text-sm text-gray-500'>{item.time}</p>
              </div>
            </div>
            <div className='text-right'>
              <p className='font-semibold text-gray-800'>{item.amount}</p>
              <span
                className={`text-xs px-2 py-0.5 rounded-full ${
                  item.status === 'Approved'
                    ? 'text-green-600 bg-green-100'
                    : item.status === 'Declined'
                      ? 'text-red-600 bg-red-100'
                      : 'text-amber-600 bg-amber-100'
                }`}
              >
                {item.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
