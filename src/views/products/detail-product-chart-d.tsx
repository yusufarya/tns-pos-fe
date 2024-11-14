import * as React from 'react'
import { BarChart } from '@mui/x-charts/BarChart'

const seriesA = {
  data: [
    200, 300, 150, 400, 500, 350, 600, 450, 550, 700, 800, 750, 600, 500, 450, 600, 500, 450, 400, 700, 800, 750, 650,
    550, 600, 650, 700, 750, 800, 850
  ], // Example data for Pembelian
  label: 'Pembelian'
}
const seriesB = {
  data: [
    250, 200, 300, 350, 450, 250, 500, 400, 300, 600, 500, 650, 700, 600, 550, 700, 500, 550, 600, 450, 550, 600, 650,
    700, 750, 800, 850, 900, 950, 1000
  ], // Example data for Penjualan
  label: 'Penjualan'
}

const days = Array.from({ length: 30 }, (_, i) => (i + 1).toString()) // Generate an array of days 1-30

export default function ChartDetailProductDaily() {
  return (
    <BarChart
      height={400}
      xAxis={[
        {
          data: days, // Use days as x-axis data
          scaleType: 'band' // Set the scale type to "band" for categorical data
        }
      ]}
      series={[
        { ...seriesA, stack: 'total' },
        { ...seriesB, stack: 'total' }
      ]}
    />
  )
}
