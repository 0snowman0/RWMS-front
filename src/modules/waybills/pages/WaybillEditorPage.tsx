import {
  useEffect,
  useMemo,
  useState,
} from 'react'

import {
  ArrowRight,
  CheckCircle2,
  FileText,
  Layers3,
  Save,
  Truck,
} from 'lucide-react'

import {
  useNavigate,
  useParams,
} from 'react-router'

import {
  DynamicFieldsForm,
} from '@/shared/dynamic-fields'

import type {
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
  getActiveWaybillTemplates,
  getWaybillTemplateById,
} from '@/modules/waybill-templates/mocks/waybillTemplateRepository.mock'

import type {
  WaybillTemplate,
} from '@/modules/waybill-templates/types'

import {
  createWaybill,
  getWaybillById,
  updateWaybill,
} from '../mocks/waybillRepository.mock'

import {
  waybillPriorities,
  waybillStatuses,
} from '../types'


interface StaticForm {
  name: string

  waybill_number: string

  waybill_date: string

  received_date: string

  sender_name: string

  sender_contact: string

  receiver_name: string

  receiver_contact: string

  origin: string

  destination: string

  vehicle_type: string

  vehicle_number: string

  driver_name: string

  driver_contact: string

  total_weight: string

  priority: string

  status: string

  description: string

  internal_notes: string
}


function createInitialStatic():
  StaticForm {
  return {
    name:
      '',

    waybill_number:
      '',

    waybill_date:
      '',

    received_date:
      '',

    sender_name:
      '',

    sender_contact:
      '',

    receiver_name:
      '',

    receiver_contact:
      '',

    origin:
      '',

    destination:
      '',

    vehicle_type:
      '',

    vehicle_number:
      '',

    driver_name:
      '',

    driver_contact:
      '',

    total_weight:
      '',

    priority:
      'normal',

    status:
      'registered',

    description:
      '',

    internal_notes:
      '',
  }
}


function emptyValue(
  value: unknown,
) {
  return (
    value === null ||
    value === undefined ||
    (
      typeof value ===
        'string' &&
      value.trim() === ''
    ) ||
    (
      Array.isArray(
        value,
      ) &&
      value.length === 0
    )
  )
}


function buildDefaults(
  template:
    WaybillTemplate,
): DynamicFieldValues {
  const result:
    DynamicFieldValues =
      {}

  for (
    const field of
    template.fields
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


function WaybillEditorPage() {
  const navigate =
    useNavigate()

  const {
    waybillId,
  } =
    useParams()


  const isEdit =
    waybillId !==
    undefined


  const [
    form,
    setForm,
  ] =
    useState<StaticForm>(
      createInitialStatic,
    )


  const [
    templates,
    setTemplates,
  ] =
    useState<
      WaybillTemplate[]
    >([])


  const [
    templateId,
    setTemplateId,
  ] =
    useState<
      number | null
    >(null)


  const [
    dynamicValues,
    setDynamicValues,
  ] =
    useState<
      DynamicFieldValues
    >({})


  const [
    dynamicErrors,
    setDynamicErrors,
  ] =
    useState<
      Record<
        string,
        string
      >
    >({})


  const [
    loading,
    setLoading,
  ] =
    useState(true)


  const [
    saving,
    setSaving,
  ] =
    useState(false)


  const [
    pendingTemplateId,
    setPendingTemplateId,
  ] =
    useState<
      number | null
    >(null)


  const [
    changeTemplateConfirmOpen,
    setChangeTemplateConfirmOpen,
  ] =
    useState(false)


  const selectedTemplate =
    useMemo(
      () =>
        templates.find(
          (template) =>
            template.id ===
            templateId,
        ) ??
        null,
      [
        templateId,
        templates,
      ],
    )


  function updateStatic<
    K extends keyof StaticForm
  >(
    key: K,
    value:
      StaticForm[K],
  ) {
    setForm(
      (current) => ({
        ...current,

        [key]:
          value,
      }),
    )
  }


  useEffect(
    () => {
      let active =
        true


      async function load() {
        try {
          setLoading(true)

          let availableTemplates =
            await getActiveWaybillTemplates()


          if (!isEdit) {
            if (active) {
              setTemplates(
                availableTemplates,
              )
            }

            return
          }


          const id =
            Number(
              waybillId,
            )

          if (
            !Number.isInteger(
              id,
            )
          ) {
            notify.error(
              'شناسه بارنامه معتبر نیست.',
            )

            navigate(
              '/waybills',
            )

            return
          }


          const item =
            await getWaybillById(
              id,
            )

          if (
            !active
          ) {
            return
          }


          if (!item) {
            notify.error(
              'بارنامه پیدا نشد.',
            )

            navigate(
              '/waybills',
            )

            return
          }


          if (
            !availableTemplates.some(
              (template) =>
                template.id ===
                item.template_id,
            )
          ) {
            const assignedTemplate =
              await getWaybillTemplateById(
                item.template_id,
              )

            if (
              assignedTemplate
            ) {
              availableTemplates = [
                ...availableTemplates,
                assignedTemplate,
              ]
            }
          }


          setTemplates(
            availableTemplates,
          )


          setForm({
            name:
              item.name,

            waybill_number:
              item.waybill_number ??
              '',

            waybill_date:
              item.waybill_date ??
              '',

            received_date:
              item.received_date ??
              '',

            sender_name:
              item.sender_name ??
              '',

            sender_contact:
              item.sender_contact ??
              '',

            receiver_name:
              item.receiver_name ??
              '',

            receiver_contact:
              item.receiver_contact ??
              '',

            origin:
              item.origin ??
              '',

            destination:
              item.destination ??
              '',

            vehicle_type:
              item.vehicle_type ??
              '',

            vehicle_number:
              item.vehicle_number ??
              '',

            driver_name:
              item.driver_name ??
              '',

            driver_contact:
              item.driver_contact ??
              '',

            total_weight:
              item.total_weight ===
                null
                ? ''
                : String(
                    item.total_weight,
                  ),

            priority:
              item.priority,

            status:
              item.status,

            description:
              item.description ??
              '',

            internal_notes:
              item.internal_notes ??
              '',
          })


          const values:
            DynamicFieldValues =
              {}

          for (
            const field of
            item.fields
          ) {
            values[
              field.field_id
            ] =
              field.value
          }


          setTemplateId(
            item.template_id,
          )

          setDynamicValues(
            values,
          )
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
      waybillId,
    ],
  )


  function applyTemplate(
    nextTemplateId:
      number | null,
  ) {
    setTemplateId(
      nextTemplateId,
    )

    setDynamicErrors(
      {},
    )


    if (
      nextTemplateId ===
      null
    ) {
      setDynamicValues(
        {},
      )

      return
    }


    const template =
      templates.find(
        (item) =>
          item.id ===
          nextTemplateId,
      )


    if (template) {
      setDynamicValues(
        buildDefaults(
          template,
        ),
      )
    }
  }


  function requestTemplateChange(
    nextTemplateId:
      number | null,
  ) {
    if (
      nextTemplateId ===
      templateId
    ) {
      return
    }


    if (
      templateId !== null &&
      Object.keys(
        dynamicValues,
      ).length > 0
    ) {
      setPendingTemplateId(
        nextTemplateId,
      )

      setChangeTemplateConfirmOpen(
        true,
      )

      return
    }


    applyTemplate(
      nextTemplateId,
    )
  }


  function confirmTemplateChange() {
    applyTemplate(
      pendingTemplateId,
    )

    setPendingTemplateId(
      null,
    )

    setChangeTemplateConfirmOpen(
      false,
    )
  }


  async function save() {
    if (
      !form.name.trim()
    ) {
      notify.error(
        'نام بارنامه الزامی است.',
      )

      return
    }


    if (
      !selectedTemplate
    ) {
      notify.error(
        'ابتدا قالب بارنامه را انتخاب کنید.',
      )

      return
    }


    const nextErrors:
      Record<
        string,
        string
      > = {}


    for (
      const field of
      selectedTemplate.fields
    ) {
      if (
        field.is_active &&
        field.required &&
        !field.auto_generate &&
        emptyValue(
          dynamicValues[
            field.field_id
          ],
        )
      ) {
        nextErrors[
          field.field_id
        ] =
          'تکمیل این فیلد الزامی است.'
      }
    }


    setDynamicErrors(
      nextErrors,
    )


    if (
      Object.keys(
        nextErrors,
      ).length > 0
    ) {
      notify.error(
        'فیلدهای الزامی قالب را تکمیل کنید.',
      )

      return
    }


    const totalWeight =
      form.total_weight.trim() ===
        ''
        ? null
        : Number(
            form.total_weight,
          )


    if (
      totalWeight !== null &&
      Number.isNaN(
        totalWeight,
      )
    ) {
      notify.error(
        'وزن کل معتبر نیست.',
      )

      return
    }


    const payload = {
      name:
        form.name.trim(),

      template_id:
        selectedTemplate.id,

      waybill_number:
        form.waybill_number.trim() ||
        null,

      waybill_date:
        form.waybill_date ||
        null,

      received_date:
        form.received_date ||
        null,

      sender_name:
        form.sender_name.trim() ||
        null,

      sender_contact:
        form.sender_contact.trim() ||
        null,

      receiver_name:
        form.receiver_name.trim() ||
        null,

      receiver_contact:
        form.receiver_contact.trim() ||
        null,

      origin:
        form.origin.trim() ||
        null,

      destination:
        form.destination.trim() ||
        null,

      vehicle_type:
        form.vehicle_type.trim() ||
        null,

      vehicle_number:
        form.vehicle_number.trim() ||
        null,

      driver_name:
        form.driver_name.trim() ||
        null,

      driver_contact:
        form.driver_contact.trim() ||
        null,

      total_weight:
        totalWeight,

      priority:
        form.priority,

      status:
        form.status,

      description:
        form.description.trim() ||
        null,

      internal_notes:
        form.internal_notes.trim() ||
        null,

      attributes:
        selectedTemplate.fields.map(
          (field) => ({
            field_id:
              field.field_id,

            value:
              dynamicValues[
                field.field_id
              ] ?? null,
          }),
        ),
    }


    try {
      setSaving(true)

      if (isEdit) {
        await updateWaybill(
          Number(
            waybillId,
          ),
          payload,
        )

        notify.success(
          'بارنامه با موفقیت ویرایش شد.',
        )
      } else {
        await createWaybill(
          payload,
        )

        notify.success(
          'بارنامه با موفقیت ثبت شد.',
        )
      }


      navigate(
        '/waybills',
      )
    } finally {
      setSaving(false)
    }
  }


  const inputClass =
    'w-full rounded-xl border border-border bg-surface px-3 py-2.5 text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/15'


  if (loading) {
    return (
      <div className="rounded-2xl border border-border bg-surface p-10 text-center text-sm text-muted-foreground">
        در حال دریافت اطلاعات بارنامه...
      </div>
    )
  }


  return (
    <>
      <div className="space-y-6">
        <PageHeader
          title={
            isEdit
              ? 'ویرایش بارنامه'
              : 'ایجاد بارنامه'
          }
          description="ابتدا قالب بارنامه را تخصیص دهید؛ سپس اطلاعات ثابت و فیلدهای اختصاصی قالب را تکمیل کنید."
          actions={
            <Button
              type="button"
              variant="outline"
              onClick={() =>
                navigate(
                  '/waybills',
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


        <section className="rounded-2xl border-2 border-primary/30 bg-surface p-5">
          <div className="mb-5 flex items-start gap-3">
            <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary-soft text-primary">
              <Layers3
                size={21}
              />
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <div className="text-xs font-medium text-primary">
                    مرحله ۱
                  </div>

                  <h2 className="mt-1 font-semibold text-foreground">
                    تخصیص قالب بارنامه
                  </h2>

                  <p className="mt-1 text-sm leading-6 text-muted-foreground">
                    قالب انتخاب‌شده روی فیلد
                    <span
                      dir="ltr"
                      className="mx-1 font-mono"
                    >
                      template_id
                    </span>
                    بارنامه ذخیره می‌شود و فیلدهای اختصاصی فرم را تعیین می‌کند.
                  </p>
                </div>

                {selectedTemplate && (
                  <span className="inline-flex items-center gap-1.5 rounded-lg bg-success-soft px-3 py-1.5 text-xs font-medium text-success">
                    <CheckCircle2
                      size={15}
                    />

                    قالب تخصیص داده شده
                  </span>
                )}
              </div>
            </div>
          </div>


          <div className="max-w-3xl">
            <label className="mb-2 block text-sm font-medium text-foreground">
              قالب بارنامه
              <span className="mr-1 text-danger">
                *
              </span>
            </label>

            <select
              className={
                inputClass
              }
              value={
                templateId ??
                ''
              }
              onChange={(
                event,
              ) =>
                requestTemplateChange(
                  event.target.value
                    ? Number(
                        event.target.value,
                      )
                    : null,
                )
              }
            >
              <option value="">
                قالب بارنامه را انتخاب کنید
              </option>

              {templates.map(
                (template) => (
                  <option
                    key={
                      template.id
                    }
                    value={
                      template.id
                    }
                  >
                    {
                      template.name
                    }
                    {!template.is_active
                      ? ' — غیرفعال'
                      : ''}
                  </option>
                ),
              )}
            </select>


            {selectedTemplate && (
              <div className="mt-4 rounded-xl border border-primary/20 bg-primary-soft/40 p-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <div className="font-medium text-foreground">
                      {
                        selectedTemplate.name
                      }
                    </div>

                    {selectedTemplate.description && (
                      <p className="mt-1 text-sm leading-6 text-muted-foreground">
                        {
                          selectedTemplate.description
                        }
                      </p>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <span className="rounded-lg bg-surface px-2.5 py-1 text-xs text-muted-foreground">
                      شناسه قالب: {
                        selectedTemplate.id
                      }
                    </span>

                    <span className="rounded-lg bg-surface px-2.5 py-1 text-xs text-muted-foreground">
                      {
                        selectedTemplate.fields.filter(
                          (field) =>
                            field.is_active,
                        ).length
                      }{' '}
                      فیلد
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>


        {!selectedTemplate ? (
          <section className="rounded-2xl border border-dashed border-border bg-surface p-12 text-center">
            <Layers3
              size={28}
              className="mx-auto text-muted-foreground"
            />

            <p className="mt-4 font-medium text-foreground">
              ابتدا قالب بارنامه را انتخاب کنید
            </p>

            <p className="mt-2 text-sm text-muted-foreground">
              پس از تخصیص قالب، فرم کامل بارنامه و فیلدهای اختصاصی آن نمایش داده می‌شود.
            </p>
          </section>
        ) : (
          <>
            <section className="rounded-2xl border border-border bg-surface p-5">
              <div className="mb-5 flex items-start gap-3">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary-soft text-primary">
                  <FileText
                    size={20}
                  />
                </div>

                <div>
                  <div className="text-xs font-medium text-primary">
                    مرحله ۲
                  </div>

                  <h2 className="mt-1 font-semibold text-foreground">
                    اطلاعات اصلی بارنامه
                  </h2>
                </div>
              </div>


              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                <div>
                  <label className="mb-2 block text-sm font-medium text-foreground">
                    نام بارنامه *
                  </label>

                  <input
                    className={
                      inputClass
                    }
                    value={
                      form.name
                    }
                    placeholder="عنوان قابل تشخیص برای بارنامه"
                    onChange={(
                      event,
                    ) =>
                      updateStatic(
                        'name',
                        event.target.value,
                      )
                    }
                  />
                </div>


                <div>
                  <label className="mb-2 block text-sm font-medium text-foreground">
                    شماره بارنامه
                  </label>

                  <input
                    dir="ltr"
                    className={
                      inputClass
                    }
                    value={
                      form.waybill_number
                    }
                    onChange={(
                      event,
                    ) =>
                      updateStatic(
                        'waybill_number',
                        event.target.value,
                      )
                    }
                  />
                </div>


                <div>
                  <label className="mb-2 block text-sm font-medium text-foreground">
                    وزن کل
                  </label>

                  <div className="flex items-center gap-2">
                    <input
                      dir="ltr"
                      type="number"
                      step="0.001"
                      className={
                        inputClass
                      }
                      value={
                        form.total_weight
                      }
                      onChange={(
                        event,
                      ) =>
                        updateStatic(
                          'total_weight',
                          event.target.value,
                        )
                      }
                    />

                    <span className="shrink-0 rounded-lg bg-surface-muted px-3 py-2.5 text-xs text-muted-foreground">
                      kg
                    </span>
                  </div>
                </div>


                <div>
                  <label className="mb-2 block text-sm font-medium text-foreground">
                    تاریخ بارنامه
                  </label>

                  <input
                    type="date"
                    className={
                      inputClass
                    }
                    value={
                      form.waybill_date
                    }
                    onChange={(
                      event,
                    ) =>
                      updateStatic(
                        'waybill_date',
                        event.target.value,
                      )
                    }
                  />
                </div>


                <div>
                  <label className="mb-2 block text-sm font-medium text-foreground">
                    تاریخ دریافت
                  </label>

                  <input
                    type="date"
                    className={
                      inputClass
                    }
                    value={
                      form.received_date
                    }
                    onChange={(
                      event,
                    ) =>
                      updateStatic(
                        'received_date',
                        event.target.value,
                      )
                    }
                  />
                </div>


                <div>
                  <label className="mb-2 block text-sm font-medium text-foreground">
                    اولویت
                  </label>

                  <select
                    className={
                      inputClass
                    }
                    value={
                      form.priority
                    }
                    onChange={(
                      event,
                    ) =>
                      updateStatic(
                        'priority',
                        event.target.value,
                      )
                    }
                  >
                    {waybillPriorities.map(
                      (priority) => (
                        <option
                          key={
                            priority.value
                          }
                          value={
                            priority.value
                          }
                        >
                          {
                            priority.label
                          }
                        </option>
                      ),
                    )}
                  </select>
                </div>


                <div>
                  <label className="mb-2 block text-sm font-medium text-foreground">
                    وضعیت
                  </label>

                  <select
                    className={
                      inputClass
                    }
                    value={
                      form.status
                    }
                    onChange={(
                      event,
                    ) =>
                      updateStatic(
                        'status',
                        event.target.value,
                      )
                    }
                  >
                    {waybillStatuses.map(
                      (status) => (
                        <option
                          key={
                            status.value
                          }
                          value={
                            status.value
                          }
                        >
                          {
                            status.label
                          }
                        </option>
                      ),
                    )}
                  </select>
                </div>
              </div>
            </section>


            <section className="rounded-2xl border border-border bg-surface p-5">
              <h2 className="font-semibold text-foreground">
                فرستنده و گیرنده
              </h2>

              <div className="mt-5 grid gap-4 md:grid-cols-2">
                {[
                  [
                    'sender_name',
                    'نام فرستنده',
                  ],
                  [
                    'sender_contact',
                    'تماس فرستنده',
                  ],
                  [
                    'receiver_name',
                    'نام گیرنده',
                  ],
                  [
                    'receiver_contact',
                    'تماس گیرنده',
                  ],
                ].map(
                  (
                    [
                      key,
                      label,
                    ],
                  ) => (
                    <div
                      key={
                        key
                      }
                    >
                      <label className="mb-2 block text-sm font-medium text-foreground">
                        {label}
                      </label>

                      <input
                        className={
                          inputClass
                        }
                        value={
                          form[
                            key as keyof StaticForm
                          ]
                        }
                        onChange={(
                          event,
                        ) =>
                          updateStatic(
                            key as keyof StaticForm,
                            event.target.value,
                          )
                        }
                      />
                    </div>
                  ),
                )}
              </div>
            </section>


            <section className="rounded-2xl border border-border bg-surface p-5">
              <div className="mb-5 flex items-start gap-3">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary-soft text-primary">
                  <Truck
                    size={20}
                  />
                </div>

                <div>
                  <h2 className="font-semibold text-foreground">
                    مسیر، خودرو و راننده
                  </h2>
                </div>
              </div>


              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {[
                  [
                    'origin',
                    'مبدأ',
                  ],
                  [
                    'destination',
                    'مقصد',
                  ],
                  [
                    'vehicle_type',
                    'نوع خودرو',
                  ],
                  [
                    'vehicle_number',
                    'شماره خودرو',
                  ],
                  [
                    'driver_name',
                    'نام راننده',
                  ],
                  [
                    'driver_contact',
                    'تماس راننده',
                  ],
                ].map(
                  (
                    [
                      key,
                      label,
                    ],
                  ) => (
                    <div
                      key={
                        key
                      }
                    >
                      <label className="mb-2 block text-sm font-medium text-foreground">
                        {label}
                      </label>

                      <input
                        className={
                          inputClass
                        }
                        value={
                          form[
                            key as keyof StaticForm
                          ]
                        }
                        onChange={(
                          event,
                        ) =>
                          updateStatic(
                            key as keyof StaticForm,
                            event.target.value,
                          )
                        }
                      />
                    </div>
                  ),
                )}
              </div>
            </section>


            <section className="rounded-2xl border border-primary/30 bg-surface p-5">
              <div className="mb-5 border-b border-border pb-4">
                <div className="text-xs font-medium text-primary">
                  مرحله ۳
                </div>

                <h2 className="mt-1 font-semibold text-foreground">
                  اطلاعات اختصاصی قالب
                </h2>

                <p className="mt-1 text-sm text-muted-foreground">
                  این فیلدها مستقیماً از قالب «{selectedTemplate.name}» ساخته شده‌اند.
                </p>
              </div>


              {selectedTemplate.fields.filter(
                (field) =>
                  field.is_active,
              ).length ===
              0 ? (
                <div className="rounded-xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
                  قالب انتخاب‌شده فیلد داینامیک فعالی ندارد.
                </div>
              ) : (
                <DynamicFieldsForm
                  fields={
                    selectedTemplate.fields
                  }
                  values={
                    dynamicValues
                  }
                  errors={
                    dynamicErrors
                  }
                  onChange={(
                    fieldId,
                    value,
                  ) => {
                    setDynamicValues(
                      (current) => ({
                        ...current,

                        [fieldId]:
                          value,
                      }),
                    )

                    setDynamicErrors(
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
                  }}
                />
              )}
            </section>


            <section className="rounded-2xl border border-border bg-surface p-5">
              <h2 className="font-semibold text-foreground">
                توضیحات تکمیلی
              </h2>

              <div className="mt-5 grid gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium text-foreground">
                    توضیحات
                  </label>

                  <textarea
                    rows={4}
                    className={
                      inputClass
                    }
                    value={
                      form.description
                    }
                    onChange={(
                      event,
                    ) =>
                      updateStatic(
                        'description',
                        event.target.value,
                      )
                    }
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-foreground">
                    یادداشت داخلی
                  </label>

                  <textarea
                    rows={4}
                    className={
                      inputClass
                    }
                    value={
                      form.internal_notes
                    }
                    onChange={(
                      event,
                    ) =>
                      updateStatic(
                        'internal_notes',
                        event.target.value,
                      )
                    }
                  />
                </div>
              </div>
            </section>


            <div className="flex flex-col-reverse gap-3 border-t border-border pt-5 sm:flex-row sm:justify-end">
              <Button
                type="button"
                variant="outline"
                disabled={
                  saving
                }
                onClick={() =>
                  navigate(
                    '/waybills',
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
                  save
                }
              >
                <Save
                  size={17}
                />

                {isEdit
                  ? 'ذخیره تغییرات'
                  : 'ثبت بارنامه'}
              </Button>
            </div>
          </>
        )}
      </div>


      <ConfirmDialog
        open={
          changeTemplateConfirmOpen
        }
        onOpenChange={(
          open,
        ) => {
          setChangeTemplateConfirmOpen(
            open,
          )

          if (!open) {
            setPendingTemplateId(
              null,
            )
          }
        }}
        title="تغییر قالب بارنامه"
        description="با تغییر قالب، مقادیر فیلدهای اختصاصی قالب قبلی پاک می‌شوند. آیا ادامه می‌دهید؟"
        confirmLabel="تغییر قالب"
        cancelLabel="انصراف"
        variant="danger"
        onConfirm={
          confirmTemplateChange
        }
      />
    </>
  )
}


export default WaybillEditorPage