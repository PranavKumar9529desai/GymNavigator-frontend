'use client';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { ArrowLeft, ArrowRight, Check, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { useHealthProfileStore } from '../_store/health-profile-store';

interface MedicalConditionsFormProps {
	onSubmit: () => Promise<void>;
	isSubmitting: boolean;
}

export default function MedicalConditionsForm({
	onSubmit,
	isSubmitting,
}: MedicalConditionsFormProps) {
	const {
		medicalConditions,
		otherMedicalCondition,
		toggleMedicalCondition,
		// setOtherMedicalCondition,
		addMedicalCondition,
		prevStep,
	} = useHealthProfileStore();

	const [newCondition, setNewCondition] = useState('');

	const handleAddCondition = () => {
		if (newCondition.trim()) {
			// Add a new medical condition instead of just setting the "other" field
			addMedicalCondition(newCondition.trim());
			setNewCondition('');
		}
	};

	const handleSubmit = async () => {
		try {
			// If "None" is selected, make sure it's the only one
			if (medicalConditions.find((c) => c.id === '9' && c.selected)) {
				for (const c of medicalConditions) {
					if (c.id !== '9' && c.selected) {
						toggleMedicalCondition(c.id); // Unselect any other conditions
					}
				}
			}
			// If nothing is selected, select "None" by default
			else if (
				!medicalConditions.some((condition) => condition.selected) &&
				!otherMedicalCondition
			) {
				toggleMedicalCondition('9'); // Select "None"
			}

			await onSubmit();
		} catch (error) {
			console.error('Error in medical conditions form:', error);
		}
	};

	return (
		<div className="flex flex-col min-h-[60vh] justify-between">
			<div>
				<h1 className="text-2xl font-bold mb-2 text-gray-800">
					Medical Conditions
				</h1>
				<p className="text-gray-500 mb-6">
					Select any medical conditions that apply to you
				</p>

				<div className="space-y-4">
					{medicalConditions.map((condition) => (
						<div key={condition.id} className="flex items-center space-x-3">
							<Checkbox
								id={`condition-${condition.id}`}
								checked={condition.selected}
								onCheckedChange={() => toggleMedicalCondition(condition.id)}
								className="border-gray-300 text-blue-600 focus:ring-blue-500"
							/>
							<label
								htmlFor={`condition-${condition.id}`}
								className="text-base font-medium text-gray-700 cursor-pointer"
							>
								{condition.name}
							</label>
						</div>
					))}

					<div className="pt-4 border-t border-gray-200">
						<label
							htmlFor="new-condition-input"
							className="text-base font-medium text-gray-700 mb-2 block"
						>
							Other condition not listed?
						</label>
						<div className="flex gap-2">
							<Input
								id="new-condition-input"
								placeholder="Type condition here"
								value={newCondition}
								onChange={(e) => setNewCondition(e.target.value)}
								className="flex-grow"
							/>
							<Button
								type="button"
								variant="outline"
								onClick={handleAddCondition}
								disabled={!newCondition.trim()}
								className="border-blue-300 hover:bg-blue-50"
							>
								Add
							</Button>
						</div>

						{otherMedicalCondition && (
							<div className="mt-2 p-3 bg-blue-50 rounded-md text-blue-800 flex items-center">
								<Check size={16} className="mr-2" />
								<span>{otherMedicalCondition}</span>
							</div>
						)}
					</div>
				</div>
			</div>

			<div className="mt-8 flex flex-col gap-3">
				<Button
					onClick={handleSubmit}
					disabled={isSubmitting}
					className={cn(
						'w-full py-6 flex items-center justify-center gap-2 text-base',
						'bg-gradient-to-r from-blue-500 to-blue-600',
					)}
				>
					{isSubmitting ? (
						<>
							<Loader2 className="h-5 w-5 animate-spin" />
							Submitting...
						</>
					) : (
						<>
							Continue <ArrowRight className="h-5 w-5" />
						</>
					)}
				</Button>

				<Button
					onClick={prevStep}
					variant="outline"
					disabled={isSubmitting}
					className="w-full py-6 flex items-center justify-center gap-2 text-base"
				>
					<ArrowLeft className="h-5 w-5" /> Go Back
				</Button>
			</div>
		</div>
	);
}
