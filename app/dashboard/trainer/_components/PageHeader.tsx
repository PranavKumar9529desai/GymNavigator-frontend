import React from 'react';

interface PageHeaderProps {
	title: string;
	description?: string;
}

export default function PageHeader({ title, description }: PageHeaderProps) {
	return (
		<div className="space-y-2">
			<h1 className="text-2xl sm:text-3xl font-bold tracking-tight">{title}</h1>
			{description && <p className="text-muted-foreground">{description}</p>}
		</div>
	);
}
