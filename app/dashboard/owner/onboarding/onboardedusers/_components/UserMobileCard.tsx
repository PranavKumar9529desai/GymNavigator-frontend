'use client';

import { Badge } from "@/components/ui/badge";

import { Button } from '@/components/ui/button';
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { cn } from '@/lib/utils';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MoreVertical } from 'lucide-react';
import { statusBadgeVariants, statusColorClasses, statusLabels } from '@/lib/constants/status-variants';
import type { UserType } from './OnboardedUsers';

interface UserMobileCardProps {
	user: UserType;
	isPending: boolean;
	onActivate: (userId: number) => void;
}

const formatDate = (date: Date | null): string => {
	if (!date) return 'N/A';
	return new Date(date).toLocaleDateString('en-GB', {
		day: '2-digit',
		month: '2-digit',
		year: 'numeric',
	});
};

export function UserMobileCard({
	user,
	isPending,
	onActivate,
}: UserMobileCardProps) {
	// Use shared status variants from constants

	return (
		<Card>
			<CardHeader>
				<div className="flex justify-between items-start">
					<CardTitle className="text-lg">{user.name}</CardTitle>
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button variant="ghost" className="h-8 w-8 p-0" disabled={isPending}>
								<span className="sr-only">Open menu</span>
								<MoreVertical className="h-4 w-4" />
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="end">
							<DropdownMenuItem
								onClick={() => onActivate(user.id)}
								disabled={isPending || user.status === 'active'}
							>
								Activate for 1 year
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				</div>
				<Badge 
					variant={statusBadgeVariants[user.status]} 
					className={cn(
						"capitalize w-fit", 
						statusColorClasses[user.status].bg, 
						statusColorClasses[user.status].text
					)}
				>
					{statusLabels[user.status] || user.status}
				</Badge>
			</CardHeader>
			<CardContent>
				<div className="grid grid-cols-2 gap-4 text-sm">
					<div>
						<p className="font-medium">Start Date</p>
						<p>{formatDate(user.startDate)}</p>
					</div>
					<div>
						<p className="font-medium">End Date</p>
						<p>{formatDate(user.endDate)}</p>
					</div>
				</div>
			</CardContent>
		</Card>
	);
}
