'use client';
import {
	type ColumnDef,
	type ColumnFiltersState,
	type SortingState,
	flexRender,
	getCoreRowModel,
	getFilteredRowModel,
	getPaginationRowModel,
	getSortedRowModel,
	useReactTable,
} from '@tanstack/react-table';
import { 
	ArrowUpDown, 
	ChevronDown, 
	MoreHorizontal, 
	Search, 
	SlidersHorizontal,
	CheckCircle2,
	Clock,
	XCircle
} from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
	DropdownMenu,
	DropdownMenuCheckboxItem,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import type {
	Enrollment,
	EnrollmentStatus,
	EnrollmentTableProps,
} from './types';

const statusIcons = {
	active: CheckCircle2,
	pending: Clock,
	inactive: XCircle,
};

const statusStyles: Record<EnrollmentStatus, { bg: string, text: string, border: string }> = {
	active: { 
		bg: 'bg-green-100 dark:bg-green-900/20', 
		text: 'text-green-800 dark:text-green-400',
		border: 'border-green-200 dark:border-green-800'
	},
	pending: { 
		bg: 'bg-yellow-100 dark:bg-yellow-900/20', 
		text: 'text-yellow-800 dark:text-yellow-400',
		border: 'border-yellow-200 dark:border-yellow-800'
	},
	inactive: { 
		bg: 'bg-red-100 dark:bg-red-900/20', 
		text: 'text-red-800 dark:text-red-400',
		border: 'border-red-200 dark:border-red-800'
	},
};

export function EnrollmentTable({ enrollments }: EnrollmentTableProps) {
	const [sorting, setSorting] = useState<SortingState>([]);
	const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
	const [columnVisibility, setColumnVisibility] = useState<Record<string, boolean>>({
		// Hide less important columns on mobile by default
		endDate: false,
		actions: false,
	});
	const [rowSelection, setRowSelection] = useState<Record<string, boolean>>({});
	const [viewMode, setViewMode] = useState<'table' | 'card'>('table');

	const columns: ColumnDef<Enrollment>[] = [
		{
			id: 'select',
			header: ({ table }) => (
				<Checkbox
					checked={
						table.getIsAllPageRowsSelected() ||
						(table.getIsSomePageRowsSelected() && 'indeterminate')
					}
					onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
					aria-label="Select all"
					className="translate-y-[2px]"
				/>
			),
			cell: ({ row }) => (
				<Checkbox
					checked={row.getIsSelected()}
					onCheckedChange={(value) => row.toggleSelected(!!value)}
					aria-label="Select row"
					className="translate-y-[2px]"
				/>
			),
			enableSorting: false,
			enableHiding: false,
		},
		{
			accessorKey: 'userName',
			header: ({ column }) => {
				return (
					<Button
						variant="ghost"
						onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
						className="text-xs md:text-sm font-medium"
					>
						User Name
						<ArrowUpDown className="ml-2 h-3 w-3 md:h-4 md:w-4" />
					</Button>
				);
			},
			cell: ({ row }) => (
				<div className="text-xs md:text-sm font-medium">{row.getValue('userName')}</div>
			),
		},
		{
			accessorKey: 'startDate',
			header: ({ column }) => (
				<Button
					variant="ghost"
					onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
					className="text-xs md:text-sm font-medium"
				>
					Start Date
					<ArrowUpDown className="ml-2 h-3 w-3 md:h-4 md:w-4" />
				</Button>
			),
			cell: ({ row }) => {
				const date = new Date(row.getValue('startDate'));
				return <div className="text-xs md:text-sm">{date.toLocaleDateString()}</div>;
			},
		},
		{
			accessorKey: 'endDate',
			header: ({ column }) => (
				<Button
					variant="ghost"
					onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
					className="text-xs md:text-sm font-medium"
				>
					End Date
					<ArrowUpDown className="ml-2 h-3 w-3 md:h-4 md:w-4" />
				</Button>
			),
			cell: ({ row }) => {
				const date = new Date(row.getValue('endDate'));
				return <div className="text-xs md:text-sm">{date.toLocaleDateString()}</div>;
			},
		},
		{
			accessorKey: 'status',
			header: ({ column }) => (
				<Button
					variant="ghost"
					onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
					className="text-xs md:text-sm font-medium"
				>
					Status
					<ArrowUpDown className="ml-2 h-3 w-3 md:h-4 md:w-4" />
				</Button>
			),
			cell: ({ row }) => {
				const status = row.getValue('status') as EnrollmentStatus;
				const StatusIcon = statusIcons[status];
				return (
					<div className="flex items-center">
						<Badge 
							variant="outline" 
							className={`
								flex items-center gap-1 px-2 py-1 text-[10px] md:text-xs font-medium
								${statusStyles[status].bg} ${statusStyles[status].text} ${statusStyles[status].border}
							`}
						>
							<StatusIcon className="h-3 w-3 md:h-3.5 md:w-3.5" />
							{status.charAt(0).toUpperCase() + status.slice(1)}
						</Badge>
					</div>
				);
			},
		},
		{
			id: 'actions',
			enableHiding: false,
			cell: ({ row }) => {
				const enrollment = row.original;

				return (
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button variant="ghost" className="h-6 w-6 md:h-8 md:w-8 p-0">
								<span className="sr-only">Open menu</span>
								<MoreHorizontal className="h-3 w-3 md:h-4 md:w-4" />
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="end" className="w-[160px]">
							<DropdownMenuLabel className="text-xs">Actions</DropdownMenuLabel>
							<DropdownMenuItem
								onClick={() =>
									navigator.clipboard.writeText(enrollment.id.toString())
								}
								className="text-xs"
							>
								Copy user ID
							</DropdownMenuItem>
							<DropdownMenuSeparator />
							<DropdownMenuItem className="text-xs">View user details</DropdownMenuItem>
							<DropdownMenuItem className="text-xs">Update enrollment</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				);
			},
		},
	];

	const table = useReactTable({
		data: enrollments,
		columns,
		onSortingChange: setSorting,
		onColumnFiltersChange: setColumnFilters,
		getCoreRowModel: getCoreRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		getSortedRowModel: getSortedRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		onColumnVisibilityChange: setColumnVisibility,
		onRowSelectionChange: setRowSelection,
		state: {
			sorting,
			columnFilters,
			columnVisibility,
			rowSelection,
		},
	});

	return (
		<div className="w-full space-y-4">
			<div className="flex flex-col md:flex-row items-center justify-between gap-4">
				<div className="relative w-full md:max-w-sm">
					<Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
					<Input
						placeholder="Search users..."
						value={(table.getColumn('userName')?.getFilterValue() as string) ?? ''}
						onChange={(event) =>
							table.getColumn('userName')?.setFilterValue(event.target.value)
						}
						className="w-full pl-9 text-xs md:text-sm"
					/>
				</div>
				<div className="flex items-center gap-2 w-full md:w-auto">
					<Button 
						variant={viewMode === 'table' ? 'default' : 'outline'} 
						size="sm" 
						onClick={() => setViewMode('table')}
						className="text-xs md:text-sm"
					>
						Table
					</Button>
					<Button 
						variant={viewMode === 'card' ? 'default' : 'outline'} 
						size="sm" 
						onClick={() => setViewMode('card')}
						className="text-xs md:text-sm"
					>
						Cards
					</Button>
					<Separator orientation="vertical" className="h-6" />
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button variant="outline" size="sm" className="text-xs md:text-sm">
								<SlidersHorizontal className="mr-2 h-3.5 w-3.5" />
								View
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="end" className="w-[160px]">
							{table
								.getAllColumns()
								.filter((column) => column.getCanHide())
								.map((column) => {
									return (
										<DropdownMenuCheckboxItem
											key={column.id}
											className="capitalize text-xs"
											checked={column.getIsVisible()}
											onCheckedChange={(value) =>
												column.toggleVisibility(!!value)
											}
										>
											{column.id}
										</DropdownMenuCheckboxItem>
									);
								})}
						</DropdownMenuContent>
					</DropdownMenu>
				</div>
			</div>

			{viewMode === 'table' ? (
				<div className="rounded-lg border overflow-hidden bg-background">
					<Table>
						<TableHeader>
							{table.getHeaderGroups().map((headerGroup) => (
								<TableRow key={headerGroup.id}>
									{headerGroup.headers.map((header) => {
										return (
											<TableHead key={header.id} className="p-2 md:p-4">
												{header.isPlaceholder
													? null
													: flexRender(
															header.column.columnDef.header,
															header.getContext(),
														)}
											</TableHead>
										);
									})}
								</TableRow>
							))}
						</TableHeader>
						<TableBody>
							{table.getRowModel().rows?.length ? (
								table.getRowModel().rows.map((row) => (
									<TableRow
										key={row.id}
										data-state={row.getIsSelected() && 'selected'}
										className="hover:bg-muted/50"
									>
										{row.getVisibleCells().map((cell) => (
											<TableCell key={cell.id} className="p-2 md:p-4">
												{flexRender(
													cell.column.columnDef.cell,
													cell.getContext(),
												)}
											</TableCell>
										))}
									</TableRow>
								))
							) : (
								<TableRow>
									<TableCell
										colSpan={columns.length}
										className="h-24 text-center text-xs md:text-sm"
									>
										No results.
									</TableCell>
								</TableRow>
							)}
						</TableBody>
					</Table>
				</div>
			) : (
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
					{table.getRowModel().rows?.length ? (
						table.getRowModel().rows.map((row) => {
							const enrollment = row.original;
							const status = enrollment.status;
							const StatusIcon = statusIcons[status];
							
							return (
								<Card 
									key={row.id} 
									className={`
										overflow-hidden transition-all duration-200
										${row.getIsSelected() ? 'ring-2 ring-primary' : ''}
										hover:shadow-md
									`}
								>
									<div className={`h-1.5 w-full ${statusStyles[status].bg}`} />
									<CardContent className="p-5">
										<div className="flex items-start justify-between">
											<div className="space-y-1.5">
												<h3 className="font-medium text-sm md:text-base">{enrollment.userName}</h3>
												<div className="flex flex-col text-xs text-muted-foreground space-y-1">
													<span>Start: {new Date(enrollment.startDate).toLocaleDateString()}</span>
													<span>End: {new Date(enrollment.endDate).toLocaleDateString()}</span>
												</div>
											</div>
											<div className="flex items-center gap-2">
												<Badge 
													variant="outline" 
													className={`
														flex items-center gap-1 px-2 py-1 text-[10px] md:text-xs font-medium
														${statusStyles[status].bg} ${statusStyles[status].text} ${statusStyles[status].border}
													`}
												>
													<StatusIcon className="h-3 w-3 md:h-3.5 md:w-3.5" />
													{status.charAt(0).toUpperCase() + status.slice(1)}
												</Badge>
												<Checkbox
													checked={row.getIsSelected()}
													onCheckedChange={(value) => row.toggleSelected(!!value)}
													aria-label="Select enrollment"
													className="translate-y-[2px]"
												/>
											</div>
										</div>
										<div className="flex items-center justify-between mt-4">
											<Button variant="outline" size="sm" className="text-xs">
												View Details
											</Button>
											<DropdownMenu>
												<DropdownMenuTrigger asChild>
													<Button variant="ghost" size="sm" className="h-8 w-8 p-0">
														<MoreHorizontal className="h-4 w-4" />
													</Button>
												</DropdownMenuTrigger>
												<DropdownMenuContent align="end" className="w-[160px]">
													<DropdownMenuLabel className="text-xs">Actions</DropdownMenuLabel>
													<DropdownMenuItem
														onClick={() => navigator.clipboard.writeText(enrollment.id.toString())}
														className="text-xs"
													>
														Copy user ID
													</DropdownMenuItem>
													<DropdownMenuSeparator />
													<DropdownMenuItem className="text-xs">View user details</DropdownMenuItem>
													<DropdownMenuItem className="text-xs">Update enrollment</DropdownMenuItem>
												</DropdownMenuContent>
											</DropdownMenu>
										</div>
									</CardContent>
								</Card>
							);
						})
					) : (
						<div className="col-span-full text-center p-8 text-muted-foreground">
							No results found.
						</div>
					)}
				</div>
			)}

			<div className="flex flex-col md:flex-row items-center justify-between space-y-2 md:space-y-0 py-2">
				<div className="text-xs md:text-sm text-muted-foreground">
					{table.getFilteredSelectedRowModel().rows.length} of{' '}
					{table.getFilteredRowModel().rows.length} row(s) selected.
				</div>
				<div className="flex items-center space-x-2">
					<Button
						variant="outline"
						size="sm"
						onClick={() => table.previousPage()}
						disabled={!table.getCanPreviousPage()}
						className="text-xs md:text-sm"
					>
						Previous
					</Button>
					<div className="text-xs md:text-sm">
						Page {table.getState().pagination.pageIndex + 1} of{' '}
						{table.getPageCount()}
					</div>
					<Button
						variant="outline"
						size="sm"
						onClick={() => table.nextPage()}
						disabled={!table.getCanNextPage()}
						className="text-xs md:text-sm"
					>
						Next
					</Button>
				</div>
			</div>
		</div>
	);
}

// Example usage
// ... existing code ...
