import {
  Boxes,
  Info,
} from 'lucide-react'

import type {
  ProductDynamicField,
} from '../types'


export type ProductFormValues =
  Record<string, unknown>


interface ProductDynamicFieldsFormProps {
  fields: ProductDynamicField[]

  values: ProductFormValues

  errors?: Record<
    string,
    string
  >

  onChange: (
    fieldId: string,
    value: unknown,
  ) => void
}


function asText(
  value: unknown,
): string {
  if (
    value === null ||
    value === undefined
  ) {
    return ''
  }

  if (
    typeof value ===
      'string' ||
    typeof value ===
      'number'
  ) {
    return String(value)
  }

  return ''
}


export function ProductDynamicFieldsForm({
  fields,
  values,
  errors = {},
  onChange,
}: ProductDynamicFieldsFormProps) {
  const groups =
    fields.reduce<
      Record<
        string,
        {
          categoryId: number
          categoryName: string
          fields: ProductDynamicField[]
        }
      >
    >(
      (
        result,
        field,
      ) => {
        const key =
          String(
            field.category_id,
          )

        if (!result[key]) {
          result[key] = {
            categoryId:
              field.category_id,

            categoryName:
              field.category_name,

            fields: [],
          }
        }

        result[key].fields.push(
          field,
        )

        return result
      },
      {},
    )


  const groupList =
    Object.values(
      groups,
    )


  if (
    fields.length === 0
  ) {
    return (
      <section className="rounded-2xl border border-border bg-surface p-5">
        <div className="flex min-h-44 flex-col items-center justify-center rounded-xl border border-dashed border-border px-6 py-8 text-center">
          <div className="flex size-12 items-center justify-center rounded-2xl bg-primary-soft text-primary">
            <Boxes
              size={22}
            />
          </div>

          <p className="mt-4 font-medium text-foreground">
            هنوز مشخصاتی برای کالا نمایش داده نمی‌شود
          </p>

          <p className="mt-2 max-w-xl text-sm leading-6 text-muted-foreground">
            با انتخاب دسته‌بندی، فیلدهای مربوط به همان دسته‌بندی در این قسمت ساخته می‌شوند.
          </p>
        </div>
      </section>
    )
  }


  function renderControl(
    field: ProductDynamicField,
  ) {
    const value =
      values[
        field.field_id
      ]

    const commonClass =
      [
        'w-full rounded-xl border border-border bg-surface px-3 py-2.5 text-sm text-foreground',
        'outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/15',
        'disabled:cursor-not-allowed disabled:bg-surface-muted disabled:text-muted-foreground',
      ].join(' ')


    if (
      field.auto_generate
    ) {
      return (
        <input
          className={
            commonClass
          }
          value="توسط سیستم تولید می‌شود"
          disabled
          readOnly
        />
      )
    }


    if (
      field.field_type ===
      'boolean'
    ) {
      const boolValue =
        value === true
          ? 'true'
          : value === false
            ? 'false'
            : ''

      return (
        <select
          className={
            commonClass
          }
          value={
            boolValue
          }
          disabled={
            field.readonly
          }
          onChange={(
            event,
          ) => {
            const next =
              event.target
                .value

            onChange(
              field.field_id,
              next === ''
                ? null
                : next ===
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
        </select>
      )
    }


    if (
      field.field_type ===
      'select'
    ) {
      return (
        <select
          className={
            commonClass
          }
          value={
            asText(
              value,
            )
          }
          disabled={
            field.readonly
          }
          onChange={(
            event,
          ) =>
            onChange(
              field.field_id,
              event.target
                .value ||
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
        </select>
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
        <div className="grid gap-2 rounded-xl border border-border bg-surface-muted/25 p-3 sm:grid-cols-2">
          {field.options.map(
            (option) => {
              const checked =
                selected.includes(
                  option.value,
                )

              return (
                <label
                  key={
                    option.value
                  }
                  className="flex cursor-pointer items-center gap-2 rounded-lg px-2 py-2 text-sm text-foreground hover:bg-surface-muted"
                >
                  <input
                    type="checkbox"
                    checked={
                      checked
                    }
                    disabled={
                      field.readonly
                    }
                    onChange={(
                      event,
                    ) => {
                      const next =
                        event
                          .target
                          .checked
                          ? [
                              ...selected,
                              option.value,
                            ]
                          : selected.filter(
                              (
                                item,
                              ) =>
                                item !==
                                option.value,
                            )

                      onChange(
                        field.field_id,
                        next,
                      )
                    }}
                  />

                  {
                    option.label
                  }
                </label>
              )
            },
          )}
        </div>
      )
    }


    if (
      field.field_type ===
      'date'
    ) {
      return (
        <input
          className={
            commonClass
          }
          type="date"
          value={
            asText(
              value,
            ).slice(
              0,
              10,
            )
          }
          disabled={
            field.readonly
          }
          onChange={(
            event,
          ) =>
            onChange(
              field.field_id,
              event.target
                .value ||
                null,
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
        <input
          className={
            commonClass
          }
          type="datetime-local"
          value={
            asText(
              value,
            ).slice(
              0,
              16,
            )
          }
          disabled={
            field.readonly
          }
          onChange={(
            event,
          ) =>
            onChange(
              field.field_id,
              event.target
                .value ||
                null,
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
          <input
            className={
              commonClass
            }
            type="number"
            dir="ltr"
            value={
              asText(
                value,
              )
            }
            min={
              field.min_value !==
                null &&
              field.min_value !==
                undefined
                ? String(
                    field.min_value,
                  )
                : undefined
            }
            max={
              field.max_value !==
                null &&
              field.max_value !==
                undefined
                ? String(
                    field.max_value,
                  )
                : undefined
            }
            step={
              field.field_type ===
              'integer'
                ? '1'
                : field.decimal_places !==
                      null &&
                    field.decimal_places !==
                      undefined
                  ? String(
                      Math.pow(
                        10,
                        -field.decimal_places,
                      ),
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
            onChange={(
              event,
            ) => {
              const raw =
                event.target
                  .value

              if (raw === '') {
                onChange(
                  field.field_id,
                  null,
                )

                return
              }

              const number =
                field.field_type ===
                'integer'
                  ? Number.parseInt(
                      raw,
                      10,
                    )
                  : Number.parseFloat(
                      raw,
                    )

              onChange(
                field.field_id,
                Number.isNaN(
                  number,
                )
                  ? null
                  : number,
              )
            }}
          />

          {field.unit && (
            <span className="shrink-0 rounded-lg bg-surface-muted px-3 py-2.5 text-sm font-medium text-muted-foreground">
              {field.unit}
            </span>
          )}
        </div>
      )
    }


    return (
      <div className="flex items-center gap-2">
        <input
          className={
            commonClass
          }
          type="text"
          value={
            asText(
              value,
            )
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
          onChange={(
            event,
          ) =>
            onChange(
              field.field_id,
              event.target
                .value,
            )
          }
        />

        {field.unit && (
          <span className="shrink-0 rounded-lg bg-surface-muted px-3 py-2.5 text-sm font-medium text-muted-foreground">
            {field.unit}
          </span>
        )}
      </div>
    )
  }


  return (
    <div className="space-y-5">
      <div className="flex gap-3 rounded-xl border border-info/20 bg-info-soft p-4">
        <Info
          size={18}
          className="mt-0.5 shrink-0 text-info"
        />

        <p className="text-sm leading-6 text-foreground">
          مشخصات زیر از دسته‌بندی‌های انتخاب‌شده ساخته شده‌اند.
        </p>
      </div>


      {groupList.map(
        (group) => (
          <section
            key={
              group.categoryId
            }
            className="rounded-2xl border border-border bg-surface"
          >
            <div className="border-b border-border px-5 py-4">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h2 className="font-semibold text-foreground">
                    {
                      group.categoryName
                    }
                  </h2>

                  <p className="mt-1 text-xs text-muted-foreground">
                    {
                      group.fields
                        .length
                    }{' '}
                    مشخصه
                  </p>
                </div>

                <span className="rounded-lg bg-primary-soft px-3 py-1 text-xs font-medium text-primary">
                  مشخصات دسته‌بندی
                </span>
              </div>
            </div>


            <div className="grid gap-5 p-5 md:grid-cols-2">
              {group.fields.map(
                (field) => (
                  <div
                    key={
                      field.field_id
                    }
                    className={
                      field.field_type ===
                      'multi_select'
                        ? 'md:col-span-2'
                        : ''
                    }
                  >
                    <div className="mb-2 flex flex-wrap items-center gap-2">
                      <label className="text-sm font-medium text-foreground">
                        {
                          field.title
                        }

                        {field.required && (
                          <span className="mr-1 text-danger">
                            *
                          </span>
                        )}
                      </label>

                      {field.readonly && (
                        <span className="rounded-md bg-info-soft px-2 py-0.5 text-[11px] text-info">
                          فقط خواندنی
                        </span>
                      )}

                      {field.auto_generate && (
                        <span className="rounded-md bg-primary-soft px-2 py-0.5 text-[11px] text-primary">
                          تولید خودکار
                        </span>
                      )}
                    </div>


                    {renderControl(
                      field,
                    )}


                    {errors[
                      field.field_id
                    ] ? (
                      <p className="mt-2 text-xs text-danger">
                        {
                          errors[
                            field
                              .field_id
                          ]
                        }
                      </p>
                    ) : field.description ? (
                      <p className="mt-2 text-xs leading-5 text-muted-foreground">
                        {
                          field.description
                        }
                      </p>
                    ) : null}
                  </div>
                ),
              )}
            </div>
          </section>
        ),
      )}
    </div>
  )
}