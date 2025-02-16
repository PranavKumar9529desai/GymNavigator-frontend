import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { LucideIcon } from 'lucide-react';

export interface StatusCardProps {
  title: string;
  value: number;
  icon: LucideIcon;
  gradient: 'blue' | 'green' | 'yellow' | 'red';
}

export interface StatusData {
  title: string;
  value: number;
  icon: LucideIcon;
}

const gradientStyles = {
  blue: 'from-blue-500 to-blue-600',
  green: 'from-green-500 to-green-600',
  yellow: 'from-yellow-500 to-yellow-600',
  red: 'from-red-500 to-red-600',
} as const;

export function StatusCard({ title, value, icon: Icon, gradient }: StatusCardProps) {
  return (
    <Card className={`bg-gradient-to-br ${gradientStyles[gradient]} text-white`}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-8 w-8 opacity-75 text-white" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
      </CardContent>
    </Card>
  );
}
