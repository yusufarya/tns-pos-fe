import * as React from 'react'
import { PieChart } from '@mui/x-charts/PieChart'

interface PieData {
  id: number
  value: number
  label: string
}

const data: PieData[] = [
  { id: 0, value: 10, label: 'series A' },
  { id: 1, value: 15, label: 'series B' },
  { id: 2, value: 20, label: 'series C' }
]

const WarehouseInfoChart: React.FC = () => {
  return (
    <PieChart
      series={[
        {
          data,
          highlightScope: { faded: 'global', highlighted: 'item' },
          faded: { innerRadius: 30, additionalRadius: -30, color: 'gray' }
        }
      ]}
      slotProps={{
        legend: {
          direction: 'column',
          position: { vertical: 'middle', horizontal: 'right' },
          padding: 1,
          itemMarkWidth: 20,
          itemMarkHeight: 10,
          markGap: 5,
          itemGap: 10
        }
      }}
      height={350}
    />
  )
}

export default WarehouseInfoChart
