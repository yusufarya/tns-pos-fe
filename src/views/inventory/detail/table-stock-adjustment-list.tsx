import { StockAdjustmentResponse } from '@/@core/inventory-data-types'
import AppService from '@/app/api/services/app-service'
import Link from '@/components/Link'
import { Skeleton, useTheme } from '@mui/material'
import { DataGrid, GridColDef } from '@mui/x-data-grid'
import dayjs from 'dayjs'
import { useEffect, useState } from 'react'

const columns: GridColDef[] = [
  {
    field: 'number',
    headerName: 'Number',
    width: 150,
    renderCell: params => (
      <Link href={`/inventory/${params.row.number}/stock-adjustment/detail`} passHref>
        <span className='text-blue-500'>{params.value}</span>
      </Link>
    )
  },
  { field: 'ref', headerName: 'Referensi', flex: 1 },
  {
    field: 'date',
    headerName: 'Tanggal',
    width: 130,
    renderCell: params => <>{dayjs(params.value).format('DD/MM/YYYY')}</>
  },
  {
    field: 'type',
    headerName: 'Tipe',
    type: 'string',
    renderCell: params => (
      <span className={params.value === 'in' ? 'text-blue-500' : 'text-red-500'}>
        {params.value === 'in' ? 'Masuk' : 'Keluar'}
      </span>
    ),
    width: 110
  },
  { field: 'total_qty', headerName: 'Jumlah', type: 'number', width: 160 }
]

const TableStockAdjustmentList = () => {
  const theme = useTheme() // Access the current theme mode
  const [stockAdjustmentData, setStockAdjustmentData] = useState<StockAdjustmentResponse[]>([])
  const [showData, setShowData] = useState(false)
  const [searchQuery, setSearchQuery] = useState('') // Search state

  useEffect(() => {
    const getDataStockAdjustment = async () => {
      try {
        const result = await AppService.serviceGet('api/all-stock-adjustment')
        setStockAdjustmentData(result.data)
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }
    getDataStockAdjustment()
  }, [])
  const [filteredData, setFilteredData] = useState(stockAdjustmentData)

  // Filter product details based on search query
  useEffect(() => {
    if (stockAdjustmentData) {
      const filtered = stockAdjustmentData.filter(product =>
        product.number.toLowerCase().includes(searchQuery.toLowerCase())
      )
      setFilteredData(filtered)
    }
  }, [searchQuery, stockAdjustmentData])

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowData(true)
    }, 800)

    return () => clearTimeout(timer)
  }, [])

  const rowCount = filteredData.length

  return (
    <>
      {showData && stockAdjustmentData ? (
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

export default TableStockAdjustmentList
