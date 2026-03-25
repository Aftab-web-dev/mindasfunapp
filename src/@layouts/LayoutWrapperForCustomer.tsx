'use client'

// React Imports
import type { ReactElement } from 'react'

// Hook Imports
import { useSettings } from '@core/hooks/useSettings'
import useLayoutInit from '@core/hooks/useLayoutInit'

type LayoutWrapperProps = {
  horizontalLayout: ReactElement
}

const LayoutWrapperForCustomer = (props: LayoutWrapperProps) => {
  // Props
  const { horizontalLayout } = props

  // Hooks
  const { settings } = useSettings()

  useLayoutInit()

  // Return the layout based on the layout context
  return (
    <div className='flex flex-col flex-auto' data-skin={settings.skin}>
      {horizontalLayout}
    </div>
  )
}

export default LayoutWrapperForCustomer
