import {
  ApiError,
  apiClient,
} from '@/shared/api'

import type {
  PagedResult,
} from '@/shared/types'

import type {
  WaybillTemplate,
  WaybillTemplateListRequest,
  WaybillTemplatePayload,
  WaybillTemplateSummary,
} from '../types'


interface ApiResponse<T> {
  is_success: boolean

  message: string | null

  errors: string[]

  data: T | null

  status: string
}


const WAYBILL_TEMPLATE_API_PATH =
  '/api/v1WaybillTemplates/V1'


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

  const message =
    data.message

  if (
    typeof message === 'string' &&
    message.trim()
  ) {
    return message
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

  return null
}


function throwNormalizedApiError(
  error: unknown,
  fallback: string,
): never {
  if (
    error instanceof ApiError
  ) {
    /*
     * apiClient throws on non-2xx responses.
     * Waybill Template backend returns its
     * BaseResponse envelope inside error.data.
     */
    if (error.status >= 500) {
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
      response.message ??
        response.errors[0] ??
        fallback,
    )
  }

  return response.data
}


function buildAllTemplatesQuery(
  request:
    WaybillTemplateListRequest,
) {
  const params =
    new URLSearchParams()

  /*
   * Backend explicitly supports -1/-1
   * to return every template.
   *
   * This lets the existing frontend
   * search/status controls continue
   * working without redesigning the UI.
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


export async function listWaybillTemplates(
  request:
    WaybillTemplateListRequest,
): Promise<
  PagedResult<
    WaybillTemplateSummary
  >
> {
  try {
    const query =
      buildAllTemplatesQuery(
        request,
      )

    const response =
      await apiClient.get<
        ApiResponse<
          PagedResult<
            WaybillTemplateSummary
          >
        >
      >(
        `${WAYBILL_TEMPLATE_API_PATH}?${query}`,
      )

    const backendResult =
      ensureSuccess(
        response,
        'دریافت قالبهای بارنامه ناموفق بود.',
      )

    let items =
      [...backendResult.items]


    /*
     * Search is not implemented
     * by the current backend.
     */
    const search =
      request.search
        ?.trim()
        .toLocaleLowerCase(
          'fa',
        ) ?? ''


    if (search) {
      items =
        items.filter(
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


    /*
     * Active/inactive filtering is also
     * performed locally because the
     * backend has no Template filter.
     */
    if (
      request.status ===
      'active'
    ) {
      items =
        items.filter(
          (template) =>
            template.is_active,
        )
    }
    else if (
      request.status ===
      'inactive'
    ) {
      items =
        items.filter(
          (template) =>
            !template.is_active,
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
      'دریافت قالبهای بارنامه ناموفق بود.',
    )
  }
}


export async function getWaybillTemplateById(
  templateId: number,
): Promise<
  WaybillTemplate | null
> {
  try {
    const response =
      await apiClient.get<
        ApiResponse<
          WaybillTemplate
        >
      >(
        `${WAYBILL_TEMPLATE_API_PATH}/${templateId}`,
      )

    return ensureSuccess(
      response,
      'دریافت قالب بارنامه ناموفق بود.',
    )
  } catch (error) {
    /*
     * Backend uses a real HTTP 404
     * for missing templates.
     *
     * Return null to preserve the
     * current Editor behavior.
     */
    if (
      error instanceof ApiError &&
      error.status === 404
    ) {
      return null
    }

    throwNormalizedApiError(
      error,
      'دریافت قالب بارنامه ناموفق بود.',
    )
  }
}


export async function createWaybillTemplate(
  payload:
    WaybillTemplatePayload,
): Promise<void> {
  try {
    const response =
      await apiClient.post<
        ApiResponse<
          WaybillTemplate
        >
      >(
        `${WAYBILL_TEMPLATE_API_PATH}/create`,
        payload,
      )

    if (!response.is_success) {
      throw new Error(
        response.message ??
          response.errors[0] ??
          'ایجاد قالب بارنامه ناموفق بود.',
      )
    }

    /*
     * Do not rely on response.data.id.
     *
     * In the current backend flow the
     * DTO is mapped before flush/commit,
     * so new id/timestamps may be null.
     *
     * Current UI already navigates back
     * to the list after successful create.
     */
  } catch (error) {
    if (
      error instanceof ApiError &&
      error.status === 409
    ) {
      throw new Error(
        'قالب بارنامهای با این نام از قبل وجود دارد.',
      )
    }

    throwNormalizedApiError(
      error,
      'ایجاد قالب بارنامه ناموفق بود.',
    )
  }
}


export async function updateWaybillTemplate(
  templateId: number,
  payload:
    WaybillTemplatePayload,
): Promise<void> {
  try {
    const response =
      await apiClient.put<
        ApiResponse<
          WaybillTemplate
        >
      >(
        `${WAYBILL_TEMPLATE_API_PATH}/${templateId}`,
        payload,
      )

    if (!response.is_success) {
      throw new Error(
        response.message ??
          response.errors[0] ??
          'ویرایش قالب بارنامه ناموفق بود.',
      )
    }

    /*
     * PUT is a full replacement.
     *
     * payload.fields already contains
     * the complete current editor state,
     * including preserved field_id values.
     */
  } catch (error) {
    if (
      error instanceof ApiError &&
      error.status === 409
    ) {
      throw new Error(
        'قالب بارنامهای با این نام از قبل وجود دارد.',
      )
    }

    if (
      error instanceof ApiError &&
      error.status === 404
    ) {
      throw new Error(
        'قالب بارنامه پیدا نشد.',
      )
    }

    throwNormalizedApiError(
      error,
      'ویرایش قالب بارنامه ناموفق بود.',
    )
  }
}


export async function deleteWaybillTemplate(
  templateId: number,
): Promise<void> {
  try {
    const response =
      await apiClient.delete<
        ApiResponse<boolean>
      >(
        `${WAYBILL_TEMPLATE_API_PATH}/${templateId}`,
      )

    if (
      !response.is_success ||
      response.data !== true
    ) {
      throw new Error(
        response.message ??
          response.errors[0] ??
          'حذف قالب بارنامه ناموفق بود.',
      )
    }
  } catch (error) {
    if (
      error instanceof ApiError &&
      error.status === 404
    ) {
      throw new Error(
        'قالب بارنامه پیدا نشد.',
      )
    }

    /*
     * Current backend has no application
     * guard for a template that is already
     * referenced by a Waybill.
     *
     * PostgreSQL FK currently results in
     * HTTP 500. Do not expose DB details.
     */
    if (
      error instanceof ApiError &&
      error.status >= 500
    ) {
      throw new Error(
        'حذف قالب بارنامه انجام نشد. ممکن است این قالب در اطلاعات دیگری استفاده شده باشد.',
      )
    }

    throwNormalizedApiError(
      error,
      'حذف قالب بارنامه ناموفق بود.',
    )
  }
}