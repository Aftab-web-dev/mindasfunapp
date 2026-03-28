'use client'

import React from 'react'

const steps = [
  { title: 'Customer Details', description: 'Personal information', icon: 'user' },
  { title: 'Event Details', description: 'Date, venue & more', icon: 'calendar-user' },
  { title: 'Arrangements', description: 'Food, gifts & extras', icon: 'list-details' },
  { title: 'Review & Submit', description: 'Confirm booking', icon: 'progress-check' }
]

export default function CustomStepper({ currentStep }: { currentStep: number }) {
  return (
    <div className='relative flex items-center justify-between'>
      <div className='absolute top-5 left-[40px] right-[40px] h-[2px] bg-[#E2E8F0] z-0 hidden sm:block' />
      <div
        className='absolute top-5 left-[40px] h-[2px] bg-[#523F99] z-[1] transition-all duration-500 hidden sm:block'
        style={{
          width: currentStep === 0
            ? '0%'
            : `calc(${(currentStep / (steps.length - 1)) * 100}% - 80px)`
        }}
      />

      {steps.map((step, index) => {
        const isCompleted = index < currentStep
        const isActive = index === currentStep

        return (
          <div key={index} className='flex flex-col items-center relative z-[2] flex-1'>
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 border-2
                ${isCompleted
                  ? 'bg-[#523F99] border-[#523F99] text-white shadow-md shadow-[#523F99]/25'
                  : isActive
                    ? 'bg-white border-[#523F99] text-[#523F99] shadow-md shadow-[#523F99]/15'
                    : 'bg-[#F8FAFC] border-[#E2E8F0] text-[#94A3B8]'
                }`}
            >
              {isCompleted ? (
                <i className='tabler-check text-base' />
              ) : (
                <i className={`tabler-${step.icon} text-lg`} />
              )}
            </div>
            <div className='mt-2.5 text-center hidden sm:block'>
              <p className={`text-xs font-semibold leading-tight ${isActive ? 'text-[#1E293B]' : isCompleted ? 'text-[#523F99]' : 'text-[#94A3B8]'}`}>
                {step.title}
              </p>
              <p className={`text-[10px] mt-0.5 ${isActive || isCompleted ? 'text-[#64748B]' : 'text-[#CBD5E1]'}`}>
                {step.description}
              </p>
            </div>
          </div>
        )
      })}
    </div>
  )
}
