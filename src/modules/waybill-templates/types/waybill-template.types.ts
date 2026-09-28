import type {
  DynamicFieldDefinition,
} from '@/shared/dynamic-fields'


export interface WaybillTemplate {
  id: number

  name: string

  description:
    string | null

  is_active: boolean

  fields:
    DynamicFieldDefinition[]

  created_at:
    string | null

  updated_at:
    string | null
}


export interface WaybillTemplateSummary {
  id: number

  name: string

  description:
    string | null

  is_active: boolean

  created_at:
    string | null

  updated_at:
    string | null
}


export interface WaybillTemplatePayload {
  name: string

  description:
    string | null

  is_active: boolean

  fields:
    DynamicFieldDefinition[]
}


export interface WaybillTemplateListRequest {
  page_number: number

  page_size: number

  sort_by:
    string | null

  is_ascending:
    boolean

  search?: string

  status?:
    | 'all'
    | 'active'
    | 'inactive'
}