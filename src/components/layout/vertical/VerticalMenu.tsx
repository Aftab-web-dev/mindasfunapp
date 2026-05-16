// MUI Imports
import { useTheme } from '@mui/material/styles'

// Third-party Imports
import PerfectScrollbar from 'react-perfect-scrollbar'

// Type Imports
import type { VerticalMenuContextProps } from '@menu/components/vertical-menu/Menu'

// Component Imports
import { Menu, MenuItem, SubMenu } from '@menu/vertical-menu'
import { reportCategories } from '@/app/(dashboard)/admin/reports/_components/reportConfig'

// Hook Imports
import useVerticalNav from '@menu/hooks/useVerticalNav'

// Styled Component Imports
import StyledVerticalNavExpandIcon from '@menu/styles/vertical/StyledVerticalNavExpandIcon'

// Style Imports
import menuItemStyles from '@core/styles/vertical/menuItemStyles'
import menuSectionStyles from '@core/styles/vertical/menuSectionStyles'

type RenderExpandIconProps = {
  open?: boolean
  transitionDuration?: VerticalMenuContextProps['transitionDuration']
}

type Props = {
  scrollMenu: (container: any, isPerfectScrollbar: boolean) => void
}

const RenderExpandIcon = ({ open, transitionDuration }: RenderExpandIconProps) => (
  <StyledVerticalNavExpandIcon open={open} transitionDuration={transitionDuration}>
    <i className='tabler-chevron-right' />
  </StyledVerticalNavExpandIcon>
)

const VerticalMenu = ({ scrollMenu }: Props) => {
  // Hooks
  const theme = useTheme()
  const verticalNavOptions = useVerticalNav()

  // Vars
  const { isBreakpointReached, transitionDuration, isCollapsed, isHovered } = verticalNavOptions
  const collapsedNotHovered = isCollapsed && !isHovered

  const ScrollWrapper = isBreakpointReached ? 'div' : PerfectScrollbar

  return (
    <ScrollWrapper
      {...(isBreakpointReached
        ? {
            className: 'bs-full overflow-y-auto overflow-x-hidden',
            onScroll: (container: any) => scrollMenu(container, false)
          }
        : {
            options: { wheelPropagation: false, suppressScrollX: true },
            onScrollY: (container: any) => scrollMenu(container, true)
          })}
    >
      <Menu
        popoutMenuOffset={{ mainAxis: 23 }}
        menuItemStyles={menuItemStyles(verticalNavOptions, theme)}
        renderExpandIcon={({ open }) => <RenderExpandIcon open={open} transitionDuration={transitionDuration} />}
        renderExpandedMenuItemIcon={{
          icon: <i className='tabler-minus text-xs' />
        }}
        menuSectionStyles={menuSectionStyles(verticalNavOptions, theme)}
      >
        <SubMenu label='Dashboard' icon={<i className='tabler-smart-home' />}>
          <MenuItem href='/admin/home/management'>Management</MenuItem>
          {/* <MenuItem href='/admin/home/operations-and-tech'>Operations & Tech</MenuItem> */}
          <MenuItem href='/admin/home/stores'>Stores</MenuItem>
        </SubMenu>

        {!collapsedNotHovered && (
          <li
            style={{
              padding: '12px 12px 4px',
              fontSize: '0.6875rem',
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.8px',
              color: 'rgba(255,255,255,0.4)'
            }}
          >
            Manage
          </li>
        )}

        <MenuItem href='/admin/recharge-and-balance' icon={<i className='tabler-recharging' />}>
          Recharge & Balance
        </MenuItem>
        <SubMenu label='Events' icon={<i className='tabler-calendar-event' />}>
          <MenuItem href='/admin/events/add-event'>Add an Event</MenuItem>
          <MenuItem href='/admin/events/req-event'>Request Events</MenuItem>
          <MenuItem href='/admin/events'>View Events</MenuItem>
        </SubMenu>
        <SubMenu label='Customers' icon={<i className='tabler-users' />}>
          <MenuItem href='/admin/customers/add-customer'>Add a Customer</MenuItem>
          <MenuItem href='/admin/customers'>View Customers</MenuItem>
        </SubMenu>
        <SubMenu label='Waiver' icon={<i className='tabler-file-check' />}>
          <MenuItem href='/admin/waiver-template/add'>Register Template</MenuItem>
          <MenuItem href='/admin/waiver-template'>Waiver Templates</MenuItem>
          <MenuItem href='/admin/view-signed-waivers'>Signed Waivers</MenuItem>
          <MenuItem href='/admin/check-in-history'>Check-in History</MenuItem>
          <MenuItem href='/admin/export-waiver-data'>Export Data</MenuItem>
        </SubMenu>
        <SubMenu label='Reports' icon={<i className='tabler-file-text' />}>
          {reportCategories.map(category => (
            <SubMenu key={category.label} label={category.label}>
              {category.reports.map(report => (
                <MenuItem key={report.value} href={`/admin/reports?type=${report.value}`}>
                  {report.label}
                </MenuItem>
              ))}
            </SubMenu>
          ))}
        </SubMenu>
      </Menu>
    </ScrollWrapper>
  )
}

export default VerticalMenu
