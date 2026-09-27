import type {
  RouteObject,
} from 'react-router'


export const categoryRoutes: RouteObject[] = [
  {
    path: 'categories',

    lazy: async () => {
      const module =
        await import(
          '../pages/CategoriesPage'
        )

      return {
        Component:
          module.default,
      }
    },
  },


  {
    path: 'categories/new',

    lazy: async () => {
      const module =
        await import(
          '../pages/CategoryEditorPage'
        )

      return {
        Component:
          module.default,
      }
    },
  },


  {
    path: 'categories/:categoryId/edit',

    lazy: async () => {
      const module =
        await import(
          '../pages/CategoryEditorPage'
        )

      return {
        Component:
          module.default,
      }
    },
  },
]