'use client'

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
import React, { useEffect, useState } from 'react'
import AppService from '@/app/api/services/app-service'
import { ArrowBack, Save } from '@mui/icons-material'
import { useParams, useRouter } from 'next/navigation'
import { useDispatch, useSelector } from 'react-redux'
import { setPageName } from '@/store/slices/page-name-slice'
import { ResponseStatus } from '@/@core/types'
import TimelapseRoundedIcon from '@mui/icons-material/TimelapseRounded'
import { CreateStockAdjustmentRequest, StockAdjustmentResponse } from '@/@core/inventory-data-types'
import AddIcon from '@mui/icons-material/Add'
import RemoveIcon from '@mui/icons-material/Remove'
import { DemoContainer } from '@mui/x-date-pickers/internals/demo'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import dayjs, { Dayjs } from 'dayjs'
import { WarehouseResponse } from '@/@core/master-data-types'
import LoadingPageTitle from '@/components/loading/loading-page-title'
import CustomSnackBarNotification from '@/components/notification/custom-snackbar-notification'
import FormTableProduct from './form-table-product'
import PageTitle from '@/@layouts/components/vertical/PageTitle'

const AddStockAdjustmentWarehouse = () => {
  const params = useParams<{ id: string }>()
  const id_warehouse = params.id
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
  const [dataForm, setDataForm] = useState<CreateStockAdjustmentRequest>({
    number: 'SAXXXXXXXXX',
    date: '',
    type: '',
    warehouse_id: id_warehouse,
    qty: 0,
    total_qty: 0,
    branch_id: Number(localStorage.getItem('current_branch')),
  })
  const [errors, setErrors] = useState<{ [key in keyof CreateStockAdjustmentRequest]?: string }>({})
  const [isSuccessUpdate, setIsSuccessUpdate] = useState<ResponseStatus | null>(null)
  const [dateNow, setDateNow] = useState<Dayjs | null>(dayjs(new Date()))
  const [warehouseData, setWarehouseData] = useState<WarehouseResponse>()
  const [showData, setShowData] = useState(false)
  const [detailTransaction, setDetailTransaction] = useState<StockAdjustmentResponse>()
  const [visibleAddItem, setVisibleAddItem] = useState(false)
  const [visibleAddDetail, setVisibleAddDetail] = useState(true)
  const [visibleSubmit, setVisibleSubmit] = useState(false)

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
        const warehouseResponse = await AppService.serviceGet('api/warehouse/get/', { id: id_warehouse })
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
    // Clear error on change
    setErrors(prev => ({ ...prev, [name]: undefined }))
  }

  // Function to handle form submission and API call
  const handleAddDetail = async (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault()
    const paramsHeader = {
      ...dataForm,
      branch_id: Number(localStorage.getItem('current_branch')),
      username: getUser.data.username
    }

    try {
      const response = await AppService.servicePost('api/stock-adjustment/create', paramsHeader)
      console.log(response)
      if (response.statusCode === 200) {
        setVisibleAddDetail(false)
        setVisibleAddItem(true)
        setVisibleSubmit(true)
        console.log(response)
        const newNumberTR = response.data.number
        console.log(newNumberTR)
        setNumberTR(newNumberTR) // Update numberTR with the new value from API response
        setDataForm(prevData => ({
          ...prevData,
          number: newNumberTR
        })) // Update dataForm.number as well
      } else if ('errorData' in response) {
        console.log(response)
        const newErrors: any = {}
        response.errorData.error.issues.forEach((issue: any) => {
          newErrors[issue.path[0]] = issue.message // Map error messages to field names
        })
        console.log(newErrors)
        setErrors(newErrors)
      } else {
        setIsSuccessUpdate({ status: 'failed', message: 'Please check the form input.' })
      }
    } catch (error) {
      console.log('Error fetching data:')
      console.log(error)
    }
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    setLoadingButtonSubmit(true)
    console.log('=== SUBMIT ADD PRODUK ===')

    // Make sure dataForm is an array and calculate total_qty
    const total_qty = Array.isArray(dataForm) ? dataForm.reduce((sum, item) => sum + (Number(item.qty) || 0), 0) : 0

    const { date, ...restOfDataForm } = dataForm // Exclude 'date' property

    const stockAdjusmentSave = {
      ...restOfDataForm,
      total_qty,
      branch_id: Number(localStorage.getItem('current_branch')),
      username: getUser.data.username
    }
    console.log('Stock Adjustment to submit:', stockAdjusmentSave)

    try {
      const storeData = await AppService.servicePatch('api/stock-adjustment/update', stockAdjusmentSave)
      console.log(storeData)
      if ('statusCode' in storeData && storeData.statusCode === 200) {
        setIsSuccessUpdate({ status: 'success', message: storeData.message })
        setTimeout(() => {
          router.push('/inventory/' + id_warehouse + '/stock-adjustment/detail')
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
      if (isSuccessUpdate?.status == 'success') {
        const getDetailData = async () => {
          try {
            const result = await AppService.serviceGet('api/stock-adjustment/get', { number: numberTR })
            setDetailTransaction(result.data)
          } catch (error) {
            console.error('Error fetching data:', error)
          }
        }
        getDetailData()
      }
    }
  }, [isSuccessUpdate])

  const handleCloseSnack = () => {
    setSnackBarOpen(false) // Close the Snackbar
  }

  const successUpdate = (response: ResponseStatus) => {
    setIsSuccessUpdate(response)
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

      <PageTitle>
        <div className='grid grid-flow-row-dense grid-cols-2 grid-rows-1 mb-8 px-1 rounded-sm'>
          {showData ? (
            <>
              <div className='flex-none'>
                <Typography variant='h4' component='h4' className='p-3'>
                  Tambah Penyesuaian Stok
                </Typography>
              </div>
              <div className='flex justify-end py-3 mx-3'>
                <div>
                  <Button variant='contained' color='secondary' size='small' onClick={() => router.push('/warehouses/detail/'+id_warehouse)}>
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
      </PageTitle>

      {showData && warehouseData ? (
        <form
          noValidate
          autoComplete='off'
          onSubmit={handleSubmit}
          className='grid grid-cols-4 gap-4 shadow-md mb-8 px-4 py-5 rounded-sm'
        >
          <div className='col-span-4'>
            <Typography variant='h4' component='h4' className='p-3'>
              {showData && warehouseData ? warehouseData.name : <LoadingPageTitle />}
            </Typography>
          </div>

          <div className='col-span-2'>
            <TextField
              fullWidth
              size='small'
              label='Number *'
              id='number'
              name='number'
              value={numberTR}
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
              <InputLabel id='type-adjust'>Stok Masuk / Keluar *</InputLabel>
              <Select
                labelId='type-adjust'
                id='type'
                name='type'
                value={typeAdjust}
                label='Stok Masuk / Keluar'
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

          {visibleAddDetail && (
            <div className='col-span-4 flex justify-end'>
              <Button type='button' variant='contained' onClick={handleAddDetail}>
                <AddIcon fontSize='small' /> Detail
              </Button>
            </div>
          )}
          <div className='col-span-4'>
            {visibleAddItem && (
              <FormTableProduct
                detailTransaction={detailTransaction}
                visibleAddItem={visibleAddItem}
                successUpdate={successUpdate}
                typeAdjust={typeAdjust}
                number={numberTR}
              />
            )}
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

          {visibleSubmit && (
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
          )}
        </form>
      ) : (
        <div className='flex items-center justify-center h-96 bg-gray-100/50 shadow-md'>
          <CircularProgress />
        </div>
      )}
    </div>
  )
}

export default AddStockAdjustmentWarehouse
