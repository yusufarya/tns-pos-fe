'use client'

import {
  Box,
  Button,
  FormControl,
  FormControlLabel,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Switch,
  TextField,
  Typography
} from '@mui/material'
import { useCallback, useEffect, useState } from 'react'
import AppService from '@/app/api/services/app-service'
import { Add, ArrowBack, Delete, Save } from '@mui/icons-material'
import { useRouter } from 'next/navigation'
import FormCategoryModal from '@/components/modals/form-category'
import UploadIcon from '@mui/icons-material/UploadFile'
import { useDropzone } from 'react-dropzone'
import { useDispatch, useSelector } from 'react-redux'
import { setPageName } from '@/store/slices/page-name-slice'
import { PreviewFile, ResponseData, ResponseStatus } from '@/@core/types'
import { BrandResponse, CategoryResponse, CreateProductRequest, UnitResponse } from '@/@core/master-data-types'
import CustomSnackBarNotification from '@/components/notification/custom-snackbar-notification'
import FormaterHelper from '@/@core/utils/formatHelper'
import TimelapseRoundedIcon from '@mui/icons-material/TimelapseRounded'
import FormUnitModal from '@/components/modals/form-unit'
import FormBrandModal from '@/components/modals/form-brand'

export default function ViewAddProduct() {
  const getResponseDataUpdate = useSelector<ResponseData | any>(state => state.responseStatus.status)
  // console.log('getResponseDataUpdate : ' + getResponseDataUpdate)
  const getUser: any = useSelector<any>(state => state.user.user)

  const router = useRouter()
  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(setPageName({ params1: 'Produk', params2: 'Tambah' }))
  }, [dispatch]) // Ensure dispatch is in the dependency array

  const [categoryData, setCategoryData] = useState<CategoryResponse[]>([])
  const [unitData, setUnitData] = useState<UnitResponse[]>([])
  const [brandData, setBrandData] = useState<BrandResponse[]>([])
  const [errors, setErrors] = useState<{ [key in keyof CreateProductRequest]?: string }>({})
  const [dataForm, setDataForm] = useState<CreateProductRequest>({
    category_id: 0,
    unit_id: 0,
    brand_id: 0,
    name: '',
    purchase_price: 0,
    selling_price: 0,
    description: '',
    pos: 'N',
    image: [],
    is_active: 'Y'
  })
  const [isSuccessUpdate, setIsSuccessUpdate] = useState<ResponseStatus | null>(null)

  useEffect(() => {
    const fetchAnyData = async () => {
      try {
        const [categoryResponse, brandResponse, unitResponse] = await Promise.all([
          AppService.serviceGet('api/all-category'),
          AppService.serviceGet('api/all-brand'),
          AppService.serviceGet('api/all-unit')
        ])
        if ('statusCode' in categoryResponse && categoryResponse.statusCode === 200 && 'data' in categoryResponse) {
          setCategoryData(categoryResponse.data) // Assuming result.data contains the array of category
        }
        if ('statusCode' in unitResponse && unitResponse.statusCode === 200 && 'data' in unitResponse) {
          setUnitData(unitResponse.data) // Assuming result data contains the array of unit
        }
        if ('statusCode' in brandResponse && brandResponse.statusCode === 200 && 'data' in brandResponse) {
          setBrandData(brandResponse.data) // Assuming result.data contains the array of brand
        }
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }
    fetchAnyData()
  }, [isSuccessUpdate])

  const [category, setCategory] = useState('')
  const [unit, setUnit] = useState('')
  const [brand, setBrand] = useState<string>(brandData.length > 0 ? 'brandData[0].id.toString()' : '')
  const [openModalCategory, setOpenModalCategory] = useState(false)
  const [openModalUnit, setOpenModalUnit] = useState(false)
  const [openModalBrand, setOpenModalBrand] = useState(false)

  const handleChangeCategory = (event: SelectChangeEvent<string>) => {
    const name = event.target.name
    const value = event.target.value

    setDataForm(prev => ({ ...prev, [name]: value }))
    // Clear error on change
    setErrors(prev => ({ ...prev, [name]: undefined }))

    if (value === 'add-category') {
      setOpenModalCategory(true) // Open modal when 'Tambah Kategori' is selected
      setCategory('')
    } else {
      setCategory(value)
    }
  }

  const handleChangeUnit = (event: SelectChangeEvent<string>) => {
    const name = event.target.name
    const value = event.target.value

    setDataForm(prev => ({ ...prev, [name]: value }))
    // Clear error on change
    setErrors(prev => ({ ...prev, [name]: undefined }))

    if (value === 'add-unit') {
      setOpenModalUnit(true) // Open modal when 'Tambah Kategori' is selected
      setUnit('')
    } else {
      setUnit(value)
    }
  }

  const handleChangeBrand = (event: SelectChangeEvent<string>) => {
    const name = event.target.name
    const value = event.target.value

    setDataForm(prev => ({ ...prev, [name]: value }))
    // Clear error on change
    setErrors(prev => ({ ...prev, [name]: undefined }))

    if (value === 'add-brand') {
      setOpenModalBrand(true) // Open modal when 'Tambah Kategori' is selected
      setBrand('')
    } else {
      setBrand(value)
    }
  }

  const handleModalClose = () => {
    setOpenModalCategory(false)
    setOpenModalUnit(false)
    setOpenModalBrand(false)
  }

  const [showImgProduct, setShowImgProduct] = useState(false)
  const [selectedFiles, setSelectedFiles] = useState<string[]>([]) // Explicit type for the selected files

  const handleChangeShowImgProduct = (event: React.ChangeEvent<HTMLInputElement>) => {
    setShowImgProduct(event.target.checked)
  }

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      console.log('acceptedFiles:', acceptedFiles)

      const invalidFiles = acceptedFiles.filter(file => file.size > 2097152)
      if (invalidFiles.length > 0) {
        setIsSuccessUpdate({ status: 'failed', message: 'File size exceeds 2 MB. Please upload smaller files.' })
        return
      }

      if (selectedFiles.length + acceptedFiles.length > 3) {
        setIsSuccessUpdate({ status: 'failed', message: 'You can only upload a maximum of 3 files.' })
        return
      }

      for (const file of acceptedFiles) {
        const fileWithPreview = Object.assign(file)

        const formData = new FormData()
        formData.append('file', fileWithPreview)

        const resultUpload = await AppService.serviceUploadImagePost('api/product/upload-img', formData)
        if (resultUpload.statusCode === 200) {
          setIsSuccessUpdate({ status: 'success', message: resultUpload.message })

          // Update the dataForm to include the new image
          setDataForm(prev => ({
            ...prev,
            image: [...(prev.image || []), resultUpload.data] // Append new image
          }))

          // Update selected files state for preview
          setSelectedFiles(prevFiles => [...prevFiles, resultUpload.data])
        } else {
          console.error('Upload failed:', resultUpload)
        }
      }
    },
    [selectedFiles]
  )

  const handleRemoveImage = async (file: PreviewFile[] | string) => {
    // Kirim permintaan POST untuk upload gambar
    console.log(file)
    const resultDelete = await AppService.servicePost('api/product/delete-img', { file: file })

    if (resultDelete.statusCode === 200) {
      setIsSuccessUpdate({ status: 'success', message: resultDelete.message })
      // Update dataForm to remove the image from the image array
      // Remove the image from the image array in dataForm
      setDataForm(prev => ({
        ...prev,
        image: (prev.image || []).filter(img => img !== file) // Remove the file from the image array
      }))
    } else {
      setIsSuccessUpdate({ status: 'failed', message: 'Failed, please call the addministrator.' })
    }
    setSelectedFiles(selectedFiles.filter(f => f !== file))
  }

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': []
    },
    maxFiles: 3,
    maxSize: 2097152 // 2 MB (2 * 1024 * 1024 bytes)
  })

  const [snackBarOpen, setSnackBarOpen] = useState(false)
  useEffect(() => {
    if (isSuccessUpdate) {
      setSnackBarOpen(true) // Show Snackbar when isSuccessUpdate changes
    }
  }, [isSuccessUpdate])

  const handleCloseSnack = () => {
    setSnackBarOpen(false) // Close the Snackbar
  }

  const [manageStock, setManageStock] = useState(false)

  const handleChangeManageStock = (event: React.ChangeEvent<HTMLInputElement>) => {
    setManageStock(event.target.checked)
  }

  const [forPos, setForPos] = useState(false)

  const handleChangeForPos = (event: React.ChangeEvent<HTMLInputElement>) => {
    setForPos(event.target.checked)
  }

  const handleInput = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    // Update dataForm
    if (name === 'purchase_price' || name === 'selling_price') {
      const strippedValue = FormaterHelper.formatRupiah(value)
      setDataForm(prev => ({ ...prev, [name]: strippedValue }))
    } else {
      setDataForm(prev => ({ ...prev, [name]: value }))
      // Clear error on change
      setErrors(prev => ({ ...prev, [name]: undefined }))
    }
  }

  const handleKeyUp = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const target = e.target as HTMLInputElement
    const { name, value } = target
    // Logic for key up event
    if (name === 'purchase_price' || name === 'selling_price') {
      const strippedValue = FormaterHelper.formatRupiah(value)
      setDataForm(prev => ({ ...prev, [name]: strippedValue }))
    }
  }

  const [loadingButtonSubmit, setLoadingButtonSubmit] = useState<boolean>(false)

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    setLoadingButtonSubmit(true)
    console.log('=== SUBMIT ADD PRODUK ===')

    const { purchase_price, selling_price, image } = dataForm // Destructure the needed values from dataForm
    const productData = {
      ...dataForm,
      pos: forPos ? 'Y' : 'N',
      image: image && image?.length > 0 ? JSON.stringify(image) : '',
      purchase_price: FormaterHelper.stripRupiahFormatting(purchase_price),
      selling_price: FormaterHelper.stripRupiahFormatting(selling_price),
      category_id: category,
      unit_id: unit,
      brand_id: brand,
      username: getUser.data.username
    }
    console.log('Product Data to submit:', productData)
    try {
      const storeData = await AppService.servicePost('api/product/create', productData)
      console.log(storeData)
      if ('statusCode' in storeData && storeData.statusCode === 200) {
        setIsSuccessUpdate({ status: 'success', message: storeData.message })
        setTimeout(() => {
          router.push('/products')
          setLoadingButtonSubmit(false)
        }, 2000)
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

  const successUpdate = (response: ResponseStatus) => {
    console.log('masuk success update function')
    setIsSuccessUpdate(response)
  }

  const responseAddCategory = (response: CategoryResponse) => {
    setCategory(String(response.id))
  }

  const responseAddUnit = (response: UnitResponse) => {
    setUnit(String(response.id))
  }

  const responseAddBrand = (response: BrandResponse) => {
    setBrand(String(response.id))
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
        <div className='flex-none'>
          <Typography variant='h4' component='h4' className='p-3'>
            Tambah Data Produk
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
      </div>

      <form
        noValidate
        autoComplete='off'
        onSubmit={handleSubmit}
        className='grid grid-cols-4 gap-4 shadow-md mb-8 px-3 py-7 rounded-sm'
      >
        <div className='col-span-4'>
          <FormControlLabel
            control={<Switch checked={showImgProduct} onChange={handleChangeShowImgProduct} />}
            label='Tampilkan gambar produk'
          />
        </div>
        {showImgProduct && (
          <>
            <div className='col-span-2'>
              <Typography variant='h6' gutterBottom>
                Gambar Produk
              </Typography>

              <Box
                {...getRootProps()}
                sx={{
                  border: '2px dashed #ccc',
                  borderRadius: '8px',
                  minHeight: '200px',
                  padding: '20px',
                  textAlign: 'center',
                  backgroundColor: isDragActive ? '#f0f0f0' : '#fafafa',
                  cursor: 'pointer',
                  '&:hover': {
                    borderColor: '#3f51b5'
                  }
                }}
              >
                <input {...getInputProps()} />
                <UploadIcon style={{ fontSize: 50, color: '#3f51b5' }} />
                <Typography variant='h6'>
                  {isDragActive ? 'Lepaskan file di sini...' : 'Klik atau seret file ke area ini untuk mengunggah'}
                </Typography>
                <Typography variant='body2' color='textSecondary'>
                  • Ukuran file gambar maksimal 2 MB <br />
                  • Jumlah maksimal 3 gambar <br />
                  • Format file jpg|png <br />
                  {/* • Jumlah upload maksimal 5 gambar */}
                </Typography>
              </Box>
            </div>
            <div className='col-span-2'>
              {/* preview img upload  */}
              <Typography variant='h6' gutterBottom>
                Preview Gambar
              </Typography>

              <Box
                display='flex'
                flexWrap='wrap'
                gap={2}
                sx={{
                  border: '2px solid #ccc',
                  borderRadius: '8px',
                  minHeight: '200px',
                  padding: '20px',
                  textAlign: 'center',
                  cursor: 'pointer'
                }}
              >
                {selectedFiles.map((file, index) => (
                  <Box key={index} sx={{ position: 'relative', padding: '10px 0' }}>
                    <img
                      src={process.env.NEXT_PUBLIC_BASE_PATH_IMG! + file}
                      alt={`preview-${index}`}
                      style={{ height: '100px', objectFit: 'cover', borderRadius: '8px' }}
                    />
                    <Box
                      sx={{
                        position: 'absolute',
                        top: 5,
                        right: 4,
                        backgroundColor: 'rgba(210, 0, 0, 0.8)',
                        color: '#fff',
                        padding: '3px 6px 2px 6px',
                        cursor: 'pointer',
                        boxShadow: '1px 2px 3px #acacac',
                        borderRadius: '50%'
                      }}
                      onClick={() => handleRemoveImage(file)}
                    >
                      <Delete fontSize='small' />
                    </Box>
                  </Box>
                ))}
              </Box>
            </div>
          </>
        )}
        <div className='col-span-2'>
          <FormControl fullWidth sx={{ minWidth: 120 }} size='small'>
            <InputLabel id='category-label'>Kategori *</InputLabel>
            <Select
              labelId='category-label'
              id='category_id'
              name='category_id'
              value={category}
              label='Kategori'
              onChange={handleChangeCategory}
              error={!!errors.category_id} // Convert the error message to a boolean
            >
              {categoryData.length > 0 &&
                categoryData.map((category, index) => (
                  <MenuItem key={index} value={category.id}>
                    {category.name}
                  </MenuItem>
                ))}
              <MenuItem value='add-category'>
                <Add /> Tambah Kategori
              </MenuItem>
            </Select>
            {errors.category_id && <FormHelperText sx={{ color: '#ff4c51' }}>{errors.category_id}</FormHelperText>}
          </FormControl>
        </div>
        <div>
          <FormControl fullWidth sx={{ minWidth: 120 }} size='small'>
            <InputLabel id='unit-label'>Satuan *</InputLabel>
            <Select
              labelId='unit-label'
              id='unit_id'
              name='unit_id'
              value={unit}
              label='Satuan'
              onChange={handleChangeUnit}
              error={!!errors.unit_id}
            >
              {unitData.length > 0 &&
                unitData.map((unit, index) => (
                  <MenuItem key={index} value={unit.id}>
                    {unit.initial}
                  </MenuItem>
                ))}
              <MenuItem value='add-unit'>
                <Add /> Tambah Satuan
              </MenuItem>
            </Select>
            {errors.unit_id && <FormHelperText sx={{ color: '#ff4c51' }}>{errors.unit_id}</FormHelperText>}
          </FormControl>
        </div>
        <div>
          <FormControl fullWidth sx={{ minWidth: 120 }} size='small'>
            <InputLabel id='brand-label'>Merek (Jika ada)</InputLabel>
            <Select
              labelId='brand-label'
              id='brand_id'
              name='brand_id'
              value={brand}
              label='Merek'
              onChange={handleChangeBrand}
              error={!!errors.brand_id}
            >
              {brandData.length > 0 &&
                brandData.map((brand, index) => (
                  <MenuItem key={index} value={brand.id}>
                    {brand.name}
                  </MenuItem>
                ))}
              <MenuItem value='add-brand'>
                <Add /> Tambah Merek
              </MenuItem>
            </Select>
          </FormControl>
        </div>
        <div className='col-span-2'>
          <TextField
            fullWidth
            size='small'
            label='Nama Barang *'
            id='name'
            name='name'
            defaultValue=''
            onChange={handleInput}
            error={!!errors.name}
            helperText={errors.name} // Display error message
          />
        </div>
        <div>
          <TextField
            fullWidth
            size='small'
            name='barcode'
            id='barcode'
            label='Kode/SKU *'
            defaultValue=''
            onChange={handleInput}
            error={!!errors.barcode}
            helperText={errors.barcode} // Display error message
          />
        </div>
        <div>
          <FormControlLabel
            control={<Switch checked={forPos} onChange={handleChangeForPos} />}
            label='Produk untuk POS'
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
        <div className='col-span-3'>
          <TextField
            fullWidth
            size='small'
            label='Harga Beli *'
            name='purchase_price'
            id='purchase-price'
            placeholder='0'
            value={dataForm?.purchase_price || ''}
            onChange={handleInput}
            onKeyUp={handleKeyUp}
            error={!!errors.purchase_price}
            helperText={errors.purchase_price} // Display error message
          />
        </div>
        <div className='col-span-3'>
          <TextField
            fullWidth
            size='small'
            label='Harga Jual *'
            name='selling_price'
            id='selling-price'
            placeholder='0'
            value={dataForm?.selling_price || ''}
            onChange={handleInput}
            onKeyUp={handleKeyUp}
            error={!!errors.selling_price}
            helperText={errors.selling_price} // Display error message
          />
        </div>
        <div>
          <Button size='small'>
            <Add /> Tambahkan Harga Grosir
          </Button>
        </div>
        <div className='col-span-4'>
          <FormControlLabel
            control={<Switch checked={manageStock} onChange={handleChangeManageStock} />}
            label='Kelola stok ini'
          />
        </div>

        {manageStock && (
          <>
            <div className='col-span-1'>
              <TextField
                fullWidth
                size='small'
                label='Min Stock *'
                name='min_stock'
                id='outlined-size-small'
                defaultValue='0'
                onChange={handleInput}
              />
            </div>
            <div className='col-span-1'>
              <TextField
                fullWidth
                size='small'
                label='Max Stock *'
                name='max_stock'
                id='outlined-size-small'
                defaultValue='0'
                onChange={handleInput}
              />
            </div>
          </>
        )}

        <div className='col-span-4'>
          <Button fullWidth variant='contained' type='submit'>
            {loadingButtonSubmit ? (
              <span className='flex animate-pulse'>
                <TimelapseRoundedIcon className='animate-spin mx-2' />
                Memuat...
              </span>
            ) : (
              <span>
                <Save fontSize='small' sx={{ mx: 2 }} /> Simpan
              </span>
            )}
          </Button>
        </div>
      </form>

      {/* Modal Component */}
      {openModalCategory && (
        <FormCategoryModal
          open={openModalCategory}
          handleClose={handleModalClose}
          successUpdate={successUpdate}
          responseAddCategory={responseAddCategory}
        />
      )}
      {/* Modal Component */}
      {openModalUnit && (
        <FormUnitModal
          open={openModalUnit}
          handleClose={handleModalClose}
          successUpdate={successUpdate}
          responseAddUnit={responseAddUnit}
        />
      )}
      {/* Modal Component */}
      {openModalBrand && (
        <FormBrandModal
          open={openModalBrand}
          handleClose={handleModalClose}
          successUpdate={successUpdate}
          responseAddBrand={responseAddBrand}
        />
      )}
    </div>
  )
}
