import { CircleAlert } from 'lucide-react'
import { AlertDialog as RadixAlertDialog } from 'radix-ui'

import { Button } from '@/shared/ui/button'
import { cn } from '@/shared/utils/cn'

type ConfirmVariant =
  | 'primary'
  | 'danger'

interface ConfirmDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void

  title: string
  description: string

  confirmLabel?: string
  cancelLabel?: string

  variant?: ConfirmVariant
  isLoading?: boolean

  onConfirm: () => void
}

function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel = 'تأیید',
  cancelLabel = 'انصراف',
  variant = 'danger',
  isLoading = false,
  onConfirm,
}: ConfirmDialogProps) {
  function handleOpenChange(
    nextOpen: boolean,
  ) {
    if (isLoading) {
      return
    }

    onOpenChange(nextOpen)
  }

  return (
    <RadixAlertDialog.Root
      open={open}
      onOpenChange={handleOpenChange}
    >
      <RadixAlertDialog.Portal>
        <RadixAlertDialog.Overlay
          className="fixed inset-0 z-50 bg-black/30 backdrop-blur-[1px]"
        />

        <RadixAlertDialog.Content
          className={cn(
            'fixed left-1/2 top-1/2 z-[51]',
            'w-[calc(100%-2rem)] max-w-md',
            '-translate-x-1/2 -translate-y-1/2',
            'rounded-2xl border border-border',
            'bg-surface p-6 text-foreground shadow-xl',
          )}
        >
          <div
            className={cn(
              'flex size-12 items-center justify-center rounded-2xl',
              variant === 'danger'
                ? 'bg-danger-soft text-danger'
                : 'bg-primary-soft text-primary',
            )}
          >
            <CircleAlert
              size={24}
              strokeWidth={1.8}
            />
          </div>

          <RadixAlertDialog.Title className="mt-5 text-lg font-semibold text-foreground">
            {title}
          </RadixAlertDialog.Title>

          <RadixAlertDialog.Description className="mt-2 text-sm leading-7 text-muted-foreground">
            {description}
          </RadixAlertDialog.Description>

          <div className="mt-6 flex flex-wrap justify-end gap-2">
            <RadixAlertDialog.Cancel asChild>
              <Button
                variant="outline"
                disabled={isLoading}
              >
                {cancelLabel}
              </Button>
            </RadixAlertDialog.Cancel>

            <Button
              variant={
                variant === 'danger'
                  ? 'danger'
                  : 'primary'
              }
              isLoading={isLoading}
              onClick={onConfirm}
            >
              {confirmLabel}
            </Button>
          </div>
        </RadixAlertDialog.Content>
      </RadixAlertDialog.Portal>
    </RadixAlertDialog.Root>
  )
}

export default ConfirmDialog
