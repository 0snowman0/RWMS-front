import type {
  PagedResult,
} from '@/shared/types'

import {
  getWaybillTemplateById,
} from '@/modules/waybill-templates/mocks/waybillTemplateRepository.mock'

import type {
  Waybill,
  WaybillAttributeValue,
  WaybillDynamicField,
  WaybillListRequest,
  WaybillPayload,
  WaybillSummary,
} from '../types'


interface StoredWaybill
  extends Omit<
    WaybillSummary,
    | 'template_name'
  > {
  attributes:
    WaybillAttributeValue[]
}


let records:
  StoredWaybill[] = [
    {
      id:
        1,

      name:
        'انتقال بسته‌های معیشتی به انبار کرج',

      waybill_number:
        'WB-00000001',

      template_id:
        1,

      waybill_date:
        '2026-09-25',

      received_date:
        null,

      sender_name:
        'انبار مرکزی تهران',

      sender_contact:
        '02100000000',

      receiver_name:
        'انبار کرج',

      receiver_contact:
        '02600000000',

      origin:
        'تهران',

      destination:
        'کرج',

      vehicle_type:
        'کامیون',

      vehicle_number:
        'ایران 11 - 123 الف 45',

      driver_name:
        'علی رضایی',

      driver_contact:
        '09120000000',

      total_weight:
        3250,

      priority:
        'normal',

      status:
        'registered',

      description:
        'انتقال اقلام معیشتی',

      internal_notes:
        null,

      created_by:
        1,

      created_at:
        '2026-09-25T08:30:00Z',

      updated_at:
        '2026-09-25T08:30:00Z',

      attributes: [
        {
          field_id:
            '81000000-0000-4000-8000-000000000001',

          value:
            'general',
        },
        {
          field_id:
            '81000000-0000-4000-8000-000000000002',

          value: [
            'insurance',
            'tracking',
          ],
        },
        {
          field_id:
            '81000000-0000-4000-8000-000000000003',

          value:
            'PL-1405-18',
        },
        {
          field_id:
            '81000000-0000-4000-8000-000000000004',

          value:
            true,
        },
      ],
    },

    {
      id:
        2,

      name:
        'دریافت محموله اهدایی',

      waybill_number:
        'WB-00000002',

      template_id:
        2,

      waybill_date:
        '2026-09-26',

      received_date:
        '2026-09-26',

      sender_name:
        'جمعیت داوطلبان',

      sender_contact:
        null,

      receiver_name:
        'انبار تبریز',

      receiver_contact:
        null,

      origin:
        'زنجان',

      destination:
        'تبریز',

      vehicle_type:
        'وانت',

      vehicle_number:
        null,

      driver_name:
        null,

      driver_contact:
        null,

      total_weight:
        820,

      priority:
        'normal',

      status:
        'registered',

      description:
        null,

      internal_notes:
        null,

      created_by:
        1,

      created_at:
        '2026-09-26T10:15:00Z',

      updated_at:
        '2026-09-26T10:15:00Z',

      attributes: [
        {
          field_id:
            '82000000-0000-4000-8000-000000000001',

          value:
            'جمعیت داوطلبان',
        },
        {
          field_id:
            '82000000-0000-4000-8000-000000000002',

          value:
            'new',
        },
      ],
    },
  ]


function delay(
  milliseconds = 180,
) {
  return new Promise<void>(
    (resolve) =>
      window.setTimeout(
        resolve,
        milliseconds,
      ),
  )
}


function clone<T>(
  value: T,
): T {
  return structuredClone(
    value,
  )
}


async function getTemplateName(
  templateId: number,
) {
  const template =
    await getWaybillTemplateById(
      templateId,
    )

  return (
    template?.name ??
    `قالب #${templateId}`
  )
}


export async function listWaybills(
  request:
    WaybillListRequest,
): Promise<
  PagedResult<
    WaybillSummary
  >
> {
  await delay()

  const search =
    request.search
      ?.trim()
      .toLocaleLowerCase(
        'fa',
      ) ?? ''


  let filtered =
    [...records]


  if (search) {
    filtered =
      filtered.filter(
        (item) =>
          item.name
            .toLocaleLowerCase(
              'fa',
            )
            .includes(
              search,
            ) ||
          (
            item.waybill_number ??
            ''
          )
            .toLocaleLowerCase(
              'fa',
            )
            .includes(
              search,
            ) ||
          (
            item.origin ??
            ''
          )
            .toLocaleLowerCase(
              'fa',
            )
            .includes(
              search,
            ) ||
          (
            item.destination ??
            ''
          )
            .toLocaleLowerCase(
              'fa',
            )
            .includes(
              search,
            ),
      )
  }


  if (
    request.sort_by
  ) {
    filtered.sort(
      (a, b) => {
        let compare =
          0

        if (
          request.sort_by ===
          'name'
        ) {
          compare =
            a.name.localeCompare(
              b.name,
              'fa',
            )
        } else if (
          request.sort_by ===
          'waybill_date'
        ) {
          compare =
            (
              a.waybill_date ??
              ''
            ).localeCompare(
              b.waybill_date ??
              '',
            )
        } else {
          compare =
            (
              a.updated_at ??
              ''
            ).localeCompare(
              b.updated_at ??
              '',
            )
        }

        return request
          .is_ascending
          ? compare
          : -compare
      },
    )
  }


  const totalCount =
    filtered.length

  const totalPages =
    Math.max(
      1,
      Math.ceil(
        totalCount /
          request.page_size,
      ),
    )

  const page =
    Math.min(
      request.page_number,
      totalPages,
    )

  const start =
    (page - 1) *
    request.page_size


  const pageRecords =
    filtered.slice(
      start,
      start +
        request.page_size,
    )


  const items:
    WaybillSummary[] =
      []

  for (
    const record of
    pageRecords
  ) {
    items.push({
      ...record,

      template_name:
        await getTemplateName(
          record.template_id,
        ),
    })
  }


  return {
    items,

    total_count:
      totalCount,

    page_number:
      page,

    page_size:
      request.page_size,

    total_pages:
      totalPages,

    has_previous_page:
      page > 1,

    has_next_page:
      page <
      totalPages,
  }
}


export async function getWaybillById(
  id: number,
): Promise<
  Waybill | null
> {
  await delay(120)

  const record =
    records.find(
      (item) =>
        item.id === id,
    )

  if (!record) {
    return null
  }


  const template =
    await getWaybillTemplateById(
      record.template_id,
    )


  const attributeMap =
    new Map(
      record.attributes.map(
        (attribute) => [
          attribute.field_id,
          attribute.value,
        ],
      ),
    )


  const fields:
    WaybillDynamicField[] =
      template
        ? template.fields.map(
            (field) => ({
              ...field,

              template_id:
                template.id,

              template_name:
                template.name,

              value:
                attributeMap.has(
                  field.field_id,
                )
                  ? attributeMap.get(
                      field.field_id,
                    ) ?? null
                  : field.default_value ??
                    null,
            }),
          )
        : []


  return {
    ...clone(
      record,
    ),

    template:
      template
        ? {
            id:
              template.id,

            name:
              template.name,
          }
        : null,

    template_name:
      template?.name,

    fields,
  }
}


export async function createWaybill(
  payload:
    WaybillPayload,
): Promise<
  Waybill
> {
  await delay(250)

  const id =
    records.length ===
      0
      ? 1
      : Math.max(
          ...records.map(
            (item) =>
              item.id ??
              0,
          ),
        ) + 1

  const now =
    new Date().toISOString()


  const record:
    StoredWaybill = {
      id,

      name:
        payload.name.trim(),

      waybill_number:
        payload.waybill_number,

      template_id:
        payload.template_id,

      waybill_date:
        payload.waybill_date,

      received_date:
        payload.received_date,

      sender_name:
        payload.sender_name,

      sender_contact:
        payload.sender_contact,

      receiver_name:
        payload.receiver_name,

      receiver_contact:
        payload.receiver_contact,

      origin:
        payload.origin,

      destination:
        payload.destination,

      vehicle_type:
        payload.vehicle_type,

      vehicle_number:
        payload.vehicle_number,

      driver_name:
        payload.driver_name,

      driver_contact:
        payload.driver_contact,

      total_weight:
        payload.total_weight,

      priority:
        payload.priority,

      status:
        payload.status,

      description:
        payload.description,

      internal_notes:
        payload.internal_notes,

      created_by:
        1,

      created_at:
        now,

      updated_at:
        now,

      attributes:
        clone(
          payload.attributes,
        ),
    }


  records = [
    record,
    ...records,
  ]


  const created =
    await getWaybillById(
      id,
    )

  if (!created) {
    throw new Error(
      'Waybill creation failed.',
    )
  }

  return created
}


export async function updateWaybill(
  id: number,
  payload:
    WaybillPayload,
): Promise<
  Waybill
> {
  await delay(250)

  const current =
    records.find(
      (item) =>
        item.id === id,
    )

  if (!current) {
    throw new Error(
      'Waybill not found.',
    )
  }


  const updated:
    StoredWaybill = {
      ...current,

      name:
        payload.name.trim(),

      waybill_number:
        payload.waybill_number,

      template_id:
        payload.template_id,

      waybill_date:
        payload.waybill_date,

      received_date:
        payload.received_date,

      sender_name:
        payload.sender_name,

      sender_contact:
        payload.sender_contact,

      receiver_name:
        payload.receiver_name,

      receiver_contact:
        payload.receiver_contact,

      origin:
        payload.origin,

      destination:
        payload.destination,

      vehicle_type:
        payload.vehicle_type,

      vehicle_number:
        payload.vehicle_number,

      driver_name:
        payload.driver_name,

      driver_contact:
        payload.driver_contact,

      total_weight:
        payload.total_weight,

      priority:
        payload.priority,

      status:
        payload.status,

      description:
        payload.description,

      internal_notes:
        payload.internal_notes,

      attributes:
        clone(
          payload.attributes,
        ),

      updated_at:
        new Date().toISOString(),
  }


  records =
    records.map(
      (item) =>
        item.id === id
          ? updated
          : item,
    )


  const result =
    await getWaybillById(
      id,
    )

  if (!result) {
    throw new Error(
      'Waybill update failed.',
    )
  }

  return result
}


export async function deleteWaybill(
  id: number,
): Promise<void> {
  await delay()

  records =
    records.filter(
      (item) =>
        item.id !== id,
    )
}