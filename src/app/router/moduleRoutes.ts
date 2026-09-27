import type {
  RouteObject,
} from 'react-router'

import {
  categoryRoutes,
} from '@/modules/categories/routes'


export const moduleRoutes: RouteObject[] = [
  ...categoryRoutes,
]