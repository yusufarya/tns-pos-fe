'use client'

import React from 'react'
import AppService from '@/app/api/services/app-service'
import Link from '@/components/Link'
import { Skeleton, TextField, useTheme, Box, Button, Typography } from '@mui/material'
import { DataGrid, GridColDef, GridRowSelectionModel } from '@mui/x-data-grid'
import { Suspense, useEffect, useState } from 'react'
import BrowserNotSupportedIcon from '@mui/icons-material/BrowserNotSupported'
import { useDispatch } from 'react-redux'
import { setPageName } from '@/store/slices/page-name-slice'
import { PurchaseOrderResponse } from '@/@core/purchase-data-types'
import dayjs from 'dayjs'
import ModalDeleteData from './modal-delete-data'
import { ResponseStatus } from '@/@core/types'
import CustomSnackBarNotification from '@/components/notification/custom-snackbar-notification'

const columns: GridColDef[] = [
  {
    field: 'number',
    headerName: 'Number',
    type: 'string',
    width: 150,
    renderCell: params => (
      <Link href={`/purchases/purchase-orders/detail/${params.value}`} passHref>
        <span className='text-blue-500'>{params.value}</span>
      </Link>
    )
  },
  { field: 'vendor_name', headerName: 'Vendor', flex: 1, renderCell: params => <span>{params.row.vendor.name}</span> },
  { field: 'ref', headerName: 'Referensi', width: 130 },
  {
    field: 'date',
    headerName: 'Tanggal',
    type: 'string',
    width: 140,
    renderCell: params => <>{dayjs(params.value).format('DD/MM/YYYY')}</>
  },
  {
    field: 'due_date',
    headerName: 'Tgl Jatuh Tempo',
    type: 'string',
    width: 140,
    renderCell: params => <>{dayjs(params.value).format('DD/MM/YYYY')}</>
  },
  {
    field: 'status_name',
    headerName: 'Status',
    width: 160,
    renderCell: params => <span>{params.row.transactionStatus.name}</span>
  },
  { field: 'total_qty_request', headerName: 'Total Qty', width: 160, type: 'number' },
  { field: 'total_price', headerName: 'Total Harga', width: 160, type: 'number' }
]

const Loading = () => (
  <div className='flex bg-gray-100/50 rounded-lg shadow-lg p-4 w-full h-56'>
    <div className='flex flex-col gap-3 w-full'>
      <Skeleton animation='wave' className='h-12 rounded w-40 mb-3 float-end' />
      <Skeleton animation='wave' className='h-11 rounded w-full m-0 p-0' />
      <Skeleton animation='wave' className='h-11 rounded w-full m-0 p-0' />
      <Skeleton animation='wave' className='h-11 rounded w-full m-0 p-0' />
      <Skeleton animation='wave' className='h-11 rounded w-full m-0 p-0' />
      <Skeleton animation='wave' className='h-11 rounded w-full m-0 p-0' />
    </div>
  </div>
)

interface ViewPurchaseOrderProps {
  titlePage: string
}

const ViewPurchaseOrder = ({ titlePage }: ViewPurchaseOrderProps) => {
  const dispatch = useDispatch()

  const theme = useTheme()
  const [purchaseOrderData, setPurchaseOrderData] = useState<PurchaseOrderResponse[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [selectedRows, setSelectedRows] = useState<GridRowSelectionModel>([])
  const [isSuccessUpdate, setIsSuccessUpdate] = useState<ResponseStatus | null>(null)
  const [snackBarOpen, setSnackBarOpen] = useState(false)

  const handleSelectionChange = (newSelection: GridRowSelectionModel) => {
    setSelectedRows(newSelection)
  }

  useEffect(() => {
    dispatch(setPageName({ params1: titlePage, params2: '' }))
  }, [dispatch]) // Ensure dispatch is in the dependency array

  const fetchItems = async () => {
    setIsLoading(true)
    const params = {
      branch_id: Number(localStorage.getItem('current_branch'))
    }
    try {
      const result = await AppService.serviceGet('api/all-purchase-order', params)
      setPurchaseOrderData(result.data)
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setTimeout(() => {
        setIsLoading(false)
      }, 1000)
    }
  }

  useEffect(() => {
    fetchItems()
  }, [])

  const filteredData = Array.isArray(purchaseOrderData)
    ? purchaseOrderData.filter(product => product.number.includes(searchQuery.toLowerCase()))
    : [] // Add fallback to an empty array if purchaseOrderData is not an array

  const [openDeleteDialog, setOpenDeleteDialog] = useState(false)
  const handleDelete = () => {
    setOpenDeleteDialog(true)
  }

  const handleSuccessUpdate = (response: ResponseStatus) => {
    setIsSuccessUpdate(response)
  }

  useEffect(() => {
    if (isSuccessUpdate) {
      setSnackBarOpen(true) // Show Snackbar when isSuccessUpdate changes
      fetchItems()
    }
  }, [isSuccessUpdate])

  const handleCloseSnack = () => {
    setSnackBarOpen(false) // Close the Snackbar
  }

  return (
    <>
      {snackBarOpen && (
        <CustomSnackBarNotification
          open={snackBarOpen}
          response={isSuccessUpdate}
          onClose={handleCloseSnack}
          onResponse={setIsSuccessUpdate}
        />
      )}
      <div className='grid grid-cols-4 gap-1 my-2 w-full'>
        <div className='col-span-3'>
          {selectedRows.length > 0 && (
            <div className='flex items-center gap-2'>
              <Button variant='contained' color='error' size='small' onClick={handleDelete}>
                Hapus
              </Button>
              <Typography>{selectedRows.length} data terpilih</Typography>
            </div>
          )}
        </div>
        <div className='col-span-1'>
          <TextField
            size='small'
            placeholder='Cari nama produk'
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            fullWidth
          />
        </div>
      </div>

      <Suspense fallback={<Loading />}>
        {isLoading ? (
          <Loading />
        ) : (
          <div style={{ width: '100%', minHeight: 400, position: 'relative' }}>
            <DataGrid
              sx={{
                '& .MuiDataGrid-columnHeader': {
                  borderRight: '1px solid #303030',
                  ...theme.applyStyles('light', {
                    borderRightColor: '#f0f0f0'
                  }),
                  backgroundColor: `${
                    theme.palette.mode === 'dark' ? theme.palette.grey[900] : theme.palette.grey[50]
                  } !important`,
                  color: `${
                    theme.palette.mode === 'dark' ? theme.palette.common.white : theme.palette.common.black
                  } !important`
                }
              }}
              rows={filteredData}
              columns={columns}
              getRowId={row => row.number}
              localeText={{
                MuiTablePagination: {
                  labelDisplayedRows: ({ from, to, count }) => `${from} - ${to} dari ${count}`,
                  labelRowsPerPage: 'Baris per halaman:'
                }
              }}
              initialState={{
                pagination: {
                  paginationModel: { page: 0, pageSize: 5 }
                }
              }}
              pageSizeOptions={[5, 10, 20, 50, 100]}
              checkboxSelection
              disableRowSelectionOnClick
              onRowSelectionModelChange={handleSelectionChange}
              rowSelectionModel={selectedRows}
              hideFooterPagination={filteredData.length <= 5}
            />

            {filteredData.length === 0 && !isLoading && (
              <Box
                sx={{
                  position: 'absolute',
                  top: 55,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  bgcolor: theme.palette.background.default,
                  color: theme.palette.text.secondary,
                  fontSize: '1.1rem',
                  fontWeight: 'bold',
                  opacity: 1
                }}
              >
                <div className='flex text-red-400' style={{ marginTop: '-50px' }}>
                  <BrowserNotSupportedIcon style={{ marginTop: '3px' }} /> Data {titlePage} masih kosong
                </div>
              </Box>
            )}
          </div>
        )}
      </Suspense>

      {openDeleteDialog && (
        <ModalDeleteData
          open={openDeleteDialog}
          handleClose={() => setOpenDeleteDialog(false)}
          selectedRows={selectedRows}
          successUpdate={handleSuccessUpdate}
        />
      )}
    </>
  )
}

export default ViewPurchaseOrder
