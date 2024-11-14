import { useState, useEffect, useRef } from 'react'

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

interface PropsFormTableProduct {
  detailTransaction: WarehouseTransferResponse | undefined
  visibleAddItem: boolean
  successUpdate: (response: ResponseStatus) => void // Updated to callback
  wareFrom: string
  number: string
  warehouseName: string
  warehouseNameSelected: string
}

const FormTableProduct: React.FC<PropsFormTableProduct> = ({
  detailTransaction,
  visibleAddItem,
  successUpdate,
  wareFrom,
  number,
  warehouseName,
  warehouseNameSelected
}) => {
  const params = useParams<{ id: string }>()
  const id_warehouse = params.id
  const getUser: any = useSelector<any>(state => state.user.user)

  const [listStockProduct, setListStockProduct] = useState<InventoryType[]>([])
  const [productData, setProductData] = useState([])
  const [showRowAdd, setShowRowAdd] = useState(false)
  const [editingIndex, setEditingIndex] = useState<number | null>(null)
  const [rowData, setRowData] = useState<CreateWarehouseTransferDetailRequest>({
    number: '',
    sequence: 1,
    date: new Date(),
    qty: 0,
    product_id: 0,
    branch_id: 0
  })
  const [productSelected, setProductSelected] = useState('')
  const [errors, setErrors] = useState<{ [key in keyof CreateWarehouseTransferDetailRequest]?: string }>({})
  const [action, setAction] = useState<string | null>(null)
  const [qtyBeforeFrom, setQtyBeforeFrom] = useState<number>()
  const [qtyAfterFrom, setQtyAfterFrom] = useState<number>()
  const [qtyBeforeTo, setQtyBeforeTo] = useState<number>()
  const [qtyAfterTo, setQtyAfterTo] = useState<number>()
  const [unitProduct, setUnitProduct] = useState<number>()

  // Function to set the default date in the "YYYY-MM-DD" format
  const setDefaultDate = () => {
    const dateTransaction = dayjs(new Date()).format('YYYY-MM-DD')
    setRowData((prev: CreateWarehouseTransferDetailRequest) => ({
      ...prev,
      date: dateTransaction as unknown as (typeof prev)['date'] // Ensures `date` type consistency
    }))
  }

  useEffect(() => {
    async function fetchData() {
      try {
        const products = await AppService.serviceGet('api/all-product')
        setProductData(products.data)
        const allStockProduct = await AppService.serviceGet('api/all-stock-product', {
          branch_id: localStorage.getItem('current_branch')
        })
        setListStockProduct(allStockProduct.data)
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
    getStockInfo(data.product_id, data.qty, 'edit')
  }

  // Refs to store initial values
  const initialQtyAfterFrom = useRef<number | null>(null)
  const initialQtyAfterTo = useRef<number | null>(null)

  const handleInputChangeProduct = (event: SelectChangeEvent<string>) => {
    const { name, value } = event.target

    setRowData({ ...rowData, [name]: value })
    setErrors(prev => ({ ...prev, [name]: undefined }))
    setProductSelected(value)
    getStockInfo(value, '0', 'add')
  }

  const getStockInfo = (value: string, qty: string | 0, action: string) => {

    setQtyBeforeFrom(0)
    setQtyBeforeTo(0)
    setQtyAfterFrom(0)
    setQtyAfterTo(0)

    // Filter `listStockProduct` for items that match `product_id` with `value`
    const matchingProductWhFrom = listStockProduct.filter(
      inventory => inventory.product_id === Number(value) && inventory.warehouse_id === Number(wareFrom)
    )

    if (matchingProductWhFrom.length > 0) {
      const stockFrom = matchingProductWhFrom[0].stock + Number(qty)
      console.log('Matching products ware from:', matchingProductWhFrom[0])
      setQtyBeforeFrom(stockFrom)
      console.log('stockFrom : ' + stockFrom)
      setUnitProduct(matchingProductWhFrom[0].unit_id)
    } else {
      console.log('No matching products found.')
    }

    // Filter `listStockProduct` for items that match `product_id` with `value` for the destination warehouse
    const matchingProductWhTo = listStockProduct.filter(
      inventory => inventory.product_id === Number(value) && inventory.warehouse_id === Number(id_warehouse)
    )

    if (matchingProductWhTo.length > 0) {
      const stockTo = matchingProductWhTo[0].stock - Number(qty)
      console.log('Matching products ware to:', matchingProductWhTo[0])
      console.log('stockTo : ' + stockTo)
      setQtyBeforeTo(stockTo)
    } else {
      console.log('No matching products found.')
    }
  }

  const handleInput = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target

    // Update dataForm
    setRowData(prev => ({ ...prev, [name]: value ? Number(value) : 0 }))
    // Clear error on change
    setErrors(prev => ({ ...prev, [name]: undefined }))

    if (value && name == 'qty' && qtyBeforeFrom && qtyBeforeTo) {
      const qtyAfterFrom_ = qtyBeforeFrom - Number(value)
      setQtyAfterFrom(qtyAfterFrom_)
      // Set the initial ref value only if it's null
      if (initialQtyAfterFrom && initialQtyAfterFrom.current === null) {
        initialQtyAfterFrom.current = qtyAfterFrom_
      }
      const qtyAfterTo_ = qtyBeforeTo + Number(value)
      setQtyAfterTo(qtyAfterTo_)
      // Set the initial ref value only if it's null
      if (initialQtyAfterTo && initialQtyAfterTo.current === null) {
        initialQtyAfterTo.current = qtyAfterTo_
      }
    }

    if (!value) {
      console.log('value kosong')
      // Set the initial ref value only if it's null
      if (initialQtyAfterFrom) {
        initialQtyAfterFrom.current = 0
      }
      // Set the initial ref value only if it's null
      if (initialQtyAfterTo) {
        initialQtyAfterTo.current = 0
      }
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace') {
      // Restore initial values stored in refs if available
      if (initialQtyAfterFrom.current !== null) {
        setQtyAfterFrom(initialQtyAfterFrom.current)
      }
      if (initialQtyAfterTo.current !== null) {
        setQtyAfterTo(initialQtyAfterTo.current)
      }
      console.log('Backspace key pressed. Restored previous values.')
    }
  }

  const handleInputEdit = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target

    // Update dataForm
    setRowData(prev => ({ ...prev, [name]: Number(value) }))

    // Clear error on change
    setErrors(prev => ({ ...prev, [name]: undefined }))

    if (value && name == 'qty' && qtyBeforeFrom && qtyBeforeTo) {
      const qtyAfterFrom_ = qtyBeforeFrom - Number(value)
      console.log('qtyAfterFrom_ : ' + qtyAfterFrom_)
      setQtyAfterFrom(qtyAfterFrom_)

      // Set the initial ref value only if it's null
      if (initialQtyAfterFrom && initialQtyAfterFrom.current === null) {
        initialQtyAfterFrom.current = qtyAfterFrom_
      }
      const qtyAfterTo_ = qtyBeforeTo + Number(value)
      console.log('qtyAfterTo_ : ' + qtyAfterTo_)
      setQtyAfterTo(qtyAfterTo_)

      // Set the initial ref value only if it's null
      if (initialQtyAfterTo && initialQtyAfterTo.current === null) {
        initialQtyAfterTo.current = qtyAfterTo_
      }
    }

    if (!value) {
      console.log('value kosong')

      // Set the initial ref value only if it's null
      if (initialQtyAfterFrom) {
        initialQtyAfterFrom.current = 0
      }

      // Set the initial ref value only if it's null
      if (initialQtyAfterTo) {
        initialQtyAfterTo.current = 0
      }
    }
  }

  const getQtyBeforeFromAvailable = (id: number) => {
    const matchingProductWhFrom = listStockProduct.filter(
      inventory => inventory.product_id === Number(id) && inventory.warehouse_id === Number(wareFrom)
    )
    console.log(matchingProductWhFrom[0])
    return matchingProductWhFrom.length > 0 ? matchingProductWhFrom[0].stock : 0
  }

  const getQtyBeforeToAvailable = (id: number) => {
    const matchingProductWhTo = listStockProduct.filter(
      inventory => inventory.product_id === Number(id) && inventory.warehouse_id === Number(id_warehouse)
    )
    return matchingProductWhTo.length > 0 ? matchingProductWhTo[0].stock : 0
  }

  const getQtyAfterFromAvailable = (id: number, qty: number) => {
    const matchingProductWhFrom = listStockProduct.filter(
      inventory => inventory.product_id === Number(id) && inventory.warehouse_id === Number(wareFrom)
    )
    if (matchingProductWhFrom.length > 0) {
      return matchingProductWhFrom[0].stock - qty
    }
  }

  const getQtyAfterToAvailable = (id: number, qty: number) => {
    const matchingProductWhTo = listStockProduct.filter(
      inventory => inventory.product_id === Number(id) && inventory.warehouse_id === Number(id_warehouse)
    )
    if (matchingProductWhTo.length > 0) {
      return matchingProductWhTo[0].stock + qty
    }
  }

  const handleSaveClick = (id: any) => {
    console.log('SAVE CLICKER')
    console.log(rowData)
    SaveStockAdjustDetail(id, rowData)
    setEditingIndex(null)
    setAction(null)
  }

  const handleCloseClick = () => {
    setAction(null)
    setShowRowAdd(false)
    setQtyBeforeFrom(0)
    setQtyBeforeTo(0)
    setQtyAfterFrom(0)
    setQtyAfterTo(0)
    setProductSelected('')
  }

  const handleDeleteClick = (detail: any) => {
    setAction(null)
  }

  const handleAddDataDetail = async () => {
    console.log(' ===== CLICK ADD DETAIL =====')
    const whTransferDetail = {
      ...rowData,
      number: number,
      unit_id: unitProduct,
      wh_from: wareFrom,
      wh_to: id_warehouse,
      branch_id: Number(localStorage.getItem('current_branch')),
      username: getUser.data.username
    }

    console.log('param WhTransfer Detail insert : ')
    console.log(whTransferDetail)
    const response = await AppService.servicePost('api/warehouse-transfer-detail/create', whTransferDetail)
    console.log(response)
    if (response.statusCode == 200) {
      setAction(null)
      setShowRowAdd(false)
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

  const SaveStockAdjustDetail = async (id: number, rowData: CreateWarehouseTransferDetailRequest) => {
    delete (rowData as { date?: any }).date

    const paramStockDetail = {
      ...rowData,
      id: id,
      number: number,
      wh_from: wareFrom,
      wh_to: id_warehouse,
      branch_id: Number(localStorage.getItem('current_branch')),
      username: getUser.data.username
    }
    console.log('paramStockDetail Update : ')
    console.log(paramStockDetail)
    const response = await AppService.servicePatch('api/warehouse-transfer-detail/update', paramStockDetail)
    console.log(response)
    if (response.statusCode == 200) {
      console.log(response.message)
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
              {/* <TableCell>No</TableCell> */}
              <TableCell width={500}>Produk</TableCell>
              <TableCell width={200}>Info Gudang</TableCell>
              <TableCell width={120}>Qty Sebelumnya</TableCell>
              <TableCell width={120}>Qty Setelahnya</TableCell>
              <TableCell width={120}>Qty Transfer</TableCell>
              {/* <TableCell>Action</TableCell> */}
            </TableRow>
          </TableHead>
          <TableBody>
            {detailTransaction ? (
              detailTransaction.warehouseTransferDetail?.map((detail: any, index: number) => (
                <TableRow key={index}>
                  {/* <TableCell>{index + 1}</TableCell> */}
                  <TableCell>{detail.product.name}</TableCell>
                  <TableCell>
                    <table>
                      <tbody>
                        <tr>
                          <td>Dari </td>
                          <td>&nbsp;: {warehouseNameSelected}</td>
                        </tr>
                        <tr>
                          <td>Ke </td>
                          <td>&nbsp;: {warehouseName}</td>
                        </tr>
                      </tbody>
                    </table>
                  </TableCell>
                  <TableCell>
                    <table>
                      {editingIndex === index && action === 'edit' ? (
                        <tbody>
                          <tr>
                            <td>{qtyBeforeFrom || 0}</td>
                          </tr>
                          <tr>
                            <td>{qtyBeforeTo || 0}</td>
                          </tr>
                        </tbody>
                      ) : (
                        <tbody>
                          <tr>
                            <td>{getQtyBeforeFromAvailable(detail.product_id)}</td>
                          </tr>
                          <tr>
                            <td>{getQtyBeforeToAvailable(detail.product_id)}</td>
                          </tr>
                        </tbody>
                      )}
                    </table>
                  </TableCell>
                  <TableCell>
                    <table>
                      {editingIndex === index && action === 'edit' ? (
                        <tbody>
                          <tr>
                            <td>{qtyAfterFrom || 0}</td>
                          </tr>
                          <tr>
                            <td>{qtyAfterTo || 0}</td>
                          </tr>
                        </tbody>
                      ) : (
                        <tbody>
                          <tr>
                            <td>{getQtyAfterFromAvailable(detail.product_id, detail.qty)}</td>
                          </tr>
                          <tr>
                            <td>{getQtyAfterToAvailable(detail.product_id, detail.qty)}</td>
                          </tr>
                        </tbody>
                      )}
                    </table>
                  </TableCell>
                  <TableCell>
                    {editingIndex === index && action === 'edit' ? (
                      <TextField
                        name='qty'
                        type='number'
                        value={rowData?.qty || ''}
                        onChange={handleInputEdit}
                        onKeyDown={handleKeyDown}
                        size='small'
                      />
                    ) : (
                      detail.qty
                    )}
                  </TableCell>
                  <TableCell>
                    {editingIndex === index && action === 'edit' ? (
                      <Button
                        startIcon={<Save />}
                        onClick={() => handleSaveClick(detail.id)}
                        color='primary'
                        size='small'
                      >
                        Save
                      </Button>
                    ) : (
                      <>
                        <IconButton
                          onClick={() =>
                            handleEditClick(index, { id: detail.id, qty: detail.qty, product_id: detail.product_id })
                          }
                          color='warning'
                          size='small'
                        >
                          <Edit />
                        </IconButton>
                        <IconButton onClick={() => handleDeleteClick(detail)} color='error' size='small'>
                          <Delete />
                        </IconButton>
                      </>
                    )}
                  </TableCell>
                </TableRow>
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
                      value={productSelected}
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
                  <table>
                    <tbody>
                      <tr>
                        <td>Dari </td>
                        <td>&nbsp;: {warehouseNameSelected}</td>
                      </tr>
                      <tr>
                        <td>Ke </td>
                        <td>&nbsp;: {warehouseName}</td>
                      </tr>
                    </tbody>
                  </table>
                </TableCell>
                <TableCell>
                  <table>
                    <tbody>
                      <tr>
                        <td>{qtyBeforeFrom || 0}</td>
                      </tr>
                      <tr>
                        <td>{qtyBeforeTo || 0}</td>
                      </tr>
                    </tbody>
                  </table>
                </TableCell>
                <TableCell>
                  <table>
                    <tbody>
                      <tr>
                        <td>{qtyAfterFrom || 0}</td>
                      </tr>
                      <tr>
                        <td>{qtyAfterTo || 0}</td>
                      </tr>
                    </tbody>
                  </table>
                </TableCell>
                <TableCell>
                  <TextField
                    name='qty'
                    type='number'
                    defaultValue='0'
                    onChange={handleInput}
                    onKeyDown={handleKeyDown}
                    size='small'
                    error={!!errors.qty}
                  />
                  {errors.qty && <FormHelperText sx={{ marginLeft: 2, color: '#ff4c51' }}>{errors.qty}</FormHelperText>}
                </TableCell>
                <TableCell>
                  <IconButton onClick={handleAddDataDetail} color='primary' size='small'>
                    <Add />
                  </IconButton>
                  <IconButton onClick={handleCloseClick} color='error' size='small'>
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

export default FormTableProduct
