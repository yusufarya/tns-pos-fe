'use client' // Ensure this is at the very top

import type React from 'react'

import { useEffect } from 'react'

import { usePathname, useRouter } from 'next/navigation' // Ensure this is from 'next/navigation'

import { useDispatch } from 'react-redux'

import UserService from '@/app/api/services/user-service'
import { setIsLoggedIn, setUserData } from '@/store/slices/user-slice'
import type { ResponseData, ProfileResponse } from '../types'

// Define interface for props
interface FetchUserDataProps {
  setIsPageDisabled: (disabled: boolean) => void
}

const FetchUserData: React.FC<FetchUserDataProps> = ({ setIsPageDisabled }) => {
  const dispatch = useDispatch()
  const router = useRouter() // Use the router here
  const pathname = usePathname()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const user: ProfileResponse | ResponseData = await UserService.getProfile()

        if ('statusCode' in user) {
          if (user.statusCode === 401) {
            setIsPageDisabled(true) // Disable the page initially

            if (pathname !== '/register' && pathname !== '/login') {
              dispatch(setIsLoggedIn({ status: false, message: 'Anda belum login. Silahkan login terlebih dahulu' }))

              setTimeout(() => {
                router.push('/login')
              }, 3000)
            }
          } else {
            dispatch(setIsLoggedIn({ status: false, message: user.message }))
          }
        } else {
          // Successful response
          dispatch(setIsLoggedIn({ status: true, message: 'OK' }))
          dispatch(setUserData(user)) // Dispatch user data
        }
      } catch (error) {
        console.error('Failed to fetch user data:', error)
      } finally {
        // setIsPageDisabled(false); // Re-enable the page
      }
    }

    fetchData()
  }, [dispatch, setIsPageDisabled, router, pathname])

  return null // No rendering
}

export default FetchUserData
