'use client'

import { useEffect, useState } from 'react'

import { useDispatch, useSelector } from 'react-redux'

import { useParams, useRouter } from 'next/navigation'

import {
  Button,
  CircularProgress,
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  TextField,
  Typography
} from '@mui/material'

import AppService from '@/app/api/services/app-service'
import { ArrowBack, Save } from '@mui/icons-material'
import { setPageName } from '@/store/slices/page-name-slice'
import { ResponseStatus } from '@/@core/types'
import TimelapseRoundedIcon from '@mui/icons-material/TimelapseRounded'
import { CreateStockAdjustmentRequest } from '@/@core/inventory-data-types'
import AddIcon from '@mui/icons-material/Add'
import RemoveIcon from '@mui/icons-material/Remove'

import { DemoContainer } from '@mui/x-date-pickers/internals/demo'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import dayjs, { Dayjs } from 'dayjs'
import { ProductResponse, WarehouseResponse } from '@/@core/master-data-types'
import LoadingPageTitle from '@/components/loading/loading-page-title'
import CustomSnackBarNotification from '@/components/notification/custom-snackbar-notification'

const AddStockAdjustment = () => {
  const params = useParams<{ id_product: string }>()
  const id_product = params.id_product
  // const getResponseDataUpdate = useSelector<ResponseData|any>((state) => state.responseStatus.status);
  // console.log('getResponseDataUpdate : ' + getResponseDataUpdate)
  const getUser: any = useSelector<any>(state => state.user.user)

  const router = useRouter()
  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(setPageName({ params1: 'Penyesuaian Stok', params2: 'Tambah' }))
  }, [dispatch]) // Ensure dispatch is in the dependency array

  const [loadingButtonSubmit, setLoadingButtonSubmit] = useState<boolean>(false)
  const [numberTR, setNumberTR] = useState('SAXXXXXXXXX') // Initial value for numberTR
  const [typeAdjust, setTypeAdjust] = useState<string>('')
  const [warehouse, setWarehouse] = useState<string>('')
  const [dataForm, setDataForm] = useState<CreateStockAdjustmentRequest[]>([])
  const [errors, setErrors] = useState<{ [key in keyof CreateStockAdjustmentRequest]?: string }>({})
  const [isSuccessUpdate, setIsSuccessUpdate] = useState<ResponseStatus | null>(null)
  const [dateNow, setDateNow] = useState<Dayjs | null>(dayjs(new Date()))
  const [productData, setProductData] = useState<ProductResponse | null>(null)
  const [warehouseData, setWarehouseData] = useState<WarehouseResponse[]>()
  const [showData, setShowData] = useState(false)

  // Function to set the default date in the "YYYY-MM-DD" format
  const setDefaultDate = () => {
    // Current date object to set default date in date input field
    const dateObject = dayjs(new Date())
    // Format the date as "YYYY-MM-DD"
    const dateTransaction = dateObject.format('YYYY-MM-DD')
    // Update the form state with the formatted date
    setDataForm(prev => ({
      ...prev,
      date: dateTransaction
    }))
  }

  useEffect(() => {
    const fetchAnyData = async () => {
      try {
        const [productResponse, warehouseResponse] = await Promise.all([
          AppService.serviceGet('api/product/get', { id: id_product }),
          AppService.serviceGet('api/all-warehouse')
        ])
        if ('statusCode' in productResponse && productResponse.statusCode === 200 && 'data' in productResponse) {
          setProductData(productResponse.data) // Assuming result.data contains the array of category
        }
        if ('statusCode' in warehouseResponse && warehouseResponse.statusCode === 200 && 'data' in warehouseResponse) {
          console.log(warehouseResponse)
          setWarehouseData(warehouseResponse.data) // Assuming result data contains the array of unit
        }
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }
    fetchAnyData()
    setDefaultDate()
  }, [])

  const handleInput = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target

    // Update dataForm
    setDataForm(prev => ({ ...prev, [name]: value }))

    // Clear error on change
    setErrors(prev => ({ ...prev, [name]: undefined }))
  }

  const handleChangeDate = (newDate: Dayjs | null) => {

    if (newDate) {
      setDateNow(newDate)
      // You can format it here if needed:
      setDataForm(prev => ({ ...prev, date: newDate.format('YYYY-MM-DD') }))
      // Clear error on change
      setErrors(prev => ({ ...prev, date: undefined }))
    }

  }

  const handleChangeType = (event: SelectChangeEvent<string>) => {
    const name = event.target.name
    const value = event.target.value
    setTypeAdjust(value)
    setDataForm(prev => ({ ...prev, [name]: value }))
    setErrors(prev => ({ ...prev, [name]: undefined }))
  }

  const handleChangeWarehouse = (event: SelectChangeEvent<string>) => {
    const name = event.target.name
    const value = event.target.value
    setWarehouse(value)
    setDataForm(prev => ({ ...prev, [name]: value }))
    // Clear error on change
    setErrors(prev => ({ ...prev, [name]: undefined }))
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    setLoadingButtonSubmit(true)
    console.log('=== SUBMIT ADD PRODUK ===')

    // Make sure dataForm is an array and calculate total_qty
    const total_qty = Array.isArray(dataForm) ? dataForm.reduce((sum, item) => sum + (Number(item.qty) || 0), 0) : 0

    const stockAdjustmentData = {
      ...dataForm,
      total_qty,
      branch_id: Number(localStorage.getItem('current_branch')),
      username: getUser.data.username
    }
    console.log('Stock Adjustment to submit:', stockAdjustmentData)

    try {
      const storeData = await AppService.servicePost('api/stock-adjustment/create', stockAdjustmentData)
      console.log(storeData)
      if ('statusCode' in storeData && storeData.statusCode === 200) {
        setIsSuccessUpdate({ status: 'success', message: storeData.message })

        const dataDetail = {
          ...dataForm,
          number: storeData.data.number,
          product_id: id_product,
          warehouse_id: warehouse,
          branch_id: Number(localStorage.getItem('current_branch')),
          username: getUser.data.username
        }
        console.log(dataDetail)

        const resultDetail = await AppService.servicePost('api/stock-adjustment-detail/create', dataDetail)
        console.log(resultDetail)
        setTimeout(() => {
          router.push('/inventory/' + id_product + '/stock-adjustment/detail')
          setLoadingButtonSubmit(false)
        }, 3000)
      } else if ('errorData' in storeData) {
        // Handle validation errors from the backend
        setLoadingButtonSubmit(false)
        if (storeData.errorData.errors) {
          setIsSuccessUpdate({ status: 'failed', message: storeData.errorData.errors })
        }
        console.log('storeData : ')
        console.log(storeData)
        const newErrors: any = {}
        storeData.errorData.error.issues.forEach((issue: any) => {
          newErrors[issue.path[0]] = issue.message // Map error messages to field names
        })
        setErrors(newErrors)
      } else {
        setLoadingButtonSubmit(false)
        setIsSuccessUpdate({ status: 'failed', message: 'Please check the form input.' })
      }
    } catch (error) {
      console.error('Error fetching data:', error)
      setLoadingButtonSubmit(false)
    }
  }

  useEffect(() => {
    setTimeout(() => {
      setShowData(true)
    }, 800)
  }, [])

  const [snackBarOpen, setSnackBarOpen] = useState(false)
  useEffect(() => {
    if (isSuccessUpdate) {
      setSnackBarOpen(true) // Show Snackbar when isSuccessUpdate changes
    }
  }, [isSuccessUpdate])

  const handleCloseSnack = () => {
    setSnackBarOpen(false) // Close the Snackbar
  }

  return (
    <div>
      {snackBarOpen && (
        <CustomSnackBarNotification
          open={snackBarOpen}
          response={isSuccessUpdate}
          onClose={handleCloseSnack}
          onResponse={setIsSuccessUpdate}
        />
      )}

      <div className='grid grid-flow-row-dense grid-cols-2 grid-rows-1 shadow-md mb-8 px-1 rounded-sm'>
        {showData ? (
          <>
            <div className='flex-none'>
              <Typography variant='h4' component='h4' className='p-3'>
                Tambah Penyesuaian Stok
              </Typography>
            </div>
            <div className='flex justify-end py-3 mx-3'>
              <div>
                <Button variant='contained' color='secondary' size='small' onClick={() => router.push('/products')}>
                  <ArrowBack fontSize='small' />
                  Kembali
                </Button>
              </div>
            </div>
          </>
        ) : (
          <LoadingPageTitle />
        )}
      </div>

      {showData && productData ? (
        <form
          noValidate
          autoComplete='off'
          onSubmit={handleSubmit}
          className='grid grid-cols-4 gap-4 shadow-md mb-8 px-4 py-5 rounded-sm'
        >
          <div className='col-span-4'>
            <Typography variant='h4' component='h4' className='p-3'>
              {showData && productData ? productData.name : <LoadingPageTitle />}
            </Typography>
          </div>

          <div className='col-span-2'>
            <TextField
              fullWidth
              size='small'
              label='Number *'
              id='number'
              name='number'
              defaultValue={numberTR}
              onChange={handleInput}
              error={!!errors.number}
              helperText={errors.number} // Display error message
            />
          </div>

          <div className='col-span-2'>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DemoContainer components={['DatePicker']} sx={{ overflow: 'visible' }}>
                <DatePicker
                  sx={{ position: 'relative', top: -5 }}
                  label='Tanggal *'
                  name='date'
                  value={dateNow}
                  onChange={handleChangeDate}
                  format='DD-MM-YYYY' // This sets the display format for the DatePicker
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      size: 'small',
                      error: !!errors.date, // Show error if any
                      helperText: errors.date, // Show the error message
                      InputLabelProps: {
                        shrink: true // Keep label in the correct position
                      }
                    },
                    actionBar: {
                      actions: ['today']
                    }
                  }}
                />
              </DemoContainer>
            </LocalizationProvider>
          </div>

          <div className='col-span-2'>
            <FormControl fullWidth sx={{ minWidth: 220 }} size='small'>
              <InputLabel id='type'>Stok Masuk / Keluar *</InputLabel>
              <Select
                labelId='type'
                id='type'
                name='type'
                value={typeAdjust}
                label='type'
                onChange={handleChangeType}
                error={!!errors.type} // Convert the error message to a boolean
              >
                <MenuItem value='in'>
                  {' '}
                  ( <AddIcon fontSize='small' color='success' /> ) Masuk
                </MenuItem>
                <MenuItem value='out'>
                  {' '}
                  ( <RemoveIcon fontSize='small' color='error' /> ) Keluar
                </MenuItem>
              </Select>
              {errors.type && <FormHelperText sx={{ color: '#ff4c51' }}>{errors.type}</FormHelperText>}
            </FormControl>
          </div>

          <div className='col-span-2'>
            <TextField
              fullWidth
              size='small'
              name='ref'
              id='ref'
              label='Referensi'
              defaultValue=''
              onChange={handleInput}
              error={!!errors.ref}
              helperText={errors.ref} // Display error message
            />
          </div>

          <div className='col-span-2'>
            {warehouseData ? (
              <FormControl fullWidth sx={{ minWidth: 220 }} size='small'>
                <InputLabel id='warehouse_id'>Gudang *</InputLabel>
                <Select
                  labelId='warehouse_id'
                  id='warehouse_id'
                  name='warehouse_id'
                  value={warehouse}
                  label='warehouse_id'
                  onChange={handleChangeWarehouse}
                  error={!!errors.warehouse_id} // Convert the error message to a boolean
                >
                  {warehouseData.map(item => (
                    <MenuItem key={item.id} value={item.id}>
                      {item.name}
                    </MenuItem>
                  ))}
                </Select>
                {errors.warehouse_id && (
                  <FormHelperText sx={{ color: '#ff4c51' }}>{errors.warehouse_id}</FormHelperText>
                )}
              </FormControl>
            ) : (
              <></>
            )}
          </div>

          <div className='col-span-2'>
            <TextField
              fullWidth
              size='small'
              label='Stok '
              name='qty'
              id='outlined-size-small'
              defaultValue='0'
              onChange={handleInput}
              required
            />
          </div>

          <div className='col-span-4'>
            <TextField
              fullWidth
              id='outlined-multiline-static'
              label='Deskripsi'
              name='description'
              multiline
              rows={2}
              defaultValue=''
              onChange={handleInput}
            />
          </div>

          <div className='col-span-4'>
            <Button fullWidth variant='contained' type='submit'>
              {loadingButtonSubmit ? (
                <span className='flex animate-pulse'>
                  <TimelapseRoundedIcon className='animate-spin mx-2' />
                  Memuat...
                </span>
              ) : (
                <div className='flex'>
                  <Save fontSize='small' sx={{ mx: 2 }} /> Simpan
                </div>
              )}
            </Button>
          </div>
        </form>
      ) : (
        <div className='flex items-center justify-center h-96 bg-gray-100/50 shadow-md'>
          <CircularProgress />
        </div>
      )}
    </div>
  )
}

export default AddStockAdjustment
