import type {
  RouteObject,
} from 'react-router'

import {
  categoryRoutes,
} from '@/modules/categories/routes'



import {
  productRoutes,
} from '@/modules/products/routes'


import {
  waybillTemplateRoutes,
} from '@/modules/waybill-templates/routes'


import {
  waybillRoutes,
} from '@/modules/waybills/routes'

export const moduleRoutes: RouteObject[] = [
        ...waybillRoutes,
...waybillTemplateRoutes,
...productRoutes,
...categoryRoutes,
]