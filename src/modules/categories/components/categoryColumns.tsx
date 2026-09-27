import {
  Pencil,
} from 'lucide-react'

import { Button } from '@/shared/ui/button'
import type {
  DataTableColumn,
} from '@/shared/ui/data-table'

import type {
  Category,
} from '../types/category.types'

import {
  SortableColumnHeader,
} from './SortableColumnHeader'

interface CreateCategoryColumnsOptions {
  sortBy: string | null

  isAscending: boolean

  onSort: (column: string) => void

  onEdit: (category: Category) => void
}

const dateFormatter =
  new Intl.DateTimeFormat(
    'fa-IR',
    {
      dateStyle: 'medium',
    },
  )

export function createCategoryColumns({
  sortBy,
  isAscending,
  onSort,
  onEdit,
}: CreateCategoryColumnsOptions): DataTableColumn<Category>[] {
  return [
    {
      accessorKey: 'name',

      header: () => (
        <SortableColumnHeader
          title="نام دسته‌بندی"
          column="name"
          sortBy={sortBy}
          isAscending={isAscending}
          onSort={onSort}
        />
      ),

      cell: ({ row }) => (
        <div className="min-w-40">
          <p className="font-medium text-foreground">
            {row.original.name}
          </p>
        </div>
      ),
    },

    {
      accessorKey: 'description',

      header: 'توضیحات',

      cell: ({ row }) => (
        <p className="max-w-md text-sm leading-6 text-muted-foreground">
          {row.original.description || '—'}
        </p>
      ),
    },

    {
      id: 'fields_count',

      header: 'تعداد فیلدها',

      cell: ({ row }) => (
        <span className="inline-flex min-w-9 items-center justify-center rounded-lg bg-primary-soft px-2.5 py-1 text-xs font-semibold text-primary">
          {row.original.fields.length}
        </span>
      ),
    },

    {
      accessorKey: 'created_at',

      header: () => (
        <SortableColumnHeader
          title="تاریخ ایجاد"
          column="created_at"
          sortBy={sortBy}
          isAscending={isAscending}
          onSort={onSort}
        />
      ),

      cell: ({ row }) => (
        <span className="whitespace-nowrap text-sm text-muted-foreground">
          {dateFormatter.format(
            new Date(
              row.original.created_at,
            ),
          )}
        </span>
      ),
    },

    {
      accessorKey: 'updated_at',

      header: () => (
        <SortableColumnHeader
          title="آخرین ویرایش"
          column="updated_at"
          sortBy={sortBy}
          isAscending={isAscending}
          onSort={onSort}
        />
      ),

      cell: ({ row }) => (
        <span className="whitespace-nowrap text-sm text-muted-foreground">
          {dateFormatter.format(
            new Date(
              row.original.updated_at,
            ),
          )}
        </span>
      ),
    },

    {
      id: 'actions',

      header: 'عملیات',

      cell: ({ row }) => (
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() =>
            onEdit(row.original)
          }
          title="ویرایش دسته‌بندی"
          aria-label="ویرایش دسته‌بندی"
        >
          <Pencil
            size={16}
            strokeWidth={1.8}
          />

          <span className="hidden lg:inline">
            ویرایش
          </span>
        </Button>
      ),
    },
  ]
}