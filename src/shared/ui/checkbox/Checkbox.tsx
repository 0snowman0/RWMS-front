import type { InputHTMLAttributes } from 'react'

import { cn } from '@/shared/utils/cn'

interface CheckboxProps
  extends Omit<
    InputHTMLAttributes<HTMLInputElement>,
    'type'
  > {
  label?: string
}

function Checkbox({
  label,
  className,
  ...props
}: CheckboxProps) {
  return (
    <label className="inline-flex cursor-pointer items-center gap-2 text-sm text-foreground">
      <input
        type="checkbox"
        className={cn(
          'size-4 cursor-pointer rounded border-border accent-primary',
          'disabled:cursor-not-allowed disabled:opacity-50',
          className,
        )}
        {...props}
      />

      {label && (
        <span>
          {label}
        </span>
      )}
    </label>
  )
}

export default Checkbox
