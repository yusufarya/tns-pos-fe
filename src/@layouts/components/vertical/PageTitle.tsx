import { Paper } from '@mui/material'

import type { ChildrenType } from '@/@core/types'

type Props = ChildrenType

export default function PageTitle(props: Props) {
  const { children } = props

  return (
    <Paper className='w-full' sx={{ boxShadow: 'none' }}>
      {children}
    </Paper>
  )
}
