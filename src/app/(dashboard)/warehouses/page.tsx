import { Typography } from '@mui/material'

import SelectReportInventory from '@/views/inventory/select-report'
import CardInventoryStock from '@/views/inventory/card-inventory-stock'
import AddWarehouse from '@/views/inventory/add-warehouse'
import InventoryTable from '@/views/inventory/table-inventory'
import PageTitle from '@/@layouts/components/vertical/PageTitle'

const Inventory = () => {
  return (
    <div>
      <PageTitle>
        <div className='grid grid-flow-row-dense grid-cols-2 grid-rows-1 mb-8 px-1 rounded-sm'>
          <div className='flex-none'>
            <Typography variant='h3' component='h4' className='p-3'>
              Inventori
            </Typography>
          </div>
          <div className='flex justify-end py-3'>
            <SelectReportInventory />
            <AddWarehouse />
          </div>
        </div>
      </PageTitle>

      <div className='flex mb-3'>
        <CardInventoryStock />
      </div>

      <InventoryTable />
    </div>
  )
}

export default Inventory
