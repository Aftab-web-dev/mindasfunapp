import React from 'react'

import { useRouter } from 'next/navigation'

function Preview({ data }: { data: any }) {
  const router = useRouter()

  return (
    <div className='w-full bg-white rounded-xl shadow lg:p-6 px-6 py-5 lg:mt-2 lg:ml-4'>
      <h2 className='text-lg font-semibold mb-4'>Customer details</h2>
      <div className='flex items-center gap-3 mb-4'>
        <img src='\images\avatars\profile.png' alt='Avatar' className='w-12 h-12 rounded-full shadow' />
        <div>
          <div className='font-medium'>{data.name}</div>
          {/* <div className="text-gray-500 text-sm">Customer ID: #58909</div> */}
        </div>
      </div>
      <div className='mb-2 flex justify-between items-center'>
        <span className='font-medium text-gray-700'>Contact info</span>
        <button
          className='text-indigo-500 text-[15px] bg-transparent cursor-pointer'
          onClick={() => router.push(`/admin/events/edit-event/${data._id}`)}
        >
          Edit
        </button>
      </div>
      <div className='text-gray-500 text-sm'>
        <div>Email: {data.email}</div>
        <div>Mobile: +91 {data.phone}</div>
        <div>Address: {data.address}</div>
      </div>
    </div>
  )
}

export default Preview
