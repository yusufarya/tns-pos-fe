'use client'

import { ProductResponse } from '@/@core/master-data-types'
import AppService from '@/app/api/services/app-service'
import Link from '@/components/Link'
import { Skeleton, TextField, Typography, useTheme } from '@mui/material'
import { GridColDef } from '@mui/x-data-grid'
import { Suspense, useEffect, useState } from 'react'
import React from 'react'

// Lazy load the DataTableProduct component
const DataTableProduct = React.lazy(() => import('./data-table-product'))

const columns: GridColDef[] = [
  { field: 'id', headerName: 'Id', type: 'number' },
  {
    field: 'name',
    headerName: 'Nama Produk',
    flex: 1,
    renderCell: (params) => (
      <Link href={`products/detail/${params.row.id}`} passHref>
        <span className='text-blue-500'>{params.value}</span>
      </Link>
    )
  },
  { field: 'barcode', headerName: 'Kode/SKU', type: 'string', width: 120 },
  { field: 'description', headerName: 'Deskripsi', flex: 1 },
]

const Loading = () => (
  <div className='flex bg-gray-100/50 rounded-lg shadow-lg p-4 w-full h-56'>
    <div className='flex flex-col gap-3 w-full'>
      <Skeleton animation='wave' className='h-10 rounded w-40 mb-3' />
      <Skeleton animation='wave' className='h-10 rounded w-full m-0 p-0' />
      <Skeleton animation='wave' className='h-10 rounded w-full m-0 p-0' />
      <Skeleton animation='wave' className='h-10 rounded w-full m-0 p-0' />
      <Skeleton animation='wave' className='h-10 rounded w-full m-0 p-0' />
    </div>
  </div>
)

const ViewProducts = () => {
  const theme = useTheme()
  const [productsData, setProductsData] = useState<ProductResponse[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [isLoading, setIsLoading] = useState(true) // State untuk melacak status pemuatan

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true) // Set isLoading ke true setiap kali pengambilan data dimulai
      try {
        const result = await AppService.serviceGet('api/all-product')
        setProductsData(result.data)
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setTimeout(() => {
          setIsLoading(false) // Set isLoading ke false setelah data berhasil diambil
        }, 1000);
      }
    }
    fetchProducts()
  }, [])

  const filteredData = productsData.filter(product =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

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

      <Suspense fallback={<Loading />}>
        {isLoading === true ? (
          <Loading /> // Tampilkan Loading saat data masih dimuat
        ) : filteredData.length > 0 ? (
          <DataTableProduct rows={filteredData} columns={columns} theme={theme} />
        ) : (
          <div className='flex justify-center my-5 py-3 rounded-sm bg-red-100'>
            <Typography variant='h6' color={'red'}>
              Data produk masih kosong
            </Typography>
          </div>
        )}
      </Suspense>
    </>
  )
}

export default ViewProducts
