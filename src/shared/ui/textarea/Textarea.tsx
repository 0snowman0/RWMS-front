import type { TextareaHTMLAttributes } from 'react'

import { cn } from '@/shared/utils/cn'

interface TextareaProps
  extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  invalid?: boolean
}

function Textarea({
  className,
  invalid = false,
  rows = 4,
  ...props
}: TextareaProps) {
  return (
    <textarea
      rows={rows}
      className={cn(
        'w-full resize-y rounded-xl border bg-surface px-3 py-2.5 text-sm text-foreground',
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

export default Textarea
