import React from 'react';

interface IconProps {
	size?: number;
	className?: string;
}

export function BreakfastIcon({ size = 24, className = '' }: IconProps) {
	return (
		<svg
			width={size}
			height={size}
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="1.75"
			strokeLinecap="round"
			strokeLinejoin="round"
			className={className}
			aria-hidden="true"
			role="img"
		>
			<title>Breakfast</title>
			{/* Coffee cup icon */}
			<path d="M18 8h1a4 4 0 0 1 0 8h-1" />
			<path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z" />
			<line x1="6" y1="1" x2="6" y2="4" />
			<line x1="10" y1="1" x2="10" y2="4" />
			<line x1="14" y1="1" x2="14" y2="4" />
		</svg>
	);
}

export function LunchIcon({ size = 24, className = '' }: IconProps) {
	return (
		<svg
			width={size}
			height={size}
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="1.75"
			strokeLinecap="round"
			strokeLinejoin="round"
			className={className}
			aria-hidden="true"
			role="img"
		>
			<title>Lunch</title>
			{/* Utensils icon */}
			<path d="M3 6l5 5" />
			<path d="M3 10l5-5" />
			<path d="M7 3v10" />
			<path d="M21 3v18" />
			<path d="M18 12c0-5 3-9 0-9-2 0-3 2-3 9v3l3 3 3-3v-3c0-7-1-9-3-9-3 0 0 4 0 9" />
		</svg>
	);
}

export function SnackIcon({ size = 24, className = '' }: IconProps) {
	return (
		<svg
			width={size}
			height={size}
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="1.75"
			strokeLinecap="round"
			strokeLinejoin="round"
			className={className}
			aria-hidden="true"
			role="img"
		>
			<title>Snack</title>
			{/* Apple icon */}
			<path d="M12 2a4 4 0 0 0-4 4v2H7a5 5 0 0 0-5 5c0 2 1 4 5 5l.5-2.5.5 2.5c4 0 5-3 5-5s-1-3-1-5 1-2 1-4a3 3 0 0 0-3-3" />
			<path d="M12 2a4 4 0 0 1 4 4v2h1a5 5 0 0 1 5 5c0 2-1 4-5 5l-.5-2.5-.5 2.5c-4 0-5-3-5-5s1-3 1-5-1-2-1-4a3 3 0 0 1 3-3" />
			<path d="M12 2v4" />
		</svg>
	);
}

export function DinnerIcon({ size = 24, className = '' }: IconProps) {
	return (
		<svg
			width={size}
			height={size}
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="1.75"
			strokeLinecap="round"
			strokeLinejoin="round"
			className={className}
			aria-hidden="true"
			role="img"
		>
			<title>Dinner</title>
			{/* Plate with utensils icon */}
			<circle cx="12" cy="12" r="9" />
			<path d="M8 9v3c0 .55.45 1 1 1h.17" />
			<path d="M16 9c-.72 0-1.3.58-1.3 1.3 0 .72.58 1.7 1.3 1.7s1.3-.98 1.3-1.7c0-.72-.58-1.3-1.3-1.3z" />
			<path d="M10 13v5" />
			<path d="M14 13v5" />
		</svg>
	);
}

export function DefaultMealIcon({ size = 24, className = '' }: IconProps) {
	return (
		<svg
			width={size}
			height={size}
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="1.75"
			strokeLinecap="round"
			strokeLinejoin="round"
			className={className}
			aria-hidden="true"
			role="img"
		>
			<title>Meal</title>
			{/* Bowl icon */}
			<path d="M19 11H5a3 3 0 0 0-3 3v0.86c0 .62.18 1.22.52 1.73l.62 1.03c.69 1.15 1.94 1.86 3.29 1.86h11.14c1.35 0 2.6-.7 3.29-1.86l.62-1.03c.34-.51.52-1.11.52-1.73V14a3 3 0 0 0-3-3Z" />
			<path d="M8 11V7c0-2.2 1.8-4 4-4h0c2.2 0 4 1.8 4 4v4" />
		</svg>
	);
}
