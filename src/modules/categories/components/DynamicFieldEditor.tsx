import {
  useEffect,
  useState,
} from 'react'

import {
  useForm,
} from 'react-hook-form'

import {
  Button,
} from '@/shared/ui/button'

import {
  Checkbox,
} from '@/shared/ui/checkbox'

import {
  Dialog,
} from '@/shared/ui/dialog'

import {
  FormField,
} from '@/shared/ui/form'

import {
  Input,
} from '@/shared/ui/input'

import {
  Select,
} from '@/shared/ui/select'

import {
  Textarea,
} from '@/shared/ui/textarea'

import type {
  DynamicFieldDefinition,
  DynamicFieldOption,
  DynamicFieldType,
} from '../types/category.types'

import {
  DynamicFieldOptionsEditor,
} from './DynamicFieldOptionsEditor'


interface DynamicFieldEditorProps {
  open: boolean

  field?: DynamicFieldDefinition | null

  nextSortOrder: number

  onOpenChange: (
    open: boolean,
  ) => void

  onSave: (
    field: DynamicFieldDefinition,
  ) => void
}


interface DynamicFieldFormValues {
  title: string
  name: string

  field_type: DynamicFieldType

  required: boolean
  unique: boolean

  auto_generate: boolean
  readonly: boolean
  is_active: boolean

  show_in_list: boolean

  unit: string
  placeholder: string
  description: string

  min_value: string
  max_value: string

  decimal_places: string

  min_length: string
  max_length: string

  regex: string
}


const fieldTypeOptions: Array<{
  value: DynamicFieldType
  label: string
}> = [
  {
    value: 'string',
    label: 'متن',
  },
  {
    value: 'integer',
    label: 'عدد صحیح',
  },
  {
    value: 'decimal',
    label: 'عدد اعشاری',
  },
  {
    value: 'boolean',
    label: 'بله / خیر',
  },
  {
    value: 'date',
    label: 'تاریخ',
  },
  {
    value: 'datetime',
    label: 'تاریخ و زمان',
  },
  {
    value: 'select',
    label: 'انتخاب از لیست',
  },
  {
    value: 'multi_select',
    label: 'انتخاب چندگانه',
  },
]


const systemNamePattern =
  /^[a-z][a-z0-9_]*$/


function optionalNumber(
  value: string,
): number | null {
  const trimmed =
    value.trim()

  if (!trimmed) {
    return null
  }

  const number =
    Number(trimmed)

  return Number.isFinite(number)
    ? number
    : null
}


function createDefaultValues(
  field?: DynamicFieldDefinition | null,
): DynamicFieldFormValues {
  return {
    title:
      field?.title ?? '',

    name:
      field?.name ?? '',

    field_type:
      field?.field_type ??
      'string',

    required:
      field?.required ??
      false,

    unique:
      field?.unique ??
      false,

    auto_generate:
      field?.auto_generate ??
      false,

    readonly:
      field?.readonly ??
      false,

    is_active:
      field?.is_active ??
      true,

    show_in_list:
      field?.show_in_list ??
      false,

    unit:
      field?.unit ?? '',

    placeholder:
      field?.placeholder ?? '',

    description:
      field?.description ?? '',

    min_value:
      field?.min_value !==
        null &&
      field?.min_value !==
        undefined
        ? String(
            field.min_value,
          )
        : '',

    max_value:
      field?.max_value !==
        null &&
      field?.max_value !==
        undefined
        ? String(
            field.max_value,
          )
        : '',

    decimal_places:
      field?.decimal_places !==
        null &&
      field?.decimal_places !==
        undefined
        ? String(
            field.decimal_places,
          )
        : '',

    min_length:
      field?.min_length !==
        null &&
      field?.min_length !==
        undefined
        ? String(
            field.min_length,
          )
        : '',

    max_length:
      field?.max_length !==
        null &&
      field?.max_length !==
        undefined
        ? String(
            field.max_length,
          )
        : '',

    regex:
      field?.regex ?? '',
  }
}


function normalizeDefaultValue(
  type: DynamicFieldType,
  value: unknown,
  options: DynamicFieldOption[],
): unknown {
  if (
    value === null ||
    value === undefined ||
    value === ''
  ) {
    return null
  }

  if (type === 'integer') {
    const parsed =
      Number(value)

    return Number.isFinite(parsed)
      ? Math.trunc(parsed)
      : null
  }

  if (type === 'decimal') {
    const parsed =
      Number(value)

    return Number.isFinite(parsed)
      ? parsed
      : null
  }

  if (type === 'boolean') {
    if (
      value === true ||
      value === 'true'
    ) {
      return true
    }

    if (
      value === false ||
      value === 'false'
    ) {
      return false
    }

    return null
  }

  if (type === 'select') {
    const text =
      String(value)

    return options.some(
      (option) =>
        option.value === text,
    )
      ? text
      : null
  }

  if (type === 'multi_select') {
    if (!Array.isArray(value)) {
      return []
    }

    const allowed =
      new Set(
        options.map(
          (option) =>
            option.value,
        ),
      )

    return value.filter(
      (item) =>
        typeof item ===
          'string' &&
        allowed.has(item),
    )
  }

  return String(value)
}


export function DynamicFieldEditor({
  open,
  field,
  nextSortOrder,
  onOpenChange,
  onSave,
}: DynamicFieldEditorProps) {
  const isEditMode =
    Boolean(field)


  const [
    options,
    setOptions,
  ] = useState<
    DynamicFieldOption[]
  >(
    field?.options ?? [],
  )


  const [
    optionsError,
    setOptionsError,
  ] = useState<
    string | null
  >(null)


  const [
    defaultValue,
    setDefaultValue,
  ] = useState<unknown>(
    field?.default_value ??
      null,
  )


  const {
    register,
    reset,
    watch,
    setValue,
    setError,
    clearErrors,
    handleSubmit,

    formState: {
      errors,
      isSubmitting,
    },
  } = useForm<DynamicFieldFormValues>({
    defaultValues:
      createDefaultValues(
        field,
      ),
  })


  const fieldType =
    watch('field_type')


  useEffect(() => {
    if (!open) {
      return
    }

    reset(
      createDefaultValues(
        field,
      ),
    )

    setOptions(
      field?.options ?? [],
    )

    setOptionsError(null)

    setDefaultValue(
      field?.default_value ??
        null,
    )
  }, [
    open,
    field,
    reset,
  ])


  function handleFieldTypeChange(
    nextType: DynamicFieldType,
  ) {
    const previousType =
      fieldType

    setValue(
      'field_type',
      nextType,
      {
        shouldDirty: true,
      },
    )

    clearErrors()

    setOptionsError(null)

    setDefaultValue(null)


    const previousWasSelect =
      previousType ===
        'select' ||
      previousType ===
        'multi_select'

    const nextIsSelect =
      nextType ===
        'select' ||
      nextType ===
        'multi_select'


    if (
      !previousWasSelect ||
      !nextIsSelect
    ) {
      setOptions([])
    }


    if (
      nextType !==
        'integer' &&
      nextType !==
        'decimal'
    ) {
      setValue(
        'min_value',
        '',
      )

      setValue(
        'max_value',
        '',
      )
    }


    if (
      nextType !==
      'decimal'
    ) {
      setValue(
        'decimal_places',
        '',
      )
    }


    if (
      nextType !==
      'string'
    ) {
      setValue(
        'min_length',
        '',
      )

      setValue(
        'max_length',
        '',
      )

      setValue(
        'regex',
        '',
      )
    }
  }


  async function handleSave(
    values: DynamicFieldFormValues,
  ) {
    clearErrors()

    setOptionsError(null)

    let hasError =
      false


    const title =
      values.title.trim()

    const name =
      values.name.trim()


    if (!title) {
      setError(
        'title',
        {
          type: 'manual',
          message:
            'عنوان فیلد الزامی است.',
        },
      )

      hasError = true
    }


    if (!name) {
      setError(
        'name',
        {
          type: 'manual',
          message:
            'نام سیستمی الزامی است.',
        },
      )

      hasError = true
    } else if (
      !systemNamePattern.test(
        name,
      )
    ) {
      setError(
        'name',
        {
          type: 'manual',
          message:
            'نام سیستمی باید با حرف انگلیسی کوچک شروع شود و فقط شامل حروف کوچک عدد و _ باشد.',
        },
      )

      hasError = true
    }


    const isString =
      values.field_type ===
      'string'

    const isInteger =
      values.field_type ===
      'integer'

    const isDecimal =
      values.field_type ===
      'decimal'

    const isNumeric =
      isInteger ||
      isDecimal

    const isSelect =
      values.field_type ===
        'select' ||
      values.field_type ===
        'multi_select'


    const minValue =
      optionalNumber(
        values.min_value,
      )

    const maxValue =
      optionalNumber(
        values.max_value,
      )


    if (
      isNumeric &&
      values.min_value.trim() &&
      minValue === null
    ) {
      setError(
        'min_value',
        {
          type: 'manual',
          message:
            'حداقل مقدار معتبر نیست.',
        },
      )

      hasError = true
    }


    if (
      isNumeric &&
      values.max_value.trim() &&
      maxValue === null
    ) {
      setError(
        'max_value',
        {
          type: 'manual',
          message:
            'حداکثر مقدار معتبر نیست.',
        },
      )

      hasError = true
    }


    if (
      isNumeric &&
      minValue !== null &&
      maxValue !== null &&
      minValue > maxValue
    ) {
      setError(
        'max_value',
        {
          type: 'manual',
          message:
            'حداکثر مقدار باید بزرگتر یا مساوی حداقل مقدار باشد.',
        },
      )

      hasError = true
    }


    if (
      isInteger &&
      minValue !== null &&
      !Number.isInteger(
        minValue,
      )
    ) {
      setError(
        'min_value',
        {
          type: 'manual',
          message:
            'برای فیلد عدد صحیح حداقل مقدار باید عدد صحیح باشد.',
        },
      )

      hasError = true
    }


    if (
      isInteger &&
      maxValue !== null &&
      !Number.isInteger(
        maxValue,
      )
    ) {
      setError(
        'max_value',
        {
          type: 'manual',
          message:
            'برای فیلد عدد صحیح حداکثر مقدار باید عدد صحیح باشد.',
        },
      )

      hasError = true
    }


    let decimalPlaces:
      number | null =
      null


    if (
      isDecimal &&
      values.decimal_places.trim()
    ) {
      decimalPlaces =
        Number(
          values.decimal_places,
        )

      if (
        !Number.isInteger(
          decimalPlaces,
        ) ||
        decimalPlaces < 0
      ) {
        setError(
          'decimal_places',
          {
            type: 'manual',
            message:
              'تعداد رقم اعشار باید یک عدد صحیح صفر یا بزرگتر باشد.',
          },
        )

        hasError = true
      }
    }


    let minLength:
      number | null =
      null

    let maxLength:
      number | null =
      null


    if (
      isString &&
      values.min_length.trim()
    ) {
      minLength =
        Number(
          values.min_length,
        )

      if (
        !Number.isInteger(
          minLength,
        ) ||
        minLength < 0
      ) {
        setError(
          'min_length',
          {
            type: 'manual',
            message:
              'حداقل طول باید یک عدد صحیح صفر یا بزرگتر باشد.',
          },
        )

        hasError = true
      }
    }


    if (
      isString &&
      values.max_length.trim()
    ) {
      maxLength =
        Number(
          values.max_length,
        )

      if (
        !Number.isInteger(
          maxLength,
        ) ||
        maxLength < 0
      ) {
        setError(
          'max_length',
          {
            type: 'manual',
            message:
              'حداکثر طول باید یک عدد صحیح صفر یا بزرگتر باشد.',
          },
        )

        hasError = true
      }
    }


    if (
      isString &&
      minLength !== null &&
      maxLength !== null &&
      minLength > maxLength
    ) {
      setError(
        'max_length',
        {
          type: 'manual',
          message:
            'حداکثر طول باید بزرگتر یا مساوی حداقل طول باشد.',
        },
      )

      hasError = true
    }


    const regex =
      values.regex.trim()


    let compiledRegex:
      RegExp | null =
      null


    if (
      isString &&
      regex
    ) {
      try {
        compiledRegex =
          new RegExp(regex)
      } catch {
        setError(
          'regex',
          {
            type: 'manual',
            message:
              'الگوی Regex معتبر نیست.',
          },
        )

        hasError = true
      }
    }


    const normalizedOptions =
      options.map(
        (option) => ({
          label:
            option.label.trim(),

          value:
            option.value.trim(),
        }),
      )


    if (isSelect) {
      if (
        normalizedOptions.length ===
        0
      ) {
        setOptionsError(
          'حداقل یک گزینه باید تعریف شود.',
        )

        hasError = true
      } else if (
        normalizedOptions.some(
          (option) =>
            !option.label ||
            !option.value,
        )
      ) {
        setOptionsError(
          'عنوان و مقدار سیستمی همه گزینهها باید تکمیل شود.',
        )

        hasError = true
      } else {
        const valuesSet =
          new Set(
            normalizedOptions.map(
              (option) =>
                option.value,
            ),
          )

        if (
          valuesSet.size !==
          normalizedOptions.length
        ) {
          setOptionsError(
            'مقدار سیستمی گزینهها نباید تکراری باشد.',
          )

          hasError = true
        }
      }
    }


    if (
      isInteger &&
      defaultValue !== null &&
      defaultValue !== ''
    ) {
      const parsed =
        Number(defaultValue)

      if (
        !Number.isFinite(
          parsed,
        ) ||
        !Number.isInteger(
          parsed,
        )
      ) {
        setError(
          'min_value',
          {
            type: 'manual',
            message:
              'مقدار پیشفرض فیلد عدد صحیح معتبر نیست.',
          },
        )

        hasError = true
      } else {
        if (
          minValue !== null &&
          parsed < minValue
        ) {
          setError(
            'min_value',
            {
              type: 'manual',
              message:
                'مقدار پیشفرض از حداقل مقدار کمتر است.',
            },
          )

          hasError = true
        }

        if (
          maxValue !== null &&
          parsed > maxValue
        ) {
          setError(
            'max_value',
            {
              type: 'manual',
              message:
                'مقدار پیشفرض از حداکثر مقدار بیشتر است.',
            },
          )

          hasError = true
        }
      }
    }


    if (
      isDecimal &&
      defaultValue !== null &&
      defaultValue !== ''
    ) {
      const parsed =
        Number(defaultValue)

      if (
        !Number.isFinite(
          parsed,
        )
      ) {
        setError(
          'min_value',
          {
            type: 'manual',
            message:
              'مقدار پیشفرض عددی معتبر نیست.',
          },
        )

        hasError = true
      } else {
        if (
          minValue !== null &&
          parsed < minValue
        ) {
          setError(
            'min_value',
            {
              type: 'manual',
              message:
                'مقدار پیشفرض از حداقل مقدار کمتر است.',
            },
          )

          hasError = true
        }

        if (
          maxValue !== null &&
          parsed > maxValue
        ) {
          setError(
            'max_value',
            {
              type: 'manual',
              message:
                'مقدار پیشفرض از حداکثر مقدار بیشتر است.',
            },
          )

          hasError = true
        }
      }
    }


    if (
      isString &&
      typeof defaultValue ===
        'string' &&
      defaultValue
    ) {
      if (
        minLength !== null &&
        defaultValue.length <
          minLength
      ) {
        setError(
          'min_length',
          {
            type: 'manual',
            message:
              'طول مقدار پیشفرض از حداقل طول کمتر است.',
          },
        )

        hasError = true
      }

      if (
        maxLength !== null &&
        defaultValue.length >
          maxLength
      ) {
        setError(
          'max_length',
          {
            type: 'manual',
            message:
              'طول مقدار پیشفرض از حداکثر طول بیشتر است.',
          },
        )

        hasError = true
      }

      if (
        compiledRegex &&
        !compiledRegex.test(
          defaultValue,
        )
      ) {
        setError(
          'regex',
          {
            type: 'manual',
            message:
              'مقدار پیشفرض با الگوی Regex سازگار نیست.',
          },
        )

        hasError = true
      }
    }


    if (
      values.field_type ===
        'select' &&
      defaultValue !== null &&
      defaultValue !== ''
    ) {
      const exists =
        normalizedOptions.some(
          (option) =>
            option.value ===
            defaultValue,
        )

      if (!exists) {
        setOptionsError(
          'مقدار پیشفرض باید یکی از گزینههای موجود باشد.',
        )

        hasError = true
      }
    }


    if (
      values.field_type ===
        'multi_select' &&
      Array.isArray(
        defaultValue,
      )
    ) {
      const allowed =
        new Set(
          normalizedOptions.map(
            (option) =>
              option.value,
          ),
        )

      const invalidDefault =
        defaultValue.some(
          (item) =>
            typeof item !==
              'string' ||
            !allowed.has(
              item,
            ),
        )

      if (invalidDefault) {
        setOptionsError(
          'یکی از مقادیر پیشفرض در گزینههای تعریفشده وجود ندارد.',
        )

        hasError = true
      }
    }


    if (hasError) {
      return
    }


    const result: DynamicFieldDefinition = {
      field_id:
        field?.field_id ??
        crypto.randomUUID(),

      name,
      title,

      field_type:
        values.field_type,

      required:
        values.required,

      unique:
        values.unique,

      default_value:
        normalizeDefaultValue(
          values.field_type,
          defaultValue,
          normalizedOptions,
        ),

      auto_generate:
        values.auto_generate,

      readonly:
        values.readonly,

      is_active:
        values.is_active,

      sort_order:
        field?.sort_order ??
        nextSortOrder,

      unit:
        values.unit.trim() ||
        null,

      placeholder:
        values.placeholder.trim() ||
        null,

      description:
        values.description.trim() ||
        null,

      show_in_list:
        values.show_in_list,

      min_value:
        isNumeric
          ? minValue
          : null,

      max_value:
        isNumeric
          ? maxValue
          : null,

      decimal_places:
        isDecimal
          ? decimalPlaces
          : null,

      min_length:
        isString
          ? minLength
          : null,

      max_length:
        isString
          ? maxLength
          : null,

      regex:
        isString &&
        regex
          ? regex
          : null,

      options:
        isSelect
          ? normalizedOptions
          : [],

      settings:
        field?.settings ?? {},
    }


    onSave(result)

    onOpenChange(false)
  }


  return (
    <Dialog
      open={open}
      onOpenChange={
        onOpenChange
      }
      title={
        isEditMode
          ? 'ویرایش فیلد'
          : 'افزودن فیلد'
      }
      description="مشخصات نوع داده و قوانین فیلد را تعیین کنید."
      size="lg"
      footer={
        <div className="flex justify-end gap-2">
          <Button
            type="button"
            variant="outline"
            disabled={
              isSubmitting
            }
            onClick={() =>
              onOpenChange(
                false,
              )
            }
          >
            انصراف
          </Button>

          <Button
            type="submit"
            form="dynamic-field-form"
            isLoading={
              isSubmitting
            }
          >
            {isEditMode
              ? 'ذخیره تغییرات'
              : 'افزودن فیلد'}
          </Button>
        </div>
      }
    >
      <form
        id="dynamic-field-form"
        className="space-y-7"
        onSubmit={
          handleSubmit(
            handleSave,
          )
        }
      >
        <section className="space-y-4">
          <div>
            <h3 className="text-sm font-semibold text-foreground">
              اطلاعات اصلی
            </h3>

            <p className="mt-1 text-xs text-muted-foreground">
              مشخصات پایه و نوع داده این فیلد را تعیین کنید.
            </p>
          </div>


          <div className="grid gap-5 md:grid-cols-2">
            <FormField
              label="عنوان فیلد"
              htmlFor="field-title"
              required
              error={
                errors.title
                  ?.message
              }
            >
              <Input
                id="field-title"
                placeholder="مثلا تاریخ انقضا"
                invalid={
                  Boolean(
                    errors.title,
                  )
                }
                {...register(
                  'title',
                )}
              />
            </FormField>


            <FormField
              label="نام سیستمی"
              htmlFor="field-name"
              required
              description="برای نمونه: expiration_date یا package_type"
              error={
                errors.name
                  ?.message
              }
            >
              <Input
                id="field-name"
                dir="ltr"
                placeholder="expiration_date"
                invalid={
                  Boolean(
                    errors.name,
                  )
                }
                {...register(
                  'name',
                )}
              />
            </FormField>


            <FormField
              label="نوع فیلد"
              htmlFor="field-type"
              required
            >
              <Select
                id="field-type"
                value={
                  fieldType
                }
                onChange={(event) =>
                  handleFieldTypeChange(
                    event.target
                      .value as DynamicFieldType,
                  )
                }
              >
                {fieldTypeOptions.map(
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
            </FormField>


            <FormField
              label="واحد"
              htmlFor="field-unit"
              description="در صورت نیاز مانند kg عدد بسته"
            >
              <Input
                id="field-unit"
                placeholder="مثلا kg"
                {...register(
                  'unit',
                )}
              />
            </FormField>
          </div>
        </section>


        {(fieldType ===
          'integer' ||
          fieldType ===
            'decimal') && (
          <section className="rounded-xl border border-border bg-surface-muted/40 p-4">
            <h3 className="text-sm font-semibold text-foreground">
              قوانین عددی
            </h3>

            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <FormField
                label="حداقل مقدار"
                htmlFor="field-min-value"
                error={
                  errors.min_value
                    ?.message
                }
              >
                <Input
                  id="field-min-value"
                  type="number"
                  step={
                    fieldType ===
                    'integer'
                      ? '1'
                      : 'any'
                  }
                  dir="ltr"
                  invalid={
                    Boolean(
                      errors.min_value,
                    )
                  }
                  {...register(
                    'min_value',
                  )}
                />
              </FormField>


              <FormField
                label="حداکثر مقدار"
                htmlFor="field-max-value"
                error={
                  errors.max_value
                    ?.message
                }
              >
                <Input
                  id="field-max-value"
                  type="number"
                  step={
                    fieldType ===
                    'integer'
                      ? '1'
                      : 'any'
                  }
                  dir="ltr"
                  invalid={
                    Boolean(
                      errors.max_value,
                    )
                  }
                  {...register(
                    'max_value',
                  )}
                />
              </FormField>


              {fieldType ===
                'decimal' && (
                <FormField
                  label="تعداد رقم اعشار"
                  htmlFor="field-decimal-places"
                  error={
                    errors
                      .decimal_places
                      ?.message
                  }
                >
                  <Input
                    id="field-decimal-places"
                    type="number"
                    min="0"
                    step="1"
                    dir="ltr"
                    invalid={
                      Boolean(
                        errors
                          .decimal_places,
                      )
                    }
                    {...register(
                      'decimal_places',
                    )}
                  />
                </FormField>
              )}
            </div>
          </section>
        )}


        {fieldType ===
          'string' && (
          <section className="rounded-xl border border-border bg-surface-muted/40 p-4">
            <h3 className="text-sm font-semibold text-foreground">
              قوانین متن
            </h3>

            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <FormField
                label="حداقل طول"
                htmlFor="field-min-length"
                error={
                  errors.min_length
                    ?.message
                }
              >
                <Input
                  id="field-min-length"
                  type="number"
                  min="0"
                  step="1"
                  dir="ltr"
                  invalid={
                    Boolean(
                      errors.min_length,
                    )
                  }
                  {...register(
                    'min_length',
                  )}
                />
              </FormField>


              <FormField
                label="حداکثر طول"
                htmlFor="field-max-length"
                error={
                  errors.max_length
                    ?.message
                }
              >
                <Input
                  id="field-max-length"
                  type="number"
                  min="0"
                  step="1"
                  dir="ltr"
                  invalid={
                    Boolean(
                      errors.max_length,
                    )
                  }
                  {...register(
                    'max_length',
                  )}
                />
              </FormField>


              <div className="md:col-span-2">
                <FormField
                  label="الگوی Regex"
                  htmlFor="field-regex"
                  description="اختیاری برای کنترل فرمت مقدار فیلد"
                  error={
                    errors.regex
                      ?.message
                  }
                >
                  <Input
                    id="field-regex"
                    dir="ltr"
                    placeholder="مثلا ^[A-Z0-9-]+$"
                    invalid={
                      Boolean(
                        errors.regex,
                      )
                    }
                    {...register(
                      'regex',
                    )}
                  />
                </FormField>
              </div>
            </div>
          </section>
        )}


        {(fieldType ===
          'select' ||
          fieldType ===
            'multi_select') && (
          <div>
            <DynamicFieldOptionsEditor
              value={options}
              onChange={(next) => {
                setOptions(
                  next,
                )

                setOptionsError(
                  null,
                )
              }}
            />

            {optionsError && (
              <p className="mt-2 text-sm text-danger">
                {optionsError}
              </p>
            )}
          </div>
        )}


        <section className="rounded-xl border border-border bg-surface-muted/40 p-4">
          <div>
            <h3 className="text-sm font-semibold text-foreground">
              مقدار پیشفرض
            </h3>

            <p className="mt-1 text-xs leading-6 text-muted-foreground">
              فقط در صورتی مقدار پیشفرض تعیین کنید که برای همه کالاهای این دسته منطقی باشد.
            </p>
          </div>


          <div className="mt-4">
            {fieldType ===
            'boolean' ? (
              <Select
                value={
                  defaultValue ===
                  true
                    ? 'true'
                    : defaultValue ===
                        false
                      ? 'false'
                      : ''
                }
                onChange={(event) =>
                  setDefaultValue(
                    event.target
                      .value,
                  )
                }
              >
                <option value="">
                  بدون مقدار پیشفرض
                </option>

                <option value="true">
                  بله
                </option>

                <option value="false">
                  خیر
                </option>
              </Select>
            ) : fieldType ===
              'select' ? (
              <Select
                value={
                  typeof defaultValue ===
                  'string'
                    ? defaultValue
                    : ''
                }
                onChange={(event) =>
                  setDefaultValue(
                    event.target
                      .value,
                  )
                }
              >
                <option value="">
                  بدون مقدار پیشفرض
                </option>

                {options
                  .filter(
                    (option) =>
                      option.value &&
                      option.label,
                  )
                  .map(
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
            ) : fieldType ===
              'multi_select' ? (
              <div className="grid gap-2 sm:grid-cols-2">
                {options
                  .filter(
                    (option) =>
                      option.value &&
                      option.label,
                  )
                  .map(
                    (option) => {
                      const selected =
                        Array.isArray(
                          defaultValue,
                        ) &&
                        defaultValue.includes(
                          option.value,
                        )

                      return (
                        <Checkbox
                          key={
                            option.value
                          }
                          label={
                            option.label
                          }
                          checked={
                            selected
                          }
                          onChange={(
                            event,
                          ) => {
                            const current =
                              Array.isArray(
                                defaultValue,
                              )
                                ? defaultValue.filter(
                                    (
                                      item,
                                    ): item is string =>
                                      typeof item ===
                                      'string',
                                  )
                                : []

                            if (
                              event
                                .target
                                .checked
                            ) {
                              setDefaultValue([
                                ...current,
                                option.value,
                              ])
                            } else {
                              setDefaultValue(
                                current.filter(
                                  (item) =>
                                    item !==
                                    option.value,
                                ),
                              )
                            }
                          }}
                        />
                      )
                    },
                  )}

                {options.length ===
                  0 && (
                  <p className="text-sm text-muted-foreground">
                    ابتدا گزینههای فیلد را تعریف کنید.
                  </p>
                )}
              </div>
            ) : (
              <Input
                type={
                  fieldType ===
                    'integer' ||
                  fieldType ===
                    'decimal'
                    ? 'number'
                    : fieldType ===
                        'date'
                      ? 'date'
                      : fieldType ===
                          'datetime'
                        ? 'datetime-local'
                        : 'text'
                }
                step={
                  fieldType ===
                  'integer'
                    ? '1'
                    : fieldType ===
                        'decimal'
                      ? 'any'
                      : undefined
                }
                value={
                  typeof defaultValue ===
                    'string' ||
                  typeof defaultValue ===
                    'number'
                    ? defaultValue
                    : ''
                }
                onChange={(event) =>
                  setDefaultValue(
                    event.target
                      .value,
                  )
                }
                placeholder={
                  fieldType ===
                  'string'
                    ? 'در صورت نیاز مقدار پیشفرض را وارد کنید'
                    : undefined
                }
              />
            )}
          </div>
        </section>


        <section>
          <h3 className="text-sm font-semibold text-foreground">
            رفتار فیلد
          </h3>

          <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <Checkbox
              label="ورود مقدار اجباری است"
              {...register(
                'required',
              )}
            />

            <Checkbox
              label="مقدار باید یکتا باشد"
              {...register(
                'unique',
              )}
            />

            <Checkbox
              label="تولید خودکار"
              {...register(
                'auto_generate',
              )}
            />

            <Checkbox
              label="فقط خواندنی"
              {...register(
                'readonly',
              )}
            />

            <Checkbox
              label="فیلد فعال است"
              {...register(
                'is_active',
              )}
            />

            <Checkbox
              label="نمایش در لیست کالاها"
              {...register(
                'show_in_list',
              )}
            />
          </div>
        </section>


        <section className="space-y-4">
          <h3 className="text-sm font-semibold text-foreground">
            نحوه نمایش
          </h3>

          <FormField
            label="متن راهنما"
            htmlFor="field-placeholder"
          >
            <Input
              id="field-placeholder"
              placeholder="مثلا تاریخ انقضای کالا را وارد کنید"
              {...register(
                'placeholder',
              )}
            />
          </FormField>


          <FormField
            label="توضیحات"
            htmlFor="field-description"
          >
            <Textarea
              id="field-description"
              rows={3}
              placeholder="توضیح تکمیلی درباره کاربرد این فیلد..."
              {...register(
                'description',
              )}
            />
          </FormField>
        </section>
      </form>
    </Dialog>
  )
}

export default DynamicFieldEditor