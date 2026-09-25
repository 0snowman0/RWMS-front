import { LoaderCircle } from 'lucide-react'

interface LoadingStateProps {
  title?: string
  description?: string
}

function LoadingState({
  title = 'در حال دریافت اطلاعات',
  description = 'لطفاً چند لحظه صبر کنید.',
}: LoadingStateProps) {
  return (
    <div className="flex min-h-52 flex-col items-center justify-center rounded-2xl border border-border bg-surface p-8 text-center">
      <LoaderCircle
        size={28}
        className="animate-spin text-primary"
      />

      <h3 className="mt-4 text-sm font-semibold text-foreground">
        {title}
      </h3>

      <p className="mt-1 text-sm text-muted-foreground">
        {description}
      </p>
    </div>
  )
}

export default LoadingState