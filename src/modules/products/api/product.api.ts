import {
  apiClient,
} from '@/shared/api'

import type {
  PagedResult,
} from '@/shared/types'

import type {
  CreateProductPayload,
  Product,
  ProductCategory,
  ProductListRequest,
  UpdateProductPayload,
} from '../types'


interface ProductSummaryApiDto {
  id: number

  name: string

  categories: ProductCategory[]

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


interface ApiCommandResponse {
  is_success: boolean

  message: string | null

  errors: string[]

  status: string
}


const PRODUCT_API_PATH =
  '/api/v1Products/V1'


function buildProductListQuery(
  request: ProductListRequest,
): string {
  const params =
    new URLSearchParams()

  params.set(
    'page_number',
    String(
      request.page_number,
    ),
  )

  params.set(
    'page_size',
    String(
      request.page_size,
    ),
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

  /*
   * IMPORTANT:
   *
   * The current Product backend MVP
   * does not support search.
   *
   * request.search intentionally remains
   * in the frontend contract because the
   * existing UI already has a search box,
   * but it is NOT sent to the server.
   */

  return params.toString()
}


export async function listProducts(
  request: ProductListRequest,
): Promise<
  PagedResult<Product>
> {
  const query =
    buildProductListQuery(
      request,
    )

  const response =
    await apiClient.get<
      ApiResponse<
        PagedResult<
          ProductSummaryApiDto
        >
      >
    >(
      `${PRODUCT_API_PATH}?${query}`,
    )

  if (
    !response.is_success ||
    !response.data
  ) {
    throw new Error(
      response.message ??
        'دریافت کالاها ناموفق بود.',
    )
  }

  return {
    ...response.data,

    items:
      response.data.items.map(
        (product) => ({
          ...product,

          /*
           * ProductSummaryDto does not
           * contain dynamic fields.
           *
           * Keep the existing Product
           * frontend shape unchanged.
           */
          fields: [],
        }),
      ),
  }
}

export async function getProductById(
  productId: number,
): Promise<Product | null> {
  const response =
    await apiClient.get<
      ApiResponse<Product>
    >(
      `${PRODUCT_API_PATH}/${productId}`,
    )

  if (
    !response.is_success
  ) {
    if (
      response.status ===
      'not_found'
    ) {
      return null
    }

    throw new Error(
      response.message ??
        'دریافت اطلاعات کالا ناموفق بود.',
    )
  }

  if (!response.data) {
    throw new Error(
      response.message ??
        'اطلاعات کالا دریافت نشد.',
    )
  }

  return response.data
}

export async function createProduct(
  request: CreateProductPayload,
): Promise<void> {
  const response =
    await apiClient.post<
      ApiCommandResponse
    >(
      `${PRODUCT_API_PATH}/create`,
      request,
    )

  if (!response.is_success) {
    throw new Error(
      response.message ??
        response.errors[0] ??
        'ایجاد کالا ناموفق بود.',
    )
  }
}

export async function updateProduct(
  productId: number,
  request: UpdateProductPayload,
): Promise<void> {
  const response =
    await apiClient.put<
      ApiCommandResponse
    >(
      `${PRODUCT_API_PATH}/${productId}`,
      request,
    )

  if (!response.is_success) {
    throw new Error(
      response.message ??
        response.errors[0] ??
        'ویرایش کالا ناموفق بود.',
    )
  }
}

export async function deleteProduct(
  productId: number,
): Promise<boolean> {
  const response =
    await apiClient.delete<
      ApiResponse<boolean>
    >(
      `${PRODUCT_API_PATH}/${productId}`,
    )

  if (
    !response.is_success ||
    response.data !== true
  ) {
    throw new Error(
      response.message ??
        response.errors[0] ??
        'حذف کالا ناموفق بود.',
    )
  }

  return true
}