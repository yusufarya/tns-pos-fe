'use client'

import { ProductResponse } from '@/@core/master-data-types'
import AppService from '@/app/api/services/app-service'
import { setPageName } from '@/store/slices/page-name-slice'
import { ArrowBack, Delete, Edit } from '@mui/icons-material'
import {
  Box,
  Button,
  ButtonGroup,
  CircularProgress,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Menu,
  MenuItem,
  Paper,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableRow,
  Typography
} from '@mui/material'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { styled } from '@mui/material/styles'
import Grid from '@mui/material/Grid'
import ChartDetailProductMonthly from './detail-product-chart-m'
import ChartDetailProductDaily from './detail-product-chart-d'
import ChartDetailProductYearly from './detail-product-chart-y'
import AddIcon from '@mui/icons-material/Add'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import WarehouseInfoChart from './warehouse-product-chart'
import LoadingPageTitle from '@/components/loading/loading-page-title'
import LoadingPageList from '@/components/loading/loading-page-list'
import PageTitle from '@/@layouts/components/vertical/PageTitle'
import FormaterHelper from '@/@core/utils/formatHelper'

const Item = styled(Paper)(({ theme }) => ({
  minHeight: 600,
  backgroundColor: '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
  ...theme.applyStyles('dark', {
    backgroundColor: '#1A2027'
  })
}))

export default function ViewDetailProduct() {
  const router = useRouter()

  const params = useParams<{ id: string }>()
  const id_product = params.id

  const dispatch = useDispatch()
  // set breadcrumps name
  useEffect(() => {
    dispatch(setPageName({ params1: 'Produk', params2: 'Detail' }))
  }, [dispatch]) // Ensure dispatch is in the dependency array

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [openMore, setOpenMore] = useState<number | null>(null) // Track the row ID for which the menu is open
  const [showData, setShowData] = useState(false)
  const [detailProduct, setDetailProduct] = useState<ProductResponse>()

  useEffect(() => {
    const getDetailProduct = async () => {
      try {
        const result = await AppService.serviceGet('api/product/get', { id: id_product })

        // Check if result is successful and has data
        if ('statusCode' in result && result.statusCode === 200 && 'data' in result) {
          setDetailProduct(result.data) // Assuming result.data contains the array of products
        } else {
          console.log('Failed to fetch products.')
        }
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }

    getDetailProduct()
  }, [])

  useEffect(() => {
    setTimeout(() => {
      setShowData(true)
    }, 800)
  }, [])

  const [selectedChart, setSelectedChart] = useState<string>('m')

  const handleTypeChart = (type: string) => {
    setSelectedChart(type)
  }

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
      {showData && detailProduct ? (
        <>
          <PageTitle>
            <div className='grid grid-flow-row-dense grid-cols-2 grid-rows-1 mb-0 rounded-sm'>
              <div className='flex-none'>
                <Typography variant='h4' component='h4' className='p-3'>
                  {detailProduct.name}
                </Typography>
              </div>
              <div className='flex justify-end py-3 px-2'>
                <Link href='/products'>
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
          <LoadingPageTitle />
          <LoadingPageList />
        </>
      )}

      {showData && detailProduct ? (
        <Paper>
          <Box sx={{ flexGrow: 1, border: '1px solid #e5e7eb', my: '10px', borderRadius: '4px' }}>
            <div className=''>
              <div className='flex py-2 w-full border-b border-gray-200 justify-end pt-3'>
                <Link href={`/inventory/${detailProduct.id}/stock-adjustment/add`} className='p-0'>
                  <Button variant='outlined' size='small' color='info'>
                    <AddIcon fontSize='small' /> Penyesuaian Stok
                  </Button>
                </Link>
                <IconButton
                  aria-label='more'
                  aria-controls='long-menu'
                  aria-haspopup='true'
                  onClick={event => handleClickMore(event, detailProduct.id)} // Pass detailProduct.id to handleClickMore
                >
                  <MoreVertIcon />
                </IconButton>
                <Menu
                  anchorEl={anchorEl}
                  open={openMore === detailProduct.id} // Open menu only for the current row
                  onClose={handleCloseMore}
                  PaperProps={{
                    elevation: 3,
                    style: {
                      borderRadius: 10
                    }
                  }}
                >
                  <MenuItem>
                    <Link href={`/products/edit/${detailProduct.id}`}>
                      <Button color='warning' size='small' variant='text' sx={{padding: 0, margin: 0}}>
                        <Edit style={{ marginRight: 8 }} fontSize='small' />
                        Ubah
                      </Button>
                    </Link>
                  </MenuItem>
                  <MenuItem onClick={() => handleClickArchiveProduct(detailProduct.id, detailProduct.name)}>
                    <Button color='error' size='small' variant='text' sx={{padding: 0, margin: 0}}>
                      <Delete style={{ marginRight: 8 }} fontSize='small' />
                      Arsipkan
                    </Button>
                  </MenuItem>
                </Menu>
              </div>
              <Grid container spacing={2}>
                <Grid item xs={9}>
                  <Item sx={{ padding: 0, border: 'none', boxShadow: 'none' }}>
                    <div className='pt-5'>
                      <ButtonGroup variant='text' aria-label='Basic button group' className='mb-5'>
                        <Button
                          variant={selectedChart == 'd' ? 'contained' : 'text'}
                          onClick={() => handleTypeChart('d')}
                        >
                          Harian
                        </Button>
                        <Button
                          variant={selectedChart == 'm' ? 'contained' : 'text'}
                          onClick={() => handleTypeChart('m')}
                        >
                          Bulanan
                        </Button>
                        <Button
                          variant={selectedChart == 'y' ? 'contained' : 'text'}
                          onClick={() => handleTypeChart('y')}
                        >
                          Tahunan
                        </Button>
                      </ButtonGroup>
                    </div>
                    <div className='ms-3'>
                      {selectedChart == 'd' ? (
                        <ChartDetailProductDaily />
                      ) : selectedChart == 'm' ? (
                        <ChartDetailProductMonthly />
                      ) : selectedChart == 'y' ? (
                        <ChartDetailProductYearly />
                      ) : (
                        <></>
                      )}
                    </div>
                    {/* </Item>
                    <Item sx={{padding: 5}}> */}
                    <Grid container spacing={2} className='mt-5 ms-1'>
                      <Grid item xs={7}>
                        <div className='justify-start text-start'>
                          <Typography variant='h5' sx={{ margin: '1px 10px' }}>
                            Lokasi Produk{' '}
                          </Typography>
                          <br />
                          <WarehouseInfoChart />
                        </div>
                      </Grid>
                      <Grid item xs={5}>
                        <nav className='text-left'>
                          <Typography variant='h5' sx={{ margin: '1px 15px' }}>
                            Gudang{' '}
                          </Typography>
                          <br />
                          <List>
                            <ListItem disablePadding>
                              <ListItemButton>
                                <ListItemText primary='Trash' />
                              </ListItemButton>
                            </ListItem>
                            <ListItem disablePadding>
                              <ListItemButton component='a' href='#simple-list'>
                                <ListItemText primary='Spam' />
                              </ListItemButton>
                            </ListItem>
                          </List>
                        </nav>
                      </Grid>
                    </Grid>
                  </Item>
                </Grid>
                <Grid item xs={3}>
                  <Item sx={{ padding: 0, border: 'none', boxShadow: 'none' }}>
                    <div className='justify-start text-left py-3'>
                      <Table size='small'>
                        <TableBody>
                          <TableRow>
                            <TableCell sx={{ width: '100px' }}>
                              <Typography className='text-gray-700'>Kategori</Typography>
                            </TableCell>
                            <TableCell sx={{ width: 5, margin: 0, padding: 0 }}>:</TableCell>
                            <TableCell>
                              <Link href={`/products?category_id=${detailProduct.category_id}`}>
                                <Typography className='text-blue-500'>{detailProduct.category.name}</Typography>
                              </Link>
                            </TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </div>

                    <div className='justify-start text-left py-3'>
                      <Typography variant='h5' sx={{ margin: '1px 10px' }}>
                        Deskripsi
                      </Typography>
                      <Table size='small'>
                        <TableBody>
                          <TableRow>
                            <TableCell>
                              <Typography>{detailProduct.description}</Typography>
                            </TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </div>

                    <div className='justify-start text-left py-3'>
                      <Typography variant='h5' sx={{ margin: '1px 10px' }}>
                        Pembelian
                      </Typography>
                      <Table size='small'>
                        <TableBody>
                          <TableRow>
                            <TableCell sx={{ width: '100px' }}>Harga</TableCell>
                            <TableCell sx={{ width: 5, margin: 0, padding: 0 }}>:</TableCell>
                            <TableCell>
                            <Typography>{FormaterHelper.formatRupiah(String(detailProduct.purchase_price))}</Typography>
                            </TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                      <hr />
                    </div>

                    <div className='justify-start text-left py-3'>
                      <Typography variant='h5' sx={{ margin: '1px 10px' }}>
                        Penjualan
                      </Typography>
                      <Table size='small'>
                        <TableBody>
                          <TableRow>
                            <TableCell sx={{ width: '100px' }}>Harga</TableCell>
                            <TableCell sx={{ width: 5, margin: 0, padding: 0 }}>:</TableCell>
                            <TableCell>
                              <Typography>{FormaterHelper.formatRupiah(String(detailProduct.selling_price))}</Typography>
                            </TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                      <hr />
                    </div>

                    <div className='justify-start text-left py-3'>
                      <Typography variant='h5' sx={{ margin: '1px 10px' }}>
                        Satuan
                      </Typography>
                      <Table size='small'>
                        <TableBody>
                          <TableRow>
                            <TableCell sx={{ width: '100px' }}>Satuan</TableCell>
                            <TableCell sx={{ width: 5, margin: 0, padding: 0 }}>:</TableCell>
                            <TableCell>
                              <Typography>{detailProduct.unit.initial}</Typography>
                            </TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                      <div className='m-2'>
                        <Button size='small' variant='contained'>
                          <AddIcon fontSize='small' className='me-2' /> Konversi Satuan
                        </Button>
                      </div>
                    </div>

                    <div className='justify-start text-left py-3'>
                      <Typography variant='h5' sx={{ margin: '1px 10px' }}>
                        Gudang
                      </Typography>
                      <Table size='small'>
                        <TableBody>
                          {detailProduct?.inventory ? (
                            detailProduct.inventory.map((inventory, index) => (
                              <TableRow key={index}>
                                <TableCell>{inventory.warehouse_name}</TableCell>
                                <TableCell sx={{ width: 5, margin: 0, padding: 0 }}>:</TableCell>
                                <TableCell>
                                  <Typography>{inventory.stock}</Typography>
                                </TableCell>
                              </TableRow>
                            ))
                          ) : (
                            <Typography>No Inventory Available</Typography>
                          )}
                        </TableBody>
                      </Table>
                      <hr />
                    </div>

                  </Item>
                </Grid>
              </Grid>
            </div>
          </Box>
        </Paper>
      ) : (
        <>
          <div className='flex items-center justify-center h-96 bg-gray-50 shadow-md'>
            <CircularProgress />
          </div>
        </>
      )}
    </div>
  )
}
