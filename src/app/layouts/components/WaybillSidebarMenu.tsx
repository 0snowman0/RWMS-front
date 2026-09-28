import {
  useEffect,
  useState,
} from 'react'

import {
  ChevronDown,
  FileText,
  LayoutTemplate,
  Truck,
} from 'lucide-react'

import {
  NavLink,
  useLocation,
} from 'react-router'


export function WaybillSidebarMenu() {
  const location =
    useLocation()


  const active =
    location.pathname.startsWith(
      '/waybills',
    ) ||
    location.pathname.startsWith(
      '/waybill-templates',
    )


  const [
    open,
    setOpen,
  ] =
    useState(
      active,
    )


  useEffect(
    () => {
      if (active) {
        setOpen(
          true,
        )
      }
    },
    [
      active,
    ],
  )


  const childClass =
    ({
      isActive,
    }: {
      isActive:
        boolean
    }) =>
      [
        'flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition',
        isActive
          ? 'bg-primary-soft font-medium text-primary'
          : 'text-muted-foreground hover:bg-surface-muted hover:text-foreground',
      ].join(' ')


  return (
    <div>
      <button
        type="button"
        className={[
          'flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-sm transition',
          active
            ? 'bg-primary-soft font-medium text-primary'
            : 'text-muted-foreground hover:bg-surface-muted hover:text-foreground',
        ].join(' ')}
        onClick={() =>
          setOpen(
            (current) =>
              !current,
          )
        }
      >
        <span className="flex items-center gap-3">
          <Truck
            size={18}
          />

          بارنامه
        </span>

        <ChevronDown
          size={16}
          className={[
            'transition-transform',
            open
              ? 'rotate-180'
              : '',
          ].join(' ')}
        />
      </button>


      {open && (
        <div className="mr-5 mt-1 space-y-1 border-r border-border pr-3">
          <NavLink
            to="/waybills"
            className={
              childClass
            }
          >
            <FileText
              size={16}
            />

            بارنامه‌ها
          </NavLink>

          <NavLink
            to="/waybill-templates"
            className={
              childClass
            }
          >
            <LayoutTemplate
              size={16}
            />

            قالب‌های بارنامه
          </NavLink>
        </div>
      )}
    </div>
  )
}