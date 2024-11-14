import Accordion from '@mui/material/Accordion'
import AccordionSummary from '@mui/material/AccordionSummary'
import AccordionDetails from '@mui/material/AccordionDetails'
import Typography from '@mui/material/Typography'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import { Button, ButtonGroup } from '@mui/material'
import { useState } from 'react'
import TableStockAdjustmentList from './table-stock-adjustment-list'
import TableWarehouseTransferList from './table-warehouse-transfer-list'

export default function TransactionList() {
  const [selectedTransaction, setSelectedTransaction] = useState<string>('WH')

  const handleTypeTransaction = (type: string) => {
    setSelectedTransaction(type)
  }

  return (
    <div className='my-10'>
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls='panel1-content' id='panel1-header'>
          <Typography variant='body1' className='text-blue-500 hover:underline hover:text-blue-600'>
            Lihat Transaksi
          </Typography>
        </AccordionSummary>
        <AccordionDetails className='justify-start text-start'>
          <ButtonGroup variant='text' aria-label='Type Transaction' className='mb-5'>
            <Button
              size='small'
              variant={selectedTransaction == 'WH' ? 'contained' : 'text'}
              onClick={() => handleTypeTransaction('WH')}
            >
              Transfer Gudang
            </Button>
            <Button
              size='small'
              variant={selectedTransaction == 'SA' ? 'contained' : 'text'}
              onClick={() => handleTypeTransaction('SA')}
            >
              Penyesuaian Stok
            </Button>
          </ButtonGroup>
          <div>
            {selectedTransaction === 'WH' ? (
              <TableWarehouseTransferList />
            ) : selectedTransaction === 'SA' ? (
              <TableStockAdjustmentList />
            ) : (
              <></>
            )}
          </div>
        </AccordionDetails>
      </Accordion>
    </div>
  )
}
