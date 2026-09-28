import type {
  DynamicFieldDefinition,
} from '@/shared/dynamic-fields'

import type {
  PagedResult,
} from '@/shared/types'

import type {
  WaybillTemplate,
  WaybillTemplateListRequest,
  WaybillTemplatePayload,
  WaybillTemplateSummary,
} from '../types'


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


const transferFields:
  DynamicFieldDefinition[] = [
    {
      field_id:
        '81000000-0000-4000-8000-000000000001',

      name:
        'cargo_type',

      title:
        'نوع محموله',

      field_type:
        'select',

      required:
        true,

      unique:
        false,

      default_value:
        'general',

      auto_generate:
        false,

      readonly:
        false,

      is_active:
        true,

      sort_order:
        1,

      unit:
        null,

      placeholder:
        'نوع محموله را انتخاب کنید',

      description:
        'نوع محموله در حال انتقال',

      show_in_list:
        true,

      min_value:
        null,

      max_value:
        null,

      decimal_places:
        null,

      min_length:
        null,

      max_length:
        null,

      regex:
        null,

      options: [
        {
          value:
            'general',

          label:
            'عمومی',
        },
        {
          value:
            'perishable',

          label:
            'فاسدشدنی',
        },
        {
          value:
            'fragile',

          label:
            'شکستنی',
        },
        {
          value:
            'liquid',

          label:
            'مایعات',
        },
      ],

      settings: {
        searchable:
          true,
      },
    },

    {
      field_id:
        '81000000-0000-4000-8000-000000000002',

      name:
        'services',

      title:
        'خدمات اضافی',

      field_type:
        'multi_select',

      required:
        false,

      unique:
        false,

      default_value:
        [],

      auto_generate:
        false,

      readonly:
        false,

      is_active:
        true,

      sort_order:
        2,

      unit:
        null,

      placeholder:
        null,

      description:
        'خدمات جانبی موردنیاز برای حمل',

      show_in_list:
        false,

      min_value:
        null,

      max_value:
        null,

      decimal_places:
        null,

      min_length:
        null,

      max_length:
        null,

      regex:
        null,

      options: [
        {
          value:
            'insurance',

          label:
            'بیمه بار',
        },
        {
          value:
            'loading',

          label:
            'بارگیری',
        },
        {
          value:
            'unloading',

          label:
            'تخلیه',
        },
        {
          value:
            'tracking',

          label:
            'رهگیری',
        },
      ],

      settings: {
        max_selections:
          3,
      },
    },

    {
      field_id:
        '81000000-0000-4000-8000-000000000003',

      name:
        'seal_number',

      title:
        'شماره پلمب',

      field_type:
        'string',

      required:
        false,

      unique:
        false,

      default_value:
        null,

      auto_generate:
        false,

      readonly:
        false,

      is_active:
        true,

      sort_order:
        3,

      unit:
        null,

      placeholder:
        'شماره پلمب محموله',

      description:
        'در صورت وجود، شماره پلمب ثبت شود.',

      show_in_list:
        true,

      min_value:
        null,

      max_value:
        null,

      decimal_places:
        null,

      min_length:
        2,

      max_length:
        50,

      regex:
        null,

      options:
        [],

      settings:
        {},
    },

    {
      field_id:
        '81000000-0000-4000-8000-000000000004',

      name:
        'is_insured',

      title:
        'محموله بیمه شده است',

      field_type:
        'boolean',

      required:
        false,

      unique:
        false,

      default_value:
        false,

      auto_generate:
        false,

      readonly:
        false,

      is_active:
        true,

      sort_order:
        4,

      unit:
        null,

      placeholder:
        null,

      description:
        'وضعیت بیمه محموله',

      show_in_list:
        true,

      min_value:
        null,

      max_value:
        null,

      decimal_places:
        null,

      min_length:
        null,

      max_length:
        null,

      regex:
        null,

      options:
        [],

      settings:
        {},
    },
  ]


const donationFields:
  DynamicFieldDefinition[] = [
    {
      field_id:
        '82000000-0000-4000-8000-000000000001',

      name:
        'donor_reference',

      title:
        'مرجع اهدا',

      field_type:
        'string',

      required:
        true,

      unique:
        false,

      default_value:
        null,

      auto_generate:
        false,

      readonly:
        false,

      is_active:
        true,

      sort_order:
        1,

      unit:
        null,

      placeholder:
        'نام فرد یا سازمان اهداکننده',

      description:
        null,

      show_in_list:
        true,

      min_value:
        null,

      max_value:
        null,

      decimal_places:
        null,

      min_length:
        2,

      max_length:
        150,

      regex:
        null,

      options:
        [],

      settings:
        {},
    },

    {
      field_id:
        '82000000-0000-4000-8000-000000000002',

      name:
        'donation_condition',

      title:
        'وضعیت اقلام اهدایی',

      field_type:
        'select',

      required:
        true,

      unique:
        false,

      default_value:
        'new',

      auto_generate:
        false,

      readonly:
        false,

      is_active:
        true,

      sort_order:
        2,

      unit:
        null,

      placeholder:
        'وضعیت کالا را انتخاب کنید',

      description:
        null,

      show_in_list:
        true,

      min_value:
        null,

      max_value:
        null,

      decimal_places:
        null,

      min_length:
        null,

      max_length:
        null,

      regex:
        null,

      options: [
        {
          value:
            'new',

          label:
            'نو',
        },
        {
          value:
            'good',

          label:
            'سالم',
        },
        {
          value:
            'review',

          label:
            'نیازمند بررسی',
        },
      ],

      settings:
        {},
    },

    {
      field_id:
        '82000000-0000-4000-8000-000000000003',

      name:
        'delivery_notes',

      title:
        'توضیحات تحویل',

      field_type:
        'string',

      required:
        false,

      unique:
        false,

      default_value:
        null,

      auto_generate:
        false,

      readonly:
        false,

      is_active:
        true,

      sort_order:
        3,

      unit:
        null,

      placeholder:
        'توضیحات تکمیلی درباره تحویل اقلام',

      description:
        null,

      show_in_list:
        false,

      min_value:
        null,

      max_value:
        null,

      decimal_places:
        null,

      min_length:
        0,

      max_length:
        1000,

      regex:
        null,

      options:
        [],

      settings:
        {},
    },
  ]


const coldChainFields:
  DynamicFieldDefinition[] = [
    {
      field_id:
        '83000000-0000-4000-8000-000000000001',

      name:
        'required_temperature',

      title:
        'دمای حمل',

      field_type:
        'decimal',

      required:
        true,

      unique:
        false,

      default_value:
        4,

      auto_generate:
        false,

      readonly:
        false,

      is_active:
        true,

      sort_order:
        1,

      unit:
        '°C',

      placeholder:
        'دمای مناسب حمل',

      description:
        'دمای موردنیاز محفظه حمل',

      show_in_list:
        true,

      min_value:
        -30,

      max_value:
        30,

      decimal_places:
        1,

      min_length:
        null,

      max_length:
        null,

      regex:
        null,

      options:
        [],

      settings:
        {},
    },

    {
      field_id:
        '83000000-0000-4000-8000-000000000002',

      name:
        'temperature_monitoring',

      title:
        'ثبت دمای مستمر',

      field_type:
        'boolean',

      required:
        false,

      unique:
        false,

      default_value:
        true,

      auto_generate:
        false,

      readonly:
        false,

      is_active:
        true,

      sort_order:
        2,

      unit:
        null,

      placeholder:
        null,

      description:
        null,

      show_in_list:
        true,

      min_value:
        null,

      max_value:
        null,

      decimal_places:
        null,

      min_length:
        null,

      max_length:
        null,

      regex:
        null,

      options:
        [],

      settings:
        {},
    },
  ]


let templates:
  WaybillTemplate[] = [
    {
      id:
        1,

      name:
        'قالب انتقال بین انبارها',

      description:
        'قالب عمومی برای انتقال محموله بین انبارهای سازمان',

      is_active:
        true,

      fields:
        transferFields,

      created_at:
        '2026-09-19T16:59:42Z',

      updated_at:
        '2026-09-19T16:59:42Z',
    },

    {
      id:
        2,

      name:
        'قالب دریافت کمک اهدایی',

      description:
        'قالب ثبت انتقال کمک‌ها و اقلام اهدایی',

      is_active:
        true,

      fields:
        donationFields,

      created_at:
        '2026-09-21T08:00:00Z',

      updated_at:
        '2026-09-21T08:00:00Z',
    },

    {
      id:
        3,

      name:
        'قالب حمل سردخانه‌ای',

      description:
        'قالب حمل کالاهای حساس به دما',

      is_active:
        false,

      fields:
        coldChainFields,

      created_at:
        '2026-09-22T09:00:00Z',

      updated_at:
        '2026-09-22T09:00:00Z',
    },
  ]


function toSummary(
  template:
    WaybillTemplate,
): WaybillTemplateSummary {
  return {
    id:
      template.id,

    name:
      template.name,

    description:
      template.description,

    is_active:
      template.is_active,

    created_at:
      template.created_at,

    updated_at:
      template.updated_at,
  }
}


export async function listWaybillTemplates(
  request:
    WaybillTemplateListRequest,
): Promise<
  PagedResult<
    WaybillTemplateSummary
  >
> {
  await delay()

  let result =
    [...templates]


  const search =
    request.search
      ?.trim()
      .toLocaleLowerCase(
        'fa',
      ) ?? ''


  if (search) {
    result =
      result.filter(
        (template) =>
          template.name
            .toLocaleLowerCase(
              'fa',
            )
            .includes(
              search,
            ) ||
          (
            template.description ??
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
    request.status ===
    'active'
  ) {
    result =
      result.filter(
        (template) =>
          template.is_active,
      )
  }


  if (
    request.status ===
    'inactive'
  ) {
    result =
      result.filter(
        (template) =>
          !template.is_active,
      )
  }


  if (
    request.sort_by
  ) {
    result.sort(
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
          'created_at'
        ) {
          compare =
            (
              a.created_at ??
              ''
            ).localeCompare(
              b.created_at ??
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
    result.length

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


  return {
    items:
      result
        .slice(
          start,
          start +
            request.page_size,
        )
        .map(
          toSummary,
        ),

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


export async function getWaybillTemplateById(
  id: number,
): Promise<
  WaybillTemplate | null
> {
  await delay(120)

  const template =
    templates.find(
      (item) =>
        item.id === id,
    )

  return template
    ? clone(
        template,
      )
    : null
}


export async function getActiveWaybillTemplates():
  Promise<
    WaybillTemplate[]
  > {
  await delay(120)

  return templates
    .filter(
      (template) =>
        template.is_active,
    )
    .map(
      clone,
    )
}


export async function createWaybillTemplate(
  payload:
    WaybillTemplatePayload,
): Promise<
  WaybillTemplate
> {
  await delay(250)

  const id =
    templates.length ===
      0
      ? 1
      : Math.max(
          ...templates.map(
            (item) =>
              item.id,
          ),
        ) + 1

  const now =
    new Date().toISOString()

  const template:
    WaybillTemplate = {
      id,

      name:
        payload.name.trim(),

      description:
        payload.description
          ?.trim() ||
        null,

      is_active:
        payload.is_active,

      fields:
        clone(
          payload.fields,
        ),

      created_at:
        now,

      updated_at:
        now,
    }

  templates = [
    template,
    ...templates,
  ]

  return clone(
    template,
  )
}


export async function updateWaybillTemplate(
  id: number,
  payload:
    WaybillTemplatePayload,
): Promise<
  WaybillTemplate
> {
  await delay(250)

  const current =
    templates.find(
      (template) =>
        template.id === id,
    )

  if (!current) {
    throw new Error(
      'Template not found.',
    )
  }

  const updated:
    WaybillTemplate = {
      ...current,

      name:
        payload.name.trim(),

      description:
        payload.description
          ?.trim() ||
        null,

      is_active:
        payload.is_active,

      fields:
        clone(
          payload.fields,
        ),

      updated_at:
        new Date().toISOString(),
  }

  templates =
    templates.map(
      (template) =>
        template.id === id
          ? updated
          : template,
    )

  return clone(
    updated,
  )
}


export async function deleteWaybillTemplate(
  id: number,
): Promise<void> {
  await delay()

  templates =
    templates.filter(
      (template) =>
        template.id !== id,
    )
}