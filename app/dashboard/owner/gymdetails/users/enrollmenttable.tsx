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
import { useState, useEffect } from 'react';

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
import { columns } from './_components/enrollment-columns';
import { statusStyles, statusIcons } from './_components/status-cards';


export function EnrollmentTable({ enrollments }: EnrollmentTableProps) {
	const [sorting, setSorting] = useState<SortingState>([]);
	const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
	const [columnVisibility, setColumnVisibility] = useState<Record<string, boolean>>({
		// Hide less important columns on mobile by default
		endDate: false,
		actions: false,
	});
	const [rowSelection, setRowSelection] = useState<Record<string, boolean>>({});
	const [viewMode, setViewMode] = useState<'table' | 'card'>(typeof window !== 'undefined' && window.innerWidth < 768 ? 'card' : 'table');

	// Effect to update viewMode on window resize
	useEffect(() => {
		if (typeof window === 'undefined') return;

		const handleResize = () => {
			const isMobile = window.innerWidth < 768;
			setViewMode(isMobile ? 'card' : 'table');
		};

		window.addEventListener('resize', handleResize);

		// Initial check in case the useState hook didn't catch it correctly
		handleResize();

		return () => {
			window.removeEventListener('resize', handleResize);
		};
	}, []); // Empty dependency array means this effect runs once on mount and cleans up on unmount

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

