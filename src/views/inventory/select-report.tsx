'use client'

import * as React from 'react'
import { styled, alpha } from '@mui/material/styles'
import Button from '@mui/material/Button'
import Menu, { MenuProps } from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import ArticleIcon from '@mui/icons-material/Article'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'

const StyledMenu = styled((props: MenuProps) => (
  <Menu
    elevation={0}
    anchorOrigin={{
      vertical: 'bottom',
      horizontal: 'right'
    }}
    transformOrigin={{
      vertical: 'top',
      horizontal: 'right'
    }}
    {...props}
  />
))(({ theme }) => ({
  '& .MuiPaper-root': {
    borderRadius: 6,
    marginTop: theme.spacing(1),
    minWidth: 180,
    color: 'rgb(55, 65, 81)',
    boxShadow:
      'rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px',
    '& .MuiMenu-list': {
      padding: '4px 0'
    },
    '& .MuiMenuItem-root': {
      '& .MuiSvgIcon-root': {
        fontSize: 18,
        color: theme.palette.text.secondary,
        marginRight: theme.spacing(1.5)
      },
      '&:active': {
        backgroundColor: alpha(theme.palette.primary.main, theme.palette.action.selectedOpacity)
      }
    },
    ...theme.applyStyles('dark', {
      color: theme.palette.grey[300]
    })
  }
}))

export default function SelectReportProduct() {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }

  return (
    <div>
      <Button
        id='select-report-button'
        aria-controls={open ? 'select-report' : undefined}
        aria-haspopup='true'
        aria-expanded={open ? 'true' : undefined}
        variant='outlined'
        disableElevation
        onClick={handleClick}
        endIcon={<KeyboardArrowDownIcon />}
        color='secondary'
        size='small'
        sx={{ mx: 1 }}
      >
        Lihat laporan
      </Button>
      <StyledMenu
        id='select-report'
        MenuListProps={{
          'aria-labelledby': 'select-report-button'
        }}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
      >
        <MenuItem onClick={handleClose} disableRipple>
          <ArticleIcon />
          Laporan Transfer Gudang
        </MenuItem>
        <MenuItem onClick={handleClose} disableRipple>
          <ArticleIcon />
          Laporan Penyesuaian Persediaan
        </MenuItem>
      </StyledMenu>
    </div>
  )
}
