import { DataGrid, GridColDef } from '@mui/x-data-grid'
import { Button, Skeleton, TextField, useTheme } from '@mui/material'
import { useEffect, useState } from 'react'
import { ProductByInventory } from '@/@core/master-data-types'
import ButtonTransferWarehouse from './button-transfer-warehouse'
import AddIcon from '@mui/icons-material/Add'
import Link from 'next/link'
import { useParams } from 'next/navigation'

const columns: GridColDef[] = [
  { field: 'product_id', headerName: 'ID', width: 40 },
  {
    field: 'product_name',
    headerName: 'Nama Produk',
    flex: 2,
    renderCell: params => (
      <Link href={`/products/detail/${params.row.product_id}`} passHref>
        <span className='text-blue-500'>{params.value}</span>
      </Link>
    )
  },
  { field: 'barcode', headerName: 'Kode/SKU', flex: 1 },
  { field: 'initial', headerName: 'Initial', flex: 1 },
  { field: 'stock', headerName: 'Stok', type: 'number', width: 110 },
  { field: 'hpp', headerName: 'HPP', type: 'number', width: 200 },
  { field: 'price_value', headerName: 'Nilai Produk', type: 'number', width: 230 }
]

export default function ProductInventoryTable({ productDetail }: { productDetail: ProductByInventory[] }) {
  const theme = useTheme() // Access the current theme mode
  const params = useParams<{ id: string }>()
  const id_warehouse = params.id

  const [showData, setShowData] = useState(false)
  const [searchQuery, setSearchQuery] = useState('') // Search state
  const [filteredData, setFilteredData] = useState(productDetail)

  // Filter product details based on search query
  useEffect(() => {
    const filtered = productDetail.filter(product =>
      product.product_name.toLowerCase().includes(searchQuery.toLowerCase())
    )
    setFilteredData(filtered)
  }, [searchQuery, productDetail])

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowData(true)
    }, 800)

    return () => clearTimeout(timer)
  }, [])

  const rowCount = filteredData.length

  return (
    <>
      <div className='grid grid-cols-4 gap-1 my-2 w-full'>
        <div className='col-span-2 flex'>
          <ButtonTransferWarehouse id_warehouse={id_warehouse} />
          <Link href={`/warehouses/${id_warehouse}/stock-adjustment/add`} className='float-left mx-2'>
            <Button variant='outlined' size='small' color='info'>
              <AddIcon fontSize='small' /> Penyesuaian Stok
            </Button>
          </Link>
        </div>
        <div className='col-span-1'></div>
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
      {showData ? (
        <div style={{ width: '100%' }}>
          <DataGrid
            sx={{
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
              product_id: false
            }}
            rows={filteredData}
            columns={columns}
            getRowId={row => row.product_id}
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
