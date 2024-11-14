'use client'

// Third-party Imports
import classnames from 'classnames'
import type { CSSObject } from '@emotion/styled'

import { Paper } from '@mui/material'

// Type Imports
import type { ChildrenType } from '@core/types'

// Util Imports
import { verticalLayoutClasses } from '@layouts/utils/layoutClasses'

// Styled Component Imports
import StyledHeader from '@layouts/styles/vertical/StyledHeader'

type Props = ChildrenType & {
  overrideStyles?: CSSObject
}

const Navbar = (props: Props) => {
  // Props
  const { children, overrideStyles } = props

  return (
    <Paper sx={{ boxShadow: 'none' }}>
      <StyledHeader
        overrideStyles={overrideStyles}
        className={classnames(
          verticalLayoutClasses.header,
          verticalLayoutClasses.headerContentCompact,
          verticalLayoutClasses.headerStatic,
          verticalLayoutClasses.headerDetached
        )}
      >
        <div className={classnames(verticalLayoutClasses.navbar, 'flex bs-full ')}>{children}</div>
      </StyledHeader>
    </Paper>
  )
}

export default Navbar
