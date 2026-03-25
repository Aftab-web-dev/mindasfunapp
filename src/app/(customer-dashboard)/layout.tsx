// MUI Imports
import Button from '@mui/material/Button'

// Type Imports
import type { ChildrenType } from '@core/types'

// Layout Imports
import LayoutWrapperForCustomer from '@/@layouts/LayoutWrapperForCustomer'
import HorizontalLayoutForCustomer from '@/@layouts/HorizontalLayoutForCustomer'

// Component Imports
import Providers from '@components/Providers'
import HeaderForCustomer from '@/components/layout/horizontal/HeaderForCustomer'
import HorizontalFooter from '@components/layout/horizontal/FooterForCustomer'
import ScrollToTop from '@core/components/scroll-to-top'

// // Util Imports
// import { getMode } from '@core/utils/serverHelpers'

const Layout = async (props: ChildrenType) => {
  const { children } = props

  // Vars
  const direction = 'ltr'

  // const mode = await getMode()

  return (
    <Providers direction={direction}>
      <LayoutWrapperForCustomer
        horizontalLayout={
          <HorizontalLayoutForCustomer header={<HeaderForCustomer />} footer={<HorizontalFooter />}>
            {children}
          </HorizontalLayoutForCustomer>
        }
      />
      <ScrollToTop className='mui-fixed'>
        <Button variant='contained' className='is-10 bs-10 rounded-full p-0 min-is-0 flex items-center justify-center'>
          <i className='tabler-arrow-up' />
        </Button>
      </ScrollToTop>
    </Providers>
  )
}

export default Layout
