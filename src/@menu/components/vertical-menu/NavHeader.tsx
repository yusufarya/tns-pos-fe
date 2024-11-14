// Third-party Imports
import styled from '@emotion/styled'

// Type Imports
import type { ChildrenType } from '../../types'

// Util Imports
import { verticalNavClasses } from '../../utils/menuClasses'

const StyledNavHeader = styled.div`
  padding: 15px;
  padding-inline-start: 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: 0 1px 10px #acacac;
  margin-bottom: 10px;
`

const NavHeader = ({ children }: ChildrenType) => {
  return <StyledNavHeader className={verticalNavClasses.header}>{children}</StyledNavHeader>
}

export default NavHeader
