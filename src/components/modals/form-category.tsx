import React, { useEffect, useState } from 'react'
import Backdrop from '@mui/material/Backdrop'
import Box from '@mui/material/Box'
import Modal from '@mui/material/Modal'
import Fade from '@mui/material/Fade'
import Typography from '@mui/material/Typography'
import { Button, TextField } from '@mui/material'
import { ResponseStatus } from '@/@core/types'
import AppService from '@/app/api/services/app-service'
import { useDispatch, useSelector } from 'react-redux'
import { CategoryResponse, CreateCategoryRequest } from '@/@core/master-data-types'

const style = {
  width: '100%',
  maxWidth: '600px',
  maxHeight: '310px',
  position: 'absolute',
  top: '25%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  bgcolor: 'background.paper',
  border: '1px solid #fafafa',
  boxShadow: 24,
  p: 4,
  borderRadius: '4px'
}

interface FormCategoryModalProps {
  open: boolean
  idCategory?: number | undefined
  rowData?: CategoryResponse | undefined
  handleClose: () => void
  successUpdate: (response: ResponseStatus) => void // Updated to callback
  responseAddCategory: (response: CategoryResponse) => void
}

const FormCategoryModal: React.FC<FormCategoryModalProps> = ({
  open,
  idCategory,
  rowData,
  handleClose,
  successUpdate,
  responseAddCategory
}) => {
  const dispatch = useDispatch()

  const getUser: any = useSelector<any>(state => state.user.user)

  const [dataFormCategory, setDataFormCategory] = useState<CreateCategoryRequest>({
    name: '',
    description: ''
  })

  const [errors, setErrors] = useState<{ name?: string; description?: string }>({})

  const handleInput = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setDataFormCategory(prevDataForm => ({
      ...prevDataForm,
      [name]: value
    }))
    setErrors({ ...errors, [e.target.name]: undefined }) // Clear error on change
  }

  const handleSubmitCategory = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    console.log('=== SUBMIT CATEGORY ===')
    const { name } = dataFormCategory
    const categoryData = {
      ...dataFormCategory,
      name_current: name,
      // Assuming you have a way to get username, you might need to define it
      username: getUser.data.username
    }
    let response
    try {
      // console.log(idCategory)
      if (!idCategory) {
        response = await AppService.servicePost('api/category/create', categoryData)
      } else {
        categoryData.id = idCategory
        // console.log(categoryData);
        response = await AppService.servicePatch('api/category/update', categoryData)
      }

      console.log(response)
      if ('statusCode' in response && response.statusCode === 200) {
        successUpdate({ status: 'success', message: response.message })
        responseAddCategory(response.data)
        handleClose()
        setDataFormCategory({})
      } else if ('errorData' in response) {
        // Handle validation errors from the backend
        if (response.errorData.errors) {
          successUpdate({ status: 'failed', message: response.errorData.errors })
          response.errorData.error.issues[0].path['category']
          response.errorData.error.issues[0].message[response.errorData.errors]
        }
        console.log('response : ')
        console.log(response)
        const newErrors: any = {}
        response.errorData.error.issues.forEach((issue: any) => {
          newErrors[issue.path[0]] = issue.message // Map error messages to field names
        })
        setErrors(newErrors)
      } else {
        successUpdate({ status: 'failed', message: 'Please check the form input.' })
      }
    } catch (error) {
      console.error('Error fetching data:', error)
    }
  }

  useEffect(() => {
    if (rowData) {
      setDataFormCategory({
        name: rowData.name || '',
        description: rowData.description || ''
      })
    }
  }, [rowData])

  const handleCloseThisModal = () => {
    setDataFormCategory({})
    handleClose()
  }

  return (
    <div>
      <Modal
        aria-labelledby='transition-modal-title'
        aria-describedby='transition-modal-description'
        open={open}
        onClose={handleCloseThisModal}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{
          backdrop: {
            timeout: 600
          }
        }}
      >
        <Fade in={open}>
          <Box sx={style}>
            <form noValidate autoComplete='off'>
              <div className='p-2'>
                <Typography id='transition-modal-title' variant='h4' component='h2'>
                  {!idCategory ? 'Tambah Kategori' : 'Ubah Kategori'}
                </Typography>
              </div>

              <div className='grid grid-cols-3 gap-4 mb-8 px-3 py-4 rounded-sm'>
                <div className='col-span-3'>
                  <TextField
                    fullWidth
                    size='small'
                    label='Kategori *'
                    name='name' // Add name for controlled input
                    value={dataFormCategory?.name || ''} // Use only dataFormCategory to control the value
                    onChange={handleInput}
                    error={!!errors.name}
                    helperText={errors.name} // Display error message
                  />
                </div>
                <div className='col-span-3'>
                  <TextField
                    fullWidth
                    name='description' // Add name for controlled input
                    label='Deskripsi'
                    multiline
                    rows={2}
                    value={dataFormCategory?.description || ''} // Use only dataFormCategory to control the value
                    onChange={handleInput}
                    error={!!errors.description}
                    helperText={errors.description} // Display error message
                  />
                </div>

                <div className='col-span-1'></div>

                <div className='col-span-1'>
                  <Button fullWidth variant='outlined' color='secondary' type='button' onClick={handleCloseThisModal}>
                    Batal
                  </Button>
                </div>
                <div className='col-span-1'>
                  <Button fullWidth variant='contained' type='button' onClick={e => handleSubmitCategory(e as any)}>
                    {idCategory ? 'Simpan' : 'Tambah'}
                  </Button>
                </div>
              </div>
            </form>
          </Box>
        </Fade>
      </Modal>
    </div>
  )
}

export default FormCategoryModal
