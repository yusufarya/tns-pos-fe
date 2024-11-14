import { Profile, ResponseData } from '@/@core/types'
import axios from 'axios'

const BASE_URL_API = process.env.NEXT_PUBLIC_BASE_URL_API || ''

const getProfile = async (): Promise<Profile | ResponseData> => {
  const headers = { Authorization: localStorage.getItem('token') || '' }
  try {
    const response = await axios.get<Profile>(`${BASE_URL_API}api/user/current`, { headers })
    return response.data
  } catch (error) {
    console.log('============= RESPONSE ERROR =============')
    if (axios.isAxiosError(error)) {
      const statusCode = error.response?.status || null
      const errorData = error.response?.data || { message: error.message }
      console.log('Error status code:', statusCode)
      console.log('Error data:', errorData)
      return {
        statusCode,
        message: errorData.errors || 'An error occurred'
      } as ResponseData
    } else {
      console.error('Unexpected error:', error)
      return {
        statusCode: 500,
        message: 'Unexpected error occurred'
      } as ResponseData
    }
  }
}

// Fungsi baru untuk memperbarui profil dan memicu revalidation
const updateProfile = async (profileData: Profile): Promise<ResponseData> => {
  const headers = { Authorization: localStorage.getItem('token') || '' }
  try {
    const response = await axios.put<ResponseData>(`${BASE_URL_API}api/user/update`, profileData, { headers })

    // Panggil revalidation setelah profil berhasil diperbarui
    await triggerRevalidate()

    return response.data
  } catch (error) {
    console.log('============= RESPONSE ERROR =============')
    if (axios.isAxiosError(error)) {
      const statusCode = error.response?.status || null
      const errorData = error.response?.data || { message: error.message }
      console.log('Error status code:', statusCode)
      console.log('Error data:', errorData)
      return {
        statusCode,
        message: errorData.errors || 'An error occurred'
      } as ResponseData
    } else {
      console.error('Unexpected error:', error)
      return {
        statusCode: 500,
        message: 'Unexpected error occurred'
      } as ResponseData
    }
  }
}

// Fungsi untuk memicu revalidation
const triggerRevalidate = async () => {
  const res = await axios.post('/api/revalidate', {
    secret: process.env.REVALIDATE_SECRET, // Pastikan ini didefinisikan di file .env
    path: '/user-profile' // Ganti dengan path yang ingin di-revalidate
  })

  if (res.data.revalidated) {
    console.log('Revalidation successful')
  } else {
    console.error('Failed to revalidate')
  }
}

const UserService = {
  getProfile,
  updateProfile // Pastikan untuk mengekspor fungsi baru ini
}

export default UserService
