// Next Imports
import type { Metadata, Viewport } from 'next'

// MUI Imports
import InitColorSchemeScript from '@mui/material/InitColorSchemeScript'

// Third-party Imports
import 'react-perfect-scrollbar/dist/css/styles.css'

import { Toaster } from 'react-hot-toast'

// Type Imports
import type { ChildrenType } from '@core/types'

// Util Imports
import { getSystemMode } from '@core/utils/serverHelpers'

// Style Imports
import '@/app/globals.css'

// Generated Icon CSS Imports
import '@assets/iconify-icons/generated-icons.css'
import ProgressProvider from '@/components/ProgressBar'
import RegisterSW from './register-sw';

export const metadata: Metadata = {
  title: {
    default: 'Midas Fun',
    template: '%s | Midas Fun',
  },
  description: 'Midas Fun - Entertainment management dashboard for events, customers, and operations.',
  icons: {
    icon: '/favicon.ico',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#523F99',
}

const RootLayout = async (props: ChildrenType) => {
  const { children } = props

  // Vars

  const systemMode = await getSystemMode()
  const direction = 'ltr'

  return (
    <html id='__next' lang='en' dir={direction} suppressHydrationWarning>
      <body className='flex is-full min-bs-full flex-auto flex-col'>
        <RegisterSW />
        <ProgressProvider>
          <InitColorSchemeScript attribute='data' defaultMode={systemMode} />
          <Toaster position='top-right' toastOptions={{ className: 'react-hot-toast' }} />
          {children}
        </ProgressProvider>
      </body>
    </html>
  )
}

export default RootLayout
