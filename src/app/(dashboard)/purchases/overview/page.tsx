import { Typography } from '@mui/material'

const PurchaseOverview = () => {
  return (
    <div>
      <div className='grid grid-flow-row-dense grid-cols-2 grid-rows-1 bg-gray-50 shadow-md mb-8 px-1 rounded-sm'>
        <div className='flex-none'>
          <Typography variant='h4' component='h4' className='p-3'>
            Overview Pembelian
          </Typography>
        </div>
        <div className='flex justify-end py-3'></div>
      </div>

      <div className='flex mb-3'></div>
    </div>
  )
}

export default PurchaseOverview
