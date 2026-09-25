import { Toaster } from 'sonner'

import { useTheme } from '@/app/providers/ThemeProvider'

function NotificationProvider() {
  const { theme } = useTheme()

  return (
    <Toaster
      theme={theme}
      position="top-left"
      richColors
      closeButton
      duration={4000}
    />
  )
}

export default NotificationProvider
