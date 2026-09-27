import type {
  DynamicFieldType,
} from '../types/category.types'

const fieldTypeLabels: Record<
  DynamicFieldType,
  string
> = {
  string: 'متن',
  integer: 'عدد صحیح',
  decimal: 'عدد اعشاری',
  boolean: 'بله / خیر',
  date: 'تاریخ',
  datetime: 'تاریخ و زمان',
  select: 'انتخاب از لیست',
  multi_select: 'انتخاب چندگانه',
}

export function getDynamicFieldTypeLabel(
  type: DynamicFieldType,
) {
  return fieldTypeLabels[type]
}