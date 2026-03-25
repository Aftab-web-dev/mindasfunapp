import React from 'react'

const PendingOrders = ({ pendingData }: { pendingData: any[] }) => (
  <div className='w-full'>
    <div className='bg-white rounded-xl p-6 w-full shadow-sm'>
      <h2 className='font-semibold text-lg mb-4'>Pending Orders</h2>
      <div className='flex flex-col gap-3'>
        {pendingData?.map((item, idx) => (
          <div
            key={idx}
            className='bg-gray-50 rounded-lg p-4 flex justify-between items-start'
          >
            <div>
              <div className='font-semibold text-sm'>{item.title}</div>
              <div className='text-xs text-gray-600 mt-1'>
                Supplier: {item.supplier}
              </div>
              <div className='text-xs text-gray-600'>
                Quantity: {item.quantity}
              </div>
            </div>
            <div className='text-xs text-gray-500 whitespace-nowrap'>{item.date}</div>
          </div>
        ))}
      </div>
    </div>
  </div>
)

export default PendingOrders
