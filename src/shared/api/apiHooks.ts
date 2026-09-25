import type ApiError from './ApiError'

export type ApiErrorAction =
  | 'throw'
  | 'retry'

export interface ApiRequestHookContext {
  url: string
  init: RequestInit
}

export interface ApiErrorHookContext {
  error: ApiError
  retryCount: number
}

export interface ApiHooks {
  beforeRequest?: (
    context: ApiRequestHookContext,
  ) => void | Promise<void>

  onUnauthorized?: (
    context: ApiErrorHookContext,
  ) =>
    | ApiErrorAction
    | void
    | Promise<ApiErrorAction | void>

  onForbidden?: (
    context: ApiErrorHookContext,
  ) => void | Promise<void>

  onError?: (
    context: ApiErrorHookContext,
  ) => void | Promise<void>
}

let hooks: ApiHooks = {}

export function configureApiHooks(
  newHooks: ApiHooks,
) {
  hooks = {
    ...hooks,
    ...newHooks,
  }
}

export function resetApiHooks() {
  hooks = {}
}

export function getApiHooks() {
  return hooks
}
