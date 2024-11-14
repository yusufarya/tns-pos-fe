import * as React from 'react'
import { BarChart } from '@mui/x-charts/BarChart'

const seriesA = {
  data: [24000, 31000, 27500, 40000, 48000], // Example yearly data for Pembelian (purchase totals)
  label: 'Pembelian'
}
const seriesB = {
  data: [28000, 25000, 35000, 39000, 45000], // Example yearly data for Penjualan (sales totals)
  label: 'Penjualan'
}

const years = ['2020', '2021', '2022', '2023', '2024'] // Years for the x-axis

export default function ChartDetailProductYearly() {
  return (
    <BarChart
      height={400}
      xAxis={[
        {
          data: years, // Use years as x-axis data
          scaleType: 'band' // Set scale type to "band" for categorical data (years)
        }
      ]}
      series={[
        { ...seriesA, stack: 'total' },
        { ...seriesB, stack: 'total' }
      ]}
    />
  )
}
