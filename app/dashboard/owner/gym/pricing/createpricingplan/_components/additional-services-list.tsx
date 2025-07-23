import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Plus, Calendar } from 'lucide-react';
import { AdditionalServiceCard } from './additional-service-card';
import type { AdditionalService } from '../_action/create-pricing-plan';

interface AdditionalServicesListProps {
	services: AdditionalService[];
	onAdd: () => void;
	onUpdate: (index: number, field: keyof AdditionalService, value: string) => void;
	onRemove: (index: number) => void;
}

export function AdditionalServicesList({ services, onAdd, onUpdate, onRemove }: AdditionalServicesListProps) {
	return (
		<>
			<div className="flex items-center justify-between">
				<p className="text-sm text-gray-600">
					Manage additional services like personal training, day passes, etc.
				</p>
				<Button type="button" onClick={onAdd} variant="outline">
					<Plus className="h-4 w-4 mr-2" />
					Add Service
				</Button>
			</div>
			{services.length === 0 ? (
				<div className="bg-gradient-to-br from-blue-50/30 via-white to-indigo-50/20 rounded-lg py-8 px-4 text-center">
					<div className="space-y-3 flex flex-col items-center">
						<div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-400 to-indigo-400 flex items-center justify-center mx-auto">
							<Calendar className="h-6 w-6 text-white" aria-label="No additional services icon" />
						</div>
						<h3 className="text-lg font-semibold text-slate-800">No additional services</h3>
						<p className="text-slate-600">Add services like personal training or day passes</p>
						<Button
							onClick={onAdd}
							variant="outline"
							className="bg-blue-50 text-blue-600 border-blue-100 hover:bg-blue-50/50"
							role="button"
							tabIndex={0}
							onKeyDown={e => { if (e.key === 'Enter') onAdd(); }}
						>
							<Plus className="h-4 w-4 mr-2" aria-label="Add service" />
							Add Service
						</Button>
					</div>
				</div>
			) : (
				<div className="grid gap-4">
					{services.map((service, index) => (
						<AdditionalServiceCard
							key={service.name + index}
							service={service}
							index={index}
							onUpdate={onUpdate}
							onRemove={onRemove}
						/>
					))}
				</div>
			)}
		</>
	);
} 