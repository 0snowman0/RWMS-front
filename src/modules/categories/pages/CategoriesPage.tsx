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
} from '@tanstack/react-query'

import {
  useNavigate,
} from 'react-router'

import {
  getPagedCategoriesMock,
} from '../mocks/categoryRepository.mock'

import {
  createCategoryColumns,
} from '../components/categoryColumns'

import {
  Button,
} from '@/shared/ui/button'

import {
  DataTable,
} from '@/shared/ui/data-table'

import {
  Pagination,
} from '@/shared/ui/pagination'

import {
  Input,
} from '@/shared/ui/input'

import {
  PageHeader,
} from '@/shared/ui/page-header'

function CategoriesPage() {
  const navigate = useNavigate()

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
      getPagedCategoriesMock(
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

            <div className="text-sm text-muted-foreground">
              {data
                ? `${data.total_count.toLocaleString(
                    'fa-IR',
                  )} نتیجه`
                : ''}
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
            <div className="border-t border-border">
              <Pagination
                page={
                  data.page_number
                }
                pageSize={
                  data.page_size
                }
                total={
                  data.total_count
                }
                onPageChange={
                  setPageNumber
                }
                onPageSizeChange={
                  handlePageSizeChange
                }
                pageSizeOptions={[
                  5,
                  10,
                  20,
                  50,
                ]}
              />
            </div>
          )}
      </section>
    </div>
  )
}

export default CategoriesPage