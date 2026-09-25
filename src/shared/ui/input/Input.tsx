import type { InputHTMLAttributes } from 'react'

import { cn } from '@/shared/utils/cn'

interface InputProps
  extends InputHTMLAttributes<HTMLInputElement> {
  invalid?: boolean
}

function Input({
  className,
  invalid = false,
  ...props
}: InputProps) {
  return (
    <input
      className={cn(
        'h-10 w-full rounded-xl border bg-surface px-3 text-sm text-foreground',
        'placeholder:text-placeholder',
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
    />
  )
}

export default Input
