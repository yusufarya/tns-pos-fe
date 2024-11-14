import PageTitle from '@/@layouts/components/vertical/PageTitle'
import ViewAcceptedOrder from '@/views/purchases/accepted-orders/view-accepted-orders'
import { Add } from '@mui/icons-material'
import { Button, Paper, Typography } from '@mui/material'
import Link from 'next/link'

const titlePage: string = 'Pesanan Pembelian'

const AcceptedOrder = () => {
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
            {/* <Link href={`/purchases/accepted-orders/add`}>
              <Button variant='contained' size='small'>
                <Add fontSize='small' />
                {titlePage}
              </Button>
            </Link> */}
          </div>
        </div>
      </PageTitle>

      <div className='m-3 mb-10 min-h-96'>
        <ViewAcceptedOrder titlePage={titlePage} />
      </div>
    </Paper>
  )
}

export default AcceptedOrder
