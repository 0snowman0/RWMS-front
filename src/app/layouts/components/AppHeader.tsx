import {
  Bell,
  ChevronDown,
  Menu,
  Search,
} from 'lucide-react'
import ThemeToggle from '@/app/layouts/components/ThemeToggle'

interface AppHeaderProps {
  onMenuClick: () => void
}

function AppHeader({
  onMenuClick,
}: AppHeaderProps) {
  return (
    <header className="flex h-16 shrink-0 items-center justify-between border-b border-border bg-surface px-4 sm:px-6">
      <div className="flex min-w-0 items-center gap-3">
        <button
          type="button"
          onClick={onMenuClick}
          className="flex size-10 shrink-0 items-center justify-center rounded-xl text-muted-foreground transition hover:bg-surface-muted hover:text-foreground lg:hidden"
          aria-label="باز کردن منو"
        >
          <Menu size={21} strokeWidth={1.8} />
        </button>

        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-foreground">
            سامانه مدیریت هوشمند انبار امدادی
          </p>

          <p className="mt-0.5 hidden truncate text-xs text-muted-foreground sm:block">
            مدیریت عملیات، موجودی و گردش کالا
          </p>
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-1 sm:gap-2">
        <button
          type="button"
          className="hidden size-10 items-center justify-center rounded-xl text-muted-foreground transition hover:bg-surface-muted hover:text-foreground sm:flex"
          aria-label="جستجو"
        >
          <Search size={19} strokeWidth={1.8} />
        </button>
        <ThemeToggle />
        <button
          type="button"
          className="relative flex size-10 items-center justify-center rounded-xl text-muted-foreground transition hover:bg-surface-muted hover:text-foreground"
          aria-label="اعلان‌ها"
        >
          <Bell size={19} strokeWidth={1.8} />

          <span className="absolute left-2 top-2 size-2 rounded-full bg-danger" />
        </button>

        <div className="mx-1 hidden h-7 w-px bg-border sm:block" />

        <button
          type="button"
          className="flex items-center gap-2 rounded-xl px-1.5 py-1.5 transition hover:bg-surface-muted sm:px-2"
        >
          <div className="flex size-9 items-center justify-center rounded-full bg-primary-soft text-sm font-semibold text-primary">
            م
          </div>

          <div className="hidden text-right md:block">
            <div className="text-sm font-medium text-foreground">
              مدیر سیستم
            </div>

            <div className="text-xs text-muted-foreground">
              Administrator
            </div>
          </div>

          <ChevronDown
            size={16}
            className="hidden text-muted-foreground md:block"
          />
        </button>
      </div>
    </header>
  )
}

export default AppHeader