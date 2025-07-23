import type {
	ColumnDef,
	ColumnFiltersState,
	Row,
	SortingState,
	Table,
} from '@tanstack/react-table';
import type { LucideIcon } from 'lucide-react';

export type EnrollmentStatus = 'active' | 'pending';

export interface TableState {
	sorting: SortingState;
	columnFilters: ColumnFiltersState;
	columnVisibility: Record<string, boolean>;
	rowSelection: Record<string, boolean>;
}
