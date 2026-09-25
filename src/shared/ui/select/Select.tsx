import type { SelectHTMLAttributes } from 'react'

import { cn } from '@/shared/utils/cn'

interface SelectProps
  extends SelectHTMLAttributes<HTMLSelectElement> {
  invalid?: boolean
}

function Select({
  className,
  invalid = false,
  children,
  ...props
}: SelectProps) {
  return (
    <select
      className={cn(
        'h-10 w-full rounded-xl border bg-surface px-3 text-sm text-foreground',
        'transition-colors',
        'focus:outline-none focus:ring-2 focus:ring-primary/20',
        'disabled:cursor-not-allowed disabled:bg-surface-muted disabled:opacity-60',
        invalid
          ? 'border-danger focus:border-danger'
          : 'border-border focus:border-primary',
        className,
      )}
      aria-invalid={invalid || undefined}
      {...props}
    >
      {children}
    </select>
  )
}

export default Select
