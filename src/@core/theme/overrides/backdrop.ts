// MUI Imports
import type { Theme } from '@mui/material/styles'

const backdrop: Theme['components'] = {
  MuiBackdrop: {
    styleOverrides: {
      root: {
        '&:not(.MuiBackdrop-invisible)': {
          backgroundColor: '0px 4px 10px rgb,(0,0,0, 0.22)'
        }
      }
    }
  }
}

export default backdrop
