import {
  Plus,
  SlidersHorizontal,
} from 'lucide-react'

import {
  Button,
} from '@/shared/ui/button'

import type {
  DynamicFieldDefinition,
} from '../types/category.types'

import {
  DynamicFieldCard,
} from './DynamicFieldCard'

interface CategoryFieldsSectionProps {
  fields: DynamicFieldDefinition[]

  onAddField: () => void

  onEditField: (
    field: DynamicFieldDefinition,
  ) => void

  onDeleteField: (
    field: DynamicFieldDefinition,
  ) => void

  onMoveField: (
    index: number,
    direction: 'up' | 'down',
  ) => void
}

export function CategoryFieldsSection({
  fields,
  onAddField,
  onEditField,
  onDeleteField,
  onMoveField,
}: CategoryFieldsSectionProps) {
  const sortedFields = [
    ...fields,
  ].sort(
    (a, b) =>
      a.sort_order -
      b.sort_order,
  )

  return (
    <div className="rounded-2xl border border-border bg-surface">
      <div className="flex flex-col gap-3 border-b border-border px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="font-semibold text-foreground">
              فیلدهای دسته‌بندی
            </h2>

            <span className="rounded-lg bg-primary-soft px-2 py-0.5 text-xs font-semibold text-primary">
              {fields.length.toLocaleString(
                'fa-IR',
              )}
            </span>
          </div>

          <p className="mt-1 text-sm text-muted-foreground">
            مشخص کنید کالاهای این دسته چه اطلاعاتی باید داشته باشند.
          </p>
        </div>

        <Button
          type="button"
          variant="outline"
          onClick={onAddField}
        >
          <Plus size={17} />

          افزودن فیلد
        </Button>
      </div>

      {sortedFields.length ===
      0 ? (
        <div className="flex min-h-44 flex-col items-center justify-center px-6 py-10 text-center">
          <div className="flex size-11 items-center justify-center rounded-xl bg-primary-soft text-primary">
            <SlidersHorizontal
              size={21}
              strokeWidth={1.8}
            />
          </div>

          <p className="mt-4 font-medium text-foreground">
            هنوز فیلدی تعریف نشده است
          </p>

          <p className="mt-1 max-w-md text-sm leading-6 text-muted-foreground">
            فیلدهایی مانند رزولوشن،
            تاریخ انقضا، نوع کالا و سایر
            مشخصات را برای این دسته
            تعریف کنید.
          </p>

          <Button
            type="button"
            variant="outline"
            className="mt-5"
            onClick={onAddField}
          >
            <Plus size={17} />

            تعریف اولین فیلد
          </Button>
        </div>
      ) : (
        <div className="space-y-3 p-5">
          {sortedFields.map(
            (field, index) => (
              <DynamicFieldCard
                key={
                  field.field_id
                }
                field={field}
                canMoveUp={
                  index > 0
                }
                canMoveDown={
                  index <
                  sortedFields.length -
                    1
                }
                onEdit={
                  onEditField
                }
                onDelete={
                  onDeleteField
                }
                onMoveUp={() =>
                  onMoveField(
                    index,
                    'up',
                  )
                }
                onMoveDown={() =>
                  onMoveField(
                    index,
                    'down',
                  )
                }
              />
            ),
          )}
        </div>
      )}
    </div>
  )
}