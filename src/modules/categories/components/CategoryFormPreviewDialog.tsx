import {
  useEffect,
  useMemo,
  useState,
} from 'react'

import {
  Eye,
  Info,
} from 'lucide-react'

import {
  Checkbox,
} from '@/shared/ui/checkbox'

import {
  Dialog,
} from '@/shared/ui/dialog'

import {
  Input,
} from '@/shared/ui/input'

import {
  Select,
} from '@/shared/ui/select'

import type {
  DynamicFieldDefinition,
} from '../types/category.types'


interface CategoryFormPreviewDialogProps {
  open: boolean

  categoryName?: string

  fields: DynamicFieldDefinition[]

  onOpenChange: (
    open: boolean,
  ) => void
}


type PreviewValues =
  Record<
    string,
    unknown
  >


function buildInitialValues(
  fields: DynamicFieldDefinition[],
): PreviewValues {
  return fields.reduce<PreviewValues>(
    (
      result,
      field,
    ) => {
      result[field.field_id] =
        field.default_value ??
        (
          field.field_type ===
          'multi_select'
            ? []
            : null
        )

      return result
    },
    {},
  )
}


export function CategoryFormPreviewDialog({
  open,
  categoryName,
  fields,
  onOpenChange,
}: CategoryFormPreviewDialogProps) {
  const activeFields =
    useMemo(
      () =>
        [...fields]
          .filter(
            (field) =>
              field.is_active,
          )
          .sort(
            (a, b) =>
              a.sort_order -
              b.sort_order,
          ),
      [fields],
    )


  const [
    values,
    setValues,
  ] = useState<PreviewValues>(
    () =>
      buildInitialValues(
        activeFields,
      ),
  )


  useEffect(() => {
    if (!open) {
      return
    }

    setValues(
      buildInitialValues(
        activeFields,
      ),
    )
  }, [
    open,
    activeFields,
  ])


  function setFieldValue(
    fieldId: string,
    value: unknown,
  ) {
    setValues(
      (current) => ({
        ...current,

        [fieldId]:
          value,
      }),
    )
  }


  function renderField(
    field: DynamicFieldDefinition,
  ) {
    const value =
      values[
        field.field_id
      ]


    if (field.auto_generate) {
      return (
        <Input
          value="توسط سیستم تولید میشود"
          disabled
          readOnly
        />
      )
    }


    if (
      field.field_type ===
      'boolean'
    ) {
      const booleanValue =
        value === true
          ? 'true'
          : value === false
            ? 'false'
            : ''

      return (
        <Select
          value={
            booleanValue
          }
          disabled={
            field.readonly
          }
          onChange={(event) => {
            const nextValue =
              event.target.value

            setFieldValue(
              field.field_id,
              nextValue === ''
                ? null
                : nextValue ===
                    'true',
            )
          }}
        >
          <option value="">
            انتخاب کنید
          </option>

          <option value="true">
            بله
          </option>

          <option value="false">
            خیر
          </option>
        </Select>
      )
    }


    if (
      field.field_type ===
      'select'
    ) {
      return (
        <Select
          value={
            typeof value ===
            'string'
              ? value
              : ''
          }
          disabled={
            field.readonly
          }
          onChange={(event) =>
            setFieldValue(
              field.field_id,
              event.target.value ||
                null,
            )
          }
        >
          <option value="">
            انتخاب کنید
          </option>

          {field.options.map(
            (option) => (
              <option
                key={
                  option.value
                }
                value={
                  option.value
                }
              >
                {
                  option.label
                }
              </option>
            ),
          )}
        </Select>
      )
    }


    if (
      field.field_type ===
      'multi_select'
    ) {
      const selected =
        Array.isArray(value)
          ? value.filter(
              (
                item,
              ): item is string =>
                typeof item ===
                'string',
            )
          : []

      return (
        <div className="grid gap-2 rounded-xl border border-border bg-surface-muted/30 p-3 sm:grid-cols-2">
          {field.options.length ===
          0 ? (
            <p className="text-sm text-muted-foreground">
              گزینهای برای این فیلد تعریف نشده است.
            </p>
          ) : (
            field.options.map(
              (option) => (
                <Checkbox
                  key={
                    option.value
                  }
                  label={
                    option.label
                  }
                  disabled={
                    field.readonly
                  }
                  checked={
                    selected.includes(
                      option.value,
                    )
                  }
                  onChange={(
                    event,
                  ) => {
                    if (
                      event.target
                        .checked
                    ) {
                      setFieldValue(
                        field.field_id,
                        [
                          ...selected,
                          option.value,
                        ],
                      )
                    } else {
                      setFieldValue(
                        field.field_id,
                        selected.filter(
                          (item) =>
                            item !==
                            option.value,
                        ),
                      )
                    }
                  }}
                />
              ),
            )
          )}
        </div>
      )
    }


    const scalarValue =
      typeof value ===
        'string' ||
      typeof value ===
        'number'
        ? value
        : ''


    if (
      field.field_type ===
      'date'
    ) {
      return (
        <Input
          type="date"
          value={
            typeof scalarValue ===
            'string'
              ? scalarValue.slice(
                  0,
                  10,
                )
              : ''
          }
          disabled={
            field.readonly
          }
          onChange={(event) =>
            setFieldValue(
              field.field_id,
              event.target.value,
            )
          }
        />
      )
    }


    if (
      field.field_type ===
      'datetime'
    ) {
      return (
        <Input
          type="datetime-local"
          value={
            typeof scalarValue ===
            'string'
              ? scalarValue.slice(
                  0,
                  16,
                )
              : ''
          }
          disabled={
            field.readonly
          }
          onChange={(event) =>
            setFieldValue(
              field.field_id,
              event.target.value,
            )
          }
        />
      )
    }


    if (
      field.field_type ===
        'integer' ||
      field.field_type ===
        'decimal'
    ) {
      return (
        <div className="flex items-center gap-2">
          <Input
            type="number"
            dir="ltr"
            value={
              scalarValue
            }
            min={
              field.min_value ??
              undefined
            }
            max={
              field.max_value ??
              undefined
            }
            step={
              field.field_type ===
              'integer'
                ? 1
                : field.decimal_places !==
                    null
                  ? Math.pow(
                      10,
                      -field.decimal_places,
                    )
                  : 'any'
            }
            placeholder={
              field.placeholder ??
              undefined
            }
            disabled={
              field.readonly
            }
            onChange={(event) =>
              setFieldValue(
                field.field_id,
                event.target.value,
              )
            }
          />

          {field.unit && (
            <span className="shrink-0 rounded-lg bg-surface-muted px-3 py-2 text-sm font-medium text-muted-foreground">
              {field.unit}
            </span>
          )}
        </div>
      )
    }


    return (
      <div className="flex items-center gap-2">
        <Input
          type="text"
          value={
            scalarValue
          }
          minLength={
            field.min_length ??
            undefined
          }
          maxLength={
            field.max_length ??
            undefined
          }
          pattern={
            field.regex ??
            undefined
          }
          placeholder={
            field.placeholder ??
            undefined
          }
          disabled={
            field.readonly
          }
          onChange={(event) =>
            setFieldValue(
              field.field_id,
              event.target.value,
            )
          }
        />

        {field.unit && (
          <span className="shrink-0 rounded-lg bg-surface-muted px-3 py-2 text-sm font-medium text-muted-foreground">
            {field.unit}
          </span>
        )}
      </div>
    )
  }


  return (
    <Dialog
      open={open}
      onOpenChange={
        onOpenChange
      }
      title="پیشنمایش فرم کالا"
      description={
        categoryName?.trim()
          ? `نمایش فرم تولیدشده برای دستهبندی «${categoryName.trim()}»`
          : 'نمایش فرم تولیدشده از فیلدهای این دستهبندی'
      }
      size="lg"
    >
      <div className="space-y-6">

        <div className="flex gap-3 rounded-xl border border-info/20 bg-info-soft p-4">
          <Info
            size={19}
            className="mt-0.5 shrink-0 text-info"
          />

          <div>
            <p className="text-sm font-medium text-foreground">
              این بخش فقط پیشنمایش است
            </p>

            <p className="mt-1 text-xs leading-6 text-muted-foreground">
              اطلاعات واردشده در این فرم ذخیره نمیشوند. این پیشنمایش نشان میدهد کالاهای این دسته هنگام ثبت چه فیلدهایی خواهند داشت.
            </p>
          </div>
        </div>


        {activeFields.length ===
        0 ? (
          <div className="flex min-h-48 flex-col items-center justify-center rounded-2xl border border-dashed border-border px-6 py-10 text-center">
            <div className="flex size-12 items-center justify-center rounded-2xl bg-primary-soft text-primary">
              <Eye
                size={22}
              />
            </div>

            <p className="mt-4 font-medium text-foreground">
              فیلد فعالی برای پیشنمایش وجود ندارد
            </p>

            <p className="mt-2 max-w-md text-sm leading-6 text-muted-foreground">
              ابتدا حداقل یک فیلد فعال برای دستهبندی تعریف کنید.
            </p>
          </div>
        ) : (
          <div className="grid gap-5">
            {activeFields.map(
              (field) => (
                <div
                  key={
                    field.field_id
                  }
                  className="rounded-xl border border-border bg-surface p-4"
                >
                  <div className="mb-2 flex flex-wrap items-center gap-2">
                    <label className="text-sm font-medium text-foreground">
                      {field.title}

                      {field.required && (
                        <span className="mr-1 text-danger">
                          *
                        </span>
                      )}
                    </label>

                    {field.readonly && (
                      <span className="rounded-md bg-info-soft px-2 py-0.5 text-[11px] font-medium text-info">
                        فقط خواندنی
                      </span>
                    )}

                    {field.auto_generate && (
                      <span className="rounded-md bg-primary-soft px-2 py-0.5 text-[11px] font-medium text-primary">
                        تولید خودکار
                      </span>
                    )}
                  </div>


                  {renderField(
                    field,
                  )}


                  {field.description && (
                    <p className="mt-2 text-xs leading-6 text-muted-foreground">
                      {
                        field.description
                      }
                    </p>
                  )}
                </div>
              ),
            )}
          </div>
        )}
      </div>
    </Dialog>
  )
}
