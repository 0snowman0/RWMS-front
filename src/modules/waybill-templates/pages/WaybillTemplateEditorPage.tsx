import {
  useEffect,
  useMemo,
  useState,
} from 'react'

import {
  ArrowDown,
  ArrowRight,
  ArrowUp,
  Edit3,
  Eye,
  FilePlus2,
  Plus,
  Save,
  Trash2,
} from 'lucide-react'

import {
  useNavigate,
  useParams,
} from 'react-router'

import {
  DynamicFieldsForm,
} from '@/shared/dynamic-fields'

import type {
  DynamicFieldDefinition,
  DynamicFieldValues,
} from '@/shared/dynamic-fields'

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
  WaybillTemplateFieldEditor,
} from '../components/WaybillTemplateFieldEditor'

import {
  createWaybillTemplate,
  getWaybillTemplateById,
  updateWaybillTemplate,
} from '../api/waybill-template.api'


function buildPreviewValues(
  fields:
    DynamicFieldDefinition[],
): DynamicFieldValues {
  const result:
    DynamicFieldValues =
      {}

  for (
    const field of
    fields
  ) {
    result[
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

  return result
}


function getTypeLabel(
  field:
    DynamicFieldDefinition,
) {
  const labels:
    Record<
      string,
      string
    > = {
      string:
        'متن',

      integer:
        'عدد صحیح',

      decimal:
        'عدد اعشاری',

      boolean:
        'بله / خیر',

      date:
        'تاریخ',

      datetime:
        'تاریخ و زمان',

      select:
        'انتخاب تکی',

      multi_select:
        'انتخاب چندگانه',
    }

  return (
    labels[
      field.field_type
    ] ??
    field.field_type
  )
}


function WaybillTemplateEditorPage() {
  const navigate =
    useNavigate()

  const {
    templateId,
  } =
    useParams()


  const isEdit =
    templateId !==
    undefined


  const [
    name,
    setName,
  ] =
    useState('')


  const [
    description,
    setDescription,
  ] =
    useState('')


  const [
    isActive,
    setIsActive,
  ] =
    useState(true)


  const [
    fields,
    setFields,
  ] =
    useState<
      DynamicFieldDefinition[]
    >([])


  const [
    loading,
    setLoading,
  ] =
    useState(
      isEdit,
    )


  const [
    saving,
    setSaving,
  ] =
    useState(false)


  const [
    fieldEditorOpen,
    setFieldEditorOpen,
  ] =
    useState(false)


  const [
    editingField,
    setEditingField,
  ] =
    useState<
      DynamicFieldDefinition |
      null
    >(null)


  const [
    deleteTarget,
    setDeleteTarget,
  ] =
    useState<
      DynamicFieldDefinition |
      null
    >(null)


  const [
    previewOpen,
    setPreviewOpen,
  ] =
    useState(false)


  const [
    previewValues,
    setPreviewValues,
  ] =
    useState<
      DynamicFieldValues
    >({})


  const sortedFields =
    useMemo(
      () =>
        [...fields].sort(
          (a, b) =>
            a.sort_order -
            b.sort_order,
        ),
      [fields],
    )


  const activeFieldsCount =
    fields.filter(
      (field) =>
        field.is_active,
    ).length


  const requiredFieldsCount =
    fields.filter(
      (field) =>
        field.is_active &&
        field.required,
    ).length


  useEffect(
    () => {
      setPreviewValues(
        buildPreviewValues(
          fields,
        ),
      )
    },
    [fields],
  )


  useEffect(
    () => {
      if (!isEdit) {
        return
      }

      const id =
        Number(
          templateId,
        )

      if (
        !Number.isInteger(
          id,
        )
      ) {
        notify.error(
          'شناسه قالب معتبر نیست.',
        )

        navigate(
          '/waybill-templates',
        )

        return
      }


      let active =
        true


      async function load() {
        try {
          setLoading(true)

          const template =
            await getWaybillTemplateById(
              id,
            )

          if (!active) {
            return
          }

          if (!template) {
            notify.error(
              'قالب بارنامه پیدا نشد.',
            )

            navigate(
              '/waybill-templates',
            )

            return
          }


          setName(
            template.name,
          )

          setDescription(
            template.description ??
            '',
          )

          setIsActive(
            template.is_active,
          )

          setFields(
            template.fields,
          )
        } catch (error) {
          if (active) {
            notify.error(
              error instanceof Error
                ? error.message
                : 'دریافت قالب بارنامه ناموفق بود.',
            )
          }
        } finally {
          if (active) {
            setLoading(false)
          }
        }
      }


      void load()


      return () => {
        active =
          false
      }
    },
    [
      isEdit,
      navigate,
      templateId,
    ],
  )


  const nextSortOrder =
    fields.length === 0
      ? 1
      : Math.max(
          ...fields.map(
            (field) =>
              field.sort_order,
          ),
        ) + 1


  function addField() {
    setEditingField(
      null,
    )

    setFieldEditorOpen(
      true,
    )
  }


  function editField(
    field:
      DynamicFieldDefinition,
  ) {
    setEditingField(
      field,
    )

    setFieldEditorOpen(
      true,
    )
  }


  function saveField(
    field:
      DynamicFieldDefinition,
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

    setEditingField(
      null,
    )
  }


  function moveField(
    index: number,
    direction:
      | 'up'
      | 'down',
  ) {
    const next =
      [...sortedFields]

    const target =
      direction === 'up'
        ? index - 1
        : index + 1

    if (
      target < 0 ||
      target >=
        next.length
    ) {
      return
    }

    const temp =
      next[index]

    next[index] =
      next[target]

    next[target] =
      temp


    setFields(
      next.map(
        (
          field,
          fieldIndex,
        ) => ({
          ...field,

          sort_order:
            fieldIndex + 1,
        }),
      ),
    )
  }


  function confirmDeleteField() {
    if (!deleteTarget) {
      return
    }

    setFields(
      (current) =>
        current
          .filter(
            (field) =>
              field.field_id !==
              deleteTarget.field_id,
          )
          .sort(
            (a, b) =>
              a.sort_order -
              b.sort_order,
          )
          .map(
            (
              field,
              index,
            ) => ({
              ...field,

              sort_order:
                index + 1,
            }),
          ),
    )

    setDeleteTarget(
      null,
    )
  }


  async function saveTemplate() {
    if (
      !name.trim()
    ) {
      notify.error(
        'نام قالب الزامی است.',
      )

      return
    }


    try {
      setSaving(true)

      const payload = {
        name:
          name.trim(),

        description:
          description.trim() ||
          null,

        is_active:
          isActive,

        fields:
          sortedFields,
      }


      if (isEdit) {
        await updateWaybillTemplate(
          Number(
            templateId,
          ),
          payload,
        )

        notify.success(
          'قالب بارنامه ویرایش شد.',
        )
      } else {
        await createWaybillTemplate(
          payload,
        )

        notify.success(
          'قالب بارنامه ایجاد شد.',
        )
      }


      navigate(
        '/waybill-templates',
      )
    } catch (error) {
      notify.error(
        error instanceof Error
          ? error.message
          : (
              isEdit
                ? 'ویرایش قالب بارنامه انجام نشد.'
                : 'ایجاد قالب بارنامه انجام نشد.'
            ),
      )
    } finally {
      setSaving(false)
    }
  }


  if (loading) {
    return (
      <div className="rounded-2xl border border-border bg-surface p-10 text-center text-sm text-muted-foreground">
        در حال دریافت قالب بارنامه...
      </div>
    )
  }


  return (
    <>
      <div className="space-y-6">
        <PageHeader
          title={
            isEdit
              ? 'ویرایش قالب بارنامه'
              : 'ایجاد قالب بارنامه'
          }
          description="ساختار فرم بارنامه را با استفاده از فیلدهای داینامیک تعریف کنید."
          actions={
            <Button
              type="button"
              variant="outline"
              onClick={() =>
                navigate(
                  '/waybill-templates',
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
              <FilePlus2
                size={20}
              />
            </div>

            <div>
              <h2 className="font-semibold text-foreground">
                اطلاعات پایه قالب
              </h2>

              <p className="mt-1 text-sm text-muted-foreground">
                نام، توضیحات و وضعیت استفاده از قالب را مشخص کنید.
              </p>
            </div>
          </div>


          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-foreground">
                نام قالب
                <span className="mr-1 text-danger">
                  *
                </span>
              </label>

              <input
                className="w-full rounded-xl border border-border bg-surface px-3 py-2.5 text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/15"
                value={
                  name
                }
                placeholder="مثلاً قالب انتقال بین انبارها"
                onChange={(
                  event,
                ) =>
                  setName(
                    event.target.value,
                  )
                }
              />
            </div>


            <div>
              <label className="mb-2 block text-sm font-medium text-foreground">
                وضعیت قالب
              </label>

              <button
                type="button"
                className={[
                  'flex w-full items-center justify-between rounded-xl border px-4 py-3 text-right transition',
                  isActive
                    ? 'border-success/30 bg-success-soft'
                    : 'border-border bg-surface-muted/40',
                ].join(' ')}
                onClick={() =>
                  setIsActive(
                    (current) =>
                      !current,
                  )
                }
              >
                <div>
                  <div className="text-sm font-medium text-foreground">
                    {isActive
                      ? 'قالب فعال است'
                      : 'قالب غیرفعال است'}
                  </div>

                  <div className="mt-1 text-xs text-muted-foreground">
                    قالب غیرفعال در ایجاد بارنامه جدید قابل انتخاب نیست.
                  </div>
                </div>

                <span
                  className={[
                    'relative h-6 w-11 rounded-full transition',
                    isActive
                      ? 'bg-success'
                      : 'bg-border-strong',
                  ].join(' ')}
                >
                  <span
                    className={[
                      'absolute top-1 size-4 rounded-full bg-white transition-all',
                      isActive
                        ? 'left-1'
                        : 'left-6',
                    ].join(' ')}
                  />
                </span>
              </button>
            </div>


            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-medium text-foreground">
                توضیحات
              </label>

              <textarea
                rows={3}
                className="w-full rounded-xl border border-border bg-surface px-3 py-2.5 text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/15"
                value={
                  description
                }
                placeholder="کاربرد این قالب را توضیح دهید..."
                onChange={(
                  event,
                ) =>
                  setDescription(
                    event.target.value,
                  )
                }
              />
            </div>
          </div>
        </section>


        <section className="rounded-2xl border border-border bg-surface">
          <div className="flex flex-col gap-4 border-b border-border p-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="font-semibold text-foreground">
                فیلدهای قالب
              </h2>

              <div className="mt-2 flex flex-wrap gap-2">
                <span className="rounded-lg bg-surface-muted px-2.5 py-1 text-xs text-muted-foreground">
                  {fields.length} فیلد
                </span>

                <span className="rounded-lg bg-success-soft px-2.5 py-1 text-xs text-success">
                  {activeFieldsCount} فعال
                </span>

                <span className="rounded-lg bg-warning-soft px-2.5 py-1 text-xs text-warning">
                  {requiredFieldsCount} اجباری
                </span>
              </div>
            </div>


            <div className="flex flex-wrap gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() =>
                  setPreviewOpen(
                    (current) =>
                      !current,
                  )
                }
              >
                <Eye
                  size={16}
                />

                پیش‌نمایش فرم
              </Button>

              <Button
                type="button"
                onClick={
                  addField
                }
              >
                <Plus
                  size={16}
                />

                افزودن فیلد
              </Button>
            </div>
          </div>


          {sortedFields.length ===
          0 ? (
            <div className="p-10 text-center">
              <div className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-primary-soft text-primary">
                <Plus
                  size={22}
                />
              </div>

              <p className="mt-4 font-medium text-foreground">
                هنوز فیلدی تعریف نشده است
              </p>

              <p className="mt-2 text-sm text-muted-foreground">
                فیلدهای اختصاصی این نوع بارنامه را تعریف کنید.
              </p>
            </div>
          ) : (
            <div className="space-y-3 p-4">
              {sortedFields.map(
                (
                  field,
                  index,
                ) => (
                  <div
                    key={
                      field.field_id
                    }
                    className="flex flex-col gap-4 rounded-xl border border-border p-4 lg:flex-row lg:items-center lg:justify-between"
                  >
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-medium text-foreground">
                          {
                            field.title
                          }
                        </span>

                        <span className="rounded-md bg-surface-muted px-2 py-0.5 text-[11px] text-muted-foreground">
                          {
                            getTypeLabel(
                              field,
                            )
                          }
                        </span>

                        {field.required && (
                          <span className="rounded-md bg-warning-soft px-2 py-0.5 text-[11px] text-warning">
                            اجباری
                          </span>
                        )}

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

                        {!field.is_active && (
                          <span className="rounded-md bg-surface-muted px-2 py-0.5 text-[11px] text-muted-foreground">
                            غیرفعال
                          </span>
                        )}
                      </div>

                      <div
                        dir="ltr"
                        className="mt-2 text-left text-xs text-muted-foreground"
                      >
                        {
                          field.name
                        }
                      </div>
                    </div>


                    <div className="flex flex-wrap gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        disabled={
                          index === 0
                        }
                        onClick={() =>
                          moveField(
                            index,
                            'up',
                          )
                        }
                      >
                        <ArrowUp
                          size={15}
                        />
                      </Button>

                      <Button
                        type="button"
                        variant="outline"
                        disabled={
                          index ===
                          sortedFields.length -
                            1
                        }
                        onClick={() =>
                          moveField(
                            index,
                            'down',
                          )
                        }
                      >
                        <ArrowDown
                          size={15}
                        />
                      </Button>

                      <Button
                        type="button"
                        variant="outline"
                        onClick={() =>
                          editField(
                            field,
                          )
                        }
                      >
                        <Edit3
                          size={15}
                        />

                        ویرایش
                      </Button>

                      <Button
                        type="button"
                        variant="outline"
                        onClick={() =>
                          setDeleteTarget(
                            field,
                          )
                        }
                      >
                        <Trash2
                          size={15}
                        />

                        حذف
                      </Button>
                    </div>
                  </div>
                ),
              )}
            </div>
          )}
        </section>


        {previewOpen && (
          <section className="rounded-2xl border border-primary/25 bg-surface p-5">
            <div className="mb-5">
              <h2 className="font-semibold text-foreground">
                پیش‌نمایش فرم بارنامه
              </h2>

              <p className="mt-1 text-sm text-muted-foreground">
                این فرم همان ساختاری است که پس از تخصیص این قالب به بارنامه ساخته می‌شود.
              </p>
            </div>

            {sortedFields.length ===
            0 ? (
              <div className="rounded-xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
                فیلدی برای پیش‌نمایش وجود ندارد.
              </div>
            ) : (
              <DynamicFieldsForm
                fields={
                  sortedFields
                }
                values={
                  previewValues
                }
                onChange={(
                  fieldId,
                  value,
                ) =>
                  setPreviewValues(
                    (current) => ({
                      ...current,

                      [fieldId]:
                        value,
                    }),
                  )
                }
              />
            )}
          </section>
        )}


        <div className="flex flex-col-reverse gap-3 border-t border-border pt-5 sm:flex-row sm:justify-end">
          <Button
            type="button"
            variant="outline"
            disabled={
              saving
            }
            onClick={() =>
              navigate(
                '/waybill-templates',
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
              saveTemplate
            }
          >
            <Save
              size={17}
            />

            {isEdit
              ? 'ذخیره تغییرات'
              : 'ایجاد قالب'}
          </Button>
        </div>
      </div>


      <WaybillTemplateFieldEditor
        open={
          fieldEditorOpen
        }
        field={
          editingField
        }
        nextSortOrder={
          nextSortOrder
        }
        onOpenChange={(
          open,
        ) => {
          setFieldEditorOpen(
            open,
          )

          if (!open) {
            setEditingField(
              null,
            )
          }
        }}
        onSave={
          saveField
        }
      />


      <ConfirmDialog
        open={
          deleteTarget !==
          null
        }
        onOpenChange={(
          open,
        ) => {
          if (!open) {
            setDeleteTarget(
              null,
            )
          }
        }}
        title="حذف فیلد"
        description={
          deleteTarget
            ? `آیا از حذف فیلد «${deleteTarget.title}» مطمئن هستید؟`
            : ''
        }
        confirmLabel="حذف فیلد"
        cancelLabel="انصراف"
        variant="danger"
        onConfirm={
          confirmDeleteField
        }
      />
    </>
  )
}


export default WaybillTemplateEditorPage