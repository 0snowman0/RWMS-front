import {
  useMemo,
  useState,
} from 'react'

import {
  Plus,
  Search,
  Tags,
} from 'lucide-react'

import {
  useQuery,
  useQueryClient,
} from '@tanstack/react-query'

import {
  useNavigate,
} from 'react-router'

import {
  deleteCategory,
  getPagedCategories,
} from '../api/category.api'

import {
  createCategoryColumns,
} from '../components/categoryColumns'

import type {
  Category,
} from '../types/category.types'

import {
  Button,
} from '@/shared/ui/button'

import {
  ConfirmDialog,
} from '@/shared/ui/dialog'

import {
  DataTable,
} from '@/shared/ui/data-table'
import {
  Input,
} from '@/shared/ui/input'

import {
  PageHeader,
} from '@/shared/ui/page-header'

import {
  notify,
} from '@/shared/notifications'

function CategoriesPage() {
  const navigate = useNavigate()

  const queryClient =
    useQueryClient()

  const [
    deleteTarget,
    setDeleteTarget,
  ] = useState<Category | null>(
    null,
  )

  const [
    isDeleting,
    setIsDeleting,
  ] = useState(false)

  const [
    pageNumber,
    setPageNumber,
  ] = useState(1)

  const [
    pageSize,
    setPageSize,
  ] = useState(10)

  const [
    sortBy,
    setSortBy,
  ] = useState<string | null>(
    'id',
  )

  const [
    isAscending,
    setIsAscending,
  ] = useState(true)

  const [
    search,
    setSearch,
  ] = useState('')

  const request = useMemo(
    () => ({
      page_number:
        pageNumber,

      page_size:
        pageSize,

      sort_by:
        sortBy,

      is_ascending:
        isAscending,

      filter:
        null,

      search,
    }),
    [
      pageNumber,
      pageSize,
      sortBy,
      isAscending,
      search,
    ],
  )

  const {
    data,
    isLoading,
    isError,
  } = useQuery({
    queryKey: [
      'categories',
      'paged',
      request,
    ],

    queryFn: () =>
      getPagedCategories(
        request,
      ),
  })

  function handleSort(
    column: string,
  ) {
    setPageNumber(1)

    if (sortBy === column) {
      setIsAscending(
        (current) => !current,
      )

      return
    }

    setSortBy(column)
    setIsAscending(true)
  }

  function handleSearch(
    value: string,
  ) {
    setSearch(value)

    setPageNumber(1)
  }

  function handlePageSizeChange(
    value: number,
  ) {
    setPageSize(value)

    setPageNumber(1)
  }

  async function handleConfirmDeleteCategory() {
    if (!deleteTarget) {
      return
    }

    setIsDeleting(true)

    try {
      await deleteCategory(
        deleteTarget.id,
      )

      setDeleteTarget(null)

      if (
        data?.items.length === 1 &&
        pageNumber > 1
      ) {
        setPageNumber(
          (current) =>
            Math.max(
              1,
              current - 1,
            ),
        )
      }

      await queryClient.invalidateQueries({
        queryKey: [
          'categories',
        ],
      })

      notify.success(
        'دستهبندی با موفقیت حذف شد.',
      )
    }
    catch (error) {
      console.error(
        'Delete category failed:',
        error,
      )

      notify.error(
        'حذف دستهبندی انجام نشد.',
      )
    }
    finally {
      setIsDeleting(false)
    }
  }


  const columns = useMemo(
    () =>
      createCategoryColumns({
        sortBy,

        isAscending,

        onSort:
          handleSort,

        onEdit:
          (category) => {
            navigate(
              `/categories/${category.id}/edit`,
            )
          },

        onDelete:
          (category) => {
            setDeleteTarget(
              category,
            )
          },
      }),
    [
      sortBy,
      isAscending,
      navigate,
    ],
  )

  return (
    <div className="space-y-6">
      <PageHeader
        title="دسته‌بندی کالا"
        description="تعریف و مدیریت دسته‌بندی‌ها و مشخصات موردنیاز کالاهای هر دسته"
        actions={
          <Button
            type="button"
            onClick={() =>
              navigate(
                '/categories/new',
              )
            }
          >
            <Plus
              size={17}
              strokeWidth={1.8}
            />

            ایجاد دسته‌بندی
          </Button>
        }
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-border bg-surface p-4">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-xl bg-primary-soft text-primary">
              <Tags
                size={20}
                strokeWidth={1.8}
              />
            </div>

            <div>
              <p className="text-xs text-muted-foreground">
                تعداد کل دسته‌بندی‌ها
              </p>

              <p className="mt-1 text-xl font-bold text-foreground">
                {data?.total_count ?? 0}
              </p>
            </div>
          </div>
        </div>
      </div>

      <section className="overflow-hidden rounded-2xl border border-border bg-surface">
        <div className="border-b border-border p-4">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div className="w-full max-w-lg">
              <label
                htmlFor="category-search"
                className="mb-2 block text-sm font-medium text-foreground"
              >
                جستجو
              </label>

              <div className="relative">
                <Search
                  size={17}
                  strokeWidth={1.8}
                  className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                />

                <Input
                  id="category-search"
                  value={search}
                  onChange={(event) =>
                    handleSearch(
                      event.target.value,
                    )
                  }
                  placeholder="جستجو در نام یا توضیحات..."
                  className="pr-10"
                />
              </div>

              <p className="mt-1.5 text-xs text-muted-foreground">
                جستجو در نسخه فعلی به‌صورت آزمایشی روی داده‌های نمایشی انجام می‌شود.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-4">
              <div className="text-sm text-muted-foreground">
                {data
                  ? `${data.total_count.toLocaleString(
                      'fa-IR',
                    )} نتیجه`
                  : ''}
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
                  ) =>
                    handlePageSizeChange(
                      Number(
                        event.target.value,
                      ),
                    )
                  }
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
          </div>
        </div>

        <DataTable
          columns={columns}
          data={
            data?.items ?? []
          }
          isLoading={
            isLoading
          }
          error={
            isError
              ? 'خطا در دریافت دسته‌بندی‌ها'
              : undefined
          }
          emptyTitle={
            search
              ? 'نتیجه‌ای پیدا نشد'
              : 'هنوز دسته‌بندی‌ای تعریف نشده است'
          }
          emptyDescription={
            search
              ? 'عبارت جستجو را تغییر دهید.'
              : 'برای شروع یک دسته‌بندی جدید ایجاد کنید.'
          }
        />

        {data &&
          data.total_count > 0 && (
            <div className="flex flex-col gap-4 border-t border-border p-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                <span>
                  صفحه {data.page_number} از{' '}
                  {data.total_pages}
                </span>

                <span>
                  {data.total_count}{' '}
                  دستهبندی
                </span>

                <span>
                  نمایش حداکثر{' '}
                  {data.page_size}{' '}
                  رکورد در هر صفحه
                </span>
              </div>

              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  disabled={
                    data.page_number <= 1 ||
                    isLoading
                  }
                  onClick={() =>
                    setPageNumber(
                      (current) =>
                        Math.max(
                          1,
                          current - 1,
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
                    data.page_number >=
                      data.total_pages ||
                    isLoading
                  }
                  onClick={() =>
                    setPageNumber(
                      (current) =>
                        Math.min(
                          data.total_pages,
                          current + 1,
                        ),
                    )
                  }
                >
                  بعدی
                </Button>
              </div>
            </div>
          )}
      </section>

      <ConfirmDialog
        open={
          deleteTarget !== null
        }
        onOpenChange={(open) => {
          if (
            !open &&
            !isDeleting
          ) {
            setDeleteTarget(
              null,
            )
          }
        }}
        title="حذف دستهبندی"
        description={
          deleteTarget
            ? `آیا از حذف دستهبندی «${deleteTarget.name}» مطمئن هستید`
            : ''
        }
        confirmLabel="حذف دستهبندی"
        cancelLabel="انصراف"
        variant="danger"
        isLoading={
          isDeleting
        }
        onConfirm={
          handleConfirmDeleteCategory
        }
      />
    </div>
  )
}

export default CategoriesPage