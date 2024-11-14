import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Paper from '@mui/material/Paper'
import { CategoryResponse } from '@/@core/master-data-types'
import { Backdrop, Box, Button, Fade, Modal, Typography } from '@mui/material'
import IconButton from '@mui/material/IconButton'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import { useEffect, useState } from 'react'
import { Add, Delete, Edit } from '@mui/icons-material'
import CloseIcon from '@mui/icons-material/Close'
import FormCategoryModal from '@/components/modals/form-category'
import DeleteCategoryModal from '@/components/modals/delete-category'
import AppService from '@/app/api/services/app-service'
import { useDispatch, useSelector } from 'react-redux'
import { ResponseData, ResponseStatus } from '@/@core/types'
import CustomSnackBarNotification from '@/components/notification/custom-snackbar-notification'
import { setResponseStatus } from '@/store/slices/response-status-slice'

const style = {
  width: '100%',
  minWidth: '500px',
  maxWidth: '60%',
  position: 'absolute',
  top: '45%',
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
  handleClose: () => void
  // categoriesData: CategoryResponse[];
}

const CategoriesTable: React.FC<FormCategoryModalProps> = ({ open, handleClose }) => {
  const dispatch = useDispatch()

  const getResponseDataUpdate = useSelector<ResponseData | any>(state => state.responseStatus.status)

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [openMore, setOpenMore] = useState<number | null>(null) // Track the row ID for which the menu is open
  const [action, setAction] = useState<string>('')
  const [idCategory, setIdCategory] = useState<number>()
  const [rowData, setRowData] = useState<CategoryResponse>()
  const [openModalCategory, setOpenModalCategory] = useState(false)
  const [openDeleteCategory, setOpenDeleteCategory] = useState(false)
  const [categoriesData, setCategoriesData] = useState<CategoryResponse[]>([])
  const [error, setError] = useState<string | null>(null)
  const [isSuccessUpdateInModal, setIsSuccessUpdateInModal] = useState<ResponseStatus | null>(null)
  const [category, setCategory] = useState<string>('')
  const [snackBarOpenInModal, setSnackBarOpenInModal] = useState(false)

  useEffect(() => {
    const getDataCategory = async () => {
      try {
        const result = await AppService.serviceGet('api/all-category')

        // Check if result is successful and has data
        if ('statusCode' in result && result.statusCode === 200 && 'data' in result) {
          setCategoriesData(result.data) // Assuming result.data contains the array of products
        } else {
          setError('Failed to fetch products.')
        }
      } catch (error) {
        console.error('Error fetching data:', error)
        setError('Failed to fetch products.')
      }
    }

    getDataCategory()
  }, [isSuccessUpdateInModal])

  const handleCloseThisModal = () => {
    handleClose()
  }

  const handleClickMore = (event: React.MouseEvent<HTMLElement>, rowId: number) => {
    setAnchorEl(event.currentTarget)
    setOpenMore(rowId) // Set the ID of the clicked row
  }

  const handleCloseMore = () => {
    setAnchorEl(null)
    setOpenMore(null) // Reset the open menu state
  }

  const handleClickAddCategory = () => {
    setAction('add')
    setIdCategory(undefined)
    setRowData(undefined)
    setOpenModalCategory(true) // Open modal when 'Tambah Kategori' is selected
  }

  const handleClickEditCategory = (id: number, rowData: CategoryResponse | undefined) => {
    console.log(id)
    console.log(rowData)
    setIdCategory(id)
    setRowData(rowData)
    setAction('edit')
    setOpenModalCategory(true) // Open modal when 'Ubah' is selected
    setOpenMore(null) // Reset the open menu state
  }

  const handleClickDeleteCategory = (id: number, rowData: CategoryResponse | undefined) => {
    console.log(id)
    setIdCategory(id)
    setRowData(rowData)
    setAction('delete')
    setOpenDeleteCategory(true) // Open modal when 'Ubah' is selected
    setOpenMore(null) // Reset the open menu state
  }

  const CloseModalAddCategory = () => {
    setOpenModalCategory(false)
    setOpenDeleteCategory(false)
  }

  const successUpdate = (response: ResponseStatus) => {
    setIsSuccessUpdateInModal(response)
  }

  const responseAddCategory = (response: CategoryResponse) => {
    setCategory(String(response.id))
  }

  useEffect(() => {
    if (isSuccessUpdateInModal) {
      setSnackBarOpenInModal(true) // Show Snackbar when isSuccessUpdateInModal changes
      // dispatch(setResponseStatus({ status: false, message: null }));
    }
  }, [isSuccessUpdateInModal])

  const handleCloseSnack = () => {
    setSnackBarOpenInModal(false) // Close the Snackbar
    setIsSuccessUpdateInModal(null) // Reset the response status
  }

  console.log('isSuccessUpdateInModal : ', isSuccessUpdateInModal)
  console.log('snackBarOpenInModal : ', snackBarOpenInModal)

  return (
    <div>
      {snackBarOpenInModal && (
        <CustomSnackBarNotification
          open={snackBarOpenInModal}
          response={isSuccessUpdateInModal}
          onResponse={setIsSuccessUpdateInModal}
          onClose={handleCloseSnack}
        />
      )}

      <Modal
        aria-labelledby='transition-modal-title'
        aria-describedby='transition-modal-description'
        open={open}
        onClose={handleCloseThisModal}
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
            <Box
              sx={{
                position: 'absolute',
                top: 5,
                right: 4,
                color: '#000',
                padding: '3px 8px 2px 8px',
                cursor: 'pointer',
                borderRadius: '50%',
                transition: 'background-color 0.3s',
                '&:hover': {
                  backgroundColor: '#f0f0f0'
                }
              }}
              onClick={handleCloseThisModal}
            >
              <CloseIcon fontSize='small' color='inherit' />
            </Box>
            <Typography variant='h5' className='mb-3'>
              Data Kategori
            </Typography>
            <div style={{ maxHeight: '400px', overflow: 'auto' }}>
              <TableContainer component={Paper}>
                <Table stickyHeader aria-label='sticky table' size='small'>
                  <TableHead>
                    <TableRow>
                      <TableCell>Nama Kategori</TableCell>
                      <TableCell>Keterangan</TableCell>
                      <TableCell align='center' width={10}></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {categoriesData.length > 0 ? (
                      categoriesData.map(row => (
                        <TableRow key={row.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                          <TableCell width={200}>{row.name}</TableCell>
                          <TableCell>{row.description || '-'}</TableCell>
                          <TableCell align='center'>
                            <IconButton
                              aria-label='more'
                              aria-controls='long-menu'
                              aria-haspopup='true'
                              onClick={event => handleClickMore(event, row.id)} // Pass row.id to handleClickMore
                            >
                              <MoreVertIcon />
                            </IconButton>
                            <Menu
                              anchorEl={anchorEl}
                              open={openMore === row.id} // Open menu only for the current row
                              onClose={handleCloseMore}
                              PaperProps={{
                                elevation: 3,
                                style: {
                                  borderRadius: 10
                                }
                              }}
                            >
                              <MenuItem onClick={() => handleClickEditCategory(row.id, row)}>
                                <Edit style={{ marginRight: 8 }} />
                                Ubah
                              </MenuItem>
                              <MenuItem onClick={() => handleClickDeleteCategory(row.id, row)}>
                                <Delete style={{ marginRight: 8 }} />
                                Hapus
                              </MenuItem>
                            </Menu>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={2} align='center'>
                          <span className='text-red-500'>Kategori tidak ditemukan.</span>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </div>
            <div className='float-right mt-5'>
              <Button variant='contained' color='primary' size='small' onClick={handleClickAddCategory}>
                <Add fontSize='small' /> Tambah Data Kategori
              </Button>
            </div>
            {openModalCategory && (
              <FormCategoryModal
                open={openModalCategory}
                idCategory={idCategory}
                rowData={rowData}
                handleClose={CloseModalAddCategory}
                successUpdate={successUpdate}
                responseAddCategory={responseAddCategory}
              />
            )}
            {openDeleteCategory && (
              <DeleteCategoryModal
                open={openDeleteCategory}
                handleClose={CloseModalAddCategory}
                idCategory={idCategory}
                rowData={rowData}
                successUpdate={successUpdate}
              />
            )}
          </Box>
        </Fade>
      </Modal>
    </div>
  )
}

export default CategoriesTable
