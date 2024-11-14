type YesOrNo = 'Y' | 'N'

export type paramsGetDataAll = {
  number?: number
  ref?: string
}

export type AcceptedOrderResponse = {
  number: string
  ref?: string | null
  branch_id: number
  vendor_id: number
  warehouse_id: number | undefined
  date: Date
  total_qty_request: number | 0
  total_qty_received: number | 0
  total_qty_over: number | 0
  total_discount: number | 0
  total_price: number | 0
  total_tax: number | 0
  total_charge: number | 0
  grand_total: number | 0
  description?: string | null
  created_at?: Date | null
  created_by?: string | null
  updated_at?: Date | null
  updated_by?: string | null
  archived: YesOrNo
  purchaseOrderDetail: AcceptedOrderDetailResponse[]
}

export type CreateAcceptedOrderRequest = {
  number: string
  date: string
  due_date: string
  term: string
  ref?: string
  branch_id: number
  warehouse_id: number | undefined
  vendor_id: number | undefined
  total_qty_request: number
  total_qty_received?: number | 0
  total_qty_over?: number | 0
  total_discount?: number | 0
  total_price: number
  total_tax?: number | 0
  total_charge?: number | 0
  grand_total?: number | 0
  description?: string | null
  created_at?: Date
  created_by?: string
  updated_at?: Date
  updated_by?: string
  archived?: YesOrNo
}

export type UpdateAcceptedOrderRequest = {
  number: string
  date?: Date
  due_date?: string
  term?: string
  ref?: string
  branch_id: number
  warehouse_id?: number
  vendor_id?: number
  total_qty_request?: number
  total_qty_received?: number
  total_qty_over?: number
  total_discount?: number
  total_price?: number
  total_tax?: number
  total_charge?: number
  grand_total?: number
  description?: string
  created_at?: Date
  created_by?: string
  updated_at?: Date
  updated_by?: string
  archived?: YesOrNo
}

export type ByNumberRequest = {
  number: string
}

// Detail
export type AcceptedOrderDetailResponse = {
  number: string
  sequence: number
  date: Date
  product_id: number
  unit_id: number
  branch_id: number
  warehouse_id?: number
  qty_request: number
  qty_received: number
  qty_over: number
  price: number
  price_discount: number
  percent_discount: number
  price_tax: number
  percent_tax: number
  charge: number
  created_at?: Date | null
  created_by?: string | null
  updated_at?: Date | null
  updated_by?: string | null
  initial: string
  unit_name: string
  product_name: string
}

export type CreateAcceptedOrderDetailRequest = {
  number: string
  sequence: number
  date: string
  product_id: number | undefined
  unit_id: number | undefined
  branch_id: number
  qty_request: number | 0
  qty_received?: number | 0
  qty_over?: number | 0
  price: number | 0
  price_discount?: number | 0
  percent_discount: number | 0
  price_tax?: number | 0
  percent_tax?: number | 0
  charge?: number | 0
  created_at?: Date
  created_by?: string
  updated_at?: Date
  updated_by?: string
}

export type UpdateAcceptedOrderDetailRequest = {
  id: number
  number?: number
  sequence: number
  date?: Date
  product_id?: number
  unit_id?: number
  branch_id?: number
  warehouse_id?: number
  qty_request?: number
  qty_received?: number
  qty_over?: number
  price?: number
  price_discount?: number
  percent_discount?: number
  price_tax?: number
  percent_tax?: number
  charge?: number
  created_at?: Date
  created_by?: string
  updated_at?: Date
  updated_by?: string
}

export type DetailAcceptedOrderType = {
  product_id: number
  product_name: string
  barcode: string
  qty_request: number
  qty_received: number
  qty_over: number
  price: number
  percent_discount: number
  total_price: number
  unit_name: string
  initial: string
  branch_name: string
}

export type AcceptedOrderType = {
  id: number
  number: string
  ref?: string
  date: Date
  due_date: Date
  term?: string
  description?: string | null
  total_qty_request: number
  total_qty_received: number
  total_qty_over: number
  total_price: number
  total_discount: number
  total_tax: number
  total_charge: number
  grand_total: number
  qty: number
  vendor_name: string
  vendor_id: number
  warehouse_id?: number
  warehouse_name?: string
  branch_name: string
  branch_id: number
  detail?: DetailAcceptedOrderType[]
  status_id: number
  status: string
}
