'use client'

// Third-party Imports
import classnames from 'classnames'

// Util Imports
import { verticalLayoutClasses } from '@layouts/utils/layoutClasses'

const FooterContent = () => {
  // Hooks

  return (
    <div
    className={classnames(
      verticalLayoutClasses.footerContent,
      "flex items-center justify-center flex-wrap gap-4"
    )}
  >
    <p className="text-textSecondary">
      {`© ${new Date().getFullYear()}, Midas Fun by Urbanhub Innovations `}
    </p>
  </div>
  )
}

export default FooterContent
