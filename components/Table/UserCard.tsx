import { Card } from '@/components/ui/card';
import type { DataCardProps } from './table.types';

// Add interface for base data type
interface BaseData {
	id: string | number;
}

export function DataCard<TData extends BaseData>({ data, renderCard }: DataCardProps<TData>) {
	return (
		<div className="space-y-4">
			{data.map((item) => (
				<Card key={item.id}>{renderCard(item)}</Card>
			))}
		</div>
	);
}
