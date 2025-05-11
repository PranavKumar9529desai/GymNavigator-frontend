import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

interface LoadingSpinnerProps extends React.HTMLAttributes<HTMLDivElement> {
	size?: 'sm' | 'md' | 'lg';
}

export function Spinner({
	className,
	size = 'md',
	...props
}: LoadingSpinnerProps) {
	return (
		<div
			className={cn(
				'animate-spin',
				size === 'sm' && 'h-4 w-4',
				size === 'md' && 'h-8 w-8',
				size === 'lg' && 'h-12 w-12',
				className,
			)}
			{...props}
		>
			<Loader2 className="h-full w-full" />
		</div>
	);
}
