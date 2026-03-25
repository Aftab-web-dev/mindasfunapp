// Next Imports
import type { Metadata } from 'next'

// Component Imports
import Login from '@/views/apps/customer-login/LoginCustomer'

export const metadata: Metadata = {
  title: 'Midas Fun - Login',
  description: 'Login to your account'
}

const LoginPage = async () => {
  return <Login />
}

export default LoginPage
