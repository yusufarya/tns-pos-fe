import { Button, Typography } from '@mui/material'
import ViewProducts from '../../../views/products/view-table-products'
import SelectReportProduct from '@/views/products/select-report'
import AddCategories from '@/views/products/add-categories'
import CardStockProduct from '@/views/products/card-stock-product'
import PageTitle from '@/@layouts/components/vertical/PageTitle'
import Link from 'next/link'
import { Add } from '@mui/icons-material'
const Products = () => {
  return (
    <div>
      <PageTitle>
        <div className='grid grid-flow-row-dense grid-cols-2 grid-rows-1 mb-8 px-1 rounded-sm'>
          <div className='flex-none'>
            <Typography variant='h4' component='h4' className='p-3'>
              Produk
            </Typography>
          </div>
          <div className='flex justify-end py-3 mx-3'>
            <SelectReportProduct />
            <AddCategories />
            <div className='ms-1'>
              <Link href={`/products/add`}>
                <Button variant='contained' size='small'>
                  <Add fontSize='small' />
                  Data Produk
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </PageTitle>

      <div className='flex mb-3'>
        <CardStockProduct />
      </div>

      <ViewProducts />
    </div>
  )
}

export default Products
