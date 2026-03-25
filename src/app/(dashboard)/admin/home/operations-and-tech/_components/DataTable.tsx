import React from 'react'

const DataTable = ({ maintenanceData, title }: { maintenanceData: any; title: any }) => (
  <div className='w-full'>
    {/* Maintenance Schedule */}
    <div className='bg-white rounded-xl p-7 flex-1 shadow-sm max-w-full overflow-x-auto'>
      <h2 className='font-semibold text-lg ~text-[0.8rem]/[1.125rem] ~leading-[1.25rem]/[1.75rem] mb-6'>Maintenance Schedule - {title}</h2>
      <table className='w-full ~text-[0.5rem]/[0.875rem] ~leading-[0.7rem]/[1.25rem]'>
        <thead>
          <tr className='text-gray-500 text-left '>
            <th className='pb-4'>Equipment</th>
            <th className='pb-4'>Issue</th>
            <th className='pb-4'>Technician</th>
            <th className='pb-4'>ETA</th>
            <th className='pb-4'>Status</th>
          </tr>
        </thead>
        <tbody>
          {maintenanceData.map((row: any, idx: any) => (
            <tr key={idx} className='border-t border-gray-200'>
              <td
                className={`border-[#eee] px-4 py-4 dark:border-dark-3 ${idx === maintenanceData.length ? 'border-t-0' : 'border-t'}`}
              >
                {row.equipment}
              </td>
              <td
                className={`border-[#eee] px-4 py-4 dark:border-dark-3 ${idx === maintenanceData.length ? 'border-t-0' : 'border-t'}`}
              >
                {row.issue}
              </td>
              <td
                className={`border-[#eee] px-4 py-4 dark:border-dark-3 ${idx === maintenanceData.length ? 'border-t-0' : 'border-t'}`}
              >
                {row.technician}
              </td>
              <td
                className={`border-[#eee] px-4 py-4 dark:border-dark-3 ${idx === maintenanceData.length ? 'border-t-0' : 'border-t'}`}
              >
                {row.eta}
              </td>
              <td
                className={`border-[#eee] px-4 py-4 dark:border-dark-3 ${idx === maintenanceData.length ? 'border-t-0' : 'border-t'}`}
              >
                <select
                  className={`px-2 py-1 rounded ~text-[0.5rem]/[0.75rem] md:~text-[0.35rem]/[0.75rem] ~leading-[0.5rem]/[1rem] font-medium border ${row.status.color}`}
                  value={row.status.label}
                  onChange={() => {
                    // Optionally handle status change here
                    // Example: row.status.label = e.target.value
                  }}
                >
                  <option value='Pending'>Pending</option>
                  <option value='In Progress'>In Progress</option>
                  <option value='Completed'>Completed</option>
                  <option value='Delayed'>Delayed</option>
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
)

export default DataTable
