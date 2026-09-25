import { createBrowserRouter } from 'react-router'
import { RouterProvider } from 'react-router/dom'

import MainLayout from '@/app/layouts/MainLayout'
import NotFoundPage from '@/app/pages/NotFoundPage'
import RouteErrorPage from '@/app/pages/RouteErrorPage'
import { DashboardPage } from '@/modules/dashboard'

const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    ErrorBoundary: RouteErrorPage,

    children: [
      {
        index: true,
        element: <DashboardPage />,
      },

      {
        path: '*',
        element: <NotFoundPage />,
      },
    ],
  },
])

function AppRouter() {
  return <RouterProvider router={router} />
}

export default AppRouter