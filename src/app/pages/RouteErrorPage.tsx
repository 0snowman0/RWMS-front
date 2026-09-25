import { CircleAlert } from 'lucide-react'
import {
  isRouteErrorResponse,
  useNavigate,
  useRouteError,
} from 'react-router'

import { Button } from '@/shared/ui/button'

function RouteErrorPage() {
  const error = useRouteError()
  const navigate = useNavigate()

  let title = 'خطایی در اجرای صفحه رخ داده است'
  let description =
    'امکان نمایش این بخش از سامانه وجود ندارد. لطفاً دوباره تلاش کنید.'

  if (isRouteErrorResponse(error)) {
    if (error.status === 404) {
      title = 'صفحه موردنظر پیدا نشد'
      description =
        'آدرس موردنظر وجود ندارد یا دیگر در دسترس نیست.'
    } else if (error.status === 403) {
      title = 'دسترسی مجاز نیست'
      description =
        'شما مجوز لازم برای مشاهده این بخش را ندارید.'
    } else if (error.status >= 500) {
      title = 'خطای داخلی سامانه'
      description =
        'در پردازش درخواست مشکلی رخ داده است. لطفاً دوباره تلاش کنید.'
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-6 text-foreground">
      <div className="w-full max-w-lg rounded-2xl border border-border bg-surface p-8 text-center shadow-sm">
        <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-danger-soft text-danger">
          <CircleAlert
            size={28}
            strokeWidth={1.7}
          />
        </div>

        <h1 className="mt-6 text-xl font-bold text-foreground">
          {title}
        </h1>

        <p className="mt-3 text-sm leading-7 text-muted-foreground">
          {description}
        </p>

        <div className="mt-7 flex flex-wrap justify-center gap-2">
          <Button onClick={() => window.location.reload()}>
            تلاش مجدد
          </Button>

          <Button
            variant="outline"
            onClick={() => navigate('/')}
          >
            بازگشت به داشبورد
          </Button>
        </div>
      </div>
    </div>
  )
}

export default RouteErrorPage