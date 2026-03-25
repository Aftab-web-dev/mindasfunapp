'use client'


const historyData = [
  {
    title: 'Game Session',
    time: 'Today, 2:30 PM',
    amount: '$15.00',
    status: 'completed',
    type: 'Spending'
  },
  {
    title: 'Account Recharge',
    time: 'Today, 12:15 PM',
    amount: '+$50.00',
    status: 'completed',
    type: 'Recharges'
  },
  {
    title: 'Food Purchase',
    time: 'Yesterday, 6:45 PM',
    amount: '$12.50',
    status: 'completed',
    type: 'Spending'
  },
  {
    title: 'VR Experience',
    time: 'Yesterday, 3:20 PM',
    amount: '$25.00',
    status: 'completed',
    type: 'Spending'
  },
  {
    title: 'Account Recharge',
    time: '3 days ago',
    amount: '+$100.00',
    status: 'completed',
    type: 'Recharges'
  },
  {
    title: 'Game Session',
    time: '5 days ago',
    amount: '$20.00',
    status: 'completed',
    type: 'Spending'
  }
]

export default function MyBooking() {
  return (
    <div className='max-w-3xl mx-auto mt-10 border border-yellow-300 rounded-xl p-6 bg-white shadow'>
      <h1 className='text-2xl font-semibold text-gray-800 flex items-center gap-2 mb-6'>
        My Booking
      </h1>

      {/* Transactions */}
      <div className='space-y-4'>
        {historyData.map((item, index) => (
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
              <p className={`font-semibold ${item.amount.includes('+') ? 'text-green-600' : 'text-gray-800'}`}>
                {item.amount}
              </p>
              <span className='text-xs text-green-600 bg-green-100 px-2 py-0.5 rounded-full'>{item.status}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
