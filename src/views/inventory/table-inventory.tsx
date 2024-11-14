'use client'

import { WarehouseResponse } from '@/@core/master-data-types'
import { ResponseData } from '@/@core/types'
import AppService from '@/app/api/services/app-service'
import Link from '@/components/Link'
import { Skeleton, TextField, useTheme } from '@mui/material'
import { DataGrid, GridColDef } from '@mui/x-data-grid'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'

const columns: GridColDef[] = [
  { field: 'id', headerName: 'Id', type: 'number'},
  {
    field: 'name',
    headerName: 'Nama Gudang',
    flex: 1,
    renderCell: params => (
      <Link href={`warehouses/detail/${params.row.id}`} passHref>
        <span className='text-blue-500'>{params.value}</span>
      </Link>
    )
  },
  { field: 'description', headerName: 'Deskripsi', flex: 1 },
  { field: 'stock', headerName: 'Stok', type: 'number', width: 160 }
]

const InventoryTable = () => {
  const theme = useTheme() // Access the current theme mode
  const getResponseDataUpdate = useSelector<ResponseData | any>(state => state.responseStatus.status)

  const [warehouseTransferData, setStockAdjustmentData] = useState<WarehouseResponse[]>([])
  const [showData, setShowData] = useState(false)
  const [searchQuery, setSearchQuery] = useState('') // Search state
  const branch_id = localStorage.getItem('current_branch')
  console.log(branch_id)

  useEffect(() => {
    const getDataStockAdjustment = async () => {
      try {
        const result = await AppService.serviceGet('api/all-inventory', { branch_id: branch_id })
        setStockAdjustmentData(result.data)
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }
    getDataStockAdjustment()
  }, [getResponseDataUpdate])

  const [filteredData, setFilteredData] = useState(warehouseTransferData)

  // Filter product details based on search query
  useEffect(() => {
    if (warehouseTransferData) {
      const filtered = warehouseTransferData.filter(product =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
      setFilteredData(filtered)
    }
  }, [searchQuery, warehouseTransferData])

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
        <div className='col-span-3'></div>
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
      {showData && warehouseTransferData ? (
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

export default InventoryTable
