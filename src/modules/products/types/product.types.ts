import type {
  DynamicFieldDefinition,
} from '@/modules/categories/types/category.types'


export interface ProductCategory {
  id: number
  name: string
}


export interface ProductDynamicField
  extends DynamicFieldDefinition {
  category_id: number
  category_name: string
  value: unknown | null
}


export interface Product {
  id: number
  name: string

  categories: ProductCategory[]

  fields: ProductDynamicField[]

  created_at: string
  updated_at: string
}


export interface ProductAttributeValue {
  field_id: string
  value: unknown
}


export interface CreateProductPayload {
  name: string

  category_ids: number[]

  attributes: ProductAttributeValue[]
}


export interface UpdateProductPayload
  extends CreateProductPayload {}


export interface ProductListRequest {
  page_number: number
  page_size: number
  sort_by: string | null
  is_ascending: boolean
  filter: null

  search?: string
}