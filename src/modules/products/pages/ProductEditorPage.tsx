import {
  useEffect,
  useMemo,
  useState,
} from 'react'

import {
  ArrowRight,
  PackagePlus,
  Save,
} from 'lucide-react'

import {
  useNavigate,
  useParams,
} from 'react-router'

import {
  getCategoryById,
  getPagedCategories,
} from '@/modules/categories/api/category.api'

import type {
  Category,
} from '@/modules/categories/types/category.types'

import {
  Button,
} from '@/shared/ui/button'

import {
  PageHeader,
} from '@/shared/ui/page-header'

import {
  notify,
} from '@/shared/notifications'

import {
  ProductCategorySelector,
} from '../components/ProductCategorySelector'

import {
  ProductDynamicFieldsForm,
} from '../components/ProductDynamicFieldsForm'

import type {
  ProductFormValues,
} from '../components/ProductDynamicFieldsForm'

import {
  createProduct,
  getProductById,
  updateProduct,
} from '../api/product.api'

import type {
  ProductDynamicField,
} from '../types'


function buildFields(
  categories: Category[],
  selectedCategoryIds: number[],
): ProductDynamicField[] {
  return categories
    .filter(
      (category) =>
        selectedCategoryIds.includes(
          category.id,
        ),
    )
    .flatMap(
      (category) =>
        [...category.fields]
          .filter(
            (field) =>
              field.is_active,
          )
          .sort(
            (a, b) =>
              a.sort_order -
              b.sort_order,
          )
          .map(
            (field) => ({
              ...field,

              category_id:
                category.id,

              category_name:
                category.name,

              value:
                field.default_value ??
                null,
            }),
          ),
    )
}


function isEmptyValue(
  value: unknown,
): boolean {
  if (
    value === null ||
    value === undefined
  ) {
    return true
  }

  if (
    typeof value ===
    'string'
  ) {
    return (
      value.trim() === ''
    )
  }

  if (
    Array.isArray(value)
  ) {
    return (
      value.length === 0
    )
  }

  return false
}


function ProductEditorPage() {
  const navigate =
    useNavigate()

  const {
    productId,
  } = useParams()

  const isEdit =
    productId !== undefined


  const [
    categories,
    setCategories,
  ] = useState<Category[]>(
    [],
  )


  const [
    name,
    setName,
  ] = useState('')


  const [
    selectedCategoryIds,
    setSelectedCategoryIds,
  ] = useState<number[]>(
    [],
  )


  const [
    values,
    setValues,
  ] =
    useState<ProductFormValues>(
      {},
    )


  const [
    errors,
    setErrors,
  ] = useState<
    Record<
      string,
      string
    >
  >({})


  const [
    nameError,
    setNameError,
  ] = useState('')


  const [
    loading,
    setLoading,
  ] = useState(
    isEdit,
  )


  const [
    saving,
    setSaving,
  ] = useState(false)


  const fields =
    useMemo(
      () =>
        buildFields(
          categories,
          selectedCategoryIds,
        ),
      [
        categories,
        selectedCategoryIds,
      ],
    )


  useEffect(
    () => {
      setValues(
        (current) => {
          const next:
            ProductFormValues =
              {}

          for (
            const field of
            fields
          ) {
            if (
              Object.prototype.hasOwnProperty.call(
                current,
                field.field_id,
              )
            ) {
              next[
                field.field_id
              ] =
                current[
                  field.field_id
                ]

              continue
            }

            next[
              field.field_id
            ] =
              field.default_value ??
              (
                field.field_type ===
                'multi_select'
                  ? []
                  : null
              )
          }

          return next
        },
      )
    },
    [fields],
  )


  useEffect(
    () => {
      let active = true


      async function load() {
        try {
          setLoading(true)


          let productIdNumber:
            number | null =
              null


          if (isEdit) {
            productIdNumber =
              Number(
                productId,
              )

            if (
              !Number.isInteger(
                productIdNumber,
              )
            ) {
              notify.error(
                'شناسه کالا معتبر نیست.',
              )

              navigate(
                '/products',
              )

              return
            }
          }


          /*
           * Backend supports:
           *
           * page_number = -1
           * page_size   = -1
           *
           * which returns all Categories.
           */
          const categoryResult =
            await getPagedCategories({
              page_number: -1,
              page_size: -1,
              sort_by: 'name',
              is_ascending: true,
              filter: null,
            })


          /*
           * Category list returns Summary DTO
           * and therefore does not include fields.
           *
           * Load each Category detail so the
           * selector and Product Dynamic Fields
           * use REAL backend definitions.
           */
          const categoryDetails =
            await Promise.all(
              categoryResult.items.map(
                (category) =>
                  getCategoryById(
                    category.id,
                  ),
              ),
            )


          if (!active) {
            return
          }


          setCategories(
            categoryDetails,
          )


          /*
           * CREATE mode needs only Categories.
           */
          if (
            !isEdit ||
            productIdNumber === null
          ) {
            return
          }


          /*
           * EDIT mode:
           * load real Product detail.
           */
          const product =
            await getProductById(
              productIdNumber,
            )


          if (!active) {
            return
          }


          if (!product) {
            notify.error(
              'کالا پیدا نشد.',
            )

            navigate(
              '/products',
            )

            return
          }


          setName(
            product.name,
          )


          /*
           * Preselect categories already assigned
           * to the Product.
           */
          setSelectedCategoryIds(
            product.categories.map(
              (category) =>
                category.id,
            ),
          )


          /*
           * Preserve current Product values.
           *
           * Dynamic field definitions themselves
           * come from current real Categories.
           */
          const loadedValues:
            ProductFormValues =
              {}


          for (
            const field of
            product.fields
          ) {
            loadedValues[
              field.field_id
            ] =
              field.value
          }


          setValues(
            loadedValues,
          )
        } catch {
          if (!active) {
            return
          }

          notify.error(
            'دریافت اطلاعات لازم برای فرم کالا انجام نشد.',
          )
        } finally {
          if (active) {
            setLoading(false)
          }
        }
      }


      void load()


      return () => {
        active = false
      }
    },
    [
      isEdit,
      navigate,
      productId,
    ],
  )


  function handleFieldChange(
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

    setErrors(
      (current) => {
        if (
          !current[
            fieldId
          ]
        ) {
          return current
        }

        const next = {
          ...current,
        }

        delete next[
          fieldId
        ]

        return next
      },
    )
  }


  function validate() {
    let valid = true

    const nextErrors:
      Record<
        string,
        string
      > = {}


    if (
      !name.trim()
    ) {
      setNameError(
        'نام کالا الزامی است.',
      )

      valid = false
    } else {
      setNameError('')
    }


    for (
      const field of
      fields
    ) {
      if (
        field.required &&
        !field.auto_generate &&
        isEmptyValue(
          values[
            field.field_id
          ],
        )
      ) {
        nextErrors[
          field.field_id
        ] =
          'تکمیل این فیلد الزامی است.'

        valid = false
      }
    }


    setErrors(
      nextErrors,
    )

    return valid
  }


  async function handleSave() {
    if (!validate()) {
      notify.error(
        'لطفاً فیلدهای الزامی را تکمیل کنید.',
      )

      return
    }


    try {
      setSaving(true)

      const payload = {
        name:
          name.trim(),

        category_ids:
          selectedCategoryIds,

        attributes:
          fields.map(
            (field) => ({
              category_id:
                field.category_id,

              field_id:
                field.field_id,

              value:
                values[
                  field.field_id
                ] ?? null,
            }),
          ),
      }


      if (
        isEdit
      ) {
        await updateProduct(
          Number(
            productId,
          ),
          payload,
        )

        notify.success(
          'کالا با موفقیت ویرایش شد.',
        )
      } else {
        await createProduct(
          payload,
        )

        notify.success(
          'کالا با موفقیت ایجاد شد.',
        )
      }


      navigate(
        '/products',
      )
    } catch {
      notify.error(
        'عملیات ذخیره کالا انجام نشد.',
      )
    } finally {
      setSaving(false)
    }
  }


  if (loading) {
    return (
      <div className="rounded-2xl border border-border bg-surface p-10 text-center text-sm text-muted-foreground">
        در حال دریافت اطلاعات کالا...
      </div>
    )
  }


  return (
    <div className="space-y-6">
      <PageHeader
        title={
          isEdit
            ? 'ویرایش کالا'
            : 'ایجاد کالا'
        }
        description={
          isEdit
            ? 'اطلاعات و مشخصات کالا را ویرایش کنید.'
            : 'اطلاعات پایه، دسته‌بندی‌ها و مشخصات کالا را وارد کنید.'
        }
        actions={
          <Button
            type="button"
            variant="outline"
            onClick={() =>
              navigate(
                '/products',
              )
            }
          >
            <ArrowRight
              size={17}
            />

            بازگشت
          </Button>
        }
      />


      <section className="rounded-2xl border border-border bg-surface p-5">
        <div className="mb-5 flex items-start gap-3">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary-soft text-primary">
            <PackagePlus
              size={20}
            />
          </div>

          <div>
            <h2 className="font-semibold text-foreground">
              اطلاعات پایه کالا
            </h2>

            <p className="mt-1 text-sm text-muted-foreground">
              اطلاعات اصلی کالا را وارد کنید.
            </p>
          </div>
        </div>


        <div className="max-w-2xl">
          <label className="mb-2 block text-sm font-medium text-foreground">
            نام کالا
            <span className="mr-1 text-danger">
              *
            </span>
          </label>

          <input
            className={[
              'w-full rounded-xl border bg-surface px-3 py-2.5 text-sm text-foreground outline-none transition',
              nameError
                ? 'border-danger focus:ring-2 focus:ring-danger/15'
                : 'border-border focus:border-primary focus:ring-2 focus:ring-primary/15',
            ].join(' ')}
            value={name}
            placeholder="مثلاً برنج ایرانی ۱۰ کیلویی"
            onChange={(
              event,
            ) => {
              setName(
                event.target
                  .value,
              )

              if (
                nameError
              ) {
                setNameError('')
              }
            }}
          />

          {nameError && (
            <p className="mt-2 text-xs text-danger">
              {
                nameError
              }
            </p>
          )}
        </div>
      </section>


      <ProductCategorySelector
        categories={
          categories
        }
        selectedIds={
          selectedCategoryIds
        }
        onChange={
          setSelectedCategoryIds
        }
      />


      <ProductDynamicFieldsForm
        fields={fields}
        values={values}
        errors={errors}
        onChange={
          handleFieldChange
        }
      />


      <div className="flex flex-col-reverse gap-3 border-t border-border pt-5 sm:flex-row sm:justify-end">
        <Button
          type="button"
          variant="outline"
          disabled={
            saving
          }
          onClick={() =>
            navigate(
              '/products',
            )
          }
        >
          انصراف
        </Button>

        <Button
          type="button"
          isLoading={
            saving
          }
          onClick={
            handleSave
          }
        >
          <Save
            size={17}
          />

          {isEdit
            ? 'ذخیره تغییرات'
            : 'ایجاد کالا'}
        </Button>
      </div>
    </div>
  )
}


export default ProductEditorPage