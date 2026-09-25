export interface ApiErrorOptions {
  status: number
  message: string
  data?: unknown
  cause?: unknown
}

class ApiError extends Error {
  readonly status: number
  readonly data?: unknown

  constructor({
    status,
    message,
    data,
    cause,
  }: ApiErrorOptions) {
    super(message, { cause })

    this.name = 'ApiError'
    this.status = status
    this.data = data
  }

  get isUnauthorized() {
    return this.status === 401
  }

  get isForbidden() {
    return this.status === 403
  }

  get isValidationError() {
    return this.status === 422
  }

  get isServerError() {
    return this.status >= 500
  }

  get isNetworkError() {
    return this.status === 0
  }
}

export default ApiError
