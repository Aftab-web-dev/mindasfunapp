'use client'

// React Imports
import { useEffect } from 'react'

// Hook Imports
import { useCookie } from 'react-use'

// Type Imports
import { useColorScheme } from '@mui/material'


const useLayoutInit = () => {
  // Hooks
  const { setMode } = useColorScheme()
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_, updateCookieColorPref] = useCookie('colorPref')

  useEffect(() => {
    setMode('light') // Always set to light mode
  }, [setMode])
}

export default useLayoutInit
