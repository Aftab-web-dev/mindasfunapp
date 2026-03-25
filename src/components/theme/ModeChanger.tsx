// React Imports
import { useEffect } from 'react'

// MUI Imports
import { useColorScheme } from '@mui/material/styles'

const ModeChanger = () => {
  // Hooks
  const { setMode } = useColorScheme()

  useEffect(() => {
    setMode('light') // Always set to light mode
  }, [setMode])

  return null
}

export default ModeChanger
