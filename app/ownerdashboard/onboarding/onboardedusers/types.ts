import {
  ColumnDef,
  Table,
  Row,
  SortingState,
  ColumnFiltersState,
} from '@tanstack/react-table';
import { LucideIcon } from 'lucide-react';

export type EnrollmentStatus = 'active' | 'pending' | 'inactive';

export interface Enrollment {
  id: string;
  userId?: string;
  userName?: string;
  planName?: string;
  startDate: Date;
  endDate: Date;
  status: EnrollmentStatus;
  amount?: number;
}

export interface EnrollmentTableProps {
  enrollments: Enrollment[];
  setEnrollments: (enrollments: Enrollment[]) => void;
}

export interface StatsCardProps {
  title: string;
  value: string | number;
  Icon: LucideIcon;
  gradient: string;
}

export interface TableProps {
  table: Table<Enrollment>;
  row: Row<Enrollment>;
}

export type EnrollmentColumn = ColumnDef<Enrollment>;

export interface TableState {
  sorting: SortingState;
  columnFilters: ColumnFiltersState;
  columnVisibility: Record<string, boolean>;
  rowSelection: Record<string, boolean>;
}
