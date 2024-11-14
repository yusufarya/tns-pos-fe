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
import {
  Box,
  Button,
  DialogTitle,
  DialogActions,
  DialogContentText,
  Dialog,
  Divider,
  IconButton,
  List,
  ListItem,
  Menu,
  MenuItem,
  Paper,
  Tooltip,
  Typography,
  DialogContent
} from '@mui/material'
import Link from 'next/link'
import dayjs from 'dayjs'
import { PurchaseOrderType } from '@/@core/purchase-data-types'
import DetailItemsPurchaseOrder from './view-detail-item-purchase-order'
import FormaterHelper from '@/@core/utils/formatHelper'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import AddIcon from '@mui/icons-material/Add'
import PrintIcon from '@mui/icons-material/Print'
import CustomSnackBarNotification from '@/components/notification/custom-snackbar-notification'
import { ResponseStatus } from '@/@core/types'

const ViewPurchaseOrderDetail = () => {
  const params = useParams()
  const numberTransaction = params.number

  const router = useRouter()

  const dispatch = useDispatch()
  // set breadcrumps name
  useEffect(() => {
    dispatch(setPageName({ params1: 'Pesanan Pembelian', params2: 'Detail' }))
  }, [dispatch]) // Ensure dispatch is in the dependency array

  const [showData, setShowData] = useState(false)
  const [detailPurchaseOrder, setDetailPurchaseOrder] = useState<PurchaseOrderType>()
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [openMore, setOpenMore] = useState<string | null>(null) // Track the row ID for which the menu is open
  const [snackBarOpen, setSnackBarOpen] = useState(false)
  const [isSuccessUpdate, setIsSuccessUpdate] = useState<ResponseStatus | null>(null)
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false)

  useEffect(() => {
    const getDetailPurchaseOrder = async () => {
      try {
        const result = await AppService.serviceGet('api/purchase-order/get', { number: numberTransaction })
        // console.log(result)
        // Check if result is successful and has data
        if ('statusCode' in result && result.statusCode === 200 && 'data' in result) {
          setDetailPurchaseOrder(result.data) // Assuming result.data contains the array of data
        } else {
          setSnackBarOpen(true)
          setIsSuccessUpdate({ status: 'failed', message: 'Transaksi tidak ditemukan' })
          setTimeout(() => {
            router.push('/purchases/purchase-orders')
          }, 3000)
        }
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }

    getDetailPurchaseOrder()
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

  const handleConfirmDelete = async () => {
    setOpenDeleteDialog(false)

    try {
      const result = await AppService.serviceDelete('api/purchase-order/delete', { number: numberTransaction })
      if ('statusCode' in result && result.statusCode === 200) {
        setSnackBarOpen(true)
        setIsSuccessUpdate({ status: 'success', message: 'Transaksi berhasil dihapus' })
        setTimeout(() => {
          router.push('/purchases/purchase-orders')
        }, 1000)
      } else if ('errorData' in result) {
        setSnackBarOpen(true)
        setIsSuccessUpdate({ status: 'failed', message: result.errorData.errors })
      }
    } catch (error) {
      console.error('Error deleting data:', error)
    }
  }

  const handleCloseSnack = () => {
    setSnackBarOpen(false) // Close the Snackbar
  }

  return (
    <div>
      {snackBarOpen && (
        <CustomSnackBarNotification
          open={snackBarOpen}
          response={isSuccessUpdate}
          onClose={handleCloseSnack}
          onResponse={setIsSuccessUpdate}
        />
      )}
      <Dialog
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
        aria-labelledby='delete-dialog-title'
        aria-describedby='delete-dialog-description'
      >
        <DialogTitle id='delete-dialog-title'>Konfirmasi Hapus Transaksi</DialogTitle>
        <DialogContent>
          <DialogContentText id='delete-dialog-description'>
            Apakah Anda yakin ingin menghapus transaksi ini? Data yang telah diisi akan hilang.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteDialog(false)}>Tidak</Button>
          <Button onClick={handleConfirmDelete} color='error' autoFocus>
            Ya, Hapus
          </Button>
        </DialogActions>
      </Dialog>
      {showData && detailPurchaseOrder ? (
        <>
          <PageTitle>
            <div className='grid grid-flow-row-dense grid-cols-2 grid-rows-1 mb-0 rounded-sm px-2'>
              <div className='flex-none'>
                <Typography variant='h4' component='h4' className='p-3'>
                  Pesanan Pembelian {detailPurchaseOrder.number}
                </Typography>
              </div>
              <div className='flex justify-end py-3 px-2'>
                <Link href={`/purchases/purchase-orders`}>
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
                      <Button variant='text' color={detailPurchaseOrder.status_id == 2 ? 'success' : 'secondary'}>
                        {detailPurchaseOrder.status}
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
                          onClick={() => router.push(`/purchases/purchase-invoice/add/${detailPurchaseOrder.number}`)}
                          className='mt-0.5 px-3 h-8 text-xs'
                        >
                          <AddIcon fontSize='small' className='me-1' /> Buat Tagihan Pembelian
                        </Button>
                        {detailPurchaseOrder.status_id != 6 && (
                          <Button
                            size='small'
                            variant='outlined'
                            onClick={() => router.push(`/purchases/accepted-orders/add/${detailPurchaseOrder.number}`)}
                            color='success'
                            className='mt-0.5 px-3 h-8 text-xs'
                          >
                            <AddIcon fontSize='small' className='me-1' /> Buat Pengiriman Pembelian
                          </Button>
                        )}
                        <Tooltip
                          title={
                            detailPurchaseOrder.status_id >= 4 ? 'Tidak dapat mengubah pesanan yang sudah diproses' : ''
                          }
                          placement='top'
                          arrow
                        >
                          <IconButton
                            aria-label='more'
                            aria-controls='long-menu'
                            aria-haspopup='true'
                            onClick={event => handleClickMore(event, detailPurchaseOrder.number)}
                          >
                            <MoreVertIcon />
                          </IconButton>
                        </Tooltip>
                        <Menu
                          anchorEl={anchorEl}
                          open={openMore === detailPurchaseOrder.number} // Open menu only for the current row
                          onClose={handleCloseMore}
                          PaperProps={{
                            elevation: 3,
                            style: {
                              borderRadius: 10
                            }
                          }}
                        >
                          <MenuItem sx={{ justifyContent: 'flex-start' }} disabled={detailPurchaseOrder.status_id >= 4}>
                            <Link href={`/purchases/purchase-orders/edit/${detailPurchaseOrder.number}`}>
                              <Button
                                color='warning'
                                size='small'
                                variant='text'
                                sx={{ padding: 0, margin: 0, fontSize: '12px', justifyContent: 'flex-start' }}
                              >
                                <Edit style={{ marginRight: 8, fontSize: '12.4px' }} />
                                Ubah
                              </Button>
                            </Link>
                          </MenuItem>
                          <MenuItem
                            onClick={() =>
                              handleClickArchiveProduct(detailPurchaseOrder.number, detailPurchaseOrder.ref)
                            }
                            sx={{ justifyContent: 'flex-start' }}
                            disabled={detailPurchaseOrder.status_id >= 4}
                          >
                            <Button
                              color='error'
                              size='small'
                              variant='text'
                              sx={{ padding: 0, margin: 0, fontSize: '12px', justifyContent: 'flex-start' }}
                            >
                              <Delete style={{ marginRight: 8, fontSize: '12.4px' }} />
                              Arsipkan
                            </Button>
                          </MenuItem>
                          <MenuItem
                            onClick={() => setOpenDeleteDialog(true)}
                            sx={{ justifyContent: 'flex-start' }}
                            disabled={detailPurchaseOrder.status_id >= 4}
                          >
                            <Button
                              color='error'
                              size='small'
                              variant='text'
                              sx={{ padding: 0, margin: 0, fontSize: '12px', justifyContent: 'flex-start' }}
                            >
                              <Delete style={{ marginRight: 8, fontSize: '12.4px' }} />
                              Hapus Transaksi
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
                  <div className='text-base font-semibold'>{detailPurchaseOrder.number}</div>
                </div>
                <div className='col-span-2 mb-3'>
                  <Typography variant='body2' className='mb-1'>
                    Vendor
                  </Typography>
                  <div className='text-base font-semibold'>{detailPurchaseOrder.vendor_name}</div>
                </div>
                <div className='col-span-2 mb-3'>
                  <Typography variant='body2' className='mb-1'>
                    Tanggal Transaksi
                  </Typography>
                  <div className='text-base font-semibold'>{dayjs(detailPurchaseOrder.date).format('DD/MM/YYYY')}</div>
                </div>
                <div className='col-span-2 mb-3'>
                  <Typography variant='body2' className='mb-1'>
                    Referensi
                  </Typography>
                  <div className='text-base font-semibold'>{detailPurchaseOrder.ref || '-'}</div>
                </div>

                <div className='col-span-4'>
                  <DetailItemsPurchaseOrder detailItems={detailPurchaseOrder} />

                  <div className='grid grid-cols-4 gap-1 my-2 w-full'>
                    <div className='col-span-2'>
                      {detailPurchaseOrder.description && (
                        <>
                          <Typography variant='body2' className='mb-1'>
                            Deskripsi
                          </Typography>
                          <div className='text-base font-semibold'>{detailPurchaseOrder.description}</div>
                        </>
                      )}
                    </div>
                    <div className='col-span-1'>
                      <List>
                        <ListItem sx={{ borderBottom: '1px solid #eaeaea', width: '100%', justifyContent: 'flex-end' }}>
                          <Typography className='font-bold text-right'>Sub Total</Typography>
                        </ListItem>
                        <ListItem sx={{ borderBottom: '1px solid #eaeaea', width: '100%', justifyContent: 'flex-end' }}>
                          <Typography className='font-bold text-right'>Diskon Tambahan</Typography>
                        </ListItem>
                        <ListItem sx={{ borderBottom: '1px solid #eaeaea', width: '100%', justifyContent: 'flex-end' }}>
                          <Typography className='font-bold text-right'>Biaya Lain</Typography>
                        </ListItem>
                        <ListItem sx={{ borderBottom: '1px solid #eaeaea', width: '100%', justifyContent: 'flex-end' }}>
                          <Typography className='font-bold text-right'>Grand Total</Typography>
                        </ListItem>
                      </List>
                    </div>
                    <div className='col-span-1'>
                      <List>
                        <ListItem sx={{ borderBottom: '1px solid #eaeaea', width: '100%', justifyContent: 'flex-end' }}>
                          <Typography className='font-bold text-right'>
                            {FormaterHelper.formatRupiah(String(detailPurchaseOrder.total_price))}
                          </Typography>
                        </ListItem>
                        <ListItem sx={{ borderBottom: '1px solid #eaeaea', width: '100%', justifyContent: 'flex-end' }}>
                          <Typography className='font-bold text-right'>
                            {FormaterHelper.formatRupiah(String(detailPurchaseOrder.total_discount))}
                          </Typography>
                        </ListItem>
                        <ListItem sx={{ borderBottom: '1px solid #eaeaea', width: '100%', justifyContent: 'flex-end' }}>
                          <Typography className='font-bold text-right'>
                            {FormaterHelper.formatRupiah(String(detailPurchaseOrder.total_charge))}
                          </Typography>
                        </ListItem>
                        <ListItem sx={{ borderBottom: '1px solid #eaeaea', width: '100%', justifyContent: 'flex-end' }}>
                          <Typography className='font-bold text-right'>
                            {FormaterHelper.formatRupiah(String(detailPurchaseOrder.grand_total))}
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

export default ViewPurchaseOrderDetail
