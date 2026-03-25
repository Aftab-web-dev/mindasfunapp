'use client'
import Link from 'next/link'

// Third-party Imports
import classnames from 'classnames'

// Component Imports
// import NavToggle from './NavToggle'
import LogoForCustomer from '../shared/LogoForCustomer'

// import UserDropdown from '@components/layout/shared/UserDropdown'

// Hook Imports
import useHorizontalNav from '@menu/hooks/useHorizontalNav'

// Util Imports
import { horizontalLayoutClasses } from '@layouts/utils/layoutClasses'

const NavbarContentForCustomer = () => {
  // Hooks
  const { isBreakpointReached } = useHorizontalNav()

  return (
    <div
      className={classnames(
        horizontalLayoutClasses.navbarContent,
        'flex items-center justify-between gap-4 max-2xl:is-full is-[80%] mx-auto'
      )}
    >
      <div className='flex items-center gap-4'>
        {/* <NavToggle /> */}
        {/* Hide Logo on Smaller screens */}
        {!isBreakpointReached && <LogoForCustomer />}
      </div>
      <Link href={'/customer-login'}>
        <div className='flex items-center'>
          {/* <ModeDropdown />
          <UserDropdown /> */}
          <svg
            xmlns='http://www.w3.org/2000/svg'
            viewBox='0 0 24 24'
            fill='none'
            stroke='currentColor'
            stroke-width='2'
            stroke-linecap='round'
            stroke-linejoin='round'
            className='lucide lucide-log-out w-4 h-4'
          >
            <path d='M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4'></path>
            <polyline points='16 17 21 12 16 7'></polyline>
            <line x1='21' x2='9' y1='12' y2='12'></line>
          </svg>
        </div>
      </Link>
    </div>
  )
}

export default NavbarContentForCustomer
