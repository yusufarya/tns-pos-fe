'use client'

import { useEffect, useState } from 'react'

import { usePathname } from 'next/navigation'

import { useSelector } from 'react-redux'

import { Paper, Skeleton } from '@mui/material'

import Typography from '@mui/material/Typography'
import Breadcrumbs from '@mui/material/Breadcrumbs'
import Link from '@mui/material/Link'

function LoadingBreadCrumbs() {
  return (
    <Paper sx={{ boxShadow: 'none' }}>
      <div className='flex gap-3 overflow-auto px-3 pb-1'>
        <Skeleton animation='wave' className='rounded-lg shadow-lg p-4 w-48 h-8' />
      </div>
    </Paper>
  )
}

export default function PageBreadcrumbs() {
  const pathname = usePathname().split('/').filter(Boolean) // Filter to remove empty strings
  // const debugSelector: string | any = useSelector<any>((state) => state);
  const firstParam: string | any = useSelector<any>(state => state.pageName.firstParam)
  const secondParam: string | any = useSelector<any>(state => state.pageName.secondParam)

  const [showData, setShowData] = useState(false)

  useEffect(() => {
    setTimeout(() => {
      setShowData(true)
    }, 400)
  }, [])

  return (
    <>
      {showData === false ? (
        <LoadingBreadCrumbs />
      ) : (
        <Paper className='border-b border-gray-300/60 py-3 px-4 mb-3' sx={{ boxShadow: 'none' }}>
          <Breadcrumbs aria-label='breadcrumb' separator='»'>
            {pathname.length === 0 ? (
              <Typography color='inherit' variant='body1'>
                Beranda
              </Typography>
            ) : (
              <Typography color='inherit' variant='body1'>
                <Link underline='hover' color='inherit' href='/'>
                  Beranda
                </Link>
              </Typography>
            )}
            {pathname.length === 1 ? (
              <Typography color='inherit' variant='body1'>
                {firstParam}
              </Typography>
            ) : (
              <Typography color='inherit' variant='body1'>
                <Link
                  underline='hover'
                  color='inherit'
                  href={`/${pathname[0]}`} // Construct URL correctly
                >
                  {firstParam}
                </Link>
              </Typography>
            )}
            {pathname.length > 2 && (
              <Typography color='blue' variant='body1'>
                {secondParam}
              </Typography>
            )}
          </Breadcrumbs>
        </Paper>
      )}
    </>
  )
}
