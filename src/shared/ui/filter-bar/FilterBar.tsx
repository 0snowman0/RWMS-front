import type { ReactNode } from 'react'
import {
  RotateCcw,
  SlidersHorizontal,
} from 'lucide-react'

import { Button } from '@/shared/ui/button'
import { cn } from '@/shared/utils/cn'

interface FilterBarProps {
  children: ReactNode
  actions?: ReactNode

  onReset?: () => void
  hasActiveFilters?: boolean

  className?: string
}

function FilterBar({
  children,
  actions,
  onReset,
  hasActiveFilters = false,
  className,
}: FilterBarProps) {
  return (
    <div
      className={cn(
        'rounded-2xl border border-border bg-surface p-4',
        className,
      )}
    >
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-2 text-sm font-medium text-foreground">
          <SlidersHorizontal
            size={18}
            className="text-primary"
            strokeWidth={1.8}
          />

          فیلترها
        </div>

        <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
          <div className="grid min-w-0 flex-1 grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {children}
          </div>

          {(actions || onReset) && (
            <div className="flex shrink-0 flex-wrap items-center gap-2">
              {onReset && (
                <Button
                  variant="ghost"
                  size="sm"
                  disabled={!hasActiveFilters}
                  onClick={onReset}
                >
                  <RotateCcw
                    size={16}
                    strokeWidth={1.8}
                  />

                  پاککردن فیلترها
                </Button>
              )}

              {actions}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default FilterBar
