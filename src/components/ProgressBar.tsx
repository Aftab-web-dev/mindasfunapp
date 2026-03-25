'use client'

import type { ReactNode } from 'react'

import { ProgressProvider as BProgressProvider } from '@bprogress/next/app'

type ProgressProviderProps = {
  children: ReactNode
}

const ProgressProvider = ({ children }: ProgressProviderProps) => (
  <BProgressProvider color='#523F99' height='4px' options={{ showSpinner: false }} shallowRouting>
    {children}
  </BProgressProvider>
)

export default ProgressProvider
