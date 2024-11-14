import React, { useState, useEffect, useRef } from 'react'

import {
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  Button,
  Select,
  MenuItem,
  IconButton,
  TextField,
  SelectChangeEvent,
  InputLabel,
  FormControl,
  FormHelperText
} from '@mui/material'

import { Delete, Edit, Add, Save, Close } from '@mui/icons-material'

import { useSelector } from 'react-redux'

import dayjs from 'dayjs'
import AppService from '@/app/api/services/app-service'
import {
  CreateWarehouseTransferDetailRequest,
  InventoryType,
  WarehouseTransferResponse
} from '@/@core/inventory-data-types'
import { ResponseStatus } from '@/@core/types'
import AddIcon from '@mui/icons-material/Add'
import { useParams } from 'next/navigation'
import {
  CreatePurchaseOrderDetailRequest,
  PurchaseOrderDetailResponse,
  PurchaseOrderResponse
} from '@/@core/purchase-data-types'
import { ProductResponse } from '@/@core/master-data-types'
import FormaterHelper from '@/@core/utils/formatHelper'
import ModalDeleteItemPO from './modal-delete-detail-item'

interface PropsViewEditDetailPurchaseOrder {
  detailTransaction: PurchaseOrderDetailResponse[] | []
  visibleAddItem: boolean
  successUpdate: (response: ResponseStatus) => void // Updated to callback
  number: string
}

const ViewEditDetailPurchaseOrder: React.FC<PropsViewEditDetailPurchaseOrder> = ({
  detailTransaction,
  visibleAddItem,
  successUpdate,
  number
}) => {
  const getUser: any = useSelector<any>(state => state.user.user)

  const [listStockProduct, setListStockProduct] = useState<InventoryType[]>([])
  const [productData, setProductData] = useState<ProductResponse[]>([])
  const [unitData, setUnitData] = useState([])
  const [showRowAdd, setShowRowAdd] = useState(false)
  const [editingIndex, setEditingIndex] = useState<number | null>(null)
  const [openDeleteItemPO, setOpenDeleteItemPO] = useState(false)
  const [productSelected, setProductSelected] = useState<number | undefined>(undefined)
  const [unitSelected, setUnitSelected] = useState<number | undefined>(undefined)
  const [qtyProduct, setQtyProduct] = useState<number>()
  const [priceProduct, setPriceProduct] = useState<string>('')
  const [totalPrice, setTotalPrice] = useState<number>(0)
  const initialData = {
    number: number,
    sequence: 1,
    date: '',
    product_id: undefined,
    unit_id: undefined,
    branch_id: Number(localStorage.getItem('current_branch')),
    qty_request: 0,
    price: '',
    percent_discount: 0
  }
  const [rowId, setRowId] = useState<number>()
  const [rowData, setRowData] = useState<CreatePurchaseOrderDetailRequest>(initialData)
  const [errors, setErrors] = useState<{ [key in keyof CreatePurchaseOrderDetailRequest]?: string }>({})
  const [action, setAction] = useState<string | null>(null)

  // Function to set the default date in the "YYYY-MM-DD" format
  const setDefaultDate = () => {
    const dateTransaction = dayjs(new Date()).format('YYYY-MM-DD')
    setRowData((prev: CreatePurchaseOrderDetailRequest) => ({
      ...prev,
      date: dateTransaction as unknown as (typeof prev)['date'] // Ensures `date` type consistency
    }))
  }

  useEffect(() => {
    async function fetchData() {
      try {
        const products = await AppService.serviceGet('api/all-product')
        setProductData(products.data)
        const units = await AppService.serviceGet('api/all-unit')
        setUnitData(units.data)
        // const allStockProduct = await AppService.serviceGet('api/all-stock-product', {
        //   branch_id: localStorage.getItem('current_branch')
        // })
        // setListStockProduct(allStockProduct.data)
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }
    fetchData()
    setDefaultDate()
  }, [])

  const handleAddClick = () => {
    setShowRowAdd(true)
    setAction('add')
  }

  const handleEditClick = (index: number, data: any) => {
    setRowData(data)
    setAction('edit')
    setEditingIndex(index)
  }

  const handleInputChangeProduct = (event: SelectChangeEvent<number>) => {
    const { name, value } = event.target

    setRowData({ ...rowData, [name]: value })
    setErrors(prev => ({ ...prev, [name]: undefined }))
    setProductSelected(Number(value))
    console.log('Select Product')
    console.log(value)
    const matchingProductWhFrom = productData.filter(product => product.id === Number(value))
    console.log(matchingProductWhFrom)
    setUnitSelected(matchingProductWhFrom[0].unit_id)
    let setPrice = FormaterHelper.formatRupiah(String(matchingProductWhFrom[0].purchase_price))
    setRowData((prev: CreatePurchaseOrderDetailRequest) => ({
      ...prev,
      price: setPrice as unknown as (typeof prev)['price'] // Ensures `price` type consistency
    }))
    setPriceProduct(setPrice)
  }

  const handleInputChangeUnit = (event: SelectChangeEvent<number>) => {
    const { name, value } = event.target

    setRowData({ ...rowData, [name]: value })
    setErrors(prev => ({ ...prev, [name]: undefined }))
    setUnitSelected(Number(value))
  }

  const handleInput = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target

    if (name === 'purchase_price' || name === 'selling_price') {
      const strippedValue = FormaterHelper.formatRupiah(value)
      calculateTotalPrice(rowData.qty_request, strippedValue, rowData.percent_discount)
      setRowData(prev => ({ ...prev, [name]: strippedValue }))
    } else if (name === 'qty_request') {
      calculateTotalPrice(Number(value), rowData.price, rowData.percent_discount)
      setRowData(prev => ({ ...prev, [name]: Number(value) }))
    } else if (name === 'percent_discount') {
      calculateTotalPrice(rowData.qty_request, rowData.price, Number(value))
      setRowData(prev => ({ ...prev, [name]: Number(value) }))
    } else {
      // Update dataForm
      setRowData(prev => ({ ...prev, [name]: value ? Number(value) : 0 }))
      // Clear error on change
      setErrors(prev => ({ ...prev, [name]: undefined }))
    }
  }

  const handleInputEdit = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    // Update dataForm
    setRowData(prev => ({ ...prev, [name]: Number(value) }))
    // Clear error on change
    setErrors(prev => ({ ...prev, [name]: undefined }))
  }

  const calculateTotalPrice = (qty: number, price: string, discount: number) => {
    console.log('Calculate Total Price')
    console.log('price : ' + price)
    let priceValue = Number(FormaterHelper.stripRupiahFormatting(String(price)))
    console.log('price : ' + priceValue)
    const total = qty * priceValue
    console.log('total : ' + total)
    if (discount > 0) {
      const discountAmount = (total * discount) / 100
      setRowData(prev => ({ ...prev, price_discount: discountAmount }))
      const totalPriceWithDiscount = total - discountAmount
      setTotalPrice(totalPriceWithDiscount)
    } else {
      setTotalPrice(total)
    }
  }

  // useEffect(() => {
  //   calculateTotalPrice(rowData.qty_request, rowData.price, rowData.percent_discount)
  // }, [rowData.qty_request, rowData.price, rowData.percent_discount])

  const handleSaveItem = (id: any) => {
    console.log('SAVE CLICKER')
    console.log(rowData)
    SavePurchaseOrderDetail(id, rowData)
    setEditingIndex(null)
    setAction(null)
  }

  const handleCloseItem = () => {
    setAction(null)
    setShowRowAdd(false)
    setProductSelected(0)
    setUnitSelected(0)
  }

  const handleDeleteItem = (id: number, rowData: any) => {
    setRowId(id)
    setRowData(rowData)
    setAction('delete')
    setOpenDeleteItemPO(true) // Open modal when 'Ubah' is selected
  }

  const CloseModalDeleteItem = () => {
    setRowData(initialData)
    setOpenDeleteItemPO(false)
    setAction(null)
  }

  const handleAddDataDetail = async () => {
    console.log(' ===== CLICK ADD DETAIL =====')
    const { price } = rowData
    const purchaseOrderDetail = {
      ...rowData,
      number: number,
      price: Number(FormaterHelper.stripRupiahFormatting(price)),
      unit_id: Number(unitSelected),
      branch_id: Number(localStorage.getItem('current_branch')),
      username: getUser.data.username
    }

    console.log('Param PO Detail insert : ')
    console.log(purchaseOrderDetail)
    const response = await AppService.servicePost('api/purchase-order-detail/create', purchaseOrderDetail)
    console.log(response)
    if (response.statusCode == 200) {
      setAction(null)
      setShowRowAdd(false)
      setRowData(initialData)
      setDefaultDate()
      successUpdate({ status: 'success', message: response.message })
    } else if ('errorData' in response) {
      console.log('response : ')
      console.log(response)
      if (typeof response.errorData.errors === 'string') {
        successUpdate({ status: 'failed', message: response.errorData.errors })
      } else {
        const newErrors: any = {}
        response.errorData.error.issues.forEach((issue: any) => {
          newErrors[issue.path[0]] = issue.message // Map error messages to field names
        })
        console.log(newErrors)
        setErrors(newErrors)
      }
    } else {
      successUpdate({ status: 'failed', message: 'Please check the form input.' })
    }
  }

  const SavePurchaseOrderDetail = async (id: number, rowData: CreatePurchaseOrderDetailRequest) => {
    // delete (rowData as { date?: any }).date

    const paramStockDetail = {
      ...rowData,
      id: id,
      number: number,
      branch_id: Number(localStorage.getItem('current_branch')),
      username: getUser.data.username
    }
    console.log('paramStockDetail Update : ')
    console.log(paramStockDetail)
    const response = await AppService.servicePatch('api/purchase-order-detail/update', paramStockDetail)
    console.log(response)
    if (response.statusCode == 200) {
      console.log(response.message)
      setRowData(initialData)
      setDefaultDate()
      successUpdate({ status: 'success', message: response.message })
    } else {
      successUpdate({ status: 'failed', message: 'Please check the form input.' })
    }
  }

  return (
    <>
      {visibleAddItem == true && action == null && (
        <Button
          className='mt-2 mb-1'
          size='small'
          color='info'
          variant='outlined'
          type='button'
          onClick={handleAddClick}
          style={{ float: 'right' }}
        >
          <AddIcon fontSize='small' className='me-2' /> Baris Baru
        </Button>
      )}
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label='warehouse transfer table'>
          <TableHead>
            <TableRow>
              <TableCell width={370}>Produk</TableCell>
              <TableCell width={140}>Satuan</TableCell>
              <TableCell width={110} className='text-right'>
                Qty
              </TableCell>
              <TableCell width={140} className='text-right'>
                Harga
              </TableCell>
              <TableCell width={110} className='text-right'>
                Diskon(%)
              </TableCell>
              <TableCell width={150} className='text-right'>
                Total Harga
              </TableCell>
              <TableCell width={100} className='text-center'>
                Aksi
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {detailTransaction ? (
              detailTransaction.map((detail: any, index: number) => (
                <React.Fragment key={index}>
                  <TableRow>
                    {/* <TableCell>{index + 1}</TableCell> */}
                    <TableCell>{detail.product_name}</TableCell>
                    <TableCell>{detail.initial}</TableCell>
                    <TableCell className='text-right'>
                      {editingIndex === index && action === 'edit' ? (
                        <TextField
                          name='qty_request'
                          type='number'
                          value={rowData?.qty_request || ''}
                          onChange={handleInputEdit}
                          size='small'
                        />
                      ) : (
                        detail.qty_request
                      )}
                    </TableCell>
                    <TableCell className='text-right'>
                      {editingIndex === index && action === 'edit' ? (
                        <TextField
                          name='price'
                          type='number'
                          value={rowData?.price || ''}
                          onChange={handleInputEdit}
                          size='small'
                        />
                      ) : (
                        FormaterHelper.formatRupiah(String(detail.price))
                      )}
                    </TableCell>
                    <TableCell className='text-right'>
                      {editingIndex === index && action === 'edit' ? (
                        <TextField
                          name='percent_discount'
                          type='number'
                          value={rowData?.percent_discount || ''}
                          onChange={handleInputEdit}
                          size='small'
                        />
                      ) : (
                        detail.percent_discount
                      )}
                    </TableCell>
                    <TableCell className='text-right'>
                      {FormaterHelper.formatRupiah(
                        String(detail.qty_request * detail.price * (1 - detail.percent_discount / 100))
                      )}
                    </TableCell>
                    <TableCell className='text-center'>
                      {editingIndex === index && action === 'edit' ? (
                        <Button
                          startIcon={<Save />}
                          onClick={() => handleSaveItem(detail.id)}
                          color='primary'
                          size='small'
                        >
                          Save
                        </Button>
                      ) : (
                        <>
                          <IconButton
                            onClick={() =>
                              handleEditClick(index, {
                                id: detail.id,
                                qty_request: detail.qty_request,
                                price: detail.price,
                                percent_discount: detail.percent_discount
                              })
                            }
                            color='warning'
                            size='small'
                          >
                            <Edit />
                          </IconButton>
                          <IconButton
                            onClick={() => handleDeleteItem(detail.id, { product_name: detail.product_name })}
                            color='error'
                            size='small'
                          >
                            <Delete />
                          </IconButton>
                        </>
                      )}
                    </TableCell>
                  </TableRow>
                  <ModalDeleteItemPO
                    open={openDeleteItemPO}
                    handleClose={CloseModalDeleteItem}
                    idItemPO={rowId}
                    rowData={rowData}
                    successUpdate={successUpdate}
                  />
                </React.Fragment>
              ))
            ) : (
              <></>
            )}
            {showRowAdd && (
              <TableRow>
                {/* <TableCell>{detailTransaction?.warehouseTransferDetail?.length + 1}</TableCell> */}
                <TableCell>
                  <FormControl fullWidth size='small'>
                    <InputLabel id='product-id'>Pilih Produk *</InputLabel>
                    <Select
                      label='Pilih Produk *'
                      labelId='product-id'
                      name='product_id'
                      value={productSelected || ''}
                      onChange={handleInputChangeProduct}
                      size='small'
                      fullWidth
                      error={!!errors.product_id}
                    >
                      {productData.map((product: any, i) => (
                        <MenuItem key={i} value={product.id}>
                          {product.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  {errors.product_id && (
                    <FormHelperText sx={{ marginLeft: 2, color: '#ff4c51' }}>{errors.product_id}</FormHelperText>
                  )}
                </TableCell>
                <TableCell>
                  <FormControl fullWidth size='small'>
                    <InputLabel id='product-id'>Satuan *</InputLabel>
                    <Select
                      label='Satuan *'
                      labelId='unit-id'
                      name='unit_id'
                      value={unitSelected || ''}
                      onChange={handleInputChangeUnit}
                      size='small'
                      fullWidth
                      error={!!errors.unit_id}
                    >
                      {unitData.map((unit: any, i) => (
                        <MenuItem key={i} value={unit.id}>
                          {unit.initial}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  {errors.unit_id && (
                    <FormHelperText sx={{ marginLeft: 2, color: '#ff4c51' }}>{errors.unit_id}</FormHelperText>
                  )}
                </TableCell>
                <TableCell>
                  <TextField
                    name='qty_request'
                    type='number'
                    value={qtyProduct || '1'}
                    onChange={handleInput}
                    size='small'
                    error={!!errors.qty_request}
                  />
                  {errors.qty_request && (
                    <FormHelperText sx={{ marginLeft: 2, color: '#ff4c51' }}>{errors.qty_request}</FormHelperText>
                  )}
                </TableCell>
                <TableCell>
                  <TextField
                    name='price'
                    type='text'
                    value={priceProduct || 0}
                    onChange={handleInput}
                    size='small'
                    error={!!errors.price}
                  />
                  {errors.price && (
                    <FormHelperText sx={{ marginLeft: 2, color: '#ff4c51' }}>{errors.price}</FormHelperText>
                  )}
                </TableCell>
                <TableCell>
                  <TextField
                    name='percent_discount'
                    type='number'
                    value='0'
                    onChange={handleInput}
                    size='small'
                    error={!!errors.percent_discount}
                  />
                  {errors.percent_discount && (
                    <FormHelperText sx={{ marginLeft: 2, color: '#ff4c51' }}>{errors.percent_discount}</FormHelperText>
                  )}
                </TableCell>
                <TableCell>
                  <TextField name='total' type='number' value={totalPrice} size='small' aria-readonly />
                </TableCell>
                <TableCell>
                  <IconButton onClick={handleAddDataDetail} color='primary' size='small'>
                    <Add />
                  </IconButton>
                  <IconButton onClick={handleCloseItem} color='error' size='small'>
                    <Close />
                  </IconButton>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  )
}

export default ViewEditDetailPurchaseOrder
