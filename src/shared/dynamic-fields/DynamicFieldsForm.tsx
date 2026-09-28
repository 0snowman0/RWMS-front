import type {
  DynamicFieldDefinition,
} from './dynamic-field.types'


export type DynamicFieldValues =
  Record<
    string,
    unknown
  >


interface DynamicFieldsFormProps {
  fields:
    DynamicFieldDefinition[]

  values:
    DynamicFieldValues

  errors?: Record<
    string,
    string
  >

  disabled?: boolean

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
    typeof value === 'string' ||
    typeof value === 'number'
  ) {
    return String(
      value,
    )
  }

  return ''
}


export function DynamicFieldsForm({
  fields,
  values,
  errors = {},
  disabled = false,
  onChange,
}: DynamicFieldsFormProps) {
  const sorted =
    [...fields]
      .filter(
        (field) =>
          field.is_active,
      )
      .sort(
        (a, b) =>
          a.sort_order -
          b.sort_order,
      )


  const controlClass =
    [
      'w-full rounded-xl border border-border bg-surface px-3 py-2.5',
      'text-sm text-foreground outline-none transition',
      'placeholder:text-placeholder',
      'focus:border-primary focus:ring-2 focus:ring-primary/15',
      'disabled:cursor-not-allowed disabled:bg-surface-muted disabled:text-muted-foreground',
    ].join(' ')


  function renderControl(
    field:
      DynamicFieldDefinition,
  ) {
    const value =
      values[
        field.field_id
      ]

    const isDisabled =
      disabled ||
      field.readonly ||
      field.auto_generate


    if (
      field.auto_generate
    ) {
      return (
        <input
          className={
            controlClass
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
      const current =
        value === true
          ? 'true'
          : value === false
            ? 'false'
            : ''

      return (
        <select
          className={
            controlClass
          }
          value={
            current
          }
          disabled={
            isDisabled
          }
          onChange={(
            event,
          ) => {
            const raw =
              event.target.value

            onChange(
              field.field_id,
              raw === ''
                ? null
                : raw ===
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
            controlClass
          }
          value={
            asText(
              value,
            )
          }
          disabled={
            isDisabled
          }
          onChange={(
            event,
          ) =>
            onChange(
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


      const maxSelections =
        typeof field.settings
          .max_selections ===
          'number'
          ? field.settings
              .max_selections
          : null


      return (
        <div className="grid gap-2 rounded-xl border border-border bg-surface-muted/25 p-3 sm:grid-cols-2">
          {field.options.map(
            (option) => {
              const checked =
                selected.includes(
                  option.value,
                )

              const maxReached =
                maxSelections !==
                  null &&
                selected.length >=
                  maxSelections &&
                !checked

              return (
                <label
                  key={
                    option.value
                  }
                  className="flex items-center gap-2 rounded-lg px-2 py-2 text-sm text-foreground"
                >
                  <input
                    type="checkbox"
                    checked={
                      checked
                    }
                    disabled={
                      isDisabled ||
                      maxReached
                    }
                    onChange={(
                      event,
                    ) => {
                      const next =
                        event.target
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
          type="date"
          className={
            controlClass
          }
          value={
            asText(
              value,
            ).slice(
              0,
              10,
            )
          }
          disabled={
            isDisabled
          }
          onChange={(
            event,
          ) =>
            onChange(
              field.field_id,
              event.target.value ||
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
          type="datetime-local"
          className={
            controlClass
          }
          value={
            asText(
              value,
            ).slice(
              0,
              16,
            )
          }
          disabled={
            isDisabled
          }
          onChange={(
            event,
          ) =>
            onChange(
              field.field_id,
              event.target.value ||
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
            dir="ltr"
            type="number"
            className={
              controlClass
            }
            value={
              asText(
                value,
              )
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
              isDisabled
            }
            onChange={(
              event,
            ) => {
              const raw =
                event.target.value

              if (
                raw === ''
              ) {
                onChange(
                  field.field_id,
                  null,
                )

                return
              }

              const parsed =
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
                  parsed,
                )
                  ? null
                  : parsed,
              )
            }}
          />

          {field.unit && (
            <span className="shrink-0 rounded-lg bg-surface-muted px-3 py-2.5 text-xs font-medium text-muted-foreground">
              {field.unit}
            </span>
          )}
        </div>
      )
    }


    return (
      <div className="flex items-center gap-2">
        <input
          type="text"
          className={
            controlClass
          }
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
            isDisabled
          }
          onChange={(
            event,
          ) =>
            onChange(
              field.field_id,
              event.target.value,
            )
          }
        />

        {field.unit && (
          <span className="shrink-0 rounded-lg bg-surface-muted px-3 py-2.5 text-xs font-medium text-muted-foreground">
            {field.unit}
          </span>
        )}
      </div>
    )
  }


  return (
    <div className="grid gap-5 md:grid-cols-2">
      {sorted.map(
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
                    field.field_id
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
  )
}