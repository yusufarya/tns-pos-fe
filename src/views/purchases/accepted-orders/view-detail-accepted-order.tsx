'use client'

import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { useParams, useRouter } from 'next/navigation'
import PageTitle from '@/@layouts/components/vertical/PageTitle'
import AppService from '@/app/api/services/app-service'
import LoadingPageList from '@/components/loading/loading-page-list'
import LoadingPageTitle from '@/components/loading/loading-page-title'
import { setPageName } from '@/store/slices/page-name-slice'
import { ArrowBack, Delete, Edit } from '@mui/icons-material'
import { Box, Button, Divider, IconButton, List, ListItem, Menu, MenuItem, Paper, Typography } from '@mui/material'
import Link from 'next/link'
import dayjs from 'dayjs'
import { AcceptedOrderType } from '@/@core/accepted-data-types'
import FormaterHelper from '@/@core/utils/formatHelper'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import AddIcon from '@mui/icons-material/Add'
import PrintIcon from '@mui/icons-material/Print'
import ViewAddDetailAcceptedOrder from './view-add-detail-accepted-order'
import DetailItemsPurchaseOrder from './view-detail-item-accepted-order'

const ViewAcceptedOrderDetail = () => {
  const params = useParams()
  const number = params.number

  const router = useRouter()

  const dispatch = useDispatch()
  // set breadcrumps name
  useEffect(() => {
    dispatch(setPageName({ params1: 'Penerimaan Pesanan', params2: 'Detail' }))
  }, [dispatch]) // Ensure dispatch is in the dependency array

  const [showData, setShowData] = useState(false)
  const [detailAcceptedOrder, setDetailAcceptedOrder] = useState<AcceptedOrderType>()
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [openMore, setOpenMore] = useState<string | null>(null) // Track the row ID for which the menu is open

  useEffect(() => {
    const getAcceptedOrder = async () => {
      try {
        const result = await AppService.serviceGet('api/accepted-order/get', { number: number, get_type: 'ao' })
        // Check if result is successful and has data
        if ('statusCode' in result && result.statusCode === 200 && 'data' in result) {
          setDetailAcceptedOrder(result.data) // Assuming result.data contains the array of data
        } else {
          console.log('Failed to fetch data.')
        }
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }

    getAcceptedOrder()
  }, [])

  useEffect(() => {
    setTimeout(() => {
      setShowData(true)
    }, 800)
  }, [])

  const handleClickMore = (event: React.MouseEvent<HTMLElement>, rowId: string) => {
    setAnchorEl(event.currentTarget)
    setOpenMore(rowId) // Set the ID of the clicked row
  }

  const handleCloseMore = () => {
    setAnchorEl(null)
    setOpenMore(null) // Reset the open menu state
  }

  const handleClickArchiveProduct = (id: string, name: string | undefined) => {
    console.log(id)
    // setIdCategory(id);
    // setRowData(rowData);
    // setAction('delete');
    // setOpenDeleteCategory(true); // Open modal when 'Ubah' is selected
    setOpenMore(null) // Reset the open menu state
  }

  return (
    <div>
      {showData && detailAcceptedOrder ? (
        <>
          <PageTitle>
            <div className='grid grid-flow-row-dense grid-cols-2 grid-rows-1 mb-0 rounded-sm px-2'>
              <div className='flex-none'>
                <Typography variant='h4' component='h4' className='p-3'>
                  Penerimaan Pesanan {detailAcceptedOrder.number}
                </Typography>
              </div>
              <div className='flex justify-end py-3 px-2'>
                <Link href={`/purchases/accepted-orders`}>
                  <Button variant='contained' color='secondary' size='small'>
                    <ArrowBack fontSize='small' />
                    Kembali
                  </Button>
                </Link>
              </div>
            </div>
          </PageTitle>

          <Paper className='w-full' sx={{ boxShadow: 'none' }}>
            <Box sx={{ boxShadow: 'none', p: 3 }}>
              <div className='grid grid-cols-4 gap-4 mb-8 px-4 py-3 rounded-sm border border-gray-200'>
                <div className='col-span-4 mb-3 border-b border-gray-200'>
                  <div className='grid grid-cols-4 gap-2 mb-2'>
                    <div className='col-span-1'>
                      <Button variant='text' color={detailAcceptedOrder.status_id == 2 ? 'success' : 'secondary'}>
                        {detailAcceptedOrder.status}
                      </Button>
                    </div>
                    <div className='col-span-1'></div>
                    <div className='col-span-2'>
                      <div className='flex gap-2 justify-end'>
                        <Button size='small' variant='outlined' color='secondary' className='mt-0.5 px-3 h-8 text-xs'>
                          <PrintIcon fontSize='small' className='me-1' /> Print
                        </Button>
                        <Button
                          size='small'
                          variant='contained'
                          onClick={() => router.push(`/purchases/purchase-invoices/add/${detailAcceptedOrder.number}`)}
                          className='mt-0.5 px-3 h-8 text-xs'
                        >
                          <AddIcon fontSize='small' className='me-1' /> Buat Tagihan Pembelian
                        </Button>
                        <IconButton
                          aria-label='more'
                          aria-controls='long-menu'
                          aria-haspopup='true'
                          onClick={event => handleClickMore(event, detailAcceptedOrder.number)}
                        >
                          <MoreVertIcon />
                        </IconButton>
                        <Menu
                          anchorEl={anchorEl}
                          open={openMore === detailAcceptedOrder.number} // Open menu only for the current row
                          onClose={handleCloseMore}
                          PaperProps={{
                            elevation: 3,
                            style: {
                              borderRadius: 10
                            }
                          }}
                        >
                          <MenuItem>
                            <Link href={`/purchases/accepted-orders/edit/${detailAcceptedOrder.number}`}>
                              <Button color='warning' size='small' variant='text' sx={{ padding: 0, margin: 0 }}>
                                <Edit style={{ marginRight: 8 }} fontSize='small' />
                                Ubah
                              </Button>
                            </Link>
                          </MenuItem>
                          <MenuItem
                            onClick={() =>
                              handleClickArchiveProduct(detailAcceptedOrder.number, detailAcceptedOrder.ref)
                            }
                          >
                            <Button color='error' size='small' variant='text' sx={{ padding: 0, margin: 0 }}>
                              <Delete style={{ marginRight: 8 }} fontSize='small' />
                              Arsipkan
                            </Button>
                          </MenuItem>
                        </Menu>
                      </div>
                    </div>
                  </div>
                </div>
                <div className='col-span-2 mb-3'>
                  <Typography variant='body2' className='mb-1'>
                    Nomor Transaksi
                  </Typography>
                  <div className='text-base font-semibold'>{detailAcceptedOrder.number}</div>
                </div>
                <div className='col-span-2 mb-3'>
                  <Typography variant='body2' className='mb-1'>
                    Vendor
                  </Typography>
                  <div className='text-base font-semibold'>{detailAcceptedOrder.vendor_name}</div>
                </div>
                <div className='col-span-2 mb-3'>
                  <Typography variant='body2' className='mb-1'>
                    Tanggal Transaksi
                  </Typography>
                  <div className='text-base font-semibold'>{dayjs(detailAcceptedOrder.date).format('DD/MM/YYYY')}</div>
                </div>
                <div className='col-span-2 mb-3'>
                  <Typography variant='body2' className='mb-1'>
                    Referensi
                  </Typography>
                  <div className='text-base font-semibold'>{detailAcceptedOrder.ref || '-'}</div>
                </div>

                <div className='col-span-4'>
                  <DetailItemsPurchaseOrder detailItems={detailAcceptedOrder} />
                  <div className='grid grid-cols-4 gap-1 my-2 w-full'>
                    <div className='col-span-2'></div>
                    <div className='col-span-1'>
                      <List>
                        <ListItem sx={{ borderBottom: '1px solid #eaeaea', width: '100%' }}>
                          <Typography className='font-bold text-right'>Sub Total</Typography>
                        </ListItem>
                        {detailAcceptedOrder.total_discount > 0 && (
                          <ListItem sx={{ borderBottom: '1px solid #eaeaea', width: '100%' }}>
                            <Typography className='font-bold text-right'>Diskon Tambahan</Typography>
                          </ListItem>
                        )}
                        <ListItem sx={{ borderBottom: '1px solid #eaeaea', width: '100%' }}>
                          <Typography className='font-bold text-right'>Grand Total</Typography>
                        </ListItem>
                      </List>
                    </div>
                    <div className='col-span-1'>
                      <List>
                        <ListItem sx={{ borderBottom: '1px solid #eaeaea', width: '100%' }}>
                          <Typography className='font-bold text-right'>
                            {FormaterHelper.formatRupiah(String(detailAcceptedOrder.total_price))}
                          </Typography>
                        </ListItem>
                        {detailAcceptedOrder.total_discount > 0 && (
                          <ListItem sx={{ borderBottom: '1px solid #eaeaea', width: '100%' }}>
                            <Typography className='font-bold text-right me-5'>
                              {detailAcceptedOrder.total_discount > 0
                                ? `${(detailAcceptedOrder.total_discount / detailAcceptedOrder.total_price) * 100}%`
                                : '0%'}
                            </Typography>
                            <Typography className='font-bold text-right'>
                              {FormaterHelper.formatRupiah(String(detailAcceptedOrder.total_discount))}
                            </Typography>
                          </ListItem>
                        )}
                        <ListItem sx={{ borderBottom: '1px solid #eaeaea', width: '100%' }}>
                          <Typography className='font-bold text-right'>
                            {FormaterHelper.formatRupiah(String(detailAcceptedOrder.grand_total))}
                          </Typography>
                        </ListItem>
                      </List>
                    </div>
                  </div>
                </div>
              </div>
            </Box>
          </Paper>
        </>
      ) : (
        <Paper sx={{ boxShadow: 'none' }}>
          <LoadingPageTitle />
          <Divider />
          <br />
          <LoadingPageList />
          <LoadingPageList />
        </Paper>
      )}
    </div>
  )
}

export default ViewAcceptedOrderDetail
