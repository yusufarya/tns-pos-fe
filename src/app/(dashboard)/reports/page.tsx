import PageTitle from '@/@layouts/components/vertical/PageTitle'
import Link from '@/components/Link'
import { Add } from '@mui/icons-material'
import { Button, Grid, Paper, Typography } from '@mui/material'

const Reports = () => {
  return (
    <div>
      <PageTitle>
        <div className='grid grid-flow-row-dense grid-cols-2 grid-rows-1 mb-8 px-1 rounded-sm'>
          <div className='flex-none'>
            <Typography variant='h3' component='h4' className='p-3'>
              Laporan
            </Typography>
          </div>
        </div>
      </PageTitle>

      {/* LAPORAN PERSEDIAAN */}
      <Paper className='shadow-lg p-3'>
        <div className='mx-3'>
          <h5>Persediaan Barang</h5>
        </div>
        <Grid container spacing={2} className='mb-3'>
          <Grid item xs={6}>
            <div className='p-5 m-2 border-2 border-blue-100 rounded-md'>
              <Link href={`/`} className='hover:text-blue-500 text-gray-900 py-3'>
                Laporan Persediaan Produk
              </Link>
            </div>
            <div className='p-5 m-2 border-2 border-blue-100 rounded-md'>
              <Link href={`/`} className='hover:text-blue-500 text-gray-900 py-3'>
                Laporan Pembelian Produk
              </Link>
            </div>
            <div className='p-5 m-2 border-2 border-blue-100 rounded-md'>
              <Link href={`/`} className='hover:text-blue-500 text-gray-900 py-3'>
                Laporan Penjualan Produk
              </Link>
            </div>
          </Grid>
          <Grid item xs={6}>
            <div className='p-5 m-2 border-2 border-blue-100 rounded-md'>
              <Link href={`/`} className='hover:text-blue-500 text-gray-900 py-3'>
                Laporan Transfer Gudang
              </Link>
            </div>
            <div className='p-5 m-2 border-2 border-blue-100 rounded-md'>
              <Link href={`/`} className='hover:text-blue-500 text-gray-900 py-3'>
                Laporan Penyesuaian Persediaan
              </Link>
            </div>
            <div className='p-5 m-2 border-2 border-blue-100 rounded-md'>
              <Link href={`/`} className='hover:text-blue-500 text-gray-900 py-3'>
                Laporan Historis Produk
              </Link>
            </div>
          </Grid>
        </Grid>

        {/* LAPORAN KEUANGAN */}
        <div className='mx-3'>
          <h5>Keuangan</h5>
        </div>
        <Grid container spacing={2} className='mb-3'>
          <Grid item xs={6}>
            <div className='p-5 m-2 border-2 border-blue-100 rounded-md'>
              <Link href={`/`} className='hover:text-blue-500 text-gray-900 py-3'>
                Laporan Hutang
              </Link>
            </div>
            <div className='p-5 m-2 border-2 border-blue-100 rounded-md'>
              <Link href={`/`} className='hover:text-blue-500 text-gray-900 py-3'>
                Laporan Piutang
              </Link>
            </div>
          </Grid>
        </Grid>
      </Paper>
    </div>
  )
}

export default Reports
