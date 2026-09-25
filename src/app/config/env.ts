function requireEnv(
  value: string | undefined,
  name: string,
): string {
  const normalizedValue = value?.trim()

  if (!normalizedValue) {
    throw new Error(
      `Environment variable "${name}" is required.`,
    )
  }

  return normalizedValue
}

function parsePositiveNumber(
  value: string | undefined,
  fallback: number,
): number {
  if (!value) {
    return fallback
  }

  const parsedValue = Number(value)

  if (
    !Number.isFinite(parsedValue) ||
    parsedValue <= 0
  ) {
    return fallback
  }

  return parsedValue
}

const apiBaseUrl = requireEnv(
  import.meta.env.VITE_API_BASE_URL,
  'VITE_API_BASE_URL',
).replace(/\/+$/, '')

export const env = Object.freeze({
  appName:
    import.meta.env.VITE_APP_NAME?.trim() || 'RWMS',

  apiBaseUrl,

  apiTimeoutMs: parsePositiveNumber(
    import.meta.env.VITE_API_TIMEOUT_MS,
    15_000,
  ),

  mode: import.meta.env.MODE,

  isDevelopment: import.meta.env.DEV,

  isProduction: import.meta.env.PROD,
})