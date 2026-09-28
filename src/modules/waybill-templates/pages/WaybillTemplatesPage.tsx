import {
  useCallback,
  useEffect,
  useState,
} from 'react'

import {
  Edit3,
  FilePlus2,
  LayoutTemplate,
  Search,
  Trash2,
} from 'lucide-react'

import {
  useNavigate,
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
  deleteWaybillTemplate,
  listWaybillTemplates,
} from '../mocks/waybillTemplateRepository.mock'

import type {
  WaybillTemplateSummary,
} from '../types'


function formatDate(
  value:
    string |
    null,
) {
  if (!value) {
    return '-'
  }

  return new Intl.DateTimeFormat(
    'fa-IR',
    {
      year:
        'numeric',

      month:
        '2-digit',

      day:
        '2-digit',
    },
  ).format(
    new Date(
      value,
    ),
  )
}


function WaybillTemplatesPage() {
  const navigate =
    useNavigate()


  const [
    items,
    setItems,
  ] =
    useState<
      WaybillTemplateSummary[]
    >([])


  const [
    page,
    setPage,
  ] =
    useState(1)


  const [
    pageSize,
    setPageSize,
  ] =
    useState(10)


  const [
    totalCount,
    setTotalCount,
  ] =
    useState(0)


  const [
    totalPages,
    setTotalPages,
  ] =
    useState(1)


  const [
    search,
    setSearch,
  ] =
    useState('')


  const [
    status,
    setStatus,
  ] =
    useState<
      | 'all'
      | 'active'
      | 'inactive'
    >('all')


  const [
    loading,
    setLoading,
  ] =
    useState(true)


  const [
    deleteTarget,
    setDeleteTarget,
  ] =
    useState<
      WaybillTemplateSummary |
      null
    >(null)


  const [
    deleting,
    setDeleting,
  ] =
    useState(false)


  const load =
    useCallback(
      async () => {
        try {
          setLoading(true)

          const result =
            await listWaybillTemplates({
              page_number:
                page,

              page_size:
                pageSize,

              sort_by:
                'updated_at',

              is_ascending:
                false,

              search,

              status,
            })

          setItems(
            result.items,
          )

          setTotalCount(
            result.total_count,
          )

          setTotalPages(
            result.total_pages,
          )

          if (
            result.page_number !==
            page
          ) {
            setPage(
              result.page_number,
            )
          }
        } finally {
          setLoading(false)
        }
      },
      [
        page,
        pageSize,
        search,
        status,
      ],
    )


  useEffect(
    () => {
      void load()
    },
    [load],
  )


  async function confirmDelete() {
    if (!deleteTarget) {
      return
    }

    try {
      setDeleting(true)

      await deleteWaybillTemplate(
        deleteTarget.id,
      )

      notify.success(
        'قالب بارنامه حذف شد.',
      )

      setDeleteTarget(
        null,
      )

      await load()
    } finally {
      setDeleting(false)
    }
  }


  return (
    <>
      <div className="space-y-6">
        <PageHeader
          title="قالب‌های بارنامه"
          description="تعریف و مدیریت قالب‌های داینامیک بارنامه"
          actions={
            <Button
              type="button"
              onClick={() =>
                navigate(
                  '/waybill-templates/new',
                )
              }
            >
              <FilePlus2
                size={17}
              />

              ایجاد قالب
            </Button>
          }
        />


        <div className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-border bg-surface p-5">
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-xl bg-primary-soft text-primary">
                <LayoutTemplate
                  size={20}
                />
              </div>

              <div>
                <p className="text-xs text-muted-foreground">
                  تعداد قالب‌ها
                </p>

                <p className="mt-1 text-xl font-bold text-foreground">
                  {
                    totalCount
                  }
                </p>
              </div>
            </div>
          </div>
        </div>


        <section className="rounded-2xl border border-border bg-surface">
          <div className="flex flex-col gap-3 border-b border-border p-4 xl:flex-row xl:items-center xl:justify-between">
            <div className="relative w-full xl:max-w-lg">
              <Search
                size={17}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              />

              <input
                value={
                  search
                }
                className="w-full rounded-xl border border-border bg-surface py-2.5 pr-10 pl-3 text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/15"
                placeholder="جستجو در قالب‌ها..."
                onChange={(
                  event,
                ) => {
                  setSearch(
                    event.target.value,
                  )

                  setPage(1)
                }}
              />
            </div>


            <div className="flex flex-wrap gap-2">
              <select
                value={
                  status
                }
                className="rounded-lg border border-border bg-surface px-3 py-2 text-sm text-foreground"
                onChange={(
                  event,
                ) => {
                  setStatus(
                    event.target
                      .value as
                      | 'all'
                      | 'active'
                      | 'inactive',
                  )

                  setPage(1)
                }}
              >
                <option value="all">
                  همه وضعیت‌ها
                </option>

                <option value="active">
                  فعال
                </option>

                <option value="inactive">
                  غیرفعال
                </option>
              </select>


              <select
                value={
                  pageSize
                }
                className="rounded-lg border border-border bg-surface px-3 py-2 text-sm text-foreground"
                onChange={(
                  event,
                ) => {
                  setPageSize(
                    Number(
                      event.target.value,
                    ),
                  )

                  setPage(1)
                }}
              >
                <option value={10}>
                  ۱۰ رکورد
                </option>

                <option value={20}>
                  ۲۰ رکورد
                </option>

                <option value={50}>
                  ۵۰ رکورد
                </option>

                <option value={100}>
                  ۱۰۰ رکورد
                </option>
              </select>
            </div>
          </div>


          <div className="overflow-x-auto">
            <table className="w-full min-w-[850px] text-sm">
              <thead>
                <tr className="border-b border-border bg-surface-muted/50 text-right">
                  <th className="px-4 py-3 text-muted-foreground">
                    ردیف
                  </th>

                  <th className="px-4 py-3 text-muted-foreground">
                    نام قالب
                  </th>

                  <th className="px-4 py-3 text-muted-foreground">
                    توضیحات
                  </th>

                  <th className="px-4 py-3 text-muted-foreground">
                    وضعیت
                  </th>

                  <th className="px-4 py-3 text-muted-foreground">
                    آخرین تغییر
                  </th>

                  <th className="px-4 py-3 text-center text-muted-foreground">
                    عملیات
                  </th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-4 py-14 text-center text-muted-foreground"
                    >
                      در حال دریافت قالب‌ها...
                    </td>
                  </tr>
                ) : items.length ===
                  0 ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-4 py-14 text-center text-muted-foreground"
                    >
                      قالبی پیدا نشد.
                    </td>
                  </tr>
                ) : (
                  items.map(
                    (
                      item,
                      index,
                    ) => (
                      <tr
                        key={
                          item.id
                        }
                        className="border-b border-border last:border-0 hover:bg-surface-muted/30"
                      >
                        <td className="px-4 py-4 text-muted-foreground">
                          {(page -
                            1) *
                            pageSize +
                            index +
                            1}
                        </td>

                        <td className="px-4 py-4 font-medium text-foreground">
                          {
                            item.name
                          }
                        </td>

                        <td className="max-w-md px-4 py-4 text-muted-foreground">
                          {
                            item.description ??
                            '-'
                          }
                        </td>

                        <td className="px-4 py-4">
                          <span
                            className={
                              item.is_active
                                ? 'rounded-lg bg-success-soft px-2.5 py-1 text-xs font-medium text-success'
                                : 'rounded-lg bg-surface-muted px-2.5 py-1 text-xs font-medium text-muted-foreground'
                            }
                          >
                            {item.is_active
                              ? 'فعال'
                              : 'غیرفعال'}
                          </span>
                        </td>

                        <td className="px-4 py-4 text-muted-foreground">
                          {formatDate(
                            item.updated_at,
                          )}
                        </td>

                        <td className="px-4 py-4">
                          <div className="flex justify-center gap-2">
                            <Button
                              type="button"
                              variant="outline"
                              onClick={() =>
                                navigate(
                                  `/waybill-templates/${item.id}/edit`,
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
                                  item,
                                )
                              }
                            >
                              <Trash2
                                size={15}
                              />

                              حذف
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ),
                  )
                )}
              </tbody>
            </table>
          </div>


          <div className="flex flex-col gap-3 border-t border-border p-4 sm:flex-row sm:items-center sm:justify-between">
            <span className="text-xs text-muted-foreground">
              {
                totalCount
              }{' '}
              قالب — صفحه{' '}
              {page} از{' '}
              {totalPages}
            </span>

            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                disabled={
                  page <= 1 ||
                  loading
                }
                onClick={() =>
                  setPage(
                    (current) =>
                      current - 1,
                  )
                }
              >
                قبلی
              </Button>

              <Button
                type="button"
                variant="outline"
                disabled={
                  page >=
                    totalPages ||
                  loading
                }
                onClick={() =>
                  setPage(
                    (current) =>
                      current + 1,
                  )
                }
              >
                بعدی
              </Button>
            </div>
          </div>
        </section>
      </div>


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
        title="حذف قالب بارنامه"
        description={
          deleteTarget
            ? `آیا از حذف قالب «${deleteTarget.name}» مطمئن هستید؟`
            : ''
        }
        confirmLabel="حذف قالب"
        cancelLabel="انصراف"
        variant="danger"
        isLoading={
          deleting
        }
        onConfirm={
          confirmDelete
        }
      />
    </>
  )
}


export default WaybillTemplatesPage