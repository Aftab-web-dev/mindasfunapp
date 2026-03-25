import React from 'react'

const Alerts = ({ alertsData }: { alertsData: any }) => (
  <div className='w-full'>
    {/* Recent Alerts */}
    <div className='bg-white rounded-xl p-6 w-full lg:w-full shadow-sm'>
      <h2 className='font-semibold text-lg mb-4'>Recent Alerts</h2>
      <div className='flex flex-col gap-3'>
        {alertsData.map((alert: any, idx: any) => (
          <div
            key={idx}
            className='rounded-lg p-4 flex justify-between items-start border-l-4 border-purple-500 bg-purple-100'
          >
            <div>
              <div className='font-medium'>{alert.title}</div>
              <div className='text-xs text-gray-500'>{alert.desc}</div>
            </div>
            <div className='text-xs text-gray-400 whitespace-nowrap'>{alert.time}</div>
          </div>
        ))}
      </div>
    </div>
  </div>
)

export default Alerts
