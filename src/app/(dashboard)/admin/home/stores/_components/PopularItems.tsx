import React from 'react'

const PopularItems = ({ popularData }: { popularData: any }) => (
  <div className='w-full'>
    <div className='bg-white rounded-xl p-6 w-full shadow-sm'>
      <h2 className='font-semibold text-lg mb-4'>Popular Items</h2>
      <div className='flex flex-col gap-3'>
        {popularData?.map((item: any, idx: any) => (
          <div key={idx} className='bg-gray-50 rounded-lg p-4 flex justify-between items-center'>
            <div>
              <div className='font-medium'>{item.title}</div>
              <div className='text-xs text-gray-500'>{item.desc}</div>
            </div>
            <div className='flex items-center gap-2 w-32'>
              <div className='w-full h-2 bg-gray-200 rounded-full'>
                <div className='h-2 bg-green-500 rounded-full' style={{ width: `${item.percentage}%` }} />
              </div>
              <span className='text-xs font-medium text-gray-700'>{item.percentage}%</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
)

export default PopularItems
