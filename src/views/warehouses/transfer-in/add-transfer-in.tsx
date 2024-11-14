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
import { CreateWarehouseTransferRequest, WarehouseTransferResponse } from '@/@core/inventory-data-types'
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

const AddTransferWarehouseIn = () => {
  const params = useParams<{ id: string }>()
  const id_warehouse = params.id

  const getUser: any = useSelector<any>(state => state.user.user)

  const router = useRouter()
  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(setPageName({ params1: 'Transfer Gudang Masuk', params2: 'Tambah' }))
  }, [dispatch]) // Ensure dispatch is in the dependency array

  const [loadingButtonSubmit, setLoadingButtonSubmit] = useState<boolean>(false)
  const [numberTR, setNumberTR] = useState('WHXXXXXXXXX') // Initial value for numberTR
  const [wareFrom, setWareFrom] = useState<string>('')
  const [dataForm, setDataForm] = useState<CreateWarehouseTransferRequest>({
    number: '',
    ref: undefined,
    date: '', // Default to current date if needed
    wh_from: 0,
    wh_to: 0,
    qty: 0,
    total_qty: 0,
    branch_id: Number(localStorage.getItem('current_branch')),
    description: undefined,
    created_at: undefined,
    created_by: undefined,
    updated_at: undefined,
    updated_by: undefined
  })
  const [errors, setErrors] = useState<{ [key in keyof CreateWarehouseTransferRequest]?: string }>({})
  const [isSuccessUpdate, setIsSuccessUpdate] = useState<ResponseStatus | null>(null)
  const [dateNow, setDateNow] = useState<Dayjs | null>(dayjs(new Date()))
  const [warehouseData, setWarehouseData] = useState<WarehouseResponse[]>([])
  const [warehouseName, setWarehouseName] = useState<string>('')
  const [warehouseDetail, setWarehouseDetail] = useState<WarehouseResponse>()
  const [showData, setShowData] = useState(false)
  const [detailTransaction, setDetailTransaction] = useState<WarehouseTransferResponse>()
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
        const [warehouseResponse, warehouseDetailResponse] = await Promise.all([
          AppService.serviceGet('api/all-warehouse'),
          AppService.serviceGet('api/warehouse/get/', { id: id_warehouse })
        ])
        if ('statusCode' in warehouseResponse && warehouseResponse.statusCode === 200 && 'data' in warehouseResponse) {
          console.log(warehouseResponse)
          setWarehouseData(warehouseResponse.data) // Assuming result data contains the array of warehouse
        }
        if (
          'statusCode' in warehouseDetailResponse &&
          warehouseDetailResponse.statusCode === 200 &&
          'data' in warehouseDetailResponse
        ) {
          console.log(warehouseDetailResponse)
          setWarehouseDetail(warehouseDetailResponse.data) // Assuming result data contains the array of warehouse detail
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

  const handleChangeWareFrom = (event: SelectChangeEvent<string>) => {
    const name = event.target.name
    const value = event.target.value
    setWareFrom(value)
    setDataForm(prev => ({ ...prev, [name]: value }))
    // Clear error on change
    setErrors(prev => ({ ...prev, [name]: undefined }))

    // needed check available stock in this warehouse

    if (value == id_warehouse) {
      setWareFrom('')
      setIsSuccessUpdate({ status: 'failed', message: 'Tidak dapat memilih dari gudang yang sama' })
    }
    // Find the selected item by `id`
    const selectedItem = warehouseData.find(item => item.id === Number(value))
    if (selectedItem) {
      setWarehouseName(selectedItem?.name)
    }
  }

  // Function to handle form submission and API call
  const handleAddDetail = async (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault()

    const paramsHeader = {
      ...dataForm,
      wh_from: Number(wareFrom),
      wh_to: Number(id_warehouse),
      branch_id: Number(localStorage.getItem('current_branch')),
      username: getUser.data.username
    }

    console.log(paramsHeader)

    try {
      const response = await AppService.servicePost('api/warehouse-transfer/create', paramsHeader)
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
        setIsSuccessUpdate({ status: 'success', message: 'Tambah detail data' })
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
    console.log('=== SUBMIT FINISH ===')

    // Make sure dataForm is an array and calculate total_qty
    const total_qty = Array.isArray(dataForm) ? dataForm.reduce((sum, item) => sum + (Number(item.qty) || 0), 0) : 0

    console.log('dataForm:', dataForm)

    // Create a new object without the 'date' property
    const { date, ...restOfDataForm } = dataForm // Exclude 'date' property

    const warehouseSave = {
      ...restOfDataForm, // Spread the remaining properties
      total_qty, // Assuming total_qty is derived from qty
      wh_from: Number(wareFrom),
      wh_to: Number(id_warehouse),
      branch_id: Number(localStorage.getItem('current_branch')), // Ensure it's a number
      username: getUser.data.username // Ensure getUser is defined in your context
    }
    console.log('Stock Adjustment to submit:', warehouseSave)

    try {
      const storeData = await AppService.servicePatch('api/warehouse-transfer/update', warehouseSave)
      console.log(storeData)
      if ('statusCode' in storeData && storeData.statusCode === 200) {
        setIsSuccessUpdate({ status: 'success', message: storeData.message })
        setTimeout(() => {
          router.push('/inventory/' + id_warehouse + '/warehouse-transfer/detail')
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
      console.log(' Update data transaksi detail ')
      const getDetailData = async () => {
        try {
          const result = await AppService.serviceGet('api/purchase-order/get', { number: numberTR })
          setDetailTransaction(result.data)
        } catch (error) {
          console.error('Error fetching data:', error)
        }
      }
      getDetailData()
      // if (isSuccessUpdate.status === 'success') {
      // }
    }
  }, [isSuccessUpdate])

  console.log('detailTransaction : ')
  console.log(detailTransaction)

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
                  Tambah Transfer Gudang Masuk
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

      {showData && warehouseDetail ? (
        <form
          noValidate
          autoComplete='off'
          onSubmit={handleSubmit}
          className='grid grid-cols-4 gap-4 shadow-md mb-8 px-4 py-7 rounded-sm'
        >
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
              <InputLabel id='from-ware'>Dari *</InputLabel>
              <Select
                labelId='from-ware'
                id='wh_from'
                name='wh_from'
                value={wareFrom}
                label='Dari'
                onChange={handleChangeWareFrom}
                error={!!errors.wh_from} // Convert the error message to a boolean
              >
                {warehouseData.length > 0 &&
                  warehouseData.map((item, i) => (
                    <MenuItem key={i} value={item.id}>
                      {item.name}
                    </MenuItem>
                  ))}
              </Select>
              {errors.wh_from && <FormHelperText sx={{ color: '#ff4c51' }}>{errors.wh_from}</FormHelperText>}
            </FormControl>
          </div>

          <div className='col-span-2'>
            <FormControl fullWidth sx={{ minWidth: 220, ml: '3px' }} size='small'>
              <span>Ke *</span>
              <Typography variant='h6' className='m-0'>
                {warehouseDetail.name}
              </Typography>
            </FormControl>
          </div>

          <div className='col-span-4'>
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
            {visibleAddItem && isSuccessUpdate && (
              <FormTableProduct
                detailTransaction={detailTransaction}
                visibleAddItem={visibleAddItem}
                successUpdate={successUpdate}
                wareFrom={wareFrom}
                number={numberTR}
                warehouseName={warehouseDetail.name}
                warehouseNameSelected={warehouseName}
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

export default AddTransferWarehouseIn
