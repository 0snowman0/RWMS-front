import {
  ApiError,
  apiClient,
} from '@/shared/api'

import {
  getWaybillTemplateById,
} from '@/modules/waybill-templates/api/waybill-template.api'

import type {
  PagedResult,
} from '@/shared/types'

import type {
  Waybill,
  WaybillListRequest,
  WaybillPayload,
  WaybillSummary,
} from '../types'


interface ApiResponse<T> {
  is_success: boolean

  message: string | null

  errors: string[]

  data: T | null

  status: string
}


const WAYBILL_API_PATH =
  '/api/v1Waybills/V1'


function isRecord(
  value: unknown,
): value is Record<string, unknown> {
  return (
    typeof value === 'object' &&
    value !== null
  )
}


function getBackendMessage(
  data: unknown,
): string | null {
  if (!isRecord(data)) {
    return null
  }

  const errors =
    data.errors

  if (
    Array.isArray(errors)
  ) {
    const firstError =
      errors.find(
        (item) =>
          typeof item === 'string' &&
          item.trim(),
      )

    if (
      typeof firstError ===
      'string'
    ) {
      return firstError
    }
  }

  const message =
    data.message

  if (
    typeof message === 'string' &&
    message.trim()
  ) {
    return message
  }

  const detail =
    data.detail

  if (
    typeof detail === 'string' &&
    detail.trim()
  ) {
    return detail
  }

  return null
}


function throwNormalizedApiError(
  error: unknown,
  fallback: string,
): never {
  if (
    error instanceof ApiError
  ) {
    if (
      error.status >= 500
    ) {
      throw new Error(
        fallback,
      )
    }

    throw new Error(
      getBackendMessage(
        error.data,
      ) ??
        error.message ??
        fallback,
    )
  }

  if (
    error instanceof Error
  ) {
    throw error
  }

  throw new Error(
    fallback,
  )
}


function ensureSuccess<T>(
  response: ApiResponse<T>,
  fallback: string,
): T {
  if (
    !response.is_success ||
    response.data === null
  ) {
    throw new Error(
      response.errors[0] ??
        response.message ??
        fallback,
    )
  }

  return response.data
}


function buildAllWaybillsQuery(
  request:
    WaybillListRequest,
) {
  const params =
    new URLSearchParams()

  /*
   * Backend supports -1/-1.
   * Search is not supported by Backend,
   * so all records are loaded and the
   * existing UI Search/Pagination is
   * performed locally.
   */
  params.set(
    'page_number',
    '-1',
  )

  params.set(
    'page_size',
    '-1',
  )

  params.set(
    'is_ascending',
    String(
      request.is_ascending,
    ),
  )

  if (request.sort_by) {
    params.set(
      'sort_by',
      request.sort_by,
    )
  }

  return params.toString()
}


async function addTemplateNames(
  items:
    WaybillSummary[],
): Promise<
  WaybillSummary[]
> {
  const templateIds =
    [
      ...new Set(
        items.map(
          (item) =>
            item.template_id,
        ),
      ),
    ]

  const templateEntries =
    await Promise.all(
      templateIds.map(
        async (
          templateId,
        ) => {
          const template =
            await getWaybillTemplateById(
              templateId,
            )

          return [
            templateId,
            template?.name,
          ] as const
        },
      ),
    )

  const templateNames =
    new Map<
      number,
      string | undefined
    >(
      templateEntries,
    )

  return items.map(
    (item) => ({
      ...item,

      template_name:
        templateNames.get(
          item.template_id,
        ),
    }),
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
  try {
    const query =
      buildAllWaybillsQuery(
        request,
      )

    const response =
      await apiClient.get<
        ApiResponse<
          PagedResult<
            WaybillSummary
          >
        >
      >(
        `${WAYBILL_API_PATH}?${query}`,
      )

    const backendResult =
      ensureSuccess(
        response,
        'دریافت بارنامهها ناموفق بود.',
      )

    let items =
      await addTemplateNames(
        backendResult.items,
      )

    const search =
      request.search
        ?.trim()
        .toLocaleLowerCase(
          'fa',
        ) ?? ''

    if (search) {
      items =
        items.filter(
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

    const totalCount =
      items.length

    const totalPages =
      Math.max(
        1,
        Math.ceil(
          totalCount /
            request.page_size,
        ),
      )

    const pageNumber =
      Math.min(
        Math.max(
          1,
          request.page_number,
        ),
        totalPages,
      )

    const start =
      (
        pageNumber -
        1
      ) *
      request.page_size

    const pagedItems =
      items.slice(
        start,
        start +
          request.page_size,
      )

    return {
      items:
        pagedItems,

      total_count:
        totalCount,

      page_number:
        pageNumber,

      page_size:
        request.page_size,

      total_pages:
        totalPages,

      has_previous_page:
        pageNumber > 1,

      has_next_page:
        pageNumber <
        totalPages,
    }
  } catch (error) {
    throwNormalizedApiError(
      error,
      'دریافت بارنامهها ناموفق بود.',
    )
  }
}


export async function getWaybillById(
  waybillId: number,
): Promise<
  Waybill | null
> {
  try {
    const response =
      await apiClient.get<
        ApiResponse<
          Waybill
        >
      >(
        `${WAYBILL_API_PATH}/${waybillId}`,
      )

    return ensureSuccess(
      response,
      'دریافت بارنامه ناموفق بود.',
    )
  } catch (error) {
    if (
      error instanceof ApiError &&
      error.status === 404
    ) {
      return null
    }

    throwNormalizedApiError(
      error,
      'دریافت بارنامه ناموفق بود.',
    )
  }
}


export async function createWaybill(
  payload:
    WaybillPayload,
): Promise<void> {
  try {
    const response =
      await apiClient.post<
        ApiResponse<
          Waybill
        >
      >(
        `${WAYBILL_API_PATH}/create`,
        payload,
      )

    if (
      !response.is_success
    ) {
      throw new Error(
        response.errors[0] ??
          response.message ??
          'ثبت بارنامه ناموفق بود.',
      )
    }

    /*
     * Do not rely on response.data.id.
     * Backend builds Create DTO before
     * flush/commit, so id/timestamps can
     * still be null in the response.
     */
  } catch (error) {
    if (
      error instanceof ApiError &&
      error.status === 409
    ) {
      throw new Error(
        'شماره بارنامه واردشده قبلا ثبت شده است.',
      )
    }

    throwNormalizedApiError(
      error,
      'ثبت بارنامه ناموفق بود.',
    )
  }
}


export async function updateWaybill(
  waybillId: number,
  payload:
    WaybillPayload,
): Promise<void> {
  try {
    const response =
      await apiClient.put<
        ApiResponse<
          Waybill
        >
      >(
        `${WAYBILL_API_PATH}/${waybillId}`,
        payload,
      )

    if (
      !response.is_success
    ) {
      throw new Error(
        response.errors[0] ??
          response.message ??
          'ویرایش بارنامه ناموفق بود.',
      )
    }

    /*
     * Current Editor always sends:
     * - name
     * - template_id
     * - priority
     * - status
     * - full active attributes array
     *
     * This avoids the important backend
     * omission behaviors of PUT.
     */
  } catch (error) {
    if (
      error instanceof ApiError &&
      error.status === 404
    ) {
      throw new Error(
        'بارنامه یا قالب بارنامه پیدا نشد.',
      )
    }

    if (
      error instanceof ApiError &&
      error.status === 409
    ) {
      throw new Error(
        'شماره بارنامه واردشده قبلا ثبت شده است.',
      )
    }

    throwNormalizedApiError(
      error,
      'ویرایش بارنامه ناموفق بود.',
    )
  }
}


export async function deleteWaybill(
  waybillId: number,
): Promise<void> {
  try {
    const response =
      await apiClient.delete<
        ApiResponse<boolean>
      >(
        `${WAYBILL_API_PATH}/${waybillId}`,
      )

    if (
      !response.is_success ||
      response.data !== true
    ) {
      throw new Error(
        response.errors[0] ??
          response.message ??
          'حذف بارنامه ناموفق بود.',
      )
    }
  } catch (error) {
    if (
      error instanceof ApiError &&
      error.status === 404
    ) {
      throw new Error(
        'بارنامه پیدا نشد.',
      )
    }

    throwNormalizedApiError(
      error,
      'حذف بارنامه ناموفق بود.',
    )
  }
}