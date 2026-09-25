import type {
  HTMLAttributes,
  ReactNode,
} from 'react'

import { cn } from '@/shared/utils/cn'

interface FormFieldProps
  extends HTMLAttributes<HTMLDivElement> {
  label?: string
  htmlFor?: string
  required?: boolean
  description?: string
  error?: string
  children: ReactNode
}

function FormField({
  label,
  htmlFor,
  required = false,
  description,
  error,
  children,
  className,
  ...props
}: FormFieldProps) {
  return (
    <div
      className={cn(
        'space-y-1.5',
        className,
      )}
      {...props}
    >
      {label && (
        <label
          htmlFor={htmlFor}
          className="block text-sm font-medium text-foreground"
        >
          {label}

          {required && (
            <span
              className="mr-1 text-danger"
              aria-hidden="true"
            >
              *
            </span>
          )}
        </label>
      )}

      {description && (
        <p className="text-xs leading-5 text-muted-foreground">
          {description}
        </p>
      )}

      {children}

      {error && (
        <p
          className="text-xs leading-5 text-danger"
          role="alert"
        >
          {error}
        </p>
      )}
    </div>
  )
}

export default FormField
