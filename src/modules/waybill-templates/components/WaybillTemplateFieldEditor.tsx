import {
  DynamicFieldEditor,
} from '@/modules/categories/components/DynamicFieldEditor'

import type {
  DynamicFieldDefinition,
} from '@/shared/dynamic-fields'


interface WaybillTemplateFieldEditorProps {
  open: boolean

  field:
    DynamicFieldDefinition |
    null

  nextSortOrder:
    number

  onOpenChange: (
    open: boolean,
  ) => void

  onSave: (
    field:
      DynamicFieldDefinition,
  ) => void
}


export function WaybillTemplateFieldEditor(
  props:
    WaybillTemplateFieldEditorProps,
) {
  return (
    <DynamicFieldEditor
      open={
        props.open
      }
      field={
        props.field
      }
      nextSortOrder={
        props.nextSortOrder
      }
      onOpenChange={
        props.onOpenChange
      }
      onSave={
        props.onSave
      }
    />
  )
}