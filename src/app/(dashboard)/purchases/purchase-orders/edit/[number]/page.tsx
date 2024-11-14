import PageTitle from '@/@layouts/components/vertical/PageTitle'
import ViewEditPurchaseOrder from '@/views/purchases/purchase-orders/view-edit-purchase-order'
import { ArrowBack } from '@mui/icons-material'
import { Button, Paper, Typography } from '@mui/material'
import Link from 'next/link'

const titlePage : string = 'Ubah Pesanan Pembelian'

const EditPurchaseOrder = () => {
  return (
    <Paper>
      <PageTitle>
        <div className='grid grid-flow-row-dense grid-cols-2 grid-rows-1 mb-8 px-1 rounded-sm'>
          <div className='flex-none'>
            <Typography variant='h4' component='h4' className='p-3'>
              {titlePage}
            </Typography>
          </div>
          <div className='flex justify-end py-3 mx-3'>
            <Link href={`/purchases/purchase-orders`}>
              <Button variant='contained' color='secondary' size='small'>
                <ArrowBack fontSize='small' />
                Kembali
              </Button>
            </Link>
          </div>
        </div>
      </PageTitle>

      <div className='m-3 mb-10'>
        <ViewEditPurchaseOrder titlePage={titlePage} />
      </div>
    </Paper>
  )
}

export default EditPurchaseOrder
