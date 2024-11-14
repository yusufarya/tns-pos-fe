import { Skeleton } from '@mui/material'

export default function LoadingCardStock() {
  return (
    <div className='flex gap-3 overflow-auto pb-3'>
      <div className='flex bg-gray-100/50 rounded-lg shadow-lg p-4 w-64 h-30'>
        <div className='flex flex-col gap-2 w-1/3'>
          <Skeleton variant='circular' animation='wave' className='rounded-full w-14 h-14' />
        </div>
        <div className='flex flex-1 items-center justify-center'>
          <div className='flex flex-col gap-1 w-full'>
            <Skeleton animation='wave' />
            <Skeleton animation='wave' />
          </div>
        </div>
      </div>
      <div className='flex bg-gray-100/50 rounded-lg shadow-lg p-4 w-64 h-30'>
        <div className='flex flex-col gap-2 w-1/3'>
          <Skeleton variant='circular' animation='wave' className='rounded-full w-14 h-14' />
        </div>
        <div className='flex flex-1 items-center justify-center'>
          <div className='flex flex-col gap-1 w-full'>
            <Skeleton animation='wave' />
            <Skeleton animation='wave' />
          </div>
        </div>
      </div>
      <div className='flex bg-gray-100/50 rounded-lg shadow-lg p-4 w-64 h-30'>
        <div className='flex flex-col gap-2 w-1/3'>
          <Skeleton variant='circular' animation='wave' className='rounded-full w-14 h-14' />
        </div>
        <div className='flex flex-1 items-center justify-center'>
          <div className='flex flex-col gap-1 w-full'>
            <Skeleton animation='wave' />
            <Skeleton animation='wave' />
          </div>
        </div>
      </div>
      <div className='flex bg-gray-100/50 rounded-lg shadow-lg p-4 w-64 h-30'>
        <div className='flex flex-col gap-2 w-1/3'>
          <Skeleton variant='circular' animation='wave' className='rounded-full w-14 h-14' />
        </div>
        <div className='flex flex-1 items-center justify-center'>
          <div className='flex flex-col gap-1 w-full'>
            <Skeleton animation='wave' />
            <Skeleton animation='wave' />
          </div>
        </div>
      </div>
      <div className='flex bg-gray-100/50 rounded-lg shadow-lg p-4 w-64 h-30'>
        <div className='flex flex-col gap-2 w-1/3'>
          <Skeleton variant='circular' animation='wave' className='rounded-full w-14 h-14' />
        </div>
        <div className='flex flex-1 items-center justify-center'>
          <div className='flex flex-col gap-1 w-full'>
            <Skeleton animation='wave' />
            <Skeleton animation='wave' />
          </div>
        </div>
      </div>
    </div>
  )
}
