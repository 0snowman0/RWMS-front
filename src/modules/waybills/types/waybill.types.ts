import type {
  DynamicFieldDefinition,
} from '@/shared/dynamic-fields'


export interface WaybillTemplateReference {
  id: number
  name: string
}


export interface WaybillAttributeValue {
  field_id: string
  value: unknown
}


export interface WaybillDynamicField
  extends DynamicFieldDefinition {
  template_id: number

  template_name: string

  value:
    unknown | null
}


export interface WaybillSummary {
  id:
    number | null

  name: string

  waybill_number:
    string | null

  template_id: number

  waybill_date:
    string | null

  received_date:
    string | null

  sender_name:
    string | null

  sender_contact:
    string | null

  receiver_name:
    string | null

  receiver_contact:
    string | null

  origin:
    string | null

  destination:
    string | null

  vehicle_type:
    string | null

  vehicle_number:
    string | null

  driver_name:
    string | null

  driver_contact:
    string | null

  total_weight:
    number | null

  priority: string

  status: string

  description:
    string | null

  internal_notes:
    string | null

  created_by:
    number | null

  created_at:
    string | null

  updated_at:
    string | null

  template_name?:
    string
}


export interface Waybill
  extends WaybillSummary {
  template:
    WaybillTemplateReference |
    null

  fields:
    WaybillDynamicField[]
}


export interface WaybillPayload {
  name: string

  template_id: number

  waybill_number:
    string | null

  waybill_date:
    string | null

  received_date:
    string | null

  sender_name:
    string | null

  sender_contact:
    string | null

  receiver_name:
    string | null

  receiver_contact:
    string | null

  origin:
    string | null

  destination:
    string | null

  vehicle_type:
    string | null

  vehicle_number:
    string | null

  driver_name:
    string | null

  driver_contact:
    string | null

  total_weight:
    number | null

  priority: string

  status: string

  description:
    string | null

  internal_notes:
    string | null

  attributes:
    WaybillAttributeValue[]
}


export interface WaybillListRequest {
  page_number: number

  page_size: number

  sort_by:
    string | null

  is_ascending:
    boolean

  search?: string
}