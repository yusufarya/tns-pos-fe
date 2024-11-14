export type InventoryType = {
  id: number
  product_id: number
  warehouse_id: number
  branch_id: number
  unit_id: number
  initial: string
  debit: number
  credit: number
  stock: number
}

export type typeAdjust = 'in' | 'out'

export type StockAdjustmentResponse = {
  number: string
  ref?: string | null
  date: Date
  type: typeAdjust
  total_qty: number
  branch_id: number
  stockAdjustmentDetail: StockAdjustmentDetailResponse[]
  description?: string | null
  created_at?: Date | null
  created_by?: string | null
  updated_at?: Date | null
  updated_by?: string | null
}

export type CreateStockAdjustmentRequest = {
  number: string
  ref?: string
  date: string
  type: string
  warehouse_id: string
  qty: number
  total_qty: number
  branch_id: number
  description?: string
  created_at?: Date
  created_by?: string
  updated_at?: Date
  updated_by?: string
}

export type UpdateStockAdjustmentRequest = {
  number: string
  ref?: string
  date?: Date
  type?: typeAdjust
  warehouse_id?: string
  qty: number
  total_qty?: number
  branch_id?: number
  description?: string
  created_at?: Date
  created_by?: string
  updated_at?: Date
  updated_by?: string
}

export type StockAdjustmentDetailResponse = {
  number: string
  sequence: number
  date: Date
  qty: number
  product_id: number
  branch_id: number
  warehouse_id: number
  created_at?: Date | null
  created_by?: string | null
  updated_at?: Date | null
  updated_by?: string | null
}

export type CreateStockAdjustmentDetailRequest = {
  number: string
  sequence?: number
  date: Date
  qty: number
  product_id: number
  branch_id: number
  warehouse_id: number
  created_at?: Date
  created_by?: string
  updated_at?: Date
  updated_by?: string
}

export type UpdateStockAdjustmentDetailRequest = {
  id: number
  number: string
  sequence?: number
  date?: Date
  qty?: number
  qty_current?: number
  product_id?: number
  branch_id?: number
  warehouse_id?: number
  created_at?: Date
  created_by?: string
  updated_at?: Date
  updated_by?: string
}

export type WarehouseTransferResponse = {
  number: string
  ref?: string
  date: Date
  wh_from: number
  wh_to: number
  warehouse_from_name: string
  warehouse_to_name: string
  warehouseTransferDetail: WarehouseTransferDetailResponse[]
  total_qty: number
  branch_id: number
  description?: string | null
  created_at?: Date | null
  created_by?: string | null
  updated_at?: Date | null
  updated_by?: string | null
}

export type DetailWarehouseTransferType = {
  product_name: string;
  initial: string;
  barcode: string;
  qty:number;
  branch_name: string;
}

export type WarehouseTransferType = {
  id: number;
  number: string
  ref?: string
  date: Date
  description?: string | null
  total_qty: number;
  product_name: string;
  barcode: string;
  qty:number;
  warehouse_from_name: string
  warehouse_to_name: string
  branch_name: string;
  detail?: DetailWarehouseTransferType[]
}

export type CreateWarehouseTransferRequest = {
  number: string
  ref?: string
  date: string
  wh_from: number
  wh_to: number
  qty: number
  total_qty: number
  branch_id: number
  description?: string
  created_at?: Date
  created_by?: string
  updated_at?: Date
  updated_by?: string
}

export type UpdateWarehouseTransferRequest = {
  number: string
  ref?: string
  date?: Date
  wh_from?: number
  wh_to?: number
  total_qty?: number
  branch_id?: number
  description?: string
  created_at?: Date
  created_by?: string
  updated_at?: Date
  updated_by?: string
}

export type WarehouseTransferDetailResponse = {
  number: string
  sequence: number
  date: Date
  qty: number
  product_id: number
  branch_id: number
  created_at?: Date | null
  created_by?: string | null
  updated_at?: Date | null
  updated_by?: string | null
}

export type CreateWarehouseTransferDetailRequest = {
  number: string
  sequence: number
  date: Date
  qty: number
  product_id: number
  branch_id: number
  created_at?: Date
  created_by?: string
  updated_at?: Date
  updated_by?: string
}

export type UpdateWarehouseTransferDetailRequest = {
  id: number
  number: string
  sequence?: number
  date?: Date
  qty?: number
  qty_current?: number
  product_id?: number
  branch_id?: number
  created_at?: Date
  created_by?: string
  updated_at?: Date
  updated_by?: string
}
