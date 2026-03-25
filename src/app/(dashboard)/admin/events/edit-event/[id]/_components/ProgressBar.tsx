'use client'

import React from 'react'

// import { CheckCircle } from 'lucide-react'

const steps = [
  { title: 'First Step', description: 'Customer Details.', icon: 'user' },
  { title: 'Second Step', description: 'Event Details.', icon: 'calendar-user' },
  { title: 'Third Step', description: 'Arrangements.', icon: 'list-details' },
  { title: 'Final Step', description: 'Complete your booking', icon: 'progress-check' }
]

export default function CustomStepper({ currentStep }: { currentStep: any }) {
  return (
    <div className='sm:px-10 md:py-5 rounded-xl '>
      <div className='flex justify-around items-center relative '>
        {steps.map((step, index) => (
          <React.Fragment key={index}>
            <div
              key={index}
              className='flex sm:flex-col md:flex-row items-center text-center w-full h-full relative gap-3 justify-center'
            >
              <div
                className={`size-[1.5rem] md:size-[2rem] flex items-center justify-center rounded-sm transition-all duration-300
                  ${index < currentStep ? 'bg-[#7367f0] text-white border-[#7367f0] shadow-sm border-2' : ''}
                  ${index === currentStep ? 'border-[#7367f0] bg-white text-[#7367f0] shadow-sm border-2' : ''}
                  ${index > currentStep ? 'border-gray-300 text-gray-400 bg-gray-50 ' : ''}`}
              >
                {index < currentStep ? (
                  
                  // <CheckCircle className='w-4 h-4' />
                  <i className={`tabler-${step.icon} size-5 max-md:size-4`} />
                ) : (
                  <i className={`tabler-${step.icon} size-5 max-md:size-4`} />

                  // <span className='text-sm font-bold'>{index + 1}</span>
                )}
              </div>
              <div className='text-start leading-0 '>
                <p
                  className={`text-[0.7rem] font-semibold max-sm:hidden ${index <= currentStep ? 'text-black' : 'text-gray-400'}`}
                >
                  {step.title}
                </p>
                <p
                  className={`text-[0.7rem] font-semibold max-lg:hidden ${index <= currentStep ? 'text-gray-500' : 'text-gray-300'}`}
                >
                  {step.description}
                </p>
              </div>
              <div className={`${index === 3 && 'hidden'} pl-7  max-md:hidden`}>
                <i
                  className={`tabler-border-corner-square rotate-[135deg] size-[0.6rem] ${index <= currentStep ? 'text-gray-500' : 'text-gray-300'}`}
                />
              </div>
            </div>
            <div className={`${index === 3 && 'hidden'} sm:pb-7 max-sm:pr-2 max-[430px]: md:hidden`}>
              <i
                className={`tabler-border-corner-square rotate-[135deg] size-[0.6rem] ${index <= currentStep ? 'text-gray-500' : 'text-gray-300'}`}
              />
            </div>
          </React.Fragment>
        ))}
      </div>
    </div>
  )
}
