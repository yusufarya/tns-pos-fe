'use client'

import { WarehouseResponse } from '@/@core/master-data-types'
import AppService from '@/app/api/services/app-service'
import LoadingPageTitle from '@/components/loading/loading-page-title'
import { setPageName } from '@/store/slices/page-name-slice'
import { ArrowBack, CloudUploadOutlined, Delete, Edit } from '@mui/icons-material'
import {
  Box,
  Button,
  CircularProgress,
  Grid,
  IconButton,
  Menu,
  MenuItem,
  Paper,
  Typography
} from '@mui/material'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import { styled } from '@mui/material/styles'
import ProductInventoryTable from './table-product-inventory'
import LoadingPageList from '@/components/loading/loading-page-list'
import PageTitle from '@/@layouts/components/vertical/PageTitle'
import TransactionList from './transaction-list'

const Item = styled(Paper)(({ theme }) => ({
  minHeight: 330,
  backgroundColor: '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
  ...theme.applyStyles('dark', {
    backgroundColor: '#1A2027'
  })
}))

export default function ViewDetailInventory() {
  const params = useParams<{ id: string }>()
  const id_warehouse = params.id

  const dispatch = useDispatch()
  // set breadcrumps name
  useEffect(() => {
    dispatch(setPageName({ params1: 'Inventory', params2: 'Detail' }))
  }, [dispatch]) // Ensure dispatch is in the dependency array

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [openMore, setOpenMore] = useState<number | null>(null) // Track the row ID for which the menu is open
  const [showData, setShowData] = useState(false)
  const [detailWarehouse, setDetailWarehouse] = useState<WarehouseResponse>()

  useEffect(() => {
    const getDetailWarehouse = async () => {
      try {
        const result = await AppService.serviceGet('api/warehouse/get', { id: id_warehouse })

        // Check if result is successful and has data
        if ('statusCode' in result && result.statusCode === 200 && 'data' in result) {
          setDetailWarehouse(result.data) // Assuming result.data contains the array of products
        } else {
          console.log('Failed to fetch products.')
        }
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }

    getDetailWarehouse()
  }, [])

  console.log(detailWarehouse)

  useEffect(() => {
    setTimeout(() => {
      setShowData(true)
    }, 800)
  }, [])

  const handleClickMore = (event: React.MouseEvent<HTMLElement>, rowId: number) => {
    setAnchorEl(event.currentTarget)
    setOpenMore(rowId) // Set the ID of the clicked row
  }

  const handleCloseMore = () => {
    setAnchorEl(null)
    setOpenMore(null) // Reset the open menu state
  }

  const handleClickArchiveProduct = (id: number, name: string | undefined) => {
    console.log(id)
    // setIdCategory(id);
    // setRowData(rowData);
    // setAction('delete');
    // setOpenDeleteCategory(true); // Open modal when 'Ubah' is selected
    setOpenMore(null) // Reset the open menu state
  }

  return (
    <div className=''>
      {showData && detailWarehouse ? (
        <>
          <PageTitle>
            <div className='grid grid-flow-row-dense grid-cols-2 grid-rows-1 mb-0 rounded-sm'>
              <div className='flex-none'>
                <Typography variant='h4' component='h4' className='p-3'>
                  {detailWarehouse.name}
                </Typography>
              </div>
              <div className='flex justify-end py-3 px-2'>
                <Link href='/inventory'>
                  <Button variant='contained' color='secondary' size='small'>
                    <ArrowBack fontSize='small' />
                    Kembali
                  </Button>
                </Link>
              </div>
            </div>
          </PageTitle>
        </>
      ) : (
        <>
          <Paper sx={{ boxShadow: 'none' }}>
            <LoadingPageTitle />
          </Paper>
          <LoadingPageList />
        </>
      )}

      {showData && detailWarehouse ? (
        <Paper sx={{ boxShadow: 'none' }}>
          <Box sx={{ flexGrow: 1, border: '1px solid #e5e7eb', my: '10px', borderRadius: '4px' }}>
            <div className='flex py-2 w-full border-b border-gray-200 justify-end pt-3'>
              <IconButton
                aria-label='more'
                aria-controls='long-menu'
                aria-haspopup='true'
                onClick={event => handleClickMore(event, detailWarehouse.id)} // Pass detailWarehouse.id to handleClickMore
              >
                <MoreVertIcon />
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                open={openMore === detailWarehouse.id} // Open menu only for the current row
                onClose={handleCloseMore}
                PaperProps={{
                  elevation: 3,
                  style: {
                    borderRadius: 10
                  }
                }}
              >
                <MenuItem>
                  <Link href={`/products/edit/${detailWarehouse.id}`}>
                   <Button color='warning' size='small' variant='text' sx={{padding: 0, margin: 0}}>
                      <Edit style={{ marginRight: 8 }} />
                      Ubah
                   </Button>
                  </Link>
                </MenuItem>
                <MenuItem onClick={() => handleClickArchiveProduct(detailWarehouse.id, detailWarehouse.name)}>
                  <Button color='error' size='small' variant='text' sx={{padding: 0, margin: 0}}>
                    <Delete style={{ marginRight: 8 }} />
                    Arsipkan
                  </Button>
                </MenuItem>
              </Menu>
            </div>

            <Grid container spacing={2} className='p-3'>
              <Grid item xs={5}>
                <Item sx={{ padding: 2, border: 'none', boxShadow: 'none' }}>
                  <Box className='border-dashed border-2 border-gray-300 rounded-lg py-3'>
                    <CloudUploadOutlined style={{ fontSize: 60, color: '#4A90E2' }} />
                    <Typography className='text-blue-600 font-semibold mt-2'>Unggah Gambar Gudang Anda</Typography>
                    <Typography className='text-gray-500 mt-1'>(Maks Ukuran Attachment 10 MB)</Typography>
                    <Button variant='contained' color='primary' className='my-4' size='small'>
                      Pilih Gambar
                    </Button>
                  </Box>
                </Item>
              </Grid>
              <Grid item xs={7}>
                <Item sx={{ py: 2, border: 'none', boxShadow: 'none' }}>
                  <Box className='flex items-center p-4 rounded-lg shadow-xs mb-5 mx-3 px-5'>
                    <Box className='w-8 h-8 bg-green-500 rounded-full mr-3' />
                    <div>
                      <Typography className='font-bold text-lg text-start'>6.203</Typography>
                      <Typography className='text-gray-500 text-sm'>Total Stok</Typography>
                    </div>
                  </Box>

                  <Box className='flex items-center p-4 rounded-lg shadow-xs mb-5 mx-3 px-5'>
                    <Box className='w-8 h-8 bg-yellow-400 rounded-full mr-3' />
                    <div>
                      <Typography className='font-bold text-lg text-start'>8.117.971</Typography>
                      <Typography className='text-gray-500 text-sm'>Total Nilai Produk</Typography>
                    </div>
                  </Box>

                  <Box className='flex items-center p-4 rounded-lg shadow-xs mb-5 mx-3 px-5'>
                    <Box className='w-8 h-8 bg-red-500 rounded-full mr-3' />
                    <div>
                      <Typography className='font-bold text-lg text-start'>1.309</Typography>
                      <Typography className='text-gray-500 text-sm'>Rata-Rata HPP</Typography>
                    </div>
                  </Box>
                </Item>
              </Grid>
              <Grid item xs={12}>
                <Item sx={{ px: 2, border: 'none', boxShadow: 'none' }}>
                  <ProductInventoryTable productDetail={detailWarehouse.product_detail} />
                  {/* ! listing transaction transfer warehouse and stock adjustment */}
                  <TransactionList />
                </Item>
              </Grid>
            </Grid>
          </Box>
        </Paper>
      ) : (
        <div className='flex items-center justify-center h-96 bg-gray-50 shadow-md'>
          <CircularProgress />
        </div>
      )}
    </div>
  )
}
