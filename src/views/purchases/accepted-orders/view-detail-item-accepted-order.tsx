'use client'

import { AcceptedOrderType } from '@/@core/accepted-data-types'
import FormaterHelper from '@/@core/utils/formatHelper'
import Link from '@/components/Link'
import { Skeleton, TextField, useTheme } from '@mui/material'
import { DataGrid, GridColDef } from '@mui/x-data-grid'
import { useEffect, useState } from 'react'

const columns: GridColDef[] = [
  { field: 'id', headerName: 'Id', type: 'number' },
  {
    field: 'product_name',
    headerName: 'Nama Produk',
    flex: 1,
    renderCell: params => (
      <Link href={`inventory/detail/${params.row.id}`} passHref>
        <span className='text-blue-500'>{params.value}</span>
      </Link>
    )
  },
  { field: 'barcode', headerName: 'Kode/SKU', type: 'string', width: 140 },
  { field: 'initial', headerName: 'Satuan', type: 'string', width: 140 },
  { field: 'qty_received', headerName: 'Qty', width: 120, type: 'number' },
  {
    field: 'price',
    headerName: 'Harga',
    width: 120,
    type: 'number',
    renderCell: params => FormaterHelper.formatRupiah(String(params.value))
  },
  { field: 'percent_discount', headerName: 'Diskon(%)', width: 120, type: 'number' },
  {
    field: 'total_price',
    headerName: 'Total Harga',
    width: 130,
    type: 'number',
    renderCell: params => FormaterHelper.formatRupiah(String(params.value))
  }
]

interface propsData {
  detailItems: AcceptedOrderType
}

const DetailItemsPurchaseOrder: React.FC<propsData> = ({ detailItems }) => {
  const theme = useTheme() // Access the current theme mode

  const [showData, setShowData] = useState(false)
  const [searchQuery, setSearchQuery] = useState('') // Search state

  // Filter product details based on search query
  const [filteredData, setFilteredData] = useState(detailItems.detail)

  useEffect(() => {
    if (detailItems.detail) {
      const filtered = detailItems.detail.filter(product =>
        product.product_name.toLowerCase().includes(searchQuery.toLowerCase())
      )
      setFilteredData(filtered)
    }
  }, [searchQuery, detailItems.detail])

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowData(true)
    }, 800)

    return () => clearTimeout(timer)
  }, [])

  const rowCount = filteredData ? filteredData.length : 0

  return (
    <>
      <div className='grid grid-cols-4 gap-1 my-2 w-full'>
        <div className='col-span-3'></div>
        <div className='col-span-1'>
          <TextField
            size='small'
            // variant="outlined"
            placeholder='Cari nama produk'
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            fullWidth
          />
        </div>
      </div>
      {showData && detailItems ? (
        <div style={{ width: '100%' }}>
          <DataGrid
            sx={{
              border: 0,
              '& .MuiDataGrid-columnHeader': {
                borderRight: '1px solid #303030',
                ...theme.applyStyles('light', {
                  borderRightColor: '#f0f0f0'
                }),
                backgroundColor: `${theme.palette.mode === 'dark' ? theme.palette.grey[900] : theme.palette.grey[50]} !important`,
                color: `${theme.palette.mode === 'dark' ? theme.palette.common.white : theme.palette.common.black} !important`
              }
            }}
            columnVisibilityModel={{
              id: false
            }}
            rows={filteredData}
            columns={columns}
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
            pageSizeOptions={[5, 10]}
            disableRowSelectionOnClick
            hideFooterPagination={rowCount <= 5}
          />
        </div>
      ) : (
        <div className='flex bg-gray-100/50 rounded-lg shadow-lg p-4 w-full h-56'>
          <div className='flex flex-col gap-3 w-full'>
            <Skeleton animation='wave' className='h-10 rounded w-40 mb-3' />
            <Skeleton animation='wave' className='h-10 rounded w-full m-0 p-0' />
            <Skeleton animation='wave' className='h-10 rounded w-full m-0 p-0' />
            <Skeleton animation='wave' className='h-10 rounded w-full m-0 p-0' />
            <Skeleton animation='wave' className='h-10 rounded w-full m-0 p-0' />
          </div>
        </div>
      )}
    </>
  )
}

export default DetailItemsPurchaseOrder
