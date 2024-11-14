import { WarehouseTransferResponse } from '@/@core/inventory-data-types'
import AppService from '@/app/api/services/app-service'
import Link from '@/components/Link'
import { Skeleton, useTheme } from '@mui/material'
import { DataGrid, GridColDef } from '@mui/x-data-grid'
import dayjs from 'dayjs'
import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'


const TableWarehouseTransferList = () => {
  const theme = useTheme() // Access the current theme mode
  const [warehouseTransferData, setStockAdjustmentData] = useState<WarehouseTransferResponse[]>([])
  const [showData, setShowData] = useState(false)

  const params = useParams()
  const id_warehouse = params.id

  const columns: GridColDef[] = [
    {
      field: 'number',
      headerName: 'Number',
      width: 150,
      renderCell: params => (
        <Link href={`/warehouses/${id_warehouse}/transfer/detail/${params.row.number}`} passHref>
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
    { field: 'warehouse_from_name', headerName: 'Dari Gudang', type: 'string', flex: 1 },
    { field: 'warehouse_to_name', headerName: 'Ke Gudang', type: 'string', flex: 1 },
    { field: 'total_qty', headerName: 'Jumlah', type: 'number', width: 160 }
  ]

  useEffect(() => {
    const getDataStockAdjustment = async () => {
      try {
        const result = await AppService.serviceGet('api/all-warehouse-transfer')
        setStockAdjustmentData(result.data)
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }
    getDataStockAdjustment()
  }, [])

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowData(true)
    }, 800)

    return () => clearTimeout(timer)
  }, [])

  const rowCount = warehouseTransferData.length

  return (
    <>
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
            rows={warehouseTransferData}
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

export default TableWarehouseTransferList
