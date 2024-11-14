import { CreatePurchaseOrderRequest, PurchaseOrderDetailResponse } from '@/@core/purchase-data-types'
import { ResponseStatus } from '@/@core/types'
import FormaterHelper from '@/@core/utils/formatHelper'
import AppService from '@/app/api/services/app-service'
import { Table, TableRow, Typography, TableCell, TableBody, TextField } from '@mui/material'
import { useEffect } from 'react'

const SectionCalculation = ({
  dataForm,
  handleInput,
  setDataForm,
  dataDetail,
  isSuccessUpdate
}: {
  dataForm: CreatePurchaseOrderRequest
  handleInput: (e: React.ChangeEvent<HTMLInputElement>) => void
  setDataForm: React.Dispatch<React.SetStateAction<CreatePurchaseOrderRequest>>
  dataDetail: PurchaseOrderDetailResponse[]
  isSuccessUpdate: ResponseStatus | null
}) => {
  // Get calculation data
  const getCalculation = async () => {
    const response = await AppService.serviceGet('api/purchase-order/calculation', {
      number: dataForm.number
    })
    if ('statusCode' in response && response.statusCode === 200) {
      console.log('response : ', response)
      setDataForm(prev => ({
        ...prev,
        total_price: response.data.total_price || dataForm.total_price,
        total_discount: response.data.total_discount || dataForm.total_discount,
        total_charge: response.data.total_charge || dataForm.total_charge,
        grand_total: response.data.grand_total || dataForm.grand_total
      }))
    }
  }

  useEffect(() => {
    if (dataDetail.length > 0) {
      getCalculation()
    }
  }, [dataDetail, setDataForm, isSuccessUpdate])

  return (
    <>
      {dataDetail.length > 0 && (
        <>
          <div className='col-span-2'>
            <TextField
              fullWidth
              id='description'
              label='Deskripsi'
              name='description'
              multiline
              rows={2}
              defaultValue={dataForm.description}
              onChange={handleInput}
            />
          </div>

          <div className='col-span-2'>
            <div className='grid grid-cols-4 gap-1 my-2 w-full'>
              <div className='col-span-4'>
                <Table size='small'>
                  <TableBody>
                    <TableRow>
                      <TableCell align='right'>
                        <Typography className='font-bold'>Sub Total</Typography>
                      </TableCell>
                      <TableCell align='right'>
                        <Typography className='font-bold'>
                          {FormaterHelper.formatRupiah(String(dataForm.total_price))}
                        </Typography>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell align='right'>
                        <Typography>Tambahan Diskon</Typography>
                      </TableCell>
                      <TableCell align='right'>
                        <TextField
                          size='small'
                          type='number'
                          placeholder='0'
                          name='total_discount_additional'
                          value={dataForm.total_discount_additional}
                          onChange={e => {
                            handleInput(e as React.ChangeEvent<HTMLInputElement>)
                            const rawValue = e.target.value.replace(/[^0-9]/g, '')
                            const percentage = parseFloat(rawValue) || 0
                            const discountAmount = (dataForm.total_price * percentage) / 100
                            setDataForm(prev => ({
                              ...prev,
                              total_discount: discountAmount,
                              grand_total: dataForm.total_price - discountAmount + (rawValue ? parseFloat(rawValue) : 0)
                            }))
                          }}
                          InputProps={{
                            endAdornment: <Typography>%</Typography>
                          }}
                          sx={{ width: '90px', marginRight: 2 }}
                          inputProps={{
                            style: { textAlign: 'right' }
                          }}
                        />
                        <TextField
                          size='small'
                          type='number'
                          name='total_discount'
                          placeholder='0'
                          value={FormaterHelper.formatRupiah(String(dataForm.total_discount))}
                          onChange={e => {
                            handleInput(e as React.ChangeEvent<HTMLInputElement>)
                            // Remove the formatRupiah before parsing to get raw number
                            const rawValue = e.target.value.replace(/[^0-9]/g, '')
                            const discountAmount = parseFloat(rawValue) || 0

                            // Calculate percentage of discount relative to total price
                            const percentage = ((discountAmount / dataForm.total_price) * 100).toFixed(2)

                            setDataForm(prev => ({
                              ...prev,
                              total_discount: discountAmount,
                              total_discount_additional: Number(percentage),
                              grand_total: dataForm.total_price - discountAmount + (rawValue ? parseFloat(rawValue) : 0)
                            }))
                          }}
                          sx={{ width: '150px' }}
                          inputProps={{
                            style: { textAlign: 'right' }
                          }}
                        />
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell align='right'>
                        <Typography>Biaya Pengiriman</Typography>
                      </TableCell>
                      <TableCell align='right'>
                        <TextField
                          size='small'
                          type='number'
                          name='total_charge'
                          placeholder='0'
                          value={FormaterHelper.formatRupiah(String(dataForm.total_charge))}
                          onChange={e => {
                            handleInput(e as React.ChangeEvent<HTMLInputElement>)
                            // Remove the formatRupiah before parsing to get raw number
                            const rawValue = e.target.value.replace(/[^0-9]/g, '')
                            const chargeAmount = parseFloat(rawValue) || 0

                            setDataForm(prev => ({
                              ...prev,
                              total_charge: chargeAmount,
                              grand_total: dataForm.total_price - (dataForm.total_discount || 0) + chargeAmount
                            }))
                          }}
                          sx={{ width: '150px' }}
                          inputProps={{
                            style: { textAlign: 'right' }
                          }}
                        />
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell align='right'>
                        <Typography className='font-bold'>Total</Typography>
                      </TableCell>
                      <TableCell align='right'>
                        <Typography className='font-bold'>
                          {FormaterHelper.formatRupiah(String(dataForm.grand_total))}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  )
}

export default SectionCalculation
