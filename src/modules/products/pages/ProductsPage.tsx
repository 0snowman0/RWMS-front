import {
  useCallback,
  useEffect,
  useState,
} from 'react'

import {
  ArrowDown,
  ArrowUp,
  ChevronsUpDown,
  Edit3,
  Package,
  PackagePlus,
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
  deleteProduct,
  listProducts,
} from '../api/product.api'

import type {
  Product,
} from '../types'


type SortColumn =
  | 'name'
  | 'created_at'
  | 'updated_at'


function formatDate(
  value: string,
) {
  try {
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
      new Date(value),
    )
  } catch {
    return value
  }
}


function ProductsPage() {
  const navigate =
    useNavigate()


  const [
    products,
    setProducts,
  ] =
    useState<Product[]>(
      [],
    )


  const [
    totalCount,
    setTotalCount,
  ] =
    useState(0)


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
    sortBy,
    setSortBy,
  ] =
    useState<
      SortColumn | null
    >(null)


  const [
    ascending,
    setAscending,
  ] =
    useState(true)


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
      Product | null
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
            await listProducts({
              page_number:
                page,

              page_size:
                pageSize,

              sort_by:
                sortBy,

              is_ascending:
                ascending,

              filter:
                null,

              search,
            })

          setProducts(
            result.items,
          )

          setTotalCount(
            result.total_count,
          )

          setTotalPages(
            result.total_pages,
          )

          if (
            page !==
            result.page_number
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
        ascending,
        page,
        pageSize,
        search,
        sortBy,
      ],
    )


  useEffect(
    () => {
      void load()
    },
    [load],
  )


  function changeSort(
    column: SortColumn,
  ) {
    setPage(1)

    if (
      sortBy === column
    ) {
      setAscending(
        (current) =>
          !current,
      )

      return
    }

    setSortBy(
      column,
    )

    setAscending(
      true,
    )
  }


  function sortIcon(
    column: SortColumn,
  ) {
    if (
      sortBy !== column
    ) {
      return (
        <ChevronsUpDown
          size={14}
          className="text-muted-foreground"
        />
      )
    }

    return ascending ? (
      <ArrowUp
        size={14}
        className="text-primary"
      />
    ) : (
      <ArrowDown
        size={14}
        className="text-primary"
      />
    )
  }


  async function confirmDelete() {
    if (!deleteTarget) {
      return
    }

    try {
      setDeleting(true)

      await deleteProduct(
        deleteTarget.id,
      )

      notify.success(
        `کالای «${deleteTarget.name}» حذف شد.`,
      )

      setDeleteTarget(
        null,
      )

      await load()
    } catch (error) {
      notify.error(
        error instanceof Error
          ? error.message
          : 'حذف کالا انجام نشد.',
      )
    } finally {
      setDeleting(false)
    }
  }


  return (
    <>
      <div className="space-y-6">
        <PageHeader
          title="کالاها"
          description="تعریف و مدیریت کالاها و مشخصات داینامیک آنها"
          actions={
            <Button
              type="button"
              onClick={() =>
                navigate(
                  '/products/new',
                )
              }
            >
              <PackagePlus
                size={17}
              />

              ایجاد کالا
            </Button>
          }
        />


        <div className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-border bg-surface p-5">
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-xl bg-primary-soft text-primary">
                <Package
                  size={20}
                />
              </div>

              <div>
                <p className="text-xs text-muted-foreground">
                  تعداد کالاها
                </p>

                <p className="mt-1 text-xl font-bold text-foreground">
                  {
                    totalCount
                  }
                </p>
              </div>
            </div>
          </div>


          <div className="rounded-2xl border border-border bg-surface p-5 sm:col-span-2">
            <p className="text-sm font-medium text-foreground">
              ساختار کالا
            </p>

            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              هر کالا میتواند عضو چند دستهبندی باشد و مشخصات آن بهصورت خودکار از همان دستهبندیها ساخته میشود.
            </p>
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
                className="w-full rounded-xl border border-border bg-surface py-2.5 pr-10 pl-3 text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/15"
                value={search}
                placeholder="جستجو در نام کالا یا دستهبندی..."
                onChange={(
                  event,
                ) => {
                  setSearch(
                    event.target
                      .value,
                  )

                  setPage(1)
                }}
              />
            </div>


            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">
                تعداد نمایش:
              </span>

              <select
                value={pageSize}
                className="rounded-lg border border-border bg-surface px-3 py-2 text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/15"
                onChange={(
                  event,
                ) => {
                  setPageSize(
                    Number(
                      event.target
                        .value,
                    ),
                  )

                  setPage(1)
                }}
              >
                <option value={10}>
                  ۱۰
                </option>

                <option value={20}>
                  ۲۰
                </option>

                <option value={50}>
                  ۵۰
                </option>

                <option value={100}>
                  ۱۰۰
                </option>
              </select>
            </div>
          </div>


          <div className="overflow-x-auto">
            <table className="w-full min-w-[850px] border-collapse text-sm">
              <thead>
                <tr className="border-b border-border bg-surface-muted/50 text-right">
                  <th className="px-4 py-3 font-medium text-muted-foreground">
                    ردیف
                  </th>

                  <th className="px-4 py-3 font-medium">
                    <button
                      type="button"
                      className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground"
                      onClick={() =>
                        changeSort(
                          'name',
                        )
                      }
                    >
                      نام کالا

                      {sortIcon(
                        'name',
                      )}
                    </button>
                  </th>

                  <th className="px-4 py-3 font-medium text-muted-foreground">
                    دستهبندیها
                  </th>

                  <th className="px-4 py-3 font-medium text-muted-foreground">
                    مشخصات
                  </th>

                  <th className="px-4 py-3 font-medium">
                    <button
                      type="button"
                      className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground"
                      onClick={() =>
                        changeSort(
                          'updated_at',
                        )
                      }
                    >
                      آخرین تغییر

                      {sortIcon(
                        'updated_at',
                      )}
                    </button>
                  </th>

                  <th className="px-4 py-3 text-center font-medium text-muted-foreground">
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
                      در حال دریافت کالاها...
                    </td>
                  </tr>
                ) : products.length ===
                  0 ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-4 py-14 text-center"
                    >
                      <div className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-primary-soft text-primary">
                        <Package
                          size={22}
                        />
                      </div>

                      <p className="mt-4 font-medium text-foreground">
                        کالایی پیدا نشد
                      </p>

                      <p className="mt-2 text-sm text-muted-foreground">
                        میتوانید اولین کالا را ایجاد کنید.
                      </p>
                    </td>
                  </tr>
                ) : (
                  products.map(
                    (
                      product,
                      index,
                    ) => (
                      <tr
                        key={
                          product.id
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

                        <td className="px-4 py-4">
                          <div className="font-medium text-foreground">
                            {
                              product.name
                            }
                          </div>

                          <div className="mt-1 text-xs text-muted-foreground">
                            شناسه:{' '}
                            {
                              product.id
                            }
                          </div>
                        </td>

                        <td className="px-4 py-4">
                          <div className="flex max-w-md flex-wrap gap-1.5">
                            {product.categories.map(
                              (
                                category,
                              ) => (
                                <span
                                  key={
                                    category.id
                                  }
                                  className="rounded-lg bg-primary-soft px-2.5 py-1 text-xs font-medium text-primary"
                                >
                                  {
                                    category.name
                                  }
                                </span>
                              ),
                            )}

                            {product.categories.length ===
                              0 && (
                              <span className="text-xs text-muted-foreground">
                                بدون دستهبندی
                              </span>
                            )}
                          </div>
                        </td>

                        <td className="px-4 py-4">
                          <span className="rounded-lg bg-surface-muted px-2.5 py-1 text-xs font-medium text-muted-foreground">
                            {
                              product
                                .fields
                                .length
                            }{' '}
                            فیلد
                          </span>
                        </td>

                        <td className="px-4 py-4 text-muted-foreground">
                          {formatDate(
                            product.updated_at,
                          )}
                        </td>

                        <td className="px-4 py-4">
                          <div className="flex items-center justify-center gap-2">
                            <Button
                              type="button"
                              variant="outline"
                              onClick={() =>
                                navigate(
                                  `/products/${product.id}/edit`,
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
                                  product,
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


          <div className="flex flex-col gap-4 border-t border-border p-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
              <span>
                صفحه {page} از{' '}
                {totalPages}
              </span>

              <span>
                {
                  totalCount
                }{' '}
                کالا
              </span>

              <span>
                نمایش حداکثر{' '}
                {
                  pageSize
                }{' '}
                رکورد در هر صفحه
              </span>
            </div>


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
                      Math.max(
                        1,
                        current -
                          1,
                      ),
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
                      Math.min(
                        totalPages,
                        current +
                          1,
                      ),
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
          deleteTarget !== null
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
        title="حذف کالا"
        description={
          deleteTarget
            ? `آیا از حذف کالای «${deleteTarget.name}» مطمئن هستید`
            : ''
        }
        confirmLabel="حذف کالا"
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


export default ProductsPage