import {
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'

import { Button } from '@/shared/ui/button'
import { Select } from '@/shared/ui/select'

interface PaginationProps {
  page: number
  pageSize: number
  total: number

  onPageChange: (page: number) => void
  onPageSizeChange?: (pageSize: number) => void

  pageSizeOptions?: number[]
}

function Pagination({
  page,
  pageSize,
  total,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = [10, 20, 50, 100],
}: PaginationProps) {
  const totalPages = Math.max(
    1,
    Math.ceil(total / pageSize),
  )

  const safePage = Math.min(
    Math.max(page, 1),
    totalPages,
  )

  const start =
    total === 0
      ? 0
      : (safePage - 1) * pageSize + 1

  const end = Math.min(
    safePage * pageSize,
    total,
  )

  const canGoPrevious =
    safePage > 1

  const canGoNext =
    safePage < totalPages

  return (
    <div className="flex flex-col gap-3 border-t border-border px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="text-xs text-muted-foreground">
        نمایش {start} تا {end} از {total} رکورد
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {onPageSizeChange && (
          <div className="flex items-center gap-2">
            <span className="whitespace-nowrap text-xs text-muted-foreground">
              تعداد در صفحه
            </span>

            <Select
              value={pageSize}
              onChange={(event) => {
                onPageSizeChange(
                  Number(event.target.value),
                )
              }}
              className="h-9 w-20"
              aria-label="تعداد رکورد در صفحه"
            >
              {pageSizeOptions.map((option) => (
                <option
                  key={option}
                  value={option}
                >
                  {option}
                </option>
              ))}
            </Select>
          </div>
        )}

        <div className="mx-1 hidden h-6 w-px bg-border sm:block" />

        <Button
          variant="outline"
          size="sm"
          disabled={!canGoPrevious}
          onClick={() =>
            onPageChange(safePage - 1)
          }
        >
          <ChevronRight
            size={16}
            strokeWidth={1.8}
          />

          قبلی
        </Button>

        <div className="min-w-24 text-center text-xs font-medium text-foreground">
          صفحه {safePage} از {totalPages}
        </div>

        <Button
          variant="outline"
          size="sm"
          disabled={!canGoNext}
          onClick={() =>
            onPageChange(safePage + 1)
          }
        >
          بعدی

          <ChevronLeft
            size={16}
            strokeWidth={1.8}
          />
        </Button>
      </div>
    </div>
  )
}

export default Pagination
