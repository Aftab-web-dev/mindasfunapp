'use client'

// Third-party Imports
import classnames from 'classnames'

// Util Imports
import { horizontalLayoutClasses } from '@layouts/utils/layoutClasses'

const FooterContentForCustomer = () => {
  // Hooks

  return (
    <div
      className={classnames(
        horizontalLayoutClasses.footerContent,
        'flex items-center justify-between flex-wrap gap-4 max-2xl:is-full is-[80%] mx-auto'
      )}
    >
      <p className='text-textSecondary'>{`© ${new Date().getFullYear()}, Midas Fun by Urbanhub Innovations `}</p>
    </div>
  )
}

export default FooterContentForCustomer
