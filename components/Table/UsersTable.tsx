'use client';

import { useState, useMemo } from 'react';
import {
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  SortingState,
  ColumnFiltersState,
  Row,
} from '@tanstack/react-table';
import { DataTableProps } from './table.types';
import { TableUI } from './TableUi';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '../ui/select';

// Add interface for base data type
interface BaseData {
  id: string | number;
}

export function DataTable<TData extends BaseData>({
  data,
  columns,
  filterColumn,
  selectable = false,
  dropdownConfig,
}: DataTableProps<TData>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState({});
  const [rowSelection, setRowSelection] = useState({});

  const enhancedColumns = useMemo(() => {
    if (!dropdownConfig) return columns;

    return columns.map((column) => {
      if (column.id === dropdownConfig.columnId) {
        return {
          ...column,
          cell: ({ row }: { row: Row<TData> }) => (
            <Select
              value={row.getValue(dropdownConfig.columnId)}
              onValueChange={(value) =>
                dropdownConfig.onSelect(row.original.id, value)
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select..." />
              </SelectTrigger>
              <SelectContent
                style={{ backgroundColor: '#D3D3D3', color: '#000000' }}
              >
                {dropdownConfig.options.map((option) => (
                  <SelectItem key={option.id} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ),
        };
      }
      return column;
    });
  }, [columns, dropdownConfig]);

  const table = useReactTable({
    data,
    columns: enhancedColumns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    enableRowSelection: selectable,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  return (
    <TableUI
      table={table}
      filterColumn={filterColumn}
      columns={enhancedColumns}
    />
  );
}
