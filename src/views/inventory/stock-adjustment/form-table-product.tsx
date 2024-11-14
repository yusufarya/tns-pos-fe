import { useState, useEffect } from 'react'
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
import AppService from '@/app/api/services/app-service'
import { CreateStockAdjustmentDetailRequest, StockAdjustmentResponse } from '@/@core/inventory-data-types'
import { ResponseStatus } from '@/@core/types'
import AddIcon from '@mui/icons-material/Add'
import dayjs from 'dayjs'
import { useParams } from 'next/navigation'

interface PropsFormTableProduct {
  detailTransaction: StockAdjustmentResponse | undefined
  visibleAddItem: boolean
  successUpdate: (response: ResponseStatus) => void // Updated to callback
  typeAdjust: string
  number: string
}

const FormTableProduct: React.FC<PropsFormTableProduct> = ({
  detailTransaction,
  visibleAddItem,
  successUpdate,
  typeAdjust,
  number
}) => {
  const params = useParams<{ id: string }>()
  const id_warehouse = params.id
  const getUser: any = useSelector<any>(state => state.user.user)

  const [productData, setProductData] = useState([])
  const [unitData, setUnitData] = useState([])
  const [showRowAdd, setShowRowAdd] = useState(false)
  const [editingIndex, setEditingIndex] = useState<number | null>(null)
  const [rowData, setRowData] = useState<CreateStockAdjustmentDetailRequest>({
    number: '',
    date: new Date(),
    qty: 0,
    product_id: 0,
    branch_id: 0,
    warehouse_id: 0
  })
  const [errors, setErrors] = useState<{ [key in keyof CreateStockAdjustmentDetailRequest]?: string }>({})
  const [action, setAction] = useState<string | null>(null)

  // Function to set the default date in the "YYYY-MM-DD" format
  const setDefaultDate = () => {
    const dateTransaction = dayjs(new Date()).format('YYYY-MM-DD')
    setRowData((prev: CreateStockAdjustmentDetailRequest) => ({
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
    setDefaultDate()
    setProductSelected('')
  }

  const handleEditClick = (index: number, data: any) => {
    setRowData(data)
    setAction('edit')
    setEditingIndex(index)
  }

  const handleInput = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    // Update dataForm
    setRowData(prev => ({ ...prev, [name]: Number(value) }))
    // Clear error on change
    setErrors(prev => ({ ...prev, [name]: undefined }))
  }

  const [productSelected, setProductSelected] = useState<string>('')
  const handleInputChangeProduct = (event: SelectChangeEvent<string>) => {
    const { name, value } = event.target
    console.log(name)
    console.log(value)
    setRowData({
      ...rowData,
      [name]: value
    })

    setErrors(prev => ({ ...prev, [name]: undefined }))
    setProductSelected(value)
  }

  const [unitSelected, setUnitSelected] = useState<string>('')
  const handleInputChangeUnit = (event: SelectChangeEvent<string>) => {
    const { name, value } = event.target
    setRowData({
      ...rowData,
      [name]: value
    })
    setUnitSelected(value)
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
    // Implement Delete function logic here
  }

  const handleDeleteClick = (detail: any) => {
    console.log(detail)
    setAction(null)
    // Implement Delete function logic here
  }

  const handleBtnAddDataDetail = async () => {
    console.log(' ===== CLICK ADD DETAIL =====')
    const stockAdjustDetail = {
      ...rowData,
      number: number,
      type: typeAdjust,
      branch_id: Number(localStorage.getItem('current_branch')),
      warehouse_id: Number(id_warehouse),
      username: getUser.data.username
    }

    console.log('paramStockDetail insert : ')
    console.log(stockAdjustDetail)
    const response = await AppService.servicePost('api/stock-adjustment-detail/create', stockAdjustDetail)
    console.log(response)
    if (response.statusCode == 200) {
      console.log(response.message)
      setAction(null)
      setShowRowAdd(false)
      successUpdate({ status: 'success', message: response.message })
    } else if ('errorData' in response) {
      console.log(response)
      const newErrors: any = {}
      response.errorData.error.issues.forEach((issue: any) => {
        newErrors[issue.path[0]] = issue.message // Map error messages to field names
      })
      console.log(newErrors)
      setErrors(newErrors)
    } else {
      successUpdate({ status: 'failed', message: 'Please check the form input.' })
    }
  }

  const SaveStockAdjustDetail = async (id: number, rowData: CreateStockAdjustmentDetailRequest) => {
    delete (rowData as { date?: any }).date

    const paramStockDetail = {
      ...rowData,
      id: id,
      number: number,
      type: typeAdjust,
      branch_id: Number(localStorage.getItem('current_branch')),
      warehouse_id: Number(id_warehouse),
      username: getUser.data.username
    }

    console.log('paramStockDetail Update : ')
    console.log(paramStockDetail)
    const response = await AppService.servicePatch('api/stock-adjustment-detail/update', paramStockDetail)
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
        <Table sx={{ minWidth: 650 }} aria-label='stock adjustment table'>
          <TableHead>
            <TableRow>
              {/* <TableCell>No</TableCell> */}
              <TableCell width={550}>Produk</TableCell>
              <TableCell width={100}>Qty Terkini</TableCell>
              <TableCell width={150}>Qty Aktual</TableCell>
              <TableCell>Selisih</TableCell>
              <TableCell width={150}>Satuan</TableCell>
              {/* <TableCell>Action</TableCell> */}
            </TableRow>
          </TableHead>
          <TableBody>
            {detailTransaction ? (
              detailTransaction.stockAdjustmentDetail?.map((detail: any, index: number) => (
                <TableRow key={index}>
                  {/* <TableCell>{index + 1}</TableCell> */}
                  <TableCell>{detail.product.name}</TableCell>
                  <TableCell>Qty Terkini</TableCell>
                  <TableCell>
                    {editingIndex === index && action === 'edit' ? (
                      <TextField
                        name='qty'
                        type='number'
                        value={rowData?.qty || ''}
                        onChange={handleInput}
                        size='small'
                      />
                    ) : (
                      detail.qty
                    )}
                  </TableCell>
                  <TableCell>Selisih</TableCell>
                  <TableCell>{detail.product.unit.initial}</TableCell>
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
                          onClick={() => handleEditClick(index, { id: detail.id, qty: detail.qty })}
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
                {/* <TableCell>{detailTransaction?.stockAdjustmentDetail?.length + 1}</TableCell> */}
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
                <TableCell>Qty terkini</TableCell>
                <TableCell>
                  <TextField
                    name='qty'
                    type='number'
                    defaultValue='0'
                    onChange={handleInput}
                    size='small'
                    error={!!errors.qty}
                  />
                  {errors.qty && <FormHelperText sx={{ marginLeft: 2, color: '#ff4c51' }}>{errors.qty}</FormHelperText>}
                </TableCell>
                <TableCell>Selisih</TableCell>
                <TableCell>
                  <Select name='unit_id' value={unitSelected} onChange={handleInputChangeUnit} size='small' fullWidth>
                    {unitData.map((unit: any, i) => (
                      <MenuItem key={i} value={unit.id}>
                        {unit.initial}
                      </MenuItem>
                    ))}
                  </Select>
                </TableCell>
                <TableCell>
                  <IconButton onClick={handleBtnAddDataDetail} color='primary' size='small'>
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
