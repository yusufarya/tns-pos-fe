import { useState, FormEvent, useEffect } from 'react'
import { ResponseStatus } from '@/@core/types'
import { CreateAcceptedOrderRequest, AcceptedOrderDetailResponse } from '@/@core/accepted-data-types'
import { VendorResponse } from '@/@core/master-data-types'
import AppService from '@/app/api/services/app-service'
import dayjs, { Dayjs } from 'dayjs'
import { SelectChangeEvent } from '@mui/material'

export const useAcceptedOrder = (numberTR: string) => {
  // State definitions
  const [vendorsData, setVendorsData] = useState<VendorResponse[]>([])
  const [vendors, setVendors] = useState<string>('')
  const [loadingButtonSubmit, setLoadingButtonSubmit] = useState(false)
  const [dataForm, setDataForm] = useState<CreateAcceptedOrderRequest>({
    number: '',
    vendor_id: 0,
    branch_id: Number(localStorage.getItem('current_branch')),
    warehouse_id: 0,
    date: '',
    due_date: '',
    term: '',
    ref: '',
    description: '',
    total_qty_request: 0,
    total_price: 0
  })
  const [dateNow, setDateNow] = useState<Dayjs | null>(dayjs())
  const [dueDateNow, setDueDateNow] = useState<Dayjs | null>(dayjs())
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSuccessUpdate, setIsSuccessUpdate] = useState<ResponseStatus | null>(null)
  const [detailTransaction, setDetailTransaction] = useState<AcceptedOrderDetailResponse[]>([])
  const [visibleAddItem, setVisibleAddItem] = useState(false)
  const [visibleSubmit, setVisibleSubmit] = useState(true)

  // Handle input changes
  const handleInput = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setDataForm(prev => ({
      ...prev,
      [name]: value
    }))
    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  // Handle vendor selection
  const handleChangeVendors = (event: SelectChangeEvent) => {
    setVendors(event.target.value)
    setDataForm(prev => ({
      ...prev,
      vendor_id: Number(event.target.value)
    }))
    if (errors.vendor_id) {
      setErrors(prev => ({
        ...prev,
        vendor_id: ''
      }))
    }
  }

  // Handle date changes
  const handleChangeDate = (newValue: Dayjs | null) => {
    setDateNow(newValue)
    if (newValue) {
      setDataForm(prev => ({
        ...prev,
        date: newValue.format('YYYY-MM-DD')
      }))
    }
  }

  const handleChangeDueDate = (newValue: Dayjs | null) => {
    setDueDateNow(newValue)
    if (newValue) {
      setDataForm(prev => ({
        ...prev,
        due_date: newValue.format('YYYY-MM-DD')
      }))
    }
  }

  // Form validation
  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    if (!dataForm.number) newErrors.number = 'Nomor harus diisi'
    if (!dataForm.vendor_id) newErrors.vendor_id = 'Vendor harus dipilih'
    if (!dataForm.date) newErrors.date = 'Tanggal harus diisi'
    if (!dataForm.due_date) newErrors.due_date = 'Tanggal jatuh tempo harus diisi'
    if (!dataForm.term) newErrors.term = 'Termin harus diisi'

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Handle form submission
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!validateForm()) return

    setLoadingButtonSubmit(true)
    try {
      const response = await AppService.servicePut('api/delivery-order/update', dataForm)
      setIsSuccessUpdate({ status: 'success', message: response.message })
      setLoadingButtonSubmit(false)
    } catch (error) {
      console.error('Error submitting form:', error)
      setLoadingButtonSubmit(false)
    }
  }

  // Load initial data
  useEffect(() => {
    const loadVendors = async () => {
      try {
        const result = await AppService.serviceGet('api/vendor/get-all')
        setVendorsData(result.data)
      } catch (error) {
        console.error('Error loading vendors:', error)
      }
    }

    const loadDeliveryOrder = async () => {
      if (numberTR) {
        try {
          const result = await AppService.serviceGet('api/accepted-order/get', { number: numberTR })
          const data = result.data
          setDataForm({
            number: data.number,
            vendor_id: data.vendor_id,
            branch_id: data.branch_id,
            date: data.date,
            due_date: data.due_date,
            term: data.term,
            ref: data.ref,
            description: data.description,
            total_qty_request: data.total_qty_request,
            total_price: data.total_price,
            warehouse_id: data.warehouse_id
          })
          setVendors(data.vendor_id)
          setDateNow(dayjs(data.date))
          setDueDateNow(dayjs(data.due_date))
        } catch (error) {
          console.error('Error loading delivery order:', error)
        }
      }
    }

    loadVendors()
    loadDeliveryOrder()
  }, [numberTR])

  const loadAcceptedOrderDetail = async () => {
    const result = await AppService.serviceGet('api/accepted-order/get-detail', { number: numberTR })
    setDetailTransaction(result.data)
  }

  return {
    vendorsData,
    vendors,
    loadingButtonSubmit,
    dataForm,
    dateNow,
    dueDateNow,
    errors,
    isSuccessUpdate,
    setIsSuccessUpdate,
    detailTransaction,
    visibleAddItem,
    visibleSubmit,
    handleInput,
    handleChangeVendors,
    handleChangeDate,
    handleChangeDueDate,
    handleSubmit,
    loadAcceptedOrderDetail
  }
}
