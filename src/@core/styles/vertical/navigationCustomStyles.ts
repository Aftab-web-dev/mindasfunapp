// MUI Imports
import type { Theme } from '@mui/material/styles'

// Type Imports
import type { VerticalNavState } from '@menu/contexts/verticalNavContext'

// Util Imports
import { menuClasses, verticalNavClasses } from '@menu/utils/menuClasses'

const navigationCustomStyles = (verticalNavOptions: VerticalNavState, theme: Theme) => {
  const { isCollapsed, isHovered, transitionDuration } = verticalNavOptions
  const collapsedNotHovered = isCollapsed && !isHovered

  return {
    color: '#fff',
    zIndex: 'var(--drawer-z-index) !important',

    [`& .${verticalNavClasses.header}`]: {
      paddingBlock: theme.spacing(4),
      paddingInline: collapsedNotHovered ? 0 : theme.spacing(4.5, 3.5),
      ...(collapsedNotHovered && {
        display: 'flex',
        justifyContent: 'center',
      }),
      '& a': {
        transition: `transform ${transitionDuration}ms ease`,
        ...(collapsedNotHovered && {
          display: 'flex',
          justifyContent: 'center',
          width: '100%',
        }),
      }
    },

    [`& .${verticalNavClasses.container}`]: {
      transition: theme.transitions.create(['inline-size', 'inset-inline-start', 'box-shadow'], {
        duration: transitionDuration,
        easing: 'ease-in-out'
      }),
      borderColor: 'transparent',
    },

    [`& .${menuClasses.root}`]: {
      paddingBlock: theme.spacing(0.5),
      paddingInline: collapsedNotHovered ? theme.spacing(2.5) : theme.spacing(2.5),
    },

    [`& .${verticalNavClasses.backdrop}`]: {
      backgroundColor: 'var(--backdrop-color)'
    },
  }
}

export default navigationCustomStyles
