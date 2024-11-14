'use client'

import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { useParams } from 'next/navigation'
import { WarehouseTransferType } from '@/@core/inventory-data-types'
import PageTitle from '@/@layouts/components/vertical/PageTitle'
import AppService from '@/app/api/services/app-service'
import LoadingPageList from '@/components/loading/loading-page-list'
import LoadingPageTitle from '@/components/loading/loading-page-title'
import { setPageName } from '@/store/slices/page-name-slice'
import { ArrowBack } from '@mui/icons-material'
import { Box, Button, Divider, Paper, Typography } from '@mui/material'
import Link from 'next/link'
import dayjs from 'dayjs'
import DetailItemsWHTransfer from './detail-items-wh-transfer'

const DetailWarehouseTransfer = () => {
  const params = useParams()
  const id_warehouse = params.id
  const number = params.number
  const dispatch = useDispatch()
  // set breadcrumps name
  useEffect(() => {
    dispatch(setPageName({ params1: 'Inventory', params2: 'Transfer Detail' }))
  }, [dispatch]) // Ensure dispatch is in the dependency array

  const [showData, setShowData] = useState(false)
  const [detailTransferWh, setDetailTransferWh] = useState<WarehouseTransferType>()

  useEffect(() => {
    const getDetailWarehouse = async () => {
      try {
        const result = await AppService.serviceGet('api/warehouse-transfer/get', { number: number })
        // console.log(result)
        // Check if result is successful and has data
        if ('statusCode' in result && result.statusCode === 200 && 'data' in result) {
          setDetailTransferWh(result.data) // Assuming result.data contains the array of products
        } else {
          console.log('Failed to fetch products.')
        }
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }

    getDetailWarehouse()
  }, [])

  useEffect(() => {
    setTimeout(() => {
      setShowData(true)
    }, 800)
  }, [])

  return (
    <div>
      {showData && detailTransferWh ? (
        <>
          <PageTitle>
            <div className='grid grid-flow-row-dense grid-cols-2 grid-rows-1 mb-0 rounded-sm px-3'>
              <div className='flex-none'>
                <Typography variant='h4' component='h4' className='p-3'>
                  Transfer Gudang {detailTransferWh.number}
                </Typography>
              </div>
              <div className='flex justify-end py-3 px-2'>
                <Link href={`/warehouses/detail/${id_warehouse}`}>
                  <Button variant='contained' color='secondary' size='small'>
                    <ArrowBack fontSize='small' />
                    Kembali
                  </Button>
                </Link>
              </div>
            </div>
          </PageTitle>

          <Paper className='w-full' sx={{ boxShadow: 'none' }}>
            <Box sx={{boxShadow: 'none', p:5}}>
              <div className='grid grid-cols-4 gap-4 mb-8 px-4 py-7 rounded-sm border border-gray-200'>
                <div className='col-span-2 mb-3'>
                  <Typography variant='body2' className='mb-1'>Dari</Typography>
                  <div className='text-base font-semibold'>{detailTransferWh.warehouse_from_name}</div>
                </div>
                <div className='col-span-2 mb-3'>
                  <Typography variant='body2' className='mb-1'>Ke</Typography>
                  <div className='text-base font-semibold'>{detailTransferWh.warehouse_to_name}</div>
                </div>
                <div className='col-span-2 mb-3'>
                  <Typography variant='body2' className='mb-1'>Tanggal Transaksi</Typography>
                  <div className='text-base font-semibold'>{dayjs(detailTransferWh.date).format('DD/MM/YYYY')}</div>
                </div>
                <div className='col-span-2 mb-3'>
                  <Typography variant='body2' className='mb-1'>Referensi</Typography>
                  <div className='text-base font-semibold'>{detailTransferWh.ref || '-'}</div>
                </div>
              </div>

              <DetailItemsWHTransfer detailItems={detailTransferWh}/>
            </Box>
          </Paper>
        </>
      ) : (
        <Paper sx={{ boxShadow: 'none' }}>
          <LoadingPageTitle />
          <Divider/>
          <br/>
          <LoadingPageList />
          <LoadingPageList />
        </Paper>
      )}
    </div>
  )
}

export default DetailWarehouseTransfer
