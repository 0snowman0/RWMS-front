import type {
  FieldValues,
  Path,
  UseFormSetError,
} from 'react-hook-form'

import { ApiError } from '@/shared/api'

type ValidationLocationPart =
  | string
  | number

interface FastApiValidationIssue {
  loc?: ValidationLocationPart[]
  msg?: string
  type?: string
}

function isRecord(
  value: unknown,
): value is Record<string, unknown> {
  return (
    typeof value === 'object' &&
    value !== null
  )
}

function isValidationIssue(
  value: unknown,
): value is FastApiValidationIssue {
  return isRecord(value)
}

function getValidationIssues(
  data: unknown,
): FastApiValidationIssue[] {
  if (
    !isRecord(data) ||
    !Array.isArray(data.detail)
  ) {
    return []
  }

  return data.detail.filter(
    isValidationIssue,
  )
}

function getFieldPath(
  location:
    | ValidationLocationPart[]
    | undefined,
): string | null {
  if (
    !location ||
    location.length === 0
  ) {
    return null
  }

  const parts = [...location]

  if (
    parts[0] === 'body' ||
    parts[0] === 'query' ||
    parts[0] === 'path'
  ) {
    parts.shift()
  }

  if (parts.length === 0) {
    return null
  }

  return parts.join('.')
}

/**
 * Maps FastAPI / Pydantic 422 validation
 * errors to React Hook Form fields.
 *
 * Returns true when at least one
 * field error was applied.
 */
export function applyFastApiValidationErrors<
  TFieldValues extends FieldValues,
>(
  error: unknown,
  setError: UseFormSetError<TFieldValues>,
): boolean {
  if (
    !(error instanceof ApiError) ||
    !error.isValidationError
  ) {
    return false
  }

  const issues =
    getValidationIssues(error.data)

  let hasAppliedError = false

  for (const issue of issues) {
    const fieldPath =
      getFieldPath(issue.loc)

    if (
      !fieldPath ||
      !issue.msg
    ) {
      continue
    }

    setError(
      fieldPath as Path<TFieldValues>,
      {
        type: 'server',
        message: issue.msg,
      },
    )

    hasAppliedError = true
  }

  return hasAppliedError
}
