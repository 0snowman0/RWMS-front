import { toast } from 'sonner'

interface NotifyOptions {
  description?: string
}

export const notify = {
  success(
    message: string,
    options?: NotifyOptions,
  ) {
    return toast.success(message, {
      description: options?.description,
    })
  },

  error(
    message: string,
    options?: NotifyOptions,
  ) {
    return toast.error(message, {
      description: options?.description,
    })
  },

  warning(
    message: string,
    options?: NotifyOptions,
  ) {
    return toast.warning(message, {
      description: options?.description,
    })
  },

  info(
    message: string,
    options?: NotifyOptions,
  ) {
    return toast.info(message, {
      description: options?.description,
    })
  },

  loading(
    message: string,
    options?: NotifyOptions,
  ) {
    return toast.loading(message, {
      description: options?.description,
    })
  },

  dismiss(id?: string | number) {
    toast.dismiss(id)
  },
}
