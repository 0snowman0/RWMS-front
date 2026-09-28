import type {
  RouteObject,
} from 'react-router'


async function loadProductsPage() {
  const module =
    await import(
      '../pages/ProductsPage'
    )

  return {
    Component:
      module.default,
  }
}


async function loadProductEditorPage() {
  const module =
    await import(
      '../pages/ProductEditorPage'
    )

  return {
    Component:
      module.default,
  }
}


export const productRoutes: RouteObject[] = [
  {
    path:
      'products',

    lazy:
      loadProductsPage,
  },

  {
    path:
      'products/new',

    lazy:
      loadProductEditorPage,
  },

  {
    path:
      'products/:productId/edit',

    lazy:
      loadProductEditorPage,
  },


  // --------------------------------------------
  // Compatibility aliases for existing dashboard
  // --------------------------------------------

  {
    path:
      'items',

    lazy:
      loadProductsPage,
  },

  {
    path:
      'items/new',

    lazy:
      loadProductEditorPage,
  },

  {
    path:
      'items/:productId/edit',

    lazy:
      loadProductEditorPage,
  },
]