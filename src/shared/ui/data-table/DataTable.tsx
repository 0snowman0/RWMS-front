import type {
  ReactNode,
} from 'react'

import {
  useTable,
  type RowData,
} from '@tanstack/react-table'

import {
  EmptyState,
  LoadingState,
} from '@/shared/ui/state'
import { cn } from '@/shared/utils/cn'

import { dataTableFeatures } from './dataTableFeatures'
import type { DataTableColumn } from './dataTableTypes'

interface DataTableProps<
  TData extends RowData,
> {
  columns: DataTableColumn<TData>[]
  data: TData[]

  isLoading?: boolean
  error?: ReactNode

  emptyTitle?: string
  emptyDescription?: string

  className?: string
}

function DataTable<
  TData extends RowData,
>({
  columns,
  data,
  isLoading = false,
  error,
  emptyTitle =
    'اطلاعاتی برای نمایش وجود ندارد',
  emptyDescription =
    'رکوردی مطابق اطلاعات موردنظر پیدا نشد.',
  className,
}: DataTableProps<TData>) {
  const table = useTable({
    features: dataTableFeatures,
    columns,
    data,
  })

  if (isLoading) {
    return <LoadingState />
  }

  if (error) {
    return <>{error}</>
  }

  if (data.length === 0) {
    return (
      <EmptyState
        title={emptyTitle}
        description={emptyDescription}
      />
    )
  }

  return (
    <div
      className={cn(
        'overflow-hidden rounded-2xl border border-border bg-surface',
        className,
      )}
    >
      <div className="w-full overflow-x-auto">
        <table className="w-full min-w-[700px] border-collapse text-sm">
          <thead className="bg-surface-muted">
            {table
              .getHeaderGroups()
              .map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map(
                    (header) => (
                      <th
                        key={header.id}
                        scope="col"
                        className="whitespace-nowrap border-b border-border px-4 py-3 text-right text-xs font-semibold text-muted-foreground"
                      >
                        {header.isPlaceholder
                          ? null
                          : (
                            <table.FlexRender
                              header={header}
                            />
                          )}
                      </th>
                    ),
                  )}
                </tr>
              ))}
          </thead>

          <tbody>
            {table
              .getRowModel()
              .rows.map((row) => (
                <tr
                  key={row.id}
                  className="border-b border-border transition-colors last:border-b-0 hover:bg-surface-muted/60"
                >
                  {row
                    .getAllCells()
                    .map((cell) => (
                      <td
                        key={cell.id}
                        className="px-4 py-3 text-foreground"
                      >
                        <table.FlexRender
                          cell={cell}
                        />
                      </td>
                    ))}
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default DataTable
