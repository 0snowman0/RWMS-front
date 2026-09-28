import type {
  RouteObject,
} from 'react-router'


async function loadList() {
  const module =
    await import(
      '../pages/WaybillsPage'
    )

  return {
    Component:
      module.default,
  }
}


async function loadEditor() {
  const module =
    await import(
      '../pages/WaybillEditorPage'
    )

  return {
    Component:
      module.default,
  }
}


export const waybillRoutes:
  RouteObject[] = [
    {
      path:
        'waybills',

      lazy:
        loadList,
    },

    {
      path:
        'waybills/new',

      lazy:
        loadEditor,
    },

    {
      path:
        'waybills/:waybillId/edit',

      lazy:
        loadEditor,
    },
  ]