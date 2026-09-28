import type {
  RouteObject,
} from 'react-router'

import {
  categoryRoutes,
} from '@/modules/categories/routes'



import {
  productRoutes,
} from '@/modules/products/routes'

export const moduleRoutes: RouteObject[] = [
    ...productRoutes,
...categoryRoutes,
]