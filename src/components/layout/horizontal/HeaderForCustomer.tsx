'use client'

// Component Imports
import Navigation from './Navigation'
import NavbarContentForCustomer from './NavbarContentForCustomer'
import Navbar from '@layouts/components/horizontal/Navbar'
import LayoutHeader from '@layouts/components/horizontal/Header'

// Hook Imports
import useHorizontalNav from '@menu/hooks/useHorizontalNav'

const HeaderForCustomer = () => {
  // Hooks
  const { isBreakpointReached } = useHorizontalNav()

  return (
    <>
      <LayoutHeader>
        <Navbar>
          <NavbarContentForCustomer />
        </Navbar>
        {/* {!isBreakpointReached && <Navigation />} */}
      </LayoutHeader>
      {isBreakpointReached && <Navigation />}
    </>
  )
}

export default HeaderForCustomer
