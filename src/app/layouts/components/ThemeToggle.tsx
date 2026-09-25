import {
  Moon,
  Sun,
} from 'lucide-react'

import { useTheme } from '@/app/providers/ThemeProvider'

function ThemeToggle() {
  const {
    theme,
    toggleTheme,
  } = useTheme()

  const isDark = theme === 'dark'

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="flex size-10 items-center justify-center rounded-xl text-muted-foreground transition hover:bg-surface-muted hover:text-foreground"
      aria-label={
        isDark
          ? 'فعال‌کردن حالت روشن'
          : 'فعال‌کردن حالت تاریک'
      }
      title={
        isDark
          ? 'حالت روشن'
          : 'حالت تاریک'
      }
    >
      {isDark ? (
        <Sun size={19} strokeWidth={1.8} />
      ) : (
        <Moon size={19} strokeWidth={1.8} />
      )}
    </button>
  )
}

export default ThemeToggle