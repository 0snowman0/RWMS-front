import {
  ChevronDown,
  ChevronUp,
  Pencil,
  Trash2,
} from 'lucide-react'

import {
  Button,
} from '@/shared/ui/button'

import type {
  DynamicFieldDefinition,
} from '../types/category.types'

import {
  getDynamicFieldTypeLabel,
} from '../utils/dynamicFieldType.utils'

interface DynamicFieldCardProps {
  field: DynamicFieldDefinition

  canMoveUp: boolean
  canMoveDown: boolean

  onEdit: (
    field: DynamicFieldDefinition,
  ) => void

  onDelete: (
    field: DynamicFieldDefinition,
  ) => void

  onMoveUp: () => void
  onMoveDown: () => void
}

export function DynamicFieldCard({
  field,
  canMoveUp,
  canMoveDown,
  onEdit,
  onDelete,
  onMoveUp,
  onMoveDown,
}: DynamicFieldCardProps) {
  const optionsCount =
    field.options.length

  return (
    <div className="rounded-xl border border-border bg-background/40 p-4 transition-colors hover:border-border-strong">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="font-semibold text-foreground">
              {field.title}
            </h3>

            {field.required && (
              <span className="rounded-lg bg-danger-soft px-2 py-0.5 text-xs font-medium text-danger">
                اجباری
              </span>
            )}

            {!field.is_active && (
              <span className="rounded-lg bg-surface-muted px-2 py-0.5 text-xs text-muted-foreground">
                غیرفعال
              </span>
            )}

            {field.readonly && (
              <span className="rounded-lg bg-info-soft px-2 py-0.5 text-xs font-medium text-info">
                فقط خواندنی
              </span>
            )}
          </div>

          <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground">
            <span>
              نوع:
              {' '}
              <strong className="font-medium text-foreground">
                {getDynamicFieldTypeLabel(
                  field.field_type,
                )}
              </strong>
            </span>

            <span>
              نام سیستمی:
              {' '}
              <code
                dir="ltr"
                className="rounded-md bg-surface-muted px-1.5 py-0.5 text-xs text-foreground"
              >
                {field.name}
              </code>
            </span>

            {field.unit && (
              <span>
                واحد:
                {' '}
                <strong className="font-medium text-foreground">
                  {field.unit}
                </strong>
              </span>
            )}

            {(field.field_type ===
              'select' ||
              field.field_type ===
                'multi_select') && (
              <span>
                {optionsCount.toLocaleString(
                  'fa-IR',
                )}
                {' '}
                گزینه
              </span>
            )}
          </div>

          {field.description && (
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              {field.description}
            </p>
          )}
        </div>

        <div className="flex shrink-0 items-center gap-1">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            disabled={!canMoveUp}
            onClick={onMoveUp}
            title="انتقال به بالا"
            aria-label="انتقال فیلد به بالا"
          >
            <ChevronUp size={16} />
          </Button>

          <Button
            type="button"
            variant="ghost"
            size="sm"
            disabled={!canMoveDown}
            onClick={onMoveDown}
            title="انتقال به پایین"
            aria-label="انتقال فیلد به پایین"
          >
            <ChevronDown size={16} />
          </Button>

          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() =>
              onEdit(field)
            }
            title="ویرایش فیلد"
          >
            <Pencil size={16} />
          </Button>

          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() =>
              onDelete(field)
            }
            title="حذف فیلد"
            className="text-danger hover:bg-danger-soft hover:text-danger"
          >
            <Trash2 size={16} />
          </Button>
        </div>
      </div>
    </div>
  )
}