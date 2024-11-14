import { Skeleton } from '@mui/material'

export default function LoadingPageTitle() {
  return (
    <div className='flex gap-3 pb-2 mx-3'>
      <div className='flex-none w-full'>
        <Skeleton animation='wave' className='rounded-lg shadow-lg p-4 w-64 h-14' />
      </div>
    </div>
  )
}
