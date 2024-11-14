// Define your types here
export type IsActive = 'Y' | 'N'
export type YesOrNo = 'Y' | 'N'

export interface Inventory {
  id: number
  warehouse_name: string
  stock: number
}
export interface Category {
  name: string
}
export interface Unit {
  initial: string
  name: string
}

export interface ProductResponse {
  id: number
  category_id: number
  category: Category
  unit_id: number
  unit: Unit
  brand_id: number
  barcode?: string | null
  name: string
  min_stock?: number | 0
  max_stock?: number | 0
  purchase_price: number | 0
  selling_price: number | 0
  description?: string | null
  inventory?: Inventory[]
  pos: YesOrNo
  image?: string
  is_active?: IsActive
  created_at?: Date | null
  created_by?: string | null
  updated_at?: Date | null
  updated_by?: string | null
}

export type CreateProductRequest = {
  category_id: number
  unit_id: number
  brand_id: number
  name: string
  barcode?: string
  min_stock?: number
  max_stock?: number
  purchase_price: number
  selling_price: number
  description?: string
  pos?: YesOrNo
  image?: string[] | []
  is_active?: IsActive
  created_at?: Date
  created_by?: string
  updated_at?: Date
  updated_by?: string
}

export type UpdateProductRequest = {
  id: number
  category_id?: number
  unit_id?: number
  brand_id?: number
  name?: string
  min_stock?: number
  max_stock?: number
  purchase_price?: number
  selling_price?: number
  barcode?: string
  description?: string
  pos?: YesOrNo
  image?: string[] | []
  is_active?: IsActive
  created_at?: Date
  created_by?: string
  updated_at?: Date
  updated_by?: string
}

export type CategoryResponse = {
  id: number
  name: string
  description?: string | null
  created_at?: Date | null
  created_by?: string | null
  updated_at?: Date | null
  updated_by?: string | null
}

export type CreateCategoryRequest = {
  id?: number | null
  name?: string
  description?: string
  created_at?: Date
  created_by?: string
  updated_at?: Date
  updated_by?: string
}

export type UpdateCategoryRequest = {
  id: number
  name?: string
  name_current: string
  description?: string
  created_at?: Date
  created_by?: string
  updated_at?: Date
  updated_by?: string
}

export type UnitResponse = {
  id: number
  initial: string
  name: string
  description?: string | null
  is_active: string
  created_at?: Date | null
  created_by?: string | null
  updated_at?: Date | null
  updated_by?: string | null
}

export type BrandResponse = {
  id: number
  name: string
  is_active: string
  description?: string | null
  created_at?: Date | null
  created_by?: string | null
  updated_at?: Date | null
  updated_by?: string | null
}

export interface ProductByInventory {
  product_id: number
  product_name: string
  barcode: string
  initial: string
  stock: number
  hpp: number
  price_value: number
}

export type WarehouseResponse = {
  id: number
  name: string
  branch_id: number
  phone: string | null
  address?: string | null
  product_detail: ProductByInventory[]
  description?: string | null
  stock?: string | null
  created_at?: Date | null
  created_by?: string | null
  updated_at?: Date | null
  updated_by?: string | null
}

export type CreateWarehouseRequest = {
  id?: number
  branch_id: number
  name: string
  phone: string
  address?: string
  description?: string
  created_at?: Date
  created_by?: string
  updated_at?: Date
  updated_by?: string
}

export type UpdateWarehouseRequest = {
  id: number
  branch_id?: number
  name?: string
  phone?: string
  address?: string
  description?: string
  created_at?: Date
  created_by?: string
  updated_at?: Date
  updated_by?: string
}

export type VendorResponse = {
  id: number,
  name: string,
  phone?: string | null,
  address?: string | null,
}
