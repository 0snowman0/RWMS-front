import type { ReactNode } from 'react'
import { X } from 'lucide-react'
import { Dialog as RadixDialog } from 'radix-ui'

import { cn } from '@/shared/utils/cn'

type DialogSize =
  | 'sm'
  | 'md'
  | 'lg'
  | 'xl'

interface DialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description?: string
  children: ReactNode
  footer?: ReactNode
  size?: DialogSize
}

const sizeClasses: Record<DialogSize, string> = {
  sm: 'max-w-md',
  md: 'max-w-xl',
  lg: 'max-w-3xl',
  xl: 'max-w-5xl',
}

function Dialog({
  open,
  onOpenChange,
  title,
  description,
  children,
  footer,
  size = 'md',
}: DialogProps) {
  return (
    <RadixDialog.Root
      open={open}
      onOpenChange={onOpenChange}
    >
      <RadixDialog.Portal>
        <RadixDialog.Overlay
          className="fixed inset-0 z-50 bg-black/30 backdrop-blur-[1px]"
        />

        <RadixDialog.Content
          {...(!description
            ? { 'aria-describedby': undefined }
            : {})}
          className={cn(
            'fixed left-1/2 top-1/2 z-[51]',
            'flex max-h-[90vh] w-[calc(100%-2rem)]',
            '-translate-x-1/2 -translate-y-1/2 flex-col',
            'overflow-hidden rounded-2xl border border-border',
            'bg-surface text-foreground shadow-xl',
            sizeClasses[size],
          )}
        >
          <div className="flex shrink-0 items-start justify-between gap-4 border-b border-border px-5 py-4">
            <div className="min-w-0">
              <RadixDialog.Title className="text-base font-semibold text-foreground">
                {title}
              </RadixDialog.Title>

              {description && (
                <RadixDialog.Description className="mt-1 text-sm leading-6 text-muted-foreground">
                  {description}
                </RadixDialog.Description>
              )}
            </div>

            <RadixDialog.Close asChild>
              <button
                type="button"
                className="flex size-9 shrink-0 items-center justify-center rounded-xl text-muted-foreground transition hover:bg-surface-muted hover:text-foreground"
                aria-label="بستن"
              >
                <X size={18} strokeWidth={1.8} />
              </button>
            </RadixDialog.Close>
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto p-5">
            {children}
          </div>

          {footer && (
            <div className="flex shrink-0 flex-wrap items-center justify-end gap-2 border-t border-border px-5 py-4">
              {footer}
            </div>
          )}
        </RadixDialog.Content>
      </RadixDialog.Portal>
    </RadixDialog.Root>
  )
}

export default Dialog
