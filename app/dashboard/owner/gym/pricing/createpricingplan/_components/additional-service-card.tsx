import * as React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Trash2, DollarSign } from 'lucide-react';
import { motion } from 'framer-motion';
import type { AdditionalService } from '../_action/create-pricing-plan';

export interface AdditionalServiceCardProps {
	service: AdditionalService;
	index: number;
	onUpdate: (index: number, field: keyof AdditionalService, value: string) => void;
	onRemove: (index: number) => void;
}

export function AdditionalServiceCard({ service, index, onUpdate, onRemove }: AdditionalServiceCardProps) {
	return (
		<motion.div
			layout
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			exit={{ opacity: 0, y: -20 }}
		>
			<Card>
				<CardHeader className="pb-3">
					<div className="flex items-center justify-between">
						<CardTitle className="text-base">{service.name || 'Untitled Service'}</CardTitle>
						<Button
							type="button"
							variant="outline"
							size="sm"
							onClick={() => onRemove(index)}
							className="text-red-500 hover:text-red-700"
						>
							<Trash2 className="h-4 w-4" />
						</Button>
					</div>
				</CardHeader>
				<CardContent className="space-y-4">
					<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
						<div className="space-y-2">
							<Label>Service Name</Label>
							<Input
								value={service.name}
								onChange={(e) => onUpdate(index, 'name', e.target.value)}
								placeholder="e.g., Personal Training"
							/>
						</div>
						<div className="space-y-2">
							<Label>Price</Label>
							<div className="relative">
								<DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
								<Input
									value={service.price}
									onChange={(e) => onUpdate(index, 'price', e.target.value)}
									placeholder="75"
									className="pl-10"
								/>
							</div>
						</div>
						<div className="space-y-2">
							<Label>Duration</Label>
							<Input
								value={service.duration}
								onChange={(e) => onUpdate(index, 'duration', e.target.value)}
								placeholder="Per session"
							/>
						</div>
					</div>
					<div className="space-y-2">
						<Label>Description (Optional)</Label>
						<Textarea
							value={service.description || ''}
							onChange={(e) => onUpdate(index, 'description', e.target.value)}
							placeholder="Describe this service..."
							rows={2}
						/>
					</div>
				</CardContent>
			</Card>
		</motion.div>
	);
} 