import axios, { AxiosError } from 'axios'
import { redirect } from 'next/navigation'

// Define the structure for the API response
interface ApiResponse<T = any> {
  statusCode: number
  message?: string
  data?: T
  response?: T
}

interface ErrorResponse {
  statusCode: number | null
  errorData: any
  message?: string
  response?: null
  data?: []
}

export type ResponseType<T> = ApiResponse<T> | ErrorResponse

const BASE_URL_API = process.env.NEXT_PUBLIC_BASE_URL_API || ''

// Initialize axios instance
const apiClient = axios.create({
  baseURL: BASE_URL_API,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Helper function to handle errors
const handleError = (error: any): ErrorResponse => {
  if (axios.isAxiosError(error)) {
    const statusCode = error.response ? error.response.status : null
    const errorData = error.response ? error.response.data : error.message
    console.log('Error status code:', statusCode)
    console.log('Error data:', errorData)
    if (statusCode === 401) {
      // Redirect to login if unauthorized
      if (typeof window !== 'undefined') {
        redirect('/login')
      }
    }
    return { statusCode, errorData }
  } else {
    console.error('Unexpected error:', error)
    return { statusCode: null, errorData: error }
  }
}

// Fetch token from localStorage if in client-side
const getToken = () => (typeof window !== 'undefined' ? localStorage.getItem('token') : '')

// Add token to headers dynamically
apiClient.interceptors.request.use(config => {
  const token = getToken()
  if (token) {
    config.headers.Authorization = token
  }
  return config
})

// Service functions
const serviceGet = async <T = any>(path: string, params: Record<string, any> = {}): Promise<ResponseType<T>> => {
  try {
    const response = await apiClient.get(path, { params })
    return { statusCode: response.status, message: response.data.message ?? 'success', data: response.data.data }
  } catch (error) {
    console.log('============= RESPONSE ERROR =============')
    return handleError(error)
  }
}

const servicePost = async <T = any>(path: string, params: Record<string, any> = {}): Promise<ResponseType<T>> => {
  try {
    const response = await apiClient.post(path, params)
    return { statusCode: response.status, message: response.data.message, data: response.data.data }
  } catch (error) {
    console.log('============= RESPONSE ERROR =============')
    return handleError(error)
  }
}

const servicePut = async <T = any>(path: string, params: Record<string, any> = {}): Promise<ResponseType<T>> => {
  try {
    const response = await apiClient.put(path, params)
    return { statusCode: response.status, message: response.data.message, data: response.data.data }
  } catch (error) {
    console.log('============= RESPONSE ERROR =============')
    return handleError(error)
  }
}

const servicePatch = async <T = any>(path: string, params: Record<string, any> = {}): Promise<ResponseType<T>> => {
  try {
    const response = await apiClient.patch(path, params)
    return { statusCode: response.status, message: response.data.message, data: response.data.data }
  } catch (error) {
    console.log('============= RESPONSE ERROR =============')
    return handleError(error)
  }
}

const serviceDelete = async <T = any>(path: string, params: Record<string, any> = {}): Promise<ResponseType<T>> => {
  try {
    const response = await apiClient.delete(path, { data: params })
    return { statusCode: response.status, message: response.data.message, data: response.data.data }
  } catch (error) {
    console.log('============= RESPONSE ERROR =============')
    return handleError(error)
  }
}

const serviceUploadImagePost = async <T = any>(path: string, formData: FormData): Promise<ResponseType<T>> => {
  try {
    const response = await apiClient.post(path, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
    return { statusCode: response.status, message: response.data.message, data: response.data.data }
  } catch (error) {
    console.log('============= RESPONSE ERROR =============')
    return handleError(error)
  }
}

const AppService = {
  serviceGet,
  servicePost,
  servicePut,
  servicePatch,
  serviceDelete,
  serviceUploadImagePost
}

export default AppService
