// Next Imports
import Link from 'next/link'

// MUI Imports
import IconButton from '@mui/material/IconButton'

// Third-party Imports
import classnames from 'classnames'

// Component Imports
import NavToggle from './NavToggle'
import NavSearch from '@components/layout/shared/search'
import ModeDropdown from '@components/layout/shared/ModeDropdown'
import UserDropdown from '@components/layout/shared/UserDropdown'

// Util Imports
import { verticalLayoutClasses } from '@layouts/utils/layoutClasses'

import ChangeLanguage from './session-client/ChangeLanguage'
import ChangeCurrentBranch from './session-client/ChangeBranch'

// Icon
import ShoppingBasketIcon from '@mui/icons-material/ShoppingBasket'
import LocalMallIcon from '@mui/icons-material/LocalMall'
import AddCardIcon from '@mui/icons-material/AddCard'

import { Button, Typography } from '@mui/material'

const NavbarContent = () => {
  return (
    <div className={classnames(verticalLayoutClasses.navbarContent, 'flex items-center justify-between gap-4 is-full')}>
      <div className='flex items-center gap-2 sm:gap-4'>
        <NavToggle />
        {/* <NavSearch /> */}

        <Link href={`/purchase/purchase-invoice/add`}>
          <Button variant='outlined' color='primary' size='small'>
            <LocalMallIcon sx={{ fontSize: '16px', pb: '2px' }} />
            <Typography variant='body2' color='primary' className='mx-2'>
              Beli
            </Typography>
          </Button>
        </Link>
        <Link href={`/sales/sales-invoice/add`}>
          <Button variant='outlined' color='error' size='small'>
            <ShoppingBasketIcon sx={{ fontSize: '16px', pb: '2px' }} />
            <Typography variant='body2' color='error' className='mx-2'>
              Jual
            </Typography>
          </Button>
        </Link>
        <Link href={`/purchase/purchase-invoice/add`}>
          <Button variant='outlined' color='warning' size='small'>
            <AddCardIcon sx={{ fontSize: '16px', pb: '2px' }} />
            <Typography variant='body2' color='orange' className='mx-2'>
              Biaya
            </Typography>
          </Button>
        </Link>
      </div>
      <div className='flex items-center'>
        <ChangeCurrentBranch />
        <ChangeLanguage />
        <ModeDropdown />
        <IconButton className='text-textPrimary'>
          <i className='ri-notification-2-line' />
        </IconButton>
        <UserDropdown />
      </div>
    </div>
  )
}

export default NavbarContent
