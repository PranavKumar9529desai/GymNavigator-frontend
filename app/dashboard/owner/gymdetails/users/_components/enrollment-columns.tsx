import { Checkbox } from "@/components/ui/checkbox";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuLabel, DropdownMenuItem, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import type { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Enrollment, EnrollmentStatus } from "../types";
import { Badge } from "@/components/ui/badge";
import { statusIcons, statusStyles } from "./status-cards";

export const columns: ColumnDef<Enrollment>[] = [
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