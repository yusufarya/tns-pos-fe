import { Skeleton } from '@mui/material'

export default function LoadingPageList() {
  return (
    <>
      <div className='flex pb-2 mx-3'>
        <div className='flex-none w-full'>
          <Skeleton animation='wave' className='rounded-lg shadow-lg w-96 h-8' />
          <Skeleton animation='wave' className='rounded-lg shadow-lg w-full h-8' />
          <Skeleton animation='wave' className='rounded-lg shadow-lg w-full h-8' />
          <Skeleton animation='wave' className='rounded-lg shadow-lg w-full h-8' />
        </div>
      </div>
    </>
  )
}
