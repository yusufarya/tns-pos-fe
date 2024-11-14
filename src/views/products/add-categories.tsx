'use client'

import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import AddIcon from '@mui/icons-material/Add'
import React, { useState } from 'react'
import CategoriesTable from './table-categories'

export default function AddCategories() {
  const [openModalCategory, setOpenModalCategory] = useState(false)

  const handleClickAddCategory = () => {
    setOpenModalCategory(true) // Open modal when 'Tambah Kategori' is selected
  }

  const handleModalClose = () => {
    setOpenModalCategory(false)
  }

  return (
    <React.Fragment>
      <Box sx={{ '& button': { mx: 1 } }}>
        <div>
          <Button variant='outlined' color='success' size='small' onClick={handleClickAddCategory}>
            <AddIcon fontSize='small' /> Kategori
          </Button>
        </div>
      </Box>
      <CategoriesTable open={openModalCategory} handleClose={handleModalClose} />
    </React.Fragment>
  )
}
