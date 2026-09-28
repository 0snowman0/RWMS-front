import type {
  RouteObject,
} from 'react-router'


async function loadList() {
  const module =
    await import(
      '../pages/WaybillTemplatesPage'
    )

  return {
    Component:
      module.default,
  }
}


async function loadEditor() {
  const module =
    await import(
      '../pages/WaybillTemplateEditorPage'
    )

  return {
    Component:
      module.default,
  }
}


export const waybillTemplateRoutes:
  RouteObject[] = [
    {
      path:
        'waybill-templates',

      lazy:
        loadList,
    },

    {
      path:
        'waybill-templates/new',

      lazy:
        loadEditor,
    },

    {
      path:
        'waybill-templates/:templateId/edit',

      lazy:
        loadEditor,
    },
  ]