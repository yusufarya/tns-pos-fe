import React, { useState } from 'react'
import Backdrop from '@mui/material/Backdrop'
import Box from '@mui/material/Box'
import Modal from '@mui/material/Modal'
import Fade from '@mui/material/Fade'
import Typography from '@mui/material/Typography'
import { Button, TextField } from '@mui/material'
import { ResponseStatus } from '@/@core/types'
import AppService from '@/app/api/services/app-service'
import { useDispatch, useSelector } from 'react-redux'
import { setResponseStatus } from '@/store/slices/response-status-slice'
import { UnitResponse } from '@/@core/master-data-types'

const style = {
  width: '100%', // Adjust width as needed (e.g., '400px', '50%', etc.)
  maxWidth: '600px', // Optional max width
  maxHeight: '310px', // Adjust height as needed
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

// Define the props interface for open and handleClose
interface FormUnitModalProps {
  open: boolean
  handleClose: () => void
  successUpdate: (response: ResponseStatus) => void // Updated to callback
  responseAddUnit: (response: UnitResponse) => any // Updated to callback
}

const FormUnitModal: React.FC<FormUnitModalProps> = ({
  open,
  handleClose,
  successUpdate, // Receive the callback
  responseAddUnit // Receive the callback
}) => {
  const dispatch = useDispatch()

  const getUser: any = useSelector<any>(state => state.user.user)

  const [dataForm, setDataForm] = useState<{ initial?: string; name?: string }>({})

  const handleInput = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setDataForm({ ...dataForm, [e.target.name]: e.target.value })
  }

  const handleSubmitModalUnit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    console.log('=== SUBMIT UNIT ===')
    const categoryData = {
      ...dataForm,
      // Assuming you have a way to get username, you might need to define it
      is_active: 'Y',
      username: getUser.data.username
    }

    try {
      const response = await AppService.servicePost('api/unit/create', categoryData)
      console.log(response)
      if (response.statusCode === 200) {
        responseAddUnit(response.data)
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
                Tambah Satuan
              </Typography>
            </div>

            <div className='grid grid-cols-3 gap-4 mb-8 px-3 py-4 rounded-sm'>
              <div className='col-span-3'>
                <TextField
                  fullWidth
                  size='small'
                  label='Inisial *'
                  id='outlined-size-small'
                  placeholder='Pcs'
                  name='initial' // Add name for controlled input
                  value={dataForm.initial || ''} // Controlled input
                  onChange={handleInput}
                />
              </div>
              <div className='col-span-3'>
                <TextField
                  fullWidth
                  size='small'
                  label='Nama Satuan *'
                  id='outlined-size-small'
                  placeholder='Pieces'
                  name='name' // Add name for controlled input
                  value={dataForm.name || ''} // Controlled input
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
                <Button fullWidth variant='contained' type='button' onClick={e => handleSubmitModalUnit(e as any)}>
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

export default FormUnitModal
