export const dynamicFieldTypes = [
  'string',
  'integer',
  'decimal',
  'boolean',
  'date',
  'datetime',
  'select',
  'multi_select',
] as const


export type DynamicFieldType =
  (typeof dynamicFieldTypes)[number]


export interface DynamicFieldOption {
  value: string
  label: string
}


export interface DynamicFieldDefinition {
  field_id: string

  name: string
  title: string

  field_type:
    DynamicFieldType

  required: boolean
  unique: boolean

  default_value:
    unknown | null

  auto_generate: boolean
  readonly: boolean
  is_active: boolean

  sort_order: number

  unit:
    string | null

  placeholder:
    string | null

  description:
    string | null

  show_in_list: boolean

  min_value:
    string |
    number |
    null

  max_value:
    string |
    number |
    null

  decimal_places:
    number | null

  min_length:
    number | null

  max_length:
    number | null

  regex:
    string | null

  options:
    DynamicFieldOption[]

  settings:
    Record<
      string,
      unknown
    >
}