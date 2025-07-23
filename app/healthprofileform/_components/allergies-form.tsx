'use client';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { ArrowLeft, ArrowRight, Check } from 'lucide-react';
import { useState } from 'react';
import { useHealthProfileStore } from '../_store/health-profile-store';

export default function AllergiesForm() {
	const {
		allergies,
		otherAllergy,
		toggleAllergy,
		addAllergy,
		// setOtherAllergy,
		nextStep,
		prevStep,
	} = useHealthProfileStore();

	const [newAllergy, setNewAllergy] = useState('');

	const handleAddAllergy = () => {
		if (newAllergy.trim()) {
			// Use addAllergy which now also sets otherAllergy
			addAllergy(newAllergy.trim());
			setNewAllergy('');
		}
	};

	const handleSubmit = () => {
		// Log the current allergies state from the store for debugging
		console.log('Allergies state before submit:', {
			allergies,
			otherAllergy,
		});

		// If "None" is selected, make sure it's the only one
		if (allergies.find((a) => a.id === '6' && a.selected)) {
			for (const a of allergies) {
				if (a.id !== '6' && a.selected) {
					toggleAllergy(a.id); // Unselect any other allergies
				}
			}
		}
		// If nothing is selected, select "None" by default
		else if (
			!allergies.some((allergy) => allergy.selected) &&
			!otherAllergy.trim().length
		) {
			toggleAllergy('6'); // Select "None"
		}
		nextStep();
	};

	// Detect if any allergies are selected or if there's text in otherAllergy field
	const _hasSelectedAllergies =
		allergies.some((allergy) => allergy.selected) ||
		otherAllergy.trim().length > 0;

	return (
		<div className="flex flex-col min-h-[60vh] justify-between">
			<div>
				<h1 className="text-2xl font-bold mb-2 text-gray-800">Allergies</h1>
				<p className="text-gray-500 mb-6">
					Select any food allergies that apply to you
				</p>

				<div className="space-y-4">
					{allergies.map((allergy) => (
						<div key={allergy.id} className="flex items-center space-x-3">
							<Checkbox
								id={`allergy-${allergy.id}`}
								checked={allergy.selected}
								onCheckedChange={() => toggleAllergy(allergy.id)}
								className="border-gray-300 text-blue-600 focus:ring-blue-500"
							/>
							<label
								htmlFor={`allergy-${allergy.id}`}
								className="text-base font-medium text-gray-700 cursor-pointer"
							>
								{allergy.name}
							</label>
						</div>
					))}

					<div className="pt-4 border-t border-gray-200">
						<label
							htmlFor="new-allergy-input"
							className="text-base font-medium text-gray-700 mb-2 block"
						>
							Other allergy not listed?
						</label>
						<div className="flex gap-2">
							<Input
								id="new-allergy-input"
								placeholder="Type allergy here"
								value={newAllergy}
								onChange={(e) => setNewAllergy(e.target.value)}
								className="flex-grow"
							/>
							<Button
								type="button"
								variant="outline"
								onClick={handleAddAllergy}
								disabled={!newAllergy.trim()}
								className="border-blue-300 hover:bg-blue-50"
							>
								Add
							</Button>
						</div>

						{otherAllergy && (
							<div className="mt-2 p-3 bg-blue-50 rounded-md text-blue-800 flex items-center">
								<Check size={16} className="mr-2" />
								<span>{otherAllergy}</span>
							</div>
						)}
					</div>
				</div>
			</div>

			<div className="mt-8 flex flex-col gap-3">
				<Button
					onClick={handleSubmit}
					className={cn(
						'w-full py-6 flex items-center justify-center gap-2 text-base',
						'bg-gradient-to-r from-blue-500 to-blue-600',
					)}
				>
					Continue <ArrowRight className="h-5 w-5" />
				</Button>

				<Button
					onClick={prevStep}
					variant="outline"
					className="w-full py-6 flex items-center justify-center gap-2 text-base"
				>
					<ArrowLeft className="h-5 w-5" /> Go Back
				</Button>
			</div>
		</div>
	);
}
