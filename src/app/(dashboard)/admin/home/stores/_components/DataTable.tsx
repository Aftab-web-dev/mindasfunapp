import React from 'react'

const DataTable = ({ statusData, title }: { statusData: any; title: any }) => (
  <div className='w-full h-full '>
    {/* Maintenance Schedule */}
    <div className='bg-white rounded-xl p-7 flex-1 shadow-sm max-w-full overflow-x-auto h-full'>
      <h2 className='font-semibold text-lg ~text-[0.8rem]/[1.125rem] ~leading-[1.25rem]/[1.75rem] mb-6'>
        {title} Status
      </h2>
      <table className='w-full ~text-[0.5rem]/[0.875rem] ~leading-[0.7rem]/[1.25rem]'>
        <thead>
          <tr className='text-gray-500 text-left '>
            <th className='pb-4 pl-4'>Item</th>
            <th className='pb-4 pl-4'>Category</th>
            <th className='pb-4 pl-4'>In Stock</th>
            <th className='pb-4 pl-4'>Min Threshold</th>
            <th className='pb-4 pl-4'>Status</th>
          </tr>
        </thead>
        <tbody>
          {statusData?.map((row: any, idx: any) => (
            <tr key={idx} className='border-t border-gray-200'>
              <td
                className={`border-[#eee] px-4 py-4 dark:border-dark-3 ${idx === statusData.length ? 'border-t-0' : 'border-t'}`}
              >
                {row.item}
              </td>
              <td
                className={`border-[#eee] px-4 py-4 dark:border-dark-3 ${idx === statusData.length ? 'border-t-0' : 'border-t'}`}
              >
                {row.category}
              </td>
              <td
                className={`border-[#eee] px-4 py-4 dark:border-dark-3 ${idx === statusData.length ? 'border-t-0' : 'border-t'}`}
              >
                {row.stock}
              </td>
              <td
                className={`border-[#eee] px-4 py-4 dark:border-dark-3 ${idx === statusData.length ? 'border-t-0' : 'border-t'}`}
              >
                {row.threshold}
              </td>
              <td
                className={`border-[#eee] px-4 py-4 dark:border-dark-3 ${idx === statusData.length ? 'border-t-0' : 'border-t'}`}
              >
                <div
                  className={`px-2 py-1 rounded ~text-[0.5rem]/[0.75rem] md:~text-[0.35rem]/[0.75rem] ~leading-[0.5rem]/[1rem] flex items-center justify-center max-w-10 font-medium border ${row.status?.color}`}
                >
                  {row.status?.label}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
)

export default DataTable
