import { FileQuestion } from 'lucide-react'
import { useNavigate } from 'react-router'

import { Button } from '@/shared/ui/button'

function NotFoundPage() {
  const navigate = useNavigate()

  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="w-full max-w-lg text-center">
        <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-primary-soft text-primary">
          <FileQuestion
            size={28}
            strokeWidth={1.7}
          />
        </div>

        <p className="mt-6 text-sm font-semibold text-primary">
          خطای ۴۰۴
        </p>

        <h1 className="mt-2 text-2xl font-bold text-foreground">
          صفحه موردنظر پیدا نشد
        </h1>

        <p className="mx-auto mt-3 max-w-md text-sm leading-7 text-muted-foreground">
          ممکن است آدرس واردشده صحیح نباشد یا این صفحه دیگر در دسترس
          نباشد.
        </p>

        <div className="mt-6 flex justify-center">
          <Button onClick={() => navigate('/')}>
            بازگشت به داشبورد
          </Button>
        </div>
      </div>
    </div>
  )
}

export default NotFoundPage