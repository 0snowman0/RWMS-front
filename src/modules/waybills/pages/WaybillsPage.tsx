import {
  useCallback,
  useEffect,
  useState,
} from 'react'

import {
  Edit3,
  FilePlus2,
  FileText,
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
  deleteWaybill,
  listWaybills,
} from '../api/waybill.api'

import type {
  WaybillSummary,
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


function WaybillsPage() {
  const navigate =
    useNavigate()


  const [
    items,
    setItems,
  ] =
    useState<
      WaybillSummary[]
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
    loading,
    setLoading,
  ] =
    useState(true)


  const [
    deleteTarget,
    setDeleteTarget,
  ] =
    useState<
      WaybillSummary |
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
            await listWaybills({
              page_number:
                page,

              page_size:
                pageSize,

              sort_by:
                'updated_at',

              is_ascending:
                false,

              search,
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
        } catch (error) {
          notify.error(
            error instanceof Error
              ? error.message
              : 'دریافت بارنامهها ناموفق بود.',
          )
        } finally {
          setLoading(false)
        }
      },
      [
        page,
        pageSize,
        search,
      ],
    )


  useEffect(
    () => {
      void load()
    },
    [load],
  )


  async function confirmDelete() {
    if (!deleteTarget?.id) {
      return
    }

    try {
      setDeleting(true)

      await deleteWaybill(
        deleteTarget.id,
      )

      notify.success(
        'بارنامه حذف شد.',
      )

      setDeleteTarget(
        null,
      )

      await load()
    } catch (error) {
      notify.error(
        error instanceof Error
          ? error.message
          : 'حذف بارنامه انجام نشد.',
      )
    } finally {
      setDeleting(false)
    }
  }


  return (
    <>
      <div className="space-y-6">
        <PageHeader
          title="بارنامه‌ها"
          description="ثبت و مدیریت بارنامه‌های حمل و انتقال کالا"
          actions={
            <Button
              type="button"
              onClick={() =>
                navigate(
                  '/waybills/new',
                )
              }
            >
              <FilePlus2
                size={17}
              />

              ایجاد بارنامه
            </Button>
          }
        />


        <div className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-border bg-surface p-5">
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-xl bg-primary-soft text-primary">
                <FileText
                  size={20}
                />
              </div>

              <div>
                <p className="text-xs text-muted-foreground">
                  تعداد بارنامه‌ها
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
          <div className="flex flex-col gap-3 border-b border-border p-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="relative w-full lg:max-w-lg">
              <Search
                size={17}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              />

              <input
                value={
                  search
                }
                className="w-full rounded-xl border border-border bg-surface py-2.5 pr-10 pl-3 text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/15"
                placeholder="جستجو در نام، شماره بارنامه، مبدأ یا مقصد..."
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


          <div className="overflow-x-auto">
            <table className="w-full min-w-[1100px] text-sm">
              <thead>
                <tr className="border-b border-border bg-surface-muted/50 text-right">
                  <th className="px-4 py-3 text-muted-foreground">
                    ردیف
                  </th>

                  <th className="px-4 py-3 text-muted-foreground">
                    نام
                  </th>

                  <th className="px-4 py-3 text-muted-foreground">
                    شماره بارنامه
                  </th>

                  <th className="px-4 py-3 text-muted-foreground">
                    قالب
                  </th>

                  <th className="px-4 py-3 text-muted-foreground">
                    مسیر
                  </th>

                  <th className="px-4 py-3 text-muted-foreground">
                    تاریخ
                  </th>

                  <th className="px-4 py-3 text-muted-foreground">
                    وضعیت
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
                      colSpan={8}
                      className="px-4 py-14 text-center text-muted-foreground"
                    >
                      در حال دریافت بارنامه‌ها...
                    </td>
                  </tr>
                ) : items.length ===
                  0 ? (
                  <tr>
                    <td
                      colSpan={8}
                      className="px-4 py-14 text-center text-muted-foreground"
                    >
                      بارنامه‌ای پیدا نشد.
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

                        <td
                          dir="ltr"
                          className="px-4 py-4 text-right text-muted-foreground"
                        >
                          {
                            item.waybill_number ??
                            '-'
                          }
                        </td>

                        <td className="px-4 py-4 text-muted-foreground">
                          {
                            item.template_name ??
                            `قالب #${item.template_id}`
                          }
                        </td>

                        <td className="px-4 py-4 text-muted-foreground">
                          {
                            item.origin ??
                            '-'
                          }
                          {' ← '}
                          {
                            item.destination ??
                            '-'
                          }
                        </td>

                        <td className="px-4 py-4 text-muted-foreground">
                          {formatDate(
                            item.waybill_date,
                          )}
                        </td>

                        <td className="px-4 py-4">
                          <span className="rounded-lg bg-success-soft px-2.5 py-1 text-xs font-medium text-success">
                            {
                              item.status
                            }
                          </span>
                        </td>

                        <td className="px-4 py-4">
                          <div className="flex justify-center gap-2">
                            <Button
                              type="button"
                              variant="outline"
                              onClick={() =>
                                navigate(
                                  `/waybills/${item.id}/edit`,
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
              بارنامه — صفحه{' '}
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
        title="حذف بارنامه"
        description={
          deleteTarget
            ? `آیا از حذف بارنامه «${deleteTarget.name}» مطمئن هستید؟`
            : ''
        }
        confirmLabel="حذف بارنامه"
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


export default WaybillsPage