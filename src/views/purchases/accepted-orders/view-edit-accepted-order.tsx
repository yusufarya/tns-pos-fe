'use client'

import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  CreateAcceptedOrderRequest,
  AcceptedOrderDetailResponse,
  AcceptedOrderResponse,
  AcceptedOrderType
} from '@/@core/accepted-data-types'
import { ResponseData, ResponseStatus } from '@/@core/types'
import AppService, { ResponseType } from '@/app/api/services/app-service'
import { setPageName } from '@/store/slices/page-name-slice'
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
import dayjs, { Dayjs } from 'dayjs'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { DemoContainer } from '@mui/x-date-pickers/internals/demo'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import AddIcon from '@mui/icons-material/Add'
import TimelapseRoundedIcon from '@mui/icons-material/TimelapseRounded'
import { VendorResponse, WarehouseResponse } from '@/@core/master-data-types'
import { Save } from '@mui/icons-material'
import { useParams, useRouter } from 'next/navigation'
import CustomSnackBarNotification from '@/components/notification/custom-snackbar-notification'
import Link from 'next/link'
import ViewEditDetailAcceptedOrder from './view-edit-detail-accepted-order'
import SectionCalculationAcceptedOrder from './section-calculation'

interface PropsTitlePage {
  titlePage: string
}

const initialData = {
  number: '',
  date: '',
  due_date: '',
  term: '0',
  ref: '',
  branch_id: Number(localStorage.getItem('current_branch')),
  vendor_id: 0,
  warehouse_id: 0,
  total_qty_request: 0,
  total_price: 0
}

const ViewEditAcceptedOrder = ({ titlePage }: PropsTitlePage) => {
  const params = useParams<{ number: string }>()
  const numberTR = params.number
  const getUser = useSelector((state: any) => state.user.user)

  const router = useRouter()
  const dispatch = useDispatch()

  const [isLoading, setIsLoading] = useState(true)
  const [vendorsData, setVendorsData] = useState<VendorResponse[]>([])
  const [vendors, setVendors] = useState<number | string>(0)
  const [warehousesData, setWarehousesData] = useState<WarehouseResponse[]>([])
  const [loadingButtonSubmit, setLoadingButtonSubmit] = useState<boolean>(false)
  const [dataTransaction, setDataTransaction] = useState<AcceptedOrderType>()
  const [dataForm, setDataForm] = useState<CreateAcceptedOrderRequest>(initialData)
  const [dateNow, setDateNow] = useState<Dayjs | null>(dayjs(new Date()))
  const [dueDateNow, setDueDateNow] = useState<Dayjs | null>(dayjs(new Date()))
  const [errors, setErrors] = useState<{ [key in keyof CreateAcceptedOrderRequest]?: string }>({})
  const [isSuccessUpdate, setIsSuccessUpdate] = useState<ResponseStatus | null>(null)
  const [showData, setShowData] = useState(false)
  const [detailTransaction, setDetailTransaction] = useState<AcceptedOrderDetailResponse[]>([])
  const [visibleAddItem, setVisibleAddItem] = useState(false)
  const [visibleAddDetail, setVisibleAddDetail] = useState(true)
  const [visibleSubmit, setVisibleSubmit] = useState(false)
  const [snackBarOpen, setSnackBarOpen] = useState(false)

  const setDefaultDate = () => {
    const dateObject = dayjs(new Date())
    const dateTransaction = dateObject.format('YYYY-MM-DD')
    setDataForm(prev => ({
      ...prev,
      date: dateTransaction,
      due_date: dateTransaction
    }))
  }

  useEffect(() => {
    dispatch(setPageName({ params1: 'Penerimaan Pembelian', params2: 'Tambah' }))
  }, [dispatch])

  useEffect(() => {
    if (!numberTR || !getUser?.data?.username) {
      return
    }

    const fetchAcceptedOrderData = async () => {
      setIsLoading(true)
      try {
        // Fetch accepted order data directly
        const acceptedOrderResponse = await AppService.serviceGet('api/accepted-order/get', {
          number: numberTR,
          get_type: 'ao'
        })
        console.log('acceptedOrderResponse : ', acceptedOrderResponse)

        if ('statusCode' in acceptedOrderResponse && acceptedOrderResponse.statusCode === 200) {
          setVendors(String(acceptedOrderResponse.data?.vendor_id))
          setDataTransaction(acceptedOrderResponse.data)
          setVisibleSubmit(true)

          // Fetch accepted order details
          const detailResult = await AppService.serviceGet('api/accepted-order-detail/get', {
            number: acceptedOrderResponse.data.number
          })
          setDetailTransaction(detailResult.data)
          setVisibleAddItem(true)
        } else {
          setIsSuccessUpdate({ status: 'failed', message: 'Transaksi tidak ditemukan' })
          router.push('/purchases/accepted-orders/detail/' + numberTR)
        }

        const vendorsResponse = await AppService.serviceGet('api/all-vendors')
        if ('statusCode' in vendorsResponse && vendorsResponse.statusCode === 200) {
          setVendorsData(vendorsResponse.data)
        }
        const warehousesResponse = await AppService.serviceGet('api/all-warehouse')
        if ('statusCode' in warehousesResponse && warehousesResponse.statusCode === 200) {
          setWarehousesData(warehousesResponse.data)
        }
      } catch (error) {
        console.error('Error fetching accepted order data:', error)
        setIsSuccessUpdate({ status: 'failed', message: 'Failed to fetch accepted order data' })
      } finally {
        setIsLoading(false)
      }
    }

    fetchAcceptedOrderData()
    setDefaultDate()
  }, [numberTR, getUser])

  useEffect(() => {
    if (dataTransaction) {
      const dtr = dataTransaction
      setDataForm(prevForm => ({
        ...prevForm,
        number: dtr.number,
        date: dayjs(dtr.date).format('DD/MM/YYYY'),
        due_date: dayjs(dtr.due_date).format('DD/MM/YYYY'),
        term: dtr.term || '',
        ref: dtr.ref,
        branch_id: dtr.branch_id,
        vendor_id: dtr.vendor_id,
        warehouse_id: dtr.warehouse_id,
        total_qty_request: dtr.total_qty_request,
        total_price: dtr.total_price
      }))
    }
  }, [dataTransaction])

  useEffect(() => {
    if (isSuccessUpdate) {
      setSnackBarOpen(true)
      const getDetailData = async () => {
        try {
          const result = await AppService.serviceGet('api/accepted-order-detail/get', { number: numberTR })
          setDetailTransaction(result.data)
          setVisibleAddItem(true)
        } catch (error) {
          console.error('Error fetching data:', error)
        }
      }
      getDetailData()
    }
  }, [isSuccessUpdate, numberTR])

  const handleInput = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setDataForm(prev => ({ ...prev, [name]: value }))
    setErrors(prev => ({ ...prev, [name]: undefined }))
  }

  const handleChangeDate = (newDate: Dayjs | null) => {
    if (newDate) {
      setDateNow(newDate)
      setDataForm(prev => ({ ...prev, date: newDate.format('YYYY-MM-DD') }))
      setErrors(prev => ({ ...prev, date: undefined }))
    }
  }

  // const handleChangeDueDate = (newDate: Dayjs | null) => {
  //   if (newDate) {
  //     setDueDateNow(newDate)
  //     setDataForm(prev => ({ ...prev, date: newDate.format('YYYY-MM-DD') }))
  //     setErrors(prev => ({ ...prev, date: undefined }))
  //   }
  // }

  const handleChangeVendors = (event: SelectChangeEvent<string>) => {
    const name = event.target.name
    const value = event.target.value
    setVendors(value)
    setDataForm(prev => ({ ...prev, [name]: value }))
    setErrors(prev => ({ ...prev, [name]: undefined }))
  }

  const handleChangeWarehouse = (event: SelectChangeEvent<string>) => {
    const name = event.target.name
    const value = event.target.value
    setDataForm(prev => ({ ...prev, [name]: value }))
    setErrors(prev => ({ ...prev, [name]: undefined }))
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    setLoadingButtonSubmit(true)
    console.log('=== SUBMIT FINISH ===')

    const total_qty = Array.isArray(dataForm) ? dataForm.reduce((sum, item) => sum + (Number(item.qty) || 0), 0) : 0

    console.log('dataForm:', dataForm)

    const { date, due_date, ...restOfDataForm } = dataForm

    const acceptedOrderSave = {
      ...restOfDataForm,
      total_qty,
      status_id: 3,
      branch_id: Number(localStorage.getItem('current_branch')),
      username: getUser.data.username
    }
    console.log('Accepted Order to submit:', acceptedOrderSave)

    try {
      const storeData = await AppService.servicePatch('api/accepted-order/update', acceptedOrderSave)
      console.log(storeData)
      if ('statusCode' in storeData && storeData.statusCode === 200) {
        setIsSuccessUpdate({ status: 'success', message: storeData.message })
        setTimeout(() => {
          router.push('/purchases/accepted-orders/detail/' + dataForm.number)
          setLoadingButtonSubmit(false)
        }, 3000)
      } else if ('errorData' in storeData) {
        setLoadingButtonSubmit(false)
        if (storeData.errorData.errors) {
          setIsSuccessUpdate({ status: 'failed', message: storeData.errorData.errors })
        }
        console.log('storeData : ')
        console.log(storeData)
        const newErrors: any = {}
        storeData.errorData.error.issues.forEach((issue: any) => {
          newErrors[issue.path[0]] = issue.message
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

  const successUpdate = (response: ResponseStatus) => {
    setIsSuccessUpdate(response)
  }

  const handleCloseSnack = () => {
    setSnackBarOpen(false) // Close the Snackbar
  }

  if (isLoading) {
    return (
      <div className='flex items-center justify-center h-96 bg-gray-50 shadow-md'>
        <CircularProgress />
      </div>
    )
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
      {dataForm ? (
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
              label='Nomor *'
              id='number'
              name='number'
              value={dataForm.number}
              onChange={handleInput}
              error={!!errors.number}
              helperText={errors.number}
              disabled={true}
            />
          </div>

          <div className='col-span-2'>
            <FormControl fullWidth sx={{ minWidth: 220 }} size='small'>
              <InputLabel id='vendor'>Vendor *</InputLabel>
              <Select
                labelId='vendor'
                id='vendor_id'
                name='vendor_id'
                value={String(vendors) || ''}
                label='Vendor'
                onChange={handleChangeVendors}
                error={!!errors.vendor_id}
                disabled={true}
              >
                {vendorsData.length > 0 &&
                  vendorsData.map((item, i) => (
                    <MenuItem key={i} value={item.id}>
                      {item.name}
                    </MenuItem>
                  ))}
              </Select>
              {errors.vendor_id && <FormHelperText sx={{ color: '#ff4c51' }}>{errors.vendor_id}</FormHelperText>}
            </FormControl>
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
                  format='DD-MM-YYYY'
                  disabled={true}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      size: 'small',
                      error: !!errors.date,
                      helperText: errors.date,
                      InputLabelProps: {
                        shrink: true
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

          <div className='col-span-2'></div>

          <div className='col-span-2'>
            <TextField
              fullWidth
              label='Referensi'
              size='small'
              name='ref'
              id='ref'
              value={dataForm.ref}
              onChange={handleInput}
              error={!!errors.ref}
              helperText={errors.ref}
              disabled={true}
            />
          </div>

          <div className='col-span-2'>
            <FormControl fullWidth size='small'>
              <InputLabel id='warehouse'>Gudang *</InputLabel>
              <Select
                label='Gudang'
                name='warehouse_id'
                value={String(dataForm.warehouse_id) || ''}
                onChange={handleChangeWarehouse}
                error={!!errors.warehouse_id}
                disabled={true}
              >
                {warehousesData.length > 0 &&
                  warehousesData.map((item, i) => (
                    <MenuItem key={i} value={item.id}>
                      {item.name}
                    </MenuItem>
                  ))}
              </Select>
              {errors.warehouse_id && <FormHelperText sx={{ color: '#ff4c51' }}>{errors.warehouse_id}</FormHelperText>}
            </FormControl>
          </div>

          <div className='col-span-2 mx-2'>
            <Typography variant='body2' className='mb-1'>
              Nomor Pesanan
            </Typography>
            <Link
              href={`/purchases/purchase-orders/detail/${dataForm.number}`}
              className='text-base text-blue-500 font-semibold hover:text-blue-600 hover:underline'
            >
              {dataForm.number}
            </Link>
          </div>

          {detailTransaction && detailTransaction.length > 0 && visibleAddItem && (
            <div className='col-span-4'>
              <ViewEditDetailAcceptedOrder
                detailTransaction={detailTransaction}
                visibleAddItem={visibleAddItem}
                successUpdate={successUpdate}
                number={numberTR}
              />
            </div>
          )}

          <div className='col-span-2'>
            <TextField
              fullWidth
              id='description'
              label='Deskripsi'
              name='description'
              multiline
              rows={1}
              defaultValue=''
              onChange={handleInput}
            />
          </div>

          <div className='col-span-2'>
            <SectionCalculationAcceptedOrder dataForm={dataForm} handleInput={handleInput} setDataForm={setDataForm} />
          </div>

          {detailTransaction && visibleSubmit && (
            <>
              <div className='col-span-2'></div>
              <div className='col-span-1'>
                <Button fullWidth variant='outlined' color='error' type='button'>
                  Batal
                </Button>
              </div>
              <div className='col-span-1'>
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
            </>
          )}
        </form>
      ) : (
        <></>
      )}
    </div>
  )
}

export default ViewEditAcceptedOrder
