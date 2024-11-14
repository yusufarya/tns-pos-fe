'use client'

import { ProductResponse } from '@/@core/master-data-types'
import PageTitle from '@/@layouts/components/vertical/PageTitle'
import AppService from '@/app/api/services/app-service'
import Link from '@/components/Link'
import LoadingPageList from '@/components/loading/loading-page-list'
import LoadingPageTitle from '@/components/loading/loading-page-title'
import { ArrowBack } from '@mui/icons-material'
import { Button, Typography } from '@mui/material'
import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'

const DetailStockAdjustmentByProduct = () => {
  const params = useParams<{ id_product: string }>()
  const id_product = params.id_product

  const [showData, setShowData] = useState(false)
  const [detailProduct, setDetailProduct] = useState<ProductResponse>()

  useEffect(() => {
    const getDetailWarehouse = async () => {
      try {
        const result = await AppService.serviceGet('api/product/get', { id: id_product })

        // Check if result is successful and has data
        if ('statusCode' in result && result.statusCode === 200 && 'data' in result) {
          setDetailProduct(result.data) // Assuming result.data contains the array of products
        } else {
          console.log('Failed to fetch products.')
        }
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }

    getDetailWarehouse()
  }, [])

  console.log(detailProduct)

  useEffect(() => {
    setTimeout(() => {
      setShowData(true)
    }, 800)
  }, [])

  return (
    <div>
      {showData && detailProduct ? (
        <>
          <PageTitle>
            <div className='grid grid-flow-row-dense grid-cols-2 grid-rows-1 mb-0 rounded-sm'>
              <div className='flex-none'>
                <Typography variant='h4' component='h4' className='p-3'>
                  Penyesuaian Persediaan {detailProduct.name}
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

export default DetailStockAdjustmentByProduct
