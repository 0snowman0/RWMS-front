import { env } from '@/app/config/env'

import ApiError from './ApiError'
import { getApiHooks } from './apiHooks'

type HttpMethod =
  | 'GET'
  | 'POST'
  | 'PUT'
  | 'PATCH'
  | 'DELETE'

interface ApiRequestOptions
  extends Omit<
    RequestInit,
    'method' | 'body' | 'signal'
  > {
  method?: HttpMethod
  body?: unknown
  retryCount?: number
}

async function parseResponseBody(
  response: Response,
): Promise<unknown> {
  if (response.status === 204) {
    return null
  }

  const contentType =
    response.headers.get('content-type') ?? ''

  if (contentType.includes('application/json')) {
    return response.json()
  }

  const text = await response.text()

  return text || null
}

function getErrorMessage(
  data: unknown,
  fallback: string,
): string {
  if (
    typeof data === 'object' &&
    data !== null &&
    'detail' in data
  ) {
    const detail = data.detail

    if (typeof detail === 'string') {
      return detail
    }
  }

  return fallback
}

function isFormData(
  value: unknown,
): value is FormData {
  return (
    typeof FormData !== 'undefined' &&
    value instanceof FormData
  )
}

function normalizeApiError(
  error: unknown,
): ApiError {
  if (error instanceof ApiError) {
    return error
  }

  if (
    error instanceof DOMException &&
    error.name === 'AbortError'
  ) {
    return new ApiError({
      status: 0,
      message:
        'زمان پاسخگویی سرور بیش از حد مجاز شد.',
      cause: error,
    })
  }

  return new ApiError({
    status: 0,
    message:
      'ارتباط با سرور برقرار نشد.',
    cause: error,
  })
}

async function request<T>(
  path: string,
  options: ApiRequestOptions = {},
): Promise<T> {
  const {
    method = 'GET',
    body,
    headers: customHeaders,
    retryCount = 0,
    ...requestOptions
  } = options

  const controller =
    new AbortController()

  const timeoutId = window.setTimeout(
    () => controller.abort(),
    env.apiTimeoutMs,
  )

  const url =
    `${env.apiBaseUrl}${path}`

  try {
    const headers =
      new Headers(customHeaders)

    headers.set(
      'Accept',
      'application/json',
    )

    const hasBody =
      body !== undefined &&
      body !== null

    const bodyIsFormData =
      isFormData(body)

    if (
      hasBody &&
      !bodyIsFormData &&
      !headers.has('Content-Type')
    ) {
      headers.set(
        'Content-Type',
        'application/json',
      )
    }

    const init: RequestInit = {
      ...requestOptions,

      method,

      headers,

      signal: controller.signal,

      body: !hasBody
        ? undefined
        : bodyIsFormData
          ? body
          : JSON.stringify(body),
    }

    const hooks = getApiHooks()

    await hooks.beforeRequest?.({
      url,
      init,
    })

    const response =
      await fetch(url, init)

    const data =
      await parseResponseBody(response)

    if (!response.ok) {
      throw new ApiError({
        status: response.status,

        message: getErrorMessage(
          data,
          `Request failed with status ${response.status}`,
        ),

        data,
      })
    }

    return data as T
  } catch (error) {
    const apiError =
      normalizeApiError(error)

    const hooks =
      getApiHooks()

    const context = {
      error: apiError,
      retryCount,
    }

    if (apiError.status === 401) {
      const action =
        await hooks.onUnauthorized?.(
          context,
        )

      if (
        action === 'retry' &&
        retryCount < 1
      ) {
        return request<T>(
          path,
          {
            ...options,
            retryCount:
              retryCount + 1,
          },
        )
      }
    }

    if (apiError.status === 403) {
      await hooks.onForbidden?.(
        context,
      )
    }

    await hooks.onError?.(
      context,
    )

    throw apiError
  } finally {
    window.clearTimeout(timeoutId)
  }
}

export const apiClient = {
  get<T>(
    path: string,
    options?: Omit<
      ApiRequestOptions,
      'method' | 'body'
    >,
  ) {
    return request<T>(
      path,
      {
        ...options,
        method: 'GET',
      },
    )
  },

  post<T>(
    path: string,
    body?: unknown,
    options?: Omit<
      ApiRequestOptions,
      'method' | 'body'
    >,
  ) {
    return request<T>(
      path,
      {
        ...options,
        method: 'POST',
        body,
      },
    )
  },

  put<T>(
    path: string,
    body?: unknown,
    options?: Omit<
      ApiRequestOptions,
      'method' | 'body'
    >,
  ) {
    return request<T>(
      path,
      {
        ...options,
        method: 'PUT',
        body,
      },
    )
  },

  patch<T>(
    path: string,
    body?: unknown,
    options?: Omit<
      ApiRequestOptions,
      'method' | 'body'
    >,
  ) {
    return request<T>(
      path,
      {
        ...options,
        method: 'PATCH',
        body,
      },
    )
  },

  delete<T>(
    path: string,
    options?: Omit<
      ApiRequestOptions,
      'method' | 'body'
    >,
  ) {
    return request<T>(
      path,
      {
        ...options,
        method: 'DELETE',
      },
    )
  },
}
