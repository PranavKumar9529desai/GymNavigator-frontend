import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Plus, Dumbbell } from 'lucide-react';
import { AnimatePresence } from 'framer-motion';
import { PlanCard } from './plan-card';
import type { PricingPlan, PlanTimeSlot } from '../_action/create-pricing-plan';

interface PlansListProps {
	plans: PricingPlan[];
	onAdd: () => void;
	onUpdate: (index: number, plan: PricingPlan) => void;
	onRemove: (index: number) => void;
}

export function PlansList({
	plans,
	onAdd,
	onUpdate,
	onRemove,
}: PlansListProps) {
	return (
		<>
			<div className="flex items-center justify-between">
				<p className="text-sm text-gray-600">
					Create pricing plans for your gym members. Featured plans will be
					highlighted to customers.
				</p>
				<Button type="button" onClick={onAdd} variant="outline">
					<Plus className="h-4 w-4 mr-2" />
					Add Plan
				</Button>
			</div>
			{plans.length === 0 ? (
				<div className="bg-gradient-to-br from-blue-50/30 via-white to-indigo-50/20 rounded-lg py-8 px-4 text-center">
					<div className="space-y-3 flex flex-col items-center">
						<div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-400 to-indigo-400 flex items-center justify-center mx-auto">
							<Dumbbell
								className="h-6 w-6 text-white"
								aria-label="No pricing plans icon"
							/>
						</div>
						<h3 className="text-lg font-semibold text-slate-800">
							No pricing plans yet
						</h3>
						<p className="text-slate-600">
							Create your first pricing plan to get started
						</p>
						<Button
							type="button"
							className="bg-blue-50 text-blue-600 border-blue-100 hover:bg-blue-50/50 rounded px-3 py-1"
							onClick={onAdd}
						>
							<Plus className="h-4 w-4 mr-2" aria-label="Add plan" />
							Create First Plan
						</Button>
					</div>
				</div>
			) : (
				<div className="space-y-4">
					<AnimatePresence>
						{plans.map((plan, index) => (
							// eslint-disable-next-line react/no-array-index-key
							<PlanCard
								key={index as number}
								plan={plan}
								index={index}
								onUpdate={onUpdate}
								onRemove={onRemove}
							/>
						))}
					</AnimatePresence>
				</div>
			)}
		</>
	);
}
