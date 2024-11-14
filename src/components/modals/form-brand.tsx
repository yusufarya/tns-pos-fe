import React, { useState } from 'react'
import Backdrop from '@mui/material/Backdrop'
import Box from '@mui/material/Box'
import Modal from '@mui/material/Modal'
import Fade from '@mui/material/Fade'
import Typography from '@mui/material/Typography'
import { Button, TextField } from '@mui/material'
import { Add, Save } from '@mui/icons-material'
import { ResponseStatus } from '@/@core/types'
import AppService from '@/app/api/services/app-service'
import { useDispatch, useSelector } from 'react-redux'
import { setResponseStatus } from '@/store/slices/response-status-slice'
import { BrandResponse } from '@/@core/master-data-types'

const style = {
  width: '100%',
  maxWidth: '600px',
  maxHeight: '310px',
  position: 'absolute',
  top: '200px',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  bgcolor: 'background.paper',
  border: '1px solid #fafafa',
  boxShadow: 24,
  p: 4,
  borderRadius: '4px'
}

interface FormBrandModalProps {
  open: boolean
  handleClose: () => void
  successUpdate: (response: ResponseStatus) => void // Updated to callback
  responseAddBrand: (response: BrandResponse) => void
}

const FormBrandModal: React.FC<FormBrandModalProps> = ({ open, handleClose, successUpdate, responseAddBrand }) => {
  const dispatch = useDispatch()

  const getUser: any = useSelector<any>(state => state.user.user)

  const [dataForm, setDataForm] = useState<{ name?: string; description?: string }>({})

  const handleInput = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setDataForm({ ...dataForm, [e.target.name]: e.target.value })
  }

  const handleSubmitModalBrand = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    event.stopPropagation() // Prevent bubbling

    console.log('=== SUBMIT ===')
    const brandData = {
      ...dataForm,
      // Assuming you have a way to get username, you might need to define it
      is_active: 'Y',
      username: getUser.data.username
    }

    try {
      const response = await AppService.servicePost('api/brand/create', brandData)
      console.log(response)
      if (response.statusCode === 200) {
        responseAddBrand(response.data)
        successUpdate({ status: 'success', message: response.message })
        dispatch(setResponseStatus({ status: true, message: 'Berhasil' }))
      } else {
        successUpdate({ status: 'failed', message: 'Please check the form input.' })
      }
      handleClose()
    } catch (error) {
      console.error('Error fetching data:', error)
    }
  }

  const handleModalClose = () => {
    setDataForm({})
    handleClose()
  }

  return (
    <Modal
      aria-labelledby='transition-modal-title'
      aria-describedby='transition-modal-description'
      open={open}
      onClose={handleModalClose}
      closeAfterTransition
      slots={{ backdrop: Backdrop }}
      slotProps={{
        backdrop: {
          timeout: 500
        }
      }}
    >
      <Fade in={open}>
        <Box sx={style}>
          <form noValidate autoComplete='off'>
            <div className='p-2'>
              <Typography id='transition-modal-title' variant='h4' component='h2'>
                Tambah Merek
              </Typography>
            </div>

            <div className='grid grid-cols-3 gap-4 mb-8 px-3 py-4 rounded-sm'>
              <div className='col-span-3'>
                <TextField
                  fullWidth
                  size='small'
                  label='Nama Merek *'
                  name='name' // Add name for controlled input
                  value={dataForm.name || ''} // Controlled input
                  onChange={handleInput}
                />
              </div>
              <div className='col-span-3'>
                <TextField
                  fullWidth
                  name='description' // Add name for controlled input
                  label='Deskripsi'
                  multiline
                  rows={2}
                  value={dataForm.description || ''} // Controlled input
                  onChange={handleInput}
                />
              </div>

              <div className='col-span-1'></div>

              <div className='col-span-1'>
                <Button fullWidth variant='outlined' color='secondary' type='button' onClick={handleModalClose}>
                  Batal
                </Button>
              </div>
              <div className='col-span-1'>
                <Button fullWidth variant='contained' type='button' onClick={e => handleSubmitModalBrand(e as any)}>
                  Tambah
                </Button>
              </div>
            </div>
          </form>
        </Box>
      </Fade>
    </Modal>
  )
}

export default FormBrandModal
