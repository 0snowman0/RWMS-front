export const waybillPriorities = [
  {
    value: 'low',
    label: 'کم',
  },
  {
    value: 'normal',
    label: 'عادی',
  },
  {
    value: 'high',
    label: 'بالا',
  },
  {
    value: 'urgent',
    label: 'فوری',
  },
] as const


export type WaybillPriority =
  (typeof waybillPriorities)[number]['value']


export const waybillStatuses = [
  {
    value: 'registered',
    label: 'ثبت‌شده',
  },
  {
    value: 'pending_approval',
    label: 'در انتظار تأیید',
  },
  {
    value: 'approved',
    label: 'تأییدشده',
  },
  {
    value: 'receiving',
    label: 'در حال دریافت',
  },
  {
    value: 'received',
    label: 'دریافت‌شده',
  },
  {
    value: 'partially_received',
    label: 'دریافت جزئی',
  },
  {
    value: 'cancelled',
    label: 'لغوشده',
  },
] as const


export type WaybillStatus =
  (typeof waybillStatuses)[number]['value']


export function getWaybillPriorityLabel(
  value: string,
) {
  return (
    waybillPriorities.find(
      (item) =>
        item.value === value,
    )?.label ??
    value
  )
}


export function getWaybillStatusLabel(
  value: string,
) {
  return (
    waybillStatuses.find(
      (item) =>
        item.value === value,
    )?.label ??
    value
  )
}