import * as React from 'react'
import { BarChart } from '@mui/x-charts/BarChart'

const seriesA = {
  data: [2000, 3000, 1500, 4000, 5000, 3500, 6000, 4500, 5500, 7000, 8000, 7500], // Example data for Pembelian
  label: 'Pembelian'
}
const seriesB = {
  data: [2500, 2000, 3000, 3500, 4500, 2500, 5000, 4000, 3000, 6000, 5000, 6500], // Example data for Penjualan
  label: 'Penjualan'
}

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

export default function ChartDetailProductMonthly() {
  return (
    <BarChart
      height={400}
      xAxis={[
        {
          data: months,
          scaleType: 'band' // Set the scale type to "band" for categorical data
        }
      ]}
      series={[
        { ...seriesA, stack: 'total' }, // Stack the series for Pembelian
        { ...seriesB, stack: 'total' } // Stack the series for Penjualan
      ]}
    />
  )
}
