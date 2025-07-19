'use client';

import { Star } from 'lucide-react';

interface FeatureToggleProps {
	isFeatured: boolean;
	onToggle: (featured: boolean) => void;
	disabled?: boolean;
}

export function FeatureToggle({ isFeatured, onToggle, disabled = false }: FeatureToggleProps) {
	return (
		<button
			onClick={() => onToggle(!isFeatured)}
			disabled={disabled}
			className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-200 ${
				isFeatured
					? 'bg-gradient-to-r from-yellow-400 to-orange-400 text-white shadow-md'
					: 'bg-slate-100 text-slate-600 hover:bg-slate-200'
			} ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
		>
			<Star className={`h-4 w-4 ${isFeatured ? 'fill-current' : ''}`} />
			<span className="text-sm font-medium">
				{isFeatured ? 'Featured' : 'Make Featured'}
			</span>
		</button>
	);
} 