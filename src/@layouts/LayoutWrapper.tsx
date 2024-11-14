'use client'

import type React from 'react'

import type { ReactElement } from 'react'

import { useState } from 'react'

import { useSelector } from 'react-redux'

import type { RootState } from '@/store'

import PageDisabled from '@/app/(dashboard)/page-disabled'
import FetchUserData from '@/@core/utils/fetchUserData'

const LayoutWrapper = ({ verticalLayout }: { verticalLayout: ReactElement }) => {
  const [isPageDisabled, setIsPageDisabled] = useState<boolean>(false)
  const isLoggedIn = useSelector((state: RootState) => state.user.isLoggedIn)
  const message = useSelector((state: RootState) => state.user.message)

  return (
    <>
      <FetchUserData setIsPageDisabled={setIsPageDisabled} />
      {isPageDisabled && !isLoggedIn && <PageDisabled message={message} />}
      <div className='flex flex-col flex-auto'>{verticalLayout}</div>
    </>
  )
}

export default LayoutWrapper
