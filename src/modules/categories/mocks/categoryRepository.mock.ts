import type {
  PagedRequest,
  PagedResult,
} from '@/shared/types'

import { mockCategories } from './categories.mock'
import type { Category } from '../types/category.types'

export interface CategoryListRequest
  extends PagedRequest<null> {
  /**
   * Demo-only search.
   *
   * Category backend filtering is not implemented yet.
   * Later this can be mapped to the generic filter contract.
   */
  search?: string
}

const sortableColumns = [
  'id',
  'name',
  'created_at',
  'updated_at',
] as const

type SortableCategoryColumn =
  (typeof sortableColumns)[number]

function isSortableColumn(
  value: string | null,
): value is SortableCategoryColumn {
  if (!value) {
    return false
  }

  return sortableColumns.includes(
    value as SortableCategoryColumn,
  )
}

function compareValues(
  first: unknown,
  second: unknown,
): number {
  if (
    typeof first === 'number' &&
    typeof second === 'number'
  ) {
    return first - second
  }

  return String(first ?? '').localeCompare(
    String(second ?? ''),
    'fa',
    {
      numeric: true,
      sensitivity: 'base',
    },
  )
}

export async function getPagedCategoriesMock(
  request: CategoryListRequest,
): Promise<PagedResult<Category>> {
  const pageNumber = Math.max(
    request.page_number,
    1,
  )

  const pageSize = Math.min(
    Math.max(request.page_size, 1),
    100,
  )

  const search =
    request.search
      ?.trim()
      .toLocaleLowerCase('fa') ?? ''

  let data = [...mockCategories]

  if (search) {
    data = data.filter((category) => {
      const name =
        category.name.toLocaleLowerCase('fa')

      const description =
        category.description
          ?.toLocaleLowerCase('fa') ?? ''

      return (
        name.includes(search) ||
        description.includes(search)
      )
    })
  }

  const sortBy: SortableCategoryColumn =
    isSortableColumn(request.sort_by)
      ? request.sort_by
      : 'id'

  data.sort((first, second) => {
    const result = compareValues(
      first[sortBy],
      second[sortBy],
    )

    return request.is_ascending
      ? result
      : -result
  })

  const totalCount = data.length

  const totalPages =
    totalCount === 0
      ? 0
      : Math.ceil(
          totalCount / pageSize,
        )

  const start =
    (pageNumber - 1) * pageSize

  const items = data.slice(
    start,
    start + pageSize,
  )

  /*
   * Small artificial delay so Loading State
   * can be tested before the real API exists.
   */
  await new Promise((resolve) => {
    window.setTimeout(resolve, 250)
  })

  return {
    items,

    total_count: totalCount,

    page_number: pageNumber,
    page_size: pageSize,

    total_pages: totalPages,

    has_previous_page:
      pageNumber > 1,

    has_next_page:
      pageNumber < totalPages,
  }
}