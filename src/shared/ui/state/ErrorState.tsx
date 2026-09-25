import type { ReactNode } from 'react'
import { CircleAlert } from 'lucide-react'

interface ErrorStateProps {
  title?: string
  description?: string
  action?: ReactNode
}

function ErrorState({
  title = 'خطایی رخ داده است',
  description = 'امکان دریافت اطلاعات وجود ندارد. دوباره تلاش کنید.',
  action,
}: ErrorStateProps) {
  return (
    <div className="flex min-h-52 flex-col items-center justify-center rounded-2xl border border-danger/20 bg-danger-soft/40 p-8 text-center">
      <div className="flex size-11 items-center justify-center rounded-xl bg-danger-soft text-danger">
        <CircleAlert size={22} strokeWidth={1.8} />
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

export default ErrorState