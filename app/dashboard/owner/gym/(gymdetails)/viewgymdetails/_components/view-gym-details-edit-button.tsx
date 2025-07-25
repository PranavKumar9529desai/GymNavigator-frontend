import { Button } from '@/components/ui/button';
import {
	Tooltip,
	TooltipTrigger,
	TooltipContent,
} from '@/components/ui/tooltip';
import { Edit } from 'lucide-react';
import type React from 'react';

interface ViewGymDetailsEditButtonProps
	extends React.ButtonHTMLAttributes<HTMLButtonElement> {
	tooltip?: string;
}

export function ViewGymDetailsEditButton({
	tooltip = 'Edit gym details',
	className = '',
	...props
}: ViewGymDetailsEditButtonProps) {
	return (
		<Tooltip>
			<TooltipTrigger asChild>
				<Button
					type="button"
					variant="ghost"
					className={`flex items-center hover:text-blue-600 group ${className}`}
					aria-label={tooltip}
					{...props}
				>
					<Edit
						className="mr-2 text-blue-600 group-hover:text-blue-700 transition-colors"
						aria-hidden="true"
					/>
					<span className="hidden md:block">Edit Gym Details</span>
				</Button>
			</TooltipTrigger>
			<TooltipContent side="top" className="text-xs">
				{tooltip}
			</TooltipContent>
		</Tooltip>
	);
}

export default ViewGymDetailsEditButton;
