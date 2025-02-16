import type { ColumnDef, ColumnFiltersState, SortingState, Table } from '@tanstack/react-table';

interface BaseData {
  id: string | number;
}

export interface DropdownOption {
  id: number | string;
  label: string;
  value: string;
}

export interface ColumnDropdownConfig {
  columnId: string;
  options: DropdownOption[];
  onSelect: (rowId: number | string, value: string) => void;
}

export interface DataTableProps<TData extends BaseData> {
  data: TData[];
  columns: ColumnDef<TData>[];
  filterColumn?: string;
  selectable?: boolean;
  dropdownConfig?: ColumnDropdownConfig;
}

export interface DataCardProps<TData> {
  data: TData[];
  renderCard: (item: TData) => React.ReactNode;
  statusColors?: Record<string, string>;
  dropdownConfig?: ColumnDropdownConfig;
}

export interface TableUIProps<TData> {
  table: Table<TData>;
  filterColumn?: string;
  columns: ColumnDef<TData>[];
}

export interface TableState {
  sorting: SortingState;
  columnFilters: ColumnFiltersState;
  columnVisibility: Record<string, boolean>;
  rowSelection: Record<string, boolean>;
}
