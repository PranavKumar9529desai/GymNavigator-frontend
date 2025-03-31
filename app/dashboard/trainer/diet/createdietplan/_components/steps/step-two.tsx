import { Slider } from '@/components/ui/slider';
import { ArcElement, Chart as ChartJS, Legend, Tooltip } from 'chart.js';
import { m } from 'framer-motion';
import { Pie } from 'react-chartjs-2';
import type { DietPlanInterface } from '../diet-plan-types';

ChartJS.register(ArcElement, Tooltip, Legend);

interface StepTwoProps {
	dietPlan: DietPlanInterface;
	setDietPlan: React.Dispatch<React.SetStateAction<DietPlanInterface>>;
}

export default function StepTwo({ dietPlan, setDietPlan }: StepTwoProps) {
	const chartData = {
		labels: ['Protein', 'Carbs', 'Fats'],
		datasets: [
			{
				data: [
					dietPlan.macroSplit.protein,
					dietPlan.macroSplit.carbs,
					dietPlan.macroSplit.fats,
				],
				backgroundColor: ['#22c55e', '#3b82f6', '#ef4444'],
				borderWidth: 0,
			},
		],
	};

	return (
		<m.div
			key="step2"
			initial={{ opacity: 0, x: -20 }}
			animate={{ opacity: 1, x: 0 }}
			exit={{ opacity: 0, x: 20 }}
			className="space-y-6"
		>
			<h2 className="text-2xl font-bold">Macro Split</h2>
			<div className="grid grid-cols-1 md:grid-cols-2 gap-8">
				<div className="space-y-6">
					<div>
						<label
							className="block text-sm font-medium mb-2"
							htmlFor="plan-protein"
						>
							Protein: {dietPlan.macroSplit.protein}%
						</label>
						<Slider
							id="plan-protein"
							defaultValue={[dietPlan.macroSplit.protein]}
							max={60}
							min={10}
							step={5}
							onValueChange={([value]) =>
								setDietPlan((prev) => ({
									...prev,
									macroSplit: { ...prev.macroSplit, protein: value },
								}))
							}
						/>
					</div>
					<div>
						<label
							className="block text-sm font-medium mb-2"
							htmlFor="plan-carbs"
						>
							Carbs: {dietPlan.macroSplit.carbs}%
						</label>
						<Slider
							id="plan-carbs"
							defaultValue={[dietPlan.macroSplit.carbs]}
							max={60}
							min={10}
							step={5}
							onValueChange={([value]) =>
								setDietPlan((prev) => ({
									...prev,
									macroSplit: { ...prev.macroSplit, carbs: value },
								}))
							}
						/>
					</div>
					<div>
						<label
							className="block text-sm font-medium mb-2"
							htmlFor="plan-fats"
						>
							Fats: {dietPlan.macroSplit.fats}%
						</label>
						<Slider
							id="plan-fats"
							defaultValue={[dietPlan.macroSplit.fats]}
							max={60}
							min={10}
							step={5}
							onValueChange={([value]) =>
								setDietPlan((prev) => ({
									...prev,
									macroSplit: { ...prev.macroSplit, fats: value },
								}))
							}
						/>
					</div>
					<div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-md">
						<p className="text-sm text-yellow-700">
							Total:{' '}
							{dietPlan.macroSplit.protein +
								dietPlan.macroSplit.carbs +
								dietPlan.macroSplit.fats}
							%
							{dietPlan.macroSplit.protein +
								dietPlan.macroSplit.carbs +
								dietPlan.macroSplit.fats !==
								100 && ' (should equal 100%)'}
						</p>
					</div>
				</div>
				<div className="flex items-center justify-center">
					<div className="w-64 h-64">
						<Pie data={chartData} />
					</div>
				</div>
			</div>
		</m.div>
	);
}
