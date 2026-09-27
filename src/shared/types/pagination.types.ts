export interface PagedRequest<TFilter = null> {
  page_number: number
  page_size: number

  sort_by: string | null
  is_ascending: boolean

  filter: TFilter | null
}

export interface PagedResult<TItem> {
  items: TItem[]

  total_count: number

  page_number: number
  page_size: number

  total_pages: number

  has_previous_page: boolean
  has_next_page: boolean
}