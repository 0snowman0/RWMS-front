import {
  useEffect,
  useState,
} from 'react'

import {
  ArrowRight,
  Eye,
  Save,
} from 'lucide-react'

import {
  useForm,
} from 'react-hook-form'

import {
  useQuery,
  useQueryClient,
} from '@tanstack/react-query'

import {
  useNavigate,
  useParams,
} from 'react-router'

import {
  Button,
} from '@/shared/ui/button'

import {
  ConfirmDialog,
} from '@/shared/ui/dialog'

import {
  PageHeader,
} from '@/shared/ui/page-header'

import {
  notify,
} from '@/shared/notifications'

import {
  zodResolver,
} from '@/shared/forms'

import {
  createCategory,
  getCategoryById,
  updateCategory,
} from '../api/category.api'

import {
  CategoryBasicInfoForm,
} from '../components/CategoryBasicInfoForm'

import {
  CategoryFieldsSection,
} from '../components/CategoryFieldsSection'

import {
  CategoryFormPreviewDialog,
} from '../components/CategoryFormPreviewDialog'

import {
  DynamicFieldEditor,
} from '../components/DynamicFieldEditor'

import {
  categoryFormSchema,
} from '../schemas/category.schema'

import type {
  CategoryFormValues,
} from '../schemas/category.schema'

import type {
  DynamicFieldDefinition,
} from '../types/category.types'


function CategoryEditorPage() {
  const navigate =
    useNavigate()

  const queryClient =
    useQueryClient()

  const {
    categoryId,
  } = useParams()

  const isEditMode =
    categoryId !== undefined


  const categoryIdNumber =
    Number(categoryId)


  const {
    data: category,
    isError: isCategoryError,
  } = useQuery({
    queryKey: [
      'categories',
      'detail',
      categoryIdNumber,
    ],

    queryFn: () =>
      getCategoryById(
        categoryIdNumber,
      ),

    enabled:
      isEditMode &&
      Number.isInteger(
        categoryIdNumber,
      ) &&
      categoryIdNumber > 0,

    retry: false,
  })

  const [
    fields,
    setFields,
  ] = useState<
    DynamicFieldDefinition[]
  >([])


  const [
    fieldEditorOpen,
    setFieldEditorOpen,
  ] = useState(false)


  const [
    editingField,
    setEditingField,
  ] = useState<
    DynamicFieldDefinition | null
  >(null)


  const [
    deleteFieldTarget,
    setDeleteFieldTarget,
  ] = useState<
    DynamicFieldDefinition | null
  >(null)


  const [
    previewOpen,
    setPreviewOpen,
  ] = useState(false)


  const {
    register,
    handleSubmit,
    watch,
    reset,

    formState: {
      errors,
      isSubmitting,
    },
  } = useForm<CategoryFormValues>({
    resolver: zodResolver(
      categoryFormSchema,
    ),

    defaultValues: {
      name: '',

      description: '',
    },
  })


  const currentCategoryName =
    watch('name')


  

  useEffect(() => {
    if (!category) {
      return
    }

    reset({
      name:
        category.name,

      description:
        category.description ??
        '',
    })

    setFields(
      category.fields ?? [],
    )
  }, [
    category,
    reset,
  ])


  useEffect(() => {
    if (
      !isEditMode ||
      !isCategoryError
    ) {
      return
    }

    notify.error(
      'دریافت اطلاعات دستهبندی انجام نشد.',
    )

    navigate(
      '/categories',
    )
  }, [
    isCategoryError,
    isEditMode,
    navigate,
  ])

  async function onSubmit(
    values: CategoryFormValues,
  ) {
    const payload = {
      ...values,

      description:
        values.description?.trim() ||
        null,

      fields,
    }


    /*
     * Edit mode is intentionally left unchanged
     * for this MVP step.
     *
     * Only CREATE is connected to the real backend.
     */
    if (isEditMode) {
      if (
        !Number.isInteger(
          categoryIdNumber,
        ) ||
        categoryIdNumber <= 0
      ) {
        notify.error(
          'شناسه دستهبندی نامعتبر است.',
        )

        return
      }

      try {
        await updateCategory(
          categoryIdNumber,
          payload,
        )

        await queryClient.invalidateQueries({
          queryKey: [
            'categories',
          ],
        })

        notify.success(
          'دستهبندی با موفقیت ویرایش شد.',
        )

        navigate(
          '/categories',
        )
      }
      catch (error) {
        console.error(
          'Update category failed:',
          error,
        )

        notify.error(
          'ویرایش دستهبندی انجام نشد.',
        )
      }

      return
    }


    try {
      await createCategory(
        payload,
      )

      await queryClient.invalidateQueries({
        queryKey: [
          'categories',
        ],
      })

      notify.success(
        'دستهبندی با موفقیت ایجاد شد.',
      )

      navigate(
        '/categories',
      )
    }
    catch (error) {
      console.error(
        'Create category failed:',
        error,
      )

      notify.error(
        'ایجاد دستهبندی انجام نشد.',
      )
    }
  }


  function handleAddField() {
    setEditingField(null)

    setFieldEditorOpen(true)
  }


  function handleEditField(
    field: DynamicFieldDefinition,
  ) {
    setEditingField(field)

    setFieldEditorOpen(true)
  }


  function handleSaveField(
    field: DynamicFieldDefinition,
  ) {
    setFields(
      (current) => {
        const exists =
          current.some(
            (item) =>
              item.field_id ===
              field.field_id,
          )

        if (exists) {
          return current.map(
            (item) =>
              item.field_id ===
              field.field_id
                ? field
                : item,
          )
        }

        return [
          ...current,
          field,
        ]
      },
    )

    setEditingField(null)
  }


  function handleDeleteField(
    field: DynamicFieldDefinition,
  ) {
    setDeleteFieldTarget(
      field,
    )
  }


  function handleConfirmDeleteField() {
    if (!deleteFieldTarget) {
      return
    }

    const title =
      deleteFieldTarget.title


    setFields(
      (current) =>
        current
          .filter(
            (item) =>
              item.field_id !==
              deleteFieldTarget.field_id,
          )
          .sort(
            (a, b) =>
              a.sort_order -
              b.sort_order,
          )
          .map(
            (
              item,
              index,
            ) => ({
              ...item,

              sort_order:
                index + 1,
            }),
          ),
    )


    setDeleteFieldTarget(
      null,
    )


    notify.success(
      `فیلد «${title}» حذف شد.`,
    )
  }


  function handleMoveField(
    index: number,

    direction:
      | 'up'
      | 'down',
  ) {
    setFields(
      (current) => {
        const sorted = [
          ...current,
        ].sort(
          (a, b) =>
            a.sort_order -
            b.sort_order,
        )

        const targetIndex =
          direction === 'up'
            ? index - 1
            : index + 1

        if (
          targetIndex < 0 ||
          targetIndex >=
            sorted.length
        ) {
          return current
        }

        const next = [
          ...sorted,
        ]

        const currentField =
          next[index]

        const targetField =
          next[targetIndex]

        next[index] =
          targetField

        next[targetIndex] =
          currentField


        return next.map(
          (
            field,
            fieldIndex,
          ) => ({
            ...field,

            sort_order:
              fieldIndex + 1,
          }),
        )
      },
    )
  }


  function handleFieldEditorOpenChange(
    open: boolean,
  ) {
    setFieldEditorOpen(
      open,
    )

    if (!open) {
      setEditingField(null)
    }
  }


  const nextSortOrder =
    fields.length === 0
      ? 1
      : Math.max(
          ...fields.map(
            (field) =>
              field.sort_order,
          ),
        ) + 1


  return (
    <>
      <form
        className="space-y-6"
        onSubmit={
          handleSubmit(
            onSubmit,
          )
        }
      >
        <PageHeader
          title={
            isEditMode
              ? 'ویرایش دستهبندی'
              : 'ایجاد دستهبندی'
          }
          description={
            isEditMode
              ? 'اطلاعات و مشخصات دستهبندی را ویرایش کنید.'
              : 'دستهبندی جدید و فیلدهای موردنیاز آن را تعریف کنید.'
          }
          actions={
            <Button
              type="button"
              variant="outline"
              onClick={() =>
                navigate(
                  '/categories',
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


        <CategoryBasicInfoForm
          register={register}
          errors={errors}
        />


        <CategoryFieldsSection
          fields={fields}
          onAddField={
            handleAddField
          }
          onEditField={
            handleEditField
          }
          onDeleteField={
            handleDeleteField
          }
          onMoveField={
            handleMoveField
          }
        />


        <div className="rounded-2xl border border-border bg-surface p-5">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="font-semibold text-foreground">
                پیشنمایش فرم کالا
              </h2>

              <p className="mt-1 text-sm leading-6 text-muted-foreground">
                نتیجه فیلدهایی که تعریف کردهاید را پیش از ذخیره دستهبندی مشاهده کنید.
              </p>
            </div>

            <Button
              type="button"
              variant="outline"
              onClick={() =>
                setPreviewOpen(
                  true,
                )
              }
            >
              <Eye size={17} />

              مشاهده پیشنمایش
            </Button>
          </div>
        </div>


        <div className="flex flex-col-reverse gap-3 border-t border-border pt-5 sm:flex-row sm:justify-end">
          <Button
            type="button"
            variant="outline"
            disabled={
              isSubmitting
            }
            onClick={() =>
              navigate(
                '/categories',
              )
            }
          >
            انصراف
          </Button>

          <Button
            type="submit"
            isLoading={
              isSubmitting
            }
          >
            <Save
              size={17}
            />

            {isEditMode
              ? 'ذخیره تغییرات'
              : 'ایجاد دستهبندی'}
          </Button>
        </div>
      </form>


      <DynamicFieldEditor
        open={
          fieldEditorOpen
        }
        field={
          editingField
        }
        nextSortOrder={
          nextSortOrder
        }
        onOpenChange={
          handleFieldEditorOpenChange
        }
        onSave={
          handleSaveField
        }
      />


      <CategoryFormPreviewDialog
        open={
          previewOpen
        }
        categoryName={
          currentCategoryName
        }
        fields={
          fields
        }
        onOpenChange={
          setPreviewOpen
        }
      />


      <ConfirmDialog
        open={
          deleteFieldTarget !== null
        }
        onOpenChange={(open) => {
          if (!open) {
            setDeleteFieldTarget(
              null,
            )
          }
        }}
        title="حذف فیلد"
        description={
          deleteFieldTarget
            ? `آیا از حذف فیلد «${deleteFieldTarget.title}» مطمئن هستید`
            : ''
        }
        confirmLabel="حذف فیلد"
        cancelLabel="انصراف"
        variant="danger"
        onConfirm={
          handleConfirmDeleteField
        }
      />
    </>
  )
}

export default CategoryEditorPage