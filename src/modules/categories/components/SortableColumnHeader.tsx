import {
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
} from 'lucide-react'

interface SortableColumnHeaderProps {
  title: string

  column: string

  sortBy: string | null

  isAscending: boolean

  onSort: (column: string) => void
}

export function SortableColumnHeader({
  title,
  column,
  sortBy,
  isAscending,
  onSort,
}: SortableColumnHeaderProps) {
  const isActive =
    sortBy === column

  return (
    <button
      type="button"
      onClick={() => onSort(column)}
      className={[
        'group inline-flex items-center gap-1.5',
        'rounded-lg px-1 py-1',
        'text-sm font-medium',
        'transition-colors',
        'hover:text-primary',
        isActive
          ? 'text-primary'
          : 'text-muted-foreground',
      ].join(' ')}
    >
      <span>{title}</span>

      {isActive ? (
        isAscending ? (
          <ArrowUp
            size={15}
            strokeWidth={2}
          />
        ) : (
          <ArrowDown
            size={15}
            strokeWidth={2}
          />
        )
      ) : (
        <ArrowUpDown
          size={14}
          strokeWidth={1.7}
          className="opacity-45 transition-opacity group-hover:opacity-100"
        />
      )}
    </button>
  )
}