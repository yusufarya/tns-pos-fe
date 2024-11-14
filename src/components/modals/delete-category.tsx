import React, { useState } from 'react'
import Backdrop from '@mui/material/Backdrop'
import Box from '@mui/material/Box'
import Modal from '@mui/material/Modal'
import Fade from '@mui/material/Fade'
import Typography from '@mui/material/Typography'
import { Button } from '@mui/material'
import { ResponseStatus } from '@/@core/types'
import AppService from '@/app/api/services/app-service'
import { CategoryResponse } from '@/@core/master-data-types'

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

interface DeleteCategoryModalProps {
  open: boolean
  idCategory?: number | undefined
  rowData?: CategoryResponse | undefined
  handleClose: () => void
  successUpdate: (response: ResponseStatus) => void // Updated to callback
}

const DeleteCategoryModal: React.FC<DeleteCategoryModalProps> = ({
  open,
  idCategory,
  rowData,
  handleClose,
  successUpdate // Receive the callback
}) => {
  const [loading, setLoading] = useState(false)

  // Function to handle delete operation
  const handleDeleteCategory = async () => {
    if (!idCategory) return
    setLoading(true)

    try {
      const response = await AppService.serviceDelete('api/category/delete', { id: idCategory })
      if (response.statusCode === 200) {
        const successResponse: ResponseStatus = { status: 'success', message: 'Berhasil menghapus kategori' }
        console.log(successResponse) // Trigger the success callback
        successUpdate(successResponse) // Trigger the success callback
      } else {
        const errorResponse: ResponseStatus = { status: 'failed', message: 'Gagal menghapus data' }
        successUpdate(errorResponse) // Trigger the success callback
      }
    } catch (error) {
      console.error('Error deleting category:', error)
      const errorResponse: ResponseStatus = { status: 'failed', message: 'Error deleting category' }
      successUpdate(errorResponse) // Trigger the success callback
    } finally {
      setLoading(false)
      handleClose() // Close the modal
    }
  }

  return (
    <>
      {/* Modal for confirming deletion */}
      <Modal
        aria-labelledby='delete-category-modal-title'
        aria-describedby='delete-category-modal-description'
        open={open}
        onClose={handleClose}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{
          backdrop: {
            timeout: 1000
          }
        }}
      >
        <Fade in={open}>
          <Box sx={style}>
            <Typography id='delete-category-modal-title' variant='h6' component='h2'>
              Hapus kategori
            </Typography>
            <Typography id='delete-category-modal-description' sx={{ mt: 2 }}>
              Anda yakin ingin menghapus kategori <strong>{rowData?.name}</strong>?
            </Typography>
            <Box mt={4} display='flex' justifyContent='flex-end' gap={2}>
              <Button variant='outlined' onClick={handleClose} color='secondary' disabled={loading}>
                Batal
              </Button>
              <Button variant='contained' color='error' onClick={handleDeleteCategory} disabled={loading}>
                {loading ? 'Menghapus...' : 'Ya, Hapus'}
              </Button>
            </Box>
          </Box>
        </Fade>
      </Modal>
    </>
  )
}

export default DeleteCategoryModal
