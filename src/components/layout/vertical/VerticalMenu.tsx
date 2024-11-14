// MUI Imports
import Chip from '@mui/material/Chip'
import { useTheme } from '@mui/material/styles'

// Third-party Imports
import PerfectScrollbar from 'react-perfect-scrollbar'

// Type Imports
import type { VerticalMenuContextProps } from '@menu/components/vertical-menu/Menu'

// Component Imports
import { Menu, SubMenu, MenuItem, MenuSection } from '@menu/vertical-menu'

// Hook Imports
import useVerticalNav from '@menu/hooks/useVerticalNav'

// Styled Component Imports
import StyledVerticalNavExpandIcon from '@menu/styles/vertical/StyledVerticalNavExpandIcon'

// Style Imports
import menuItemStyles from '@core/styles/vertical/menuItemStyles'
import menuSectionStyles from '@core/styles/vertical/menuSectionStyles'
import { Divider } from '@mui/material'

type RenderExpandIconProps = {
  open?: boolean
  transitionDuration?: VerticalMenuContextProps['transitionDuration']
}

const RenderExpandIcon = ({ open, transitionDuration }: RenderExpandIconProps) => (
  <StyledVerticalNavExpandIcon open={open} transitionDuration={transitionDuration}>
    <i className='ri-arrow-right-s-line' />
  </StyledVerticalNavExpandIcon>
)

const VerticalMenu = ({ scrollMenu }: { scrollMenu: (container: any, isPerfectScrollbar: boolean) => void }) => {
  // Hooks
  const theme = useTheme()
  const { isBreakpointReached, transitionDuration } = useVerticalNav()

  const ScrollWrapper = isBreakpointReached ? 'div' : PerfectScrollbar

  return (
    // eslint-disable-next-line lines-around-comment
    /* Custom scrollbar instead of browser scroll, remove if you want browser scroll only */
    <ScrollWrapper
      {...(isBreakpointReached
        ? {
            className: 'bs-full overflow-y-auto overflow-x-hidden',
            onScroll: container => scrollMenu(container, false)
          }
        : {
            options: { wheelPropagation: false, suppressScrollX: true },
            onScrollY: container => scrollMenu(container, true)
          })}
    >
      {/* Incase you also want to scroll NavHeader to scroll with Vertical Menu, remove NavHeader from above and paste it below this comment */}
      {/* Vertical Menu */}
      <Menu
        menuItemStyles={menuItemStyles(theme)}
        renderExpandIcon={({ open }) => <RenderExpandIcon open={open} transitionDuration={transitionDuration} />}
        renderExpandedMenuItemIcon={{ icon: <i className='ri-circle-line' /> }}
        menuSectionStyles={menuSectionStyles(theme)}
      >
        <MenuItem href='/' icon={<i className='ri-home-smile-line' />}>
          Beranda
        </MenuItem>
        <Divider className='my-1' />
        <MenuItem href='/products' icon={<i className='ri-box-1-line' />}>
          Product
        </MenuItem>
        <MenuItem href='/warehouses' icon={<i className='ri-building-2-line' />}>
          Inventori
        </MenuItem>
        <SubMenu label='Pembelian' icon={<i className='ri-shopping-bag-4-line' />}>
          <MenuItem href='/purchases/overview'>Overview</MenuItem>
          <MenuItem href='/purchases/purchase-invoices'>Tagihan Pembelian</MenuItem>
          <MenuItem href='/purchases/accepted-orders'>Penerimaan Pesanan</MenuItem>
          <MenuItem href='/purchases/purchase-orders'>Pesanan Pembelian</MenuItem>
        </SubMenu>
        <SubMenu label='Penjualan' icon={<i className='ri-shopping-basket-2-line' />}>
          <MenuItem href='/sales/overview'>Overview</MenuItem>
          <MenuItem href='/sales/sales-invoices'>Tagihan Penjualan</MenuItem>
          <MenuItem href='/sales/deliveries'>Pengiriman Pesanan</MenuItem>
          <MenuItem href='/sales/sales-orders'>Pesanan Penjualan</MenuItem>
        </SubMenu>
        <SubMenu label='Miscellaneous' icon={<i className='ri-question-line' />}>
          <MenuItem href='/error' target='_blank'>
            Error
          </MenuItem>
          <MenuItem href='/under-maintenance' target='_blank'>
            Under Maintenance
          </MenuItem>
        </SubMenu>
        <MenuSection label='Laporan & Keuangan'>
          <MenuItem href='/reports' icon={<i className='ri-bar-chart-2-line' />}>
            Laporan
          </MenuItem>
          <MenuItem href='/cash-and-banks' icon={<i className='ri-bank-card-2-line' />}>
            Kas & Bank
          </MenuItem>
          <MenuItem href='/accounts' icon={<i className='ri-article-line' />}>
            Akun
          </MenuItem>
          <MenuItem href='/fixed-assets' icon={<i className='ri-hotel-line' />}>
            Aset Tetap
          </MenuItem>
        </MenuSection>
        <MenuSection label='Kontak'>
          <MenuItem href='/salesman' icon={<i className='ri-account-box-line' />}>
            Sales
          </MenuItem>
          <MenuItem href='/vendors' icon={<i className='ri-team-line' />}>
            Vendor
          </MenuItem>
          <MenuItem href='/customer' icon={<i className='ri-group-3-line' />}>
            Pelanggan
          </MenuItem>
        </MenuSection>
      </Menu>
    </ScrollWrapper>
  )
}

export default VerticalMenu
