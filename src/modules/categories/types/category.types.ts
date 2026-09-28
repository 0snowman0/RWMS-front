import type {
  DynamicFieldDefinition,
} from '@/shared/dynamic-fields'


export {
  dynamicFieldTypes,
} from '@/shared/dynamic-fields'


export type {
  DynamicFieldDefinition,
  DynamicFieldOption,
  DynamicFieldType,
} from '@/shared/dynamic-fields'


export interface Category {
  id: number

  name: string

  description:
    string | null

  fields:
    DynamicFieldDefinition[]

  created_at: string

  updated_at: string
}