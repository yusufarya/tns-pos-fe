'use client'

import LoadingCardStock from '@/components/loading/loading-card-stock'
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import React, { useEffect, useState } from 'react'

const totalStock = (
  <React.Fragment>
    <CardContent>
      <div className='flex gap-2 px-0'>
        <div className='flex-none w-10 h-10 bg-green-400 rounded-full'></div>
        <div className='grow'>
          <div className='grid grid-rows-2 grid-flow-col gap-0'>
            <div>100</div>
            <div>Total Qty</div>
          </div>
        </div>
      </div>
    </CardContent>
  </React.Fragment>
)
const totalHpp = (
  <React.Fragment>
    <CardContent>
      <div className='flex gap-2 px-0'>
        <div className='flex-none w-10 h-10 bg-yellow-500 rounded-full'></div>
        <div className='grow'>
          <div className='grid grid-rows-2 grid-flow-col gap-0'>
            <div>130.000</div>
            <div>Total Hpp</div>
          </div>
        </div>
      </div>
    </CardContent>
  </React.Fragment>
)
const totalPembelian = (
  <React.Fragment>
    <CardContent>
      <div className='flex gap-2 px-0'>
        <div className='flex-none w-10 h-10 bg-purple-500 rounded-full'></div>
        <div className='grow'>
          <div className='grid grid-rows-2 grid-flow-col gap-0'>
            <div>100</div>
            <div>Total Penjualan</div>
          </div>
        </div>
      </div>
    </CardContent>
  </React.Fragment>
)
const totalPenjualan = (
  <React.Fragment>
    <CardContent>
      <div className='flex gap-2 px-0'>
        <div className='flex-none w-10 h-10 bg-blue-400 rounded-full'></div>
        <div className='grow'>
          <div className='grid grid-rows-2 grid-flow-col gap-0'>
            <div>100</div>
            <div>Total Penjualan</div>
          </div>
        </div>
      </div>
    </CardContent>
  </React.Fragment>
)

export default function CardStockProduct() {
  const [showData, setShowData] = useState(false)

  useEffect(() => {
    setTimeout(() => {
      setShowData(true)
    }, 500)
  }, [])

  return (
    <>
      {showData === false ? (
        <LoadingCardStock />
      ) : (
        <Box sx={{ minWidth: 275 }}>
          <div className='flex gap-3 overflow-auto pb-3'>
            <Card sx={{ minWidth: 230 }} variant='elevation'>
              {totalStock}
            </Card>
            <Card sx={{ minWidth: 230 }} variant='elevation'>
              {totalStock}
            </Card>
            <Card sx={{ minWidth: 230 }} variant='elevation'>
              {totalStock}
            </Card>
            <Card sx={{ minWidth: 230 }} variant='elevation'>
              {totalHpp}
            </Card>
            <Card sx={{ minWidth: 230 }} variant='elevation'>
              {totalPenjualan}
            </Card>
            <Card sx={{ minWidth: 230 }} variant='elevation'>
              {totalPembelian}
            </Card>
          </div>
        </Box>
      )}
    </>
  )
}
