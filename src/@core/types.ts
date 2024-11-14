// React Imports
import type { ReactNode } from 'react'

export type Skin = 'default' | 'bordered'

export type Mode = 'light' | 'dark'

export type SystemMode = 'light' | 'dark'

export type Direction = 'ltr' | 'rtl'

export type ChildrenType = {
  children: ReactNode
}

export type ThemeColor = 'primary' | 'secondary' | 'error' | 'warning' | 'info' | 'success'

export interface PreviewFile extends File {
  preview: string
}

export interface Profile {
  id: number
  name: string
  username: string
  gender: string
  place_of_birth?: string | null
  date_of_birth?: Date | null
  phone: string
  address?: string | null
  is_active: string
  role_id: number
  token?: string | null
  last_login?: Date | null
}

export interface ResponseData {
  statusCode: number
  message: string
}

export interface ResponseStatus {
  status: string
  message?: string | null
}

// Union type for API responses
export type ProfileResponse = Profile | ResponseData
