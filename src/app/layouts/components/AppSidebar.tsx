import {
  Boxes,
  ClipboardList,
  FileText,
  LayoutDashboard,
  Tags,
  Warehouse,
  X,
} from 'lucide-react'
import { NavLink } from 'react-router'

import { cn } from '@/shared/utils/cn'

interface AppSidebarProps {
  isOpen: boolean
  onClose: () => void
}

const navigationItems = [
  {
    label: 'داشبورد',
    to: '/',
    icon: LayoutDashboard,
  },
  {
    label: 'کالاها',
    to: '/items',
    icon: Boxes,
  },
  {
    label: 'دسته‌بندی کالا',
    to: '/categories',
    icon: Tags,
  },
  {
    label: 'بارنامه‌ها',
    to: '/waybills',
    icon: FileText,
  },
  {
    label: 'درخواست‌ها',
    to: '/requests',
    icon: ClipboardList,
  },
  {
    label: 'انبار',
    to: '/warehouses',
    icon: Warehouse,
  },
]

function AppSidebar({
  isOpen,
  onClose,
}: AppSidebarProps) {
  return (
    <>
      {isOpen && (
        <button
          type="button"
          aria-label="بستن منو"
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/20 backdrop-blur-[1px] lg:hidden"
        />
      )}

      <aside
        className={cn(
          'fixed inset-y-0 right-0 z-50 flex h-screen w-64 shrink-0 flex-col',
          'border-l border-border bg-surface',
          'transition-transform duration-200 ease-out',
          'lg:static lg:z-auto lg:translate-x-0',
          isOpen
            ? 'translate-x-0'
            : 'translate-x-full',
        )}
      >
        <div className="flex h-16 shrink-0 items-center justify-between border-b border-border px-5">
          <div className="flex items-center gap-3">
            <div className="flex size-9 items-center justify-center rounded-xl bg-primary text-sm font-bold text-white">
              R
            </div>

            <div>
              <div className="font-bold text-foreground">
                RWMS
              </div>

              <div className="text-xs text-muted-foreground">
                مدیریت هوشمند انبار
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex size-9 items-center justify-center rounded-xl text-muted-foreground transition hover:bg-surface-muted hover:text-foreground lg:hidden"
            aria-label="بستن منو"
          >
            <X size={19} strokeWidth={1.8} />
          </button>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto p-3">
          {navigationItems.map((item) => {
            const Icon = item.icon

            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/'}
                onClick={onClose}
                className={({ isActive }) =>
                  cn(
                    'flex items-center gap-3 rounded-xl px-3 py-2.5',
                    'text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-primary text-white'
                      : 'text-muted-foreground hover:bg-surface-muted hover:text-foreground',
                  )
                }
              >
                <Icon size={19} strokeWidth={1.8} />

                <span>
                  {item.label}
                </span>
              </NavLink>
            )
          })}
        </nav>

        <div className="shrink-0 border-t border-border p-4">
          <div className="rounded-xl bg-surface-muted p-3">
            <div className="text-sm font-medium text-foreground">
              سامانه RWMS
            </div>

            <div className="mt-1 text-xs leading-5 text-muted-foreground">
              نسخه توسعه
            </div>
          </div>
        </div>
      </aside>
    </>
  )
}

export default AppSidebar