import { DataGrid, GridColDef } from '@mui/x-data-grid'
import { Theme } from '@mui/material'

interface DataTableProps {
  rows: any[]; // Ganti dengan tipe yang sesuai untuk data produk Anda
  columns: GridColDef[];
  theme: Theme;
}

const DataTableProduct: React.FC<DataTableProps> = ({ rows, columns, theme }) => {
  return (
    <div style={{ width: '100%' }}>
      <DataGrid
        sx={{
          '& .MuiDataGrid-columnHeader': {
            borderRight: '1px solid #303030',
            ...theme.applyStyles('light', {
              borderRightColor: '#f0f0f0'
            }),
            backgroundColor: `${
              theme.palette.mode === 'dark'
                ? theme.palette.grey[900]
                : theme.palette.grey[50]
            } !important`,
            color: `${
              theme.palette.mode === 'dark'
                ? theme.palette.common.white
                : theme.palette.common.black
            } !important`
          }
        }}
        rows={rows}
        columns={columns}
        pageSizeOptions={[5, 10]}
        disableRowSelectionOnClick
        hideFooterPagination={rows.length <= 5}
      />
    </div>
  )
}

export default DataTableProduct
