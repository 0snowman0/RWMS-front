import { useState } from 'react'
import { Outlet } from 'react-router'

import AppHeader from '@/app/layouts/components/AppHeader'
import AppSidebar from '@/app/layouts/components/AppSidebar'

function MainLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  function openSidebar() {
    setIsSidebarOpen(true)
  }

  function closeSidebar() {
    setIsSidebarOpen(false)
  }

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <AppSidebar
        isOpen={isSidebarOpen}
        onClose={closeSidebar}
      />

      <div className="flex min-w-0 flex-1 flex-col">
        <AppHeader onMenuClick={openSidebar} />

        <main className="flex-1 overflow-auto p-4 sm:p-6">
          <div className="mx-auto w-full max-w-[1600px]">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}

export default MainLayout