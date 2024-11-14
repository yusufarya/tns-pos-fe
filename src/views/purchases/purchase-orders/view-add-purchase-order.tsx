'use client'

import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  CreatePurchaseOrderRequest,
  PurchaseOrderDetailResponse,
  PurchaseOrderResponse
} from '@/@core/purchase-data-types'
import { ResponseStatus } from '@/@core/types'
import AppService from '@/app/api/services/app-service'
import { setPageName } from '@/store/slices/page-name-slice'
import {
  Button,
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  TextField
} from '@mui/material'
import dayjs, { Dayjs } from 'dayjs'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { DemoContainer } from '@mui/x-date-pickers/internals/demo'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import AddIcon from '@mui/icons-material/Add'
import TimelapseRoundedIcon from '@mui/icons-material/TimelapseRounded'
import { VendorResponse, WarehouseResponse } from '@/@core/master-data-types'
import ViewAddDetailPurchaseOrder from './view-add-detail-purchase-order'
import { Save } from '@mui/icons-material'
import { useRouter } from 'next/navigation'
import CustomSnackBarNotification from '@/components/notification/custom-snackbar-notification'
import SectionCalculation from './section-calculation'

interface PropsTitlePage {
  titlePage: string
}

const ViewAddPurchaseOrder = ({ titlePage }: PropsTitlePage) => {
  const router = useRouter()
  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(setPageName({ params1: titlePage, params2: '' }))
  }, [dispatch]) // Ensure dispatch is in the dependency array

  const getUser: any = useSelector<any>(state => state.user.user)

  const [vendorsData, setVendorsData] = useState<VendorResponse[]>([])
  const [loadingButtonSubmit, setLoadingButtonSubmit] = useState<boolean>(false)
  const [numberTR, setNumberTR] = useState('POXXXXXXXXX') // Initial value for numberTR
  const [dataForm, setDataForm] = useState<CreatePurchaseOrderRequest>({
    number: '',
    date: '',
    due_date: '',
    term: '0',
    ref: '',
    branch_id: Number(localStorage.getItem('current_branch')),
    vendor_id: undefined,
    warehouse_id: undefined,
    total_qty_request: 0,
    total_price: 0
  })
  const [dateNow, setDateNow] = useState<Dayjs | null>(dayjs(new Date()))
  const [dueDateNow, setDueDateNow] = useState<Dayjs | null>(dayjs(new Date()).add(1, 'day'))
  const [errors, setErrors] = useState<{ [key in keyof CreatePurchaseOrderRequest]?: string }>({})
  const [isSuccessUpdate, setIsSuccessUpdate] = useState<ResponseStatus | null>(null)
  const [detailTransaction, setDetailTransaction] = useState<PurchaseOrderDetailResponse[]>([])
  const [visibleAddItem, setVisibleAddItem] = useState(false)
  const [visibleAddDetail, setVisibleAddDetail] = useState(true)
  const [visibleSubmit, setVisibleSubmit] = useState(false)
  const [warehouseData, setWarehouseData] = useState<WarehouseResponse[]>([])

  // Function to set the default date in the "YYYY-MM-DD" format
  const setDefaultDate = () => {
    // Current date object to set default date in date input field
    const dateObject = dayjs(new Date())
    // Format the date as "YYYY-MM-DD"
    const dateTransaction = dateObject.format('YYYY-MM-DD')
    const dueDateTransaction = dateObject.add(1, 'day').format('YYYY-MM-DD')
    // Update the form state with the formatted date
    setDataForm(prev => ({
      ...prev,
      date: dateTransaction,
      due_date: dueDateTransaction
    }))
  }

  useEffect(() => {
    const fetchAnyData = async () => {
      try {
        const vendorsResponse = await AppService.serviceGet('api/all-vendors')
        if ('statusCode' in vendorsResponse && vendorsResponse.statusCode === 200 && 'data' in vendorsResponse) {
          setVendorsData(vendorsResponse.data) // Assuming result data contains the array of Vendor
        }
        const warehouseResponse = await AppService.serviceGet('api/all-warehouse')
        if ('statusCode' in warehouseResponse && warehouseResponse.statusCode === 200 && 'data' in warehouseResponse) {
          setWarehouseData(warehouseResponse.data) // Assuming result data contains the array of Warehouse
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

  const handleChangeDueDate = (newDate: Dayjs | null) => {
    if (newDate) {
      setDueDateNow(newDate)
      // You can format it here if needed:
      setDataForm(prev => ({ ...prev, date: newDate.format('YYYY-MM-DD') }))
      // Clear error on change
      setErrors(prev => ({ ...prev, date: undefined }))
    }
  }

  const handleChangeVendors = (event: SelectChangeEvent<string>) => {
    const name = event.target.name
    const value = event.target.value
    setDataForm(prev => ({ ...prev, [name]: value }))
    setErrors(prev => ({ ...prev, [name]: undefined }))
  }

  const handleChangeWarehouse = (event: SelectChangeEvent<string>) => {
    const name = event.target.name
    const value = event.target.value
    setDataForm(prev => ({ ...prev, [name]: value }))
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

    console.log(paramsHeader)

    try {
      const response = await AppService.servicePost('api/purchase-order/create', paramsHeader)
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
    const { date, due_date, ...restOfDataForm } = dataForm // Exclude 'date' property

    const purchaseOrderSave = {
      ...restOfDataForm, // Spread the remaining properties
      total_qty, // Assuming total_qty is derived from qty
      branch_id: Number(localStorage.getItem('current_branch')), // Ensure it's a number
      username: getUser.data.username // Ensure getUser is defined in your context
    }
    console.log('Purchase Order to submit:', purchaseOrderSave)

    try {
      const storeData = await AppService.servicePatch('api/purchase-order/update', purchaseOrderSave)
      console.log(storeData)
      if ('statusCode' in storeData && storeData.statusCode === 200) {
        setIsSuccessUpdate({ status: 'success', message: storeData.message })
        setTimeout(() => {
          router.push('/purchases/purchase-orders')
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

  const [snackBarOpen, setSnackBarOpen] = useState(false)

  useEffect(() => {
    if (isSuccessUpdate) {
      setSnackBarOpen(true) // Show Snackbar when isSuccessUpdate changes
      console.log(' reload data transaksi detail ')
      const getDetailData = async () => {
        try {
          const result = await AppService.serviceGet('api/purchase-order-detail/get', { number: numberTR })
          console.log(' SUKSES EKSEKUSI DETAIL ')
          setDetailTransaction(result.data)
        } catch (error) {
          console.error('Error fetching data:', error)
        }
      }
      getDetailData()
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
          <FormControl fullWidth sx={{ minWidth: 220 }} size='small'>
            <InputLabel id='vendor'>Vendor *</InputLabel>
            <Select
              labelId='vendor'
              id='vendor_id'
              name='vendor_id'
              value={dataForm.vendor_id ? String(dataForm.vendor_id) : ''}
              label='Vendor'
              onChange={handleChangeVendors}
              error={!!errors.vendor_id} // Convert the error message to a boolean
            >
              {vendorsData.length > 0 &&
                vendorsData.map((item, i) => (
                  <MenuItem key={i} value={Number(item.id)}>
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

        <div className='col-span-1'>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DemoContainer components={['DatePicker']} sx={{ overflow: 'visible' }}>
              <DatePicker
                sx={{ position: 'relative', top: -5 }}
                label='Tanggal Jatuh Tempo *'
                name='due_date'
                value={dueDateNow}
                onChange={handleChangeDueDate}
                format='DD-MM-YYYY' // This sets the display format for the DatePicker
                slotProps={{
                  textField: {
                    fullWidth: true,
                    size: 'small',
                    error: !!errors.due_date, // Show error if any
                    helperText: errors.due_date, // Show the error message
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

        <div className='col-span-1'>
          <TextField
            fullWidth
            size='small'
            name='term'
            id='term'
            label='Termin / hari'
            defaultValue=''
            onChange={handleInput}
            error={!!errors.term}
            helperText={errors.term} // Display error message
          />
        </div>

        <div className='col-span-2'>
          <FormControl fullWidth sx={{ minWidth: 220 }} size='small'>
            <InputLabel id='warehouse'>Gudang *</InputLabel>
            <Select
              labelId='warehouse'
              id='warehouse_id'
              name='warehouse_id'
              label='Gudang'
              value={dataForm.warehouse_id ? String(dataForm.warehouse_id) : ''}
              onChange={handleChangeWarehouse}
              error={!!errors.warehouse_id}
            >
              {warehouseData.length > 0 &&
                warehouseData.map((item, i) => (
                  <MenuItem key={i} value={Number(item.id)}>
                    {item.name}
                  </MenuItem>
                ))}
            </Select>
            {errors.warehouse_id && <FormHelperText sx={{ color: '#ff4c51' }}>{errors.warehouse_id}</FormHelperText>}
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
          {visibleAddItem && isSuccessUpdate && (
            <ViewAddDetailPurchaseOrder
              detailTransaction={detailTransaction}
              visibleAddItem={visibleAddItem}
              successUpdate={successUpdate}
              number={numberTR}
              warehouseId={dataForm.warehouse_id}
            />
          )}
        </div>

        <SectionCalculation
          dataForm={dataForm}
          handleInput={handleInput}
          setDataForm={setDataForm}
          dataDetail={detailTransaction}
          isSuccessUpdate={isSuccessUpdate}
        />

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
    </div>
  )
}

export default ViewAddPurchaseOrder
