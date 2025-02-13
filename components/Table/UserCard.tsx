import { Card } from '@/components/ui/card';
import { DataCardProps } from './table.types';

export function DataCard<TData>({ data, renderCard }: DataCardProps<TData>) {
  return (
    <div className="space-y-4">
      {data.map((item, index) => (
        <Card key={index}>{renderCard(item)}</Card>
      ))}
    </div>
  );
}
