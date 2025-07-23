'use client';

import { Badge } from '@/components/ui/badge';
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
	statusBadgeVariants,
	statusColorClasses,
	statusLabels,
} from '@/lib/constants/status-variants';
import type { UserType } from './OnboardedUsers';
import { UserActions } from './user-onboarding-actions';

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
	return (
		<div className="bg-background rounded-lg p-4 shadow-lg">
			<div className="flex justify-between items-start mb-3">
				<h3 className="text-lg font-medium line-clamp-1">{user.name}</h3>
				<UserActions
					user={user}
					isPending={isPending}
					onActivate={onActivate}
					triggerVariant="ghost"
				/>
			</div>

			<Badge
				variant={statusBadgeVariants[user.status]}
				className={cn(
					'capitalize mb-4 px-2.5 py-0.5',
					statusColorClasses[user.status].bg,
					statusColorClasses[user.status].text,
				)}
			>
				{statusLabels[user.status] || user.status}
			</Badge>

			<div className="grid grid-cols-2 gap-3 text-sm">
				<div className="space-y-1">
					<p className="font-medium text-muted-foreground">Start Date</p>
					<p className="font-medium">{formatDate(user.startDate)}</p>
				</div>
				<div className="space-y-1">
					<p className="font-medium text-muted-foreground">End Date</p>
					<p className="font-medium">{formatDate(user.endDate)}</p>
				</div>
			</div>
		</div>
	);
}
