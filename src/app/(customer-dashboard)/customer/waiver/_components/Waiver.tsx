'use client'
import React, { useEffect, useState } from 'react'

import { FaFileAlt } from 'react-icons/fa'
import { MdOutlineAccessTime } from 'react-icons/md'
import { format } from 'date-fns'

import { customerModuleApi } from '@/api/customer-module-api'

type WaiverItem = {
  title: string
  updated: string
  status: string
}

const Waiver = () => {
  const [waiverForms, setWaiverForms] = useState<WaiverItem[]>([])

  useEffect(() => {
    customerModuleApi.waiverList().then(res => {
      const rows: any[] = res.data?.data || []

      const mapped = rows.map((r: any) => ({
        title: r.titile ?? r.title ?? r.name ?? 'Waiver',
        updated: r.modifiedOn
          ? format(new Date(r.modifiedOn), 'MMMM d, yyyy')
          : r.createdOn
            ? format(new Date(r.createdOn), 'MMMM d, yyyy')
            : '—',
        status: r.active === 1 || r.active === true || r.status === 1 ? 'Active' : 'Inactive'
      }))

      setWaiverForms(mapped)
    }).catch(() => setWaiverForms([]))
  }, [])

  return (
    <div className='max-w-3xl mx-auto mt-10 p-6 bg-white border border-purple-100 rounded-xl shadow'>
      <h1 className='text-2xl font-bold text-purple-700 flex items-center gap-2 mb-6'>
        <FaFileAlt className='text-3xl' />
        Waiver Forms
      </h1>

      <div className='space-y-4'>
        {waiverForms.length === 0 && (
          <p className='text-sm text-gray-500'>No waivers available.</p>
        )}
        {waiverForms.map((form, index) => (
          <div
            key={index}
            className='flex items-center justify-between bg-gray-50 p-4 rounded-xl border hover:bg-gray-100 transition'
          >
            <div className='flex items-center gap-4'>
              <div className='bg-purple-100 text-purple-600 p-2 rounded-full'>
                <FaFileAlt className='text-lg' />
              </div>
              <div>
                <h3 className='font-medium text-gray-800'>{form.title}</h3>
                <p className='text-sm text-gray-500 flex items-center gap-1'>
                  <MdOutlineAccessTime className='text-base' />
                  Last updated: {form.updated}
                </p>
              </div>
            </div>
            <span
              className={`text-xs px-3 py-1 rounded-full ${
                form.status === 'Active'
                  ? 'bg-green-100 text-green-600'
                  : 'bg-red-100 text-red-500'
              }`}
            >
              {form.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Waiver
