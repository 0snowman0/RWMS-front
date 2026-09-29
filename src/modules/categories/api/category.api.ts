import {
  apiClient,
} from '@/shared/api'

import type {
  PagedRequest,
  PagedResult,
} from '@/shared/types'

import type {
  Category,
  DynamicFieldDefinition,
} from '../types/category.types'


/**
 * Backend endpoint:
 *
 * GET /api/v1Categories/V1
 *
 * Search is intentionally kept in the frontend request contract
 * because the current UI already has a search box.
 *
 * The current MVP backend does NOT support search yet,
 * so it is intentionally NOT sent to the server.
 */
export interface CategoryListRequest
  extends PagedRequest<null> {
  search?: string
}


interface CategorySummaryApiDto {
  id: number

  name: string

  description: string | null

  created_at: string

  updated_at: string
}


interface ApiResponse<T> {
  is_success: boolean

  message: string | null

  errors: string[]

  data: T | null

  status: string
}


const CATEGORY_API_PATH =
  '/api/v1Categories/V1'


function buildCategoryListQuery(
  request: CategoryListRequest,
): string {
  const params =
    new URLSearchParams()

  params.set(
    'page_number',
    String(request.page_number),
  )

  params.set(
    'page_size',
    String(request.page_size),
  )

  params.set(
    'is_ascending',
    String(request.is_ascending),
  )

  if (request.sort_by) {
    params.set(
      'sort_by',
      request.sort_by,
    )
  }

  /*
   * IMPORTANT:
   *
   * Backend Category MVP currently has no search parameter.
   * Do not send request.search yet.
   *
   * When backend search is implemented later,
   * it can be added here without changing the page UI.
   */

  return params.toString()
}


export async function getPagedCategories(
  request: CategoryListRequest,
): Promise<PagedResult<Category>> {
  const query =
    buildCategoryListQuery(
      request,
    )

  const response =
    await apiClient.get<
      ApiResponse<
        PagedResult<CategorySummaryApiDto>
      >
    >(
      `${CATEGORY_API_PATH}?${query}`,
    )

  if (
    !response.is_success ||
    !response.data
  ) {
    throw new Error(
      response.message ??
        'دریافت دسته‌بندی‌ها ناموفق بود.',
    )
  }

  /*
   * List endpoint intentionally returns CategorySummaryDto
   * and therefore does not contain fields.
   *
   * We normalize it to the existing frontend Category shape
   * so the current table/design remains completely unchanged.
   *
   * Full fields will later be loaded from:
   * GET /api/v1Categories/V1/{category_id}
   */
  return {
    ...response.data,

    items:
      response.data.items.map(
        (category) => ({
          ...category,

          fields: [],
        }),
      ),
  }
}

export interface CreateCategoryRequest {
  name: string

  description?: string | null

  fields: DynamicFieldDefinition[]
}


export async function createCategory(
  request: CreateCategoryRequest,
): Promise<number> {
  const response =
    await apiClient.post<
      ApiResponse<number>
    >(
      `${CATEGORY_API_PATH}/create`,
      request,
    )

  if (
    !response.is_success ||
    response.data === null
  ) {
    throw new Error(
      response.message ??
        'ایجاد دستهبندی ناموفق بود.',
    )
  }

  return response.data
}

export async function getCategoryById(
  categoryId: number,
): Promise<Category> {
  const response =
    await apiClient.get<
      ApiResponse<Category>
    >(
      `${CATEGORY_API_PATH}/${categoryId}`,
    )

  if (
    !response.is_success ||
    !response.data
  ) {
    throw new Error(
      response.message ??
        'دریافت اطلاعات دستهبندی ناموفق بود.',
    )
  }

  return response.data
}

export interface UpdateCategoryRequest {
  name: string

  description?: string | null

  fields: DynamicFieldDefinition[]
}


export async function updateCategory(
  categoryId: number,
  request: UpdateCategoryRequest,
): Promise<number> {
  const response =
    await apiClient.put<
      ApiResponse<number>
    >(
      `${CATEGORY_API_PATH}/${categoryId}`,
      request,
    )

  if (
    !response.is_success ||
    response.data === null
  ) {
    throw new Error(
      response.message ??
        'ویرایش دستهبندی ناموفق بود.',
    )
  }

  return response.data
}

export async function deleteCategory(
  categoryId: number,
): Promise<boolean> {
  const response =
    await apiClient.delete<
      ApiResponse<boolean>
    >(
      `${CATEGORY_API_PATH}/${categoryId}`,
    )

  if (
    !response.is_success ||
    response.data !== true
  ) {
    throw new Error(
      response.message ??
        'حذف دستهبندی ناموفق بود.',
    )
  }

  return true
}