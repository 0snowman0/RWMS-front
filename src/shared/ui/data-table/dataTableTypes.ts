import type {
  ColumnDef,
  RowData,
} from '@tanstack/react-table'

import { dataTableFeatures } from './dataTableFeatures'

export type DataTableColumn<
  TData extends RowData,
> = ColumnDef<
  typeof dataTableFeatures,
  TData
>
