import {
  useMemo,
  useState,
} from 'react'

import {
  Check,
  Layers3,
  Search,
  X,
} from 'lucide-react'

import type {
  Category,
} from '@/modules/categories/types/category.types'


type CategoryFilter =
  | 'all'
  | 'selected'
  | 'unselected'


interface ProductCategorySelectorProps {
  categories: Category[]

  selectedIds: number[]

  onChange: (
    ids: number[],
  ) => void
}


export function ProductCategorySelector({
  categories,
  selectedIds,
  onChange,
}: ProductCategorySelectorProps) {
  const [
    search,
    setSearch,
  ] = useState('')


  const [
    filter,
    setFilter,
  ] =
    useState<CategoryFilter>(
      'all',
    )


  const selectedCategories =
    useMemo(
      () =>
        categories.filter(
          (category) =>
            selectedIds.includes(
              category.id,
            ),
        ),
      [selectedIds],
    )


  const visibleCategories =
    useMemo(
      () => {
        const normalizedSearch =
          search
            .trim()
            .toLocaleLowerCase(
              'fa',
            )

        return categories.filter(
          (category) => {
            const selected =
              selectedIds.includes(
                category.id,
              )

            if (
              filter ===
                'selected' &&
              !selected
            ) {
              return false
            }

            if (
              filter ===
                'unselected' &&
              selected
            ) {
              return false
            }

            if (
              !normalizedSearch
            ) {
              return true
            }

            return (
              category.name
                .toLocaleLowerCase(
                  'fa',
                )
                .includes(
                  normalizedSearch,
                ) ||
              (
                category.description ??
                ''
              )
                .toLocaleLowerCase(
                  'fa',
                )
                .includes(
                  normalizedSearch,
                )
            )
          },
        )
      },
      [
        filter,
        search,
        selectedIds,
      ],
    )


  function toggle(
    categoryId: number,
  ) {
    if (
      selectedIds.includes(
        categoryId,
      )
    ) {
      onChange(
        selectedIds.filter(
          (id) =>
            id !== categoryId,
        ),
      )

      return
    }

    onChange([
      ...selectedIds,
      categoryId,
    ])
  }


  function removeSelected(
    categoryId: number,
  ) {
    onChange(
      selectedIds.filter(
        (id) =>
          id !== categoryId,
      ),
    )
  }


  return (
    <section className="rounded-2xl border border-border bg-surface">
      <div className="border-b border-border p-5">
        <div className="flex items-start gap-3">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary-soft text-primary">
            <Layers3
              size={20}
            />
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="font-semibold text-foreground">
                  دستهبندیهای کالا
                </h2>

                <p className="mt-1 text-sm leading-6 text-muted-foreground">
                  یک یا چند دستهبندی را انتخاب کنید. مشخصات هر دسته به فرم کالا اضافه میشود.
                </p>
              </div>

              <div className="rounded-lg bg-primary-soft px-3 py-1.5 text-xs font-medium text-primary">
                {
                  selectedIds.length
                }{' '}
                انتخابشده
              </div>
            </div>
          </div>
        </div>


        {selectedCategories.length >
          0 && (
          <div className="mt-5 rounded-xl border border-border bg-surface-muted/35 p-3">
            <div className="mb-2 text-xs font-medium text-muted-foreground">
              دستهبندیهای انتخابشده
            </div>

            <div className="flex flex-wrap gap-2">
              {selectedCategories.map(
                (category) => (
                  <span
                    key={
                      category.id
                    }
                    className="inline-flex items-center gap-2 rounded-lg bg-primary-soft px-2.5 py-1.5 text-xs font-medium text-primary"
                  >
                    {
                      category.name
                    }

                    <button
                      type="button"
                      title="حذف انتخاب"
                      className="rounded-md p-0.5 transition hover:bg-primary/10"
                      onClick={() =>
                        removeSelected(
                          category.id,
                        )
                      }
                    >
                      <X
                        size={13}
                      />
                    </button>
                  </span>
                ),
              )}
            </div>
          </div>
        )}


        <div className="mt-5 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="relative w-full lg:max-w-md">
            <Search
              size={17}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            />

            <input
              type="search"
              value={search}
              placeholder="جستجو در دستهبندیها..."
              className="w-full rounded-xl border border-border bg-surface py-2.5 pr-10 pl-3 text-sm text-foreground outline-none transition placeholder:text-placeholder focus:border-primary focus:ring-2 focus:ring-primary/15"
              onChange={(
                event,
              ) =>
                setSearch(
                  event.target
                    .value,
                )
              }
            />
          </div>


          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              className={[
                'rounded-lg border px-3 py-2 text-xs font-medium transition',
                filter === 'all'
                  ? 'border-primary bg-primary-soft text-primary'
                  : 'border-border bg-surface text-muted-foreground hover:bg-surface-muted',
              ].join(' ')}
              onClick={() =>
                setFilter(
                  'all',
                )
              }
            >
              همه
              {' '}
              (
              {
                categories.length
              }
              )
            </button>


            <button
              type="button"
              className={[
                'rounded-lg border px-3 py-2 text-xs font-medium transition',
                filter ===
                'selected'
                  ? 'border-primary bg-primary-soft text-primary'
                  : 'border-border bg-surface text-muted-foreground hover:bg-surface-muted',
              ].join(' ')}
              onClick={() =>
                setFilter(
                  'selected',
                )
              }
            >
              انتخابشدهها
              {' '}
              (
              {
                selectedIds.length
              }
              )
            </button>


            <button
              type="button"
              className={[
                'rounded-lg border px-3 py-2 text-xs font-medium transition',
                filter ===
                'unselected'
                  ? 'border-primary bg-primary-soft text-primary'
                  : 'border-border bg-surface text-muted-foreground hover:bg-surface-muted',
              ].join(' ')}
              onClick={() =>
                setFilter(
                  'unselected',
                )
              }
            >
              انتخابنشدهها
              {' '}
              (
              {
                categories.length -
                selectedIds.length
              }
              )
            </button>
          </div>
        </div>
      </div>


      <div className="p-4">
        <div className="max-h-[420px] overflow-y-auto overscroll-contain pl-1">
          {visibleCategories.length ===
          0 ? (
            <div className="flex min-h-40 items-center justify-center rounded-xl border border-dashed border-border p-6 text-center">
              <div>
                <p className="font-medium text-foreground">
                  دستهبندیای پیدا نشد
                </p>

                <p className="mt-2 text-sm text-muted-foreground">
                  عبارت جستجو یا فیلتر نمایش را تغییر دهید.
                </p>
              </div>
            </div>
          ) : (
            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
              {visibleCategories.map(
                (category) => {
                  const selected =
                    selectedIds.includes(
                      category.id,
                    )

                  const activeFields =
                    category.fields.filter(
                      (field) =>
                        field.is_active,
                    )

                  const requiredFields =
                    activeFields.filter(
                      (field) =>
                        field.required,
                    ).length

                  return (
                    <button
                      key={
                        category.id
                      }
                      type="button"
                      onClick={() =>
                        toggle(
                          category.id,
                        )
                      }
                      className={[
                        'relative min-h-[126px] rounded-xl border p-4 text-right transition',
                        'focus:outline-none focus:ring-2 focus:ring-primary/25',
                        selected
                          ? 'border-primary bg-primary-soft/60'
                          : 'border-border bg-surface hover:border-border-strong hover:bg-surface-muted/40',
                      ].join(' ')}
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className={[
                            'mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-md border transition',
                            selected
                              ? 'border-primary bg-primary text-white'
                              : 'border-border-strong bg-surface',
                          ].join(' ')}
                        >
                          {selected && (
                            <Check
                              size={15}
                            />
                          )}
                        </div>


                        <div className="min-w-0 flex-1">
                          <div className="font-medium text-foreground">
                            {
                              category.name
                            }
                          </div>

                          <div className="mt-2 flex flex-wrap gap-1.5">
                            <span className="rounded-md bg-surface-muted px-2 py-1 text-[11px] text-muted-foreground">
                              {
                                activeFields.length
                              }{' '}
                              مشخصه
                            </span>

                            {requiredFields >
                              0 && (
                              <span className="rounded-md bg-warning-soft px-2 py-1 text-[11px] text-warning">
                                {
                                  requiredFields
                                }{' '}
                                اجباری
                              </span>
                            )}
                          </div>

                          {category.description && (
                            <p className="mt-2 line-clamp-2 text-xs leading-5 text-muted-foreground">
                              {
                                category.description
                              }
                            </p>
                          )}
                        </div>
                      </div>
                    </button>
                  )
                },
              )}
            </div>
          )}
        </div>


        <div className="mt-3 flex items-center justify-between border-t border-border pt-3 text-xs text-muted-foreground">
          <span>
            نمایش{' '}
            {
              visibleCategories.length
            }{' '}
            دستهبندی
          </span>

          <span>
            برای مشاهده تعداد زیاد دستهبندیها از اسکرول همین بخش استفاده کنید.
          </span>
        </div>
      </div>
    </section>
  )
}