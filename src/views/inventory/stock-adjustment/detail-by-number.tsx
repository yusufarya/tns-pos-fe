'use client'

import { StockAdjustType } from '@/@core/inventory-data-types'
import PageTitle from '@/@layouts/components/vertical/PageTitle'
import AppService from '@/app/api/services/app-service'
import Link from '@/components/Link'
import LoadingPageList from '@/components/loading/loading-page-list'
import LoadingPageTitle from '@/components/loading/loading-page-title'
import { ArrowBack } from '@mui/icons-material'
import { Box, Button, Paper, Typography } from '@mui/material'
import dayjs from 'dayjs'
import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import DetailItemsStockAdjust from './detail-items-stock-adjust'
import { useDispatch } from 'react-redux'
import { setPageName } from '@/store/slices/page-name-slice'

const DetailStockAdjustmentByNumber = () => {
  const params = useParams<{ number: string }>()
  const number = params.number
  const dispatch = useDispatch()
  // set breadcrumps name
  useEffect(() => {
    dispatch(setPageName({ params1: 'Penyesuaian Persediaan', params2: 'Detail' }))
  }, [dispatch]) // Ensure dispatch is in the dependency array

  const [showData, setShowData] = useState(false)
  const [detailStockAdjust, setDetailStockAdjust] = useState<StockAdjustType>()

  useEffect(() => {
    const getDetailWarehouse = async () => {
      try {
        const result = await AppService.serviceGet('api/stock-adjustment/get', { number: number })
        console.log(result)
        // Check if result is successful and has data
        if ('statusCode' in result && result.statusCode === 200 && 'data' in result) {
          setDetailStockAdjust(result.data) // Assuming result.data contains the array of products
        } else {
          console.log('Failed to fetch products.')
        }
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }

    getDetailWarehouse()
  }, [])

  console.log(detailStockAdjust)

  useEffect(() => {
    setTimeout(() => {
      setShowData(true)
    }, 800)
  }, [])

  return (
    <div>
      {showData && detailStockAdjust ? (
        <>
          <PageTitle>
            <div className='grid grid-flow-row-dense grid-cols-2 grid-rows-1 mb-0 rounded-sm'>
              <div className='flex-none'>
                <Typography variant='h4' component='h4' className='p-3'>
                  Penyesuaian Persediaan {detailStockAdjust.number}
                </Typography>
              </div>
              <div className='flex justify-end py-3 px-2'>
                <Link href='/inventory'>
                  <Button variant='contained' color='secondary' size='small'>
                    <ArrowBack fontSize='small' />
                    Kembali
                  </Button>
                </Link>
              </div>
            </div>
          </PageTitle>

          <Paper className='w-full' sx={{ boxShadow: 'none' }}>
            <Box sx={{ boxShadow: 'none', p: 5 }}>
              <div className='grid grid-cols-4 gap-4 mb-8 px-4 py-7 rounded-sm border border-gray-200'>
                <div className='col-span-2 mb-3'>
                  <Typography variant='body2' className='mb-1'>
                    Tanggal Transaksi
                  </Typography>
                  <div className='text-base font-semibold'>{dayjs(detailStockAdjust.date).format('DD/MM/YYYY')}</div>
                </div>
                <div className='col-span-2 mb-3'>
                  <Typography variant='body2' className='mb-1'>
                    Tipe
                  </Typography>
                  <div className='text-base font-semibold'>{detailStockAdjust.type == 'in' ? 'Masuk' : 'Keluar'}</div>
                </div>
                <div className='col-span-2 mb-3'>
                  <Typography variant='body2' className='mb-1'>
                    Referensi
                  </Typography>
                  <div className='text-base font-semibold'>{detailStockAdjust.ref || '-'}</div>
                </div>
                <div className='col-span-4 mb-3'>
                  <Typography variant='body2' className='mb-1'>
                    Deskripsi
                  </Typography>
                  <div className='text-base font-normal'>{detailStockAdjust.description || '-'}</div>
                </div>
              </div>

              <DetailItemsStockAdjust detailItems={detailStockAdjust} />
            </Box>
          </Paper>
        </>
      ) : (
        <>
          <LoadingPageTitle />
          <LoadingPageList />
        </>
      )}
    </div>
  )
}

export default DetailStockAdjustmentByNumber
