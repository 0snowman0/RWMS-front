import type { ReactNode } from 'react'
import { Inbox } from 'lucide-react'

interface EmptyStateProps {
  title?: string
  description?: string
  action?: ReactNode
}

function EmptyState({
  title = 'اطلاعاتی برای نمایش وجود ندارد',
  description = 'هنوز موردی در این بخش ثبت نشده است.',
  action,
}: EmptyStateProps) {
  return (
    <div className="flex min-h-52 flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-surface p-8 text-center">
      <div className="flex size-11 items-center justify-center rounded-xl bg-surface-muted text-muted-foreground">
        <Inbox size={22} strokeWidth={1.8} />
      </div>

      <h3 className="mt-4 text-sm font-semibold text-foreground">
        {title}
      </h3>

      <p className="mt-1 max-w-md text-sm leading-6 text-muted-foreground">
        {description}
      </p>

      {action && (
        <div className="mt-5">
          {action}
        </div>
      )}
    </div>
  )
}

export default EmptyState