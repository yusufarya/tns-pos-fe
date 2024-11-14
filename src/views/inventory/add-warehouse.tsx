'use client'

import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import AddIcon from '@mui/icons-material/Add'
import React, { useEffect, useState } from 'react'
import FormWarehouseModal from '@/components/modals/form-warehouse'
import CustomSnackBarNotification from '@/components/notification/custom-snackbar-notification'
import { ResponseData, ResponseStatus } from '@/@core/types'
import { useDispatch, useSelector } from 'react-redux'

export default function AddWarehouse() {
  const dispatch = useDispatch()

  const getResponseDataUpdate = useSelector<ResponseData | any>(state => state.responseStatus.status)

  const [openModalCategory, setOpenModalCategory] = useState(false)
  const [isSuccessUpdateInModal, setIsSuccessUpdateInModal] = useState<ResponseStatus | null>(null)
  const [snackBarOpenInModal, setSnackBarOpenInModal] = useState(false)

  const handleClickAddCategory = () => {
    setOpenModalCategory(true) // Open modal when 'Tambah Kategori' is selected
  }

  const CloseModalAddCategory = () => {
    setOpenModalCategory(false)
    // setOpenDeleteCategory(false);
  }

  const successUpdate = (response: ResponseStatus) => {
    setIsSuccessUpdateInModal(response)
  }

  useEffect(() => {
    if (isSuccessUpdateInModal) {
      setSnackBarOpenInModal(true) // Show Snackbar when isSuccessUpdateInModal changes
      // dispatch(setResponseStatus({ status: true, message: 'add warehouse' }));
    }
  }, [isSuccessUpdateInModal])

  const handleCloseSnack = () => {
    setSnackBarOpenInModal(false) // Close the Snackbar
    setIsSuccessUpdateInModal(null) // Reset the response status
  }

  return (
    <React.Fragment>
      {snackBarOpenInModal && (
        <CustomSnackBarNotification
          open={snackBarOpenInModal}
          response={isSuccessUpdateInModal}
          onResponse={setIsSuccessUpdateInModal}
          onClose={handleCloseSnack}
        />
      )}

      <Box sx={{ '& button': { mx: 1 } }}>
        <div>
          <Button variant='contained' color='primary' size='small' onClick={handleClickAddCategory}>
            <AddIcon fontSize='small' /> Tambah Gudang
          </Button>
        </div>
      </Box>
      {openModalCategory && (
        <FormWarehouseModal
          open={openModalCategory}
          handleClose={CloseModalAddCategory}
          successUpdate={successUpdate}
        />
      )}
    </React.Fragment>
  )
}
