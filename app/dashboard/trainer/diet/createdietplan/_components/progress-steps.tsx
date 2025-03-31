import { m } from 'framer-motion';

interface ProgressStepsProps {
	currentStep: number;
}

export default function ProgressSteps({ currentStep }: ProgressStepsProps) {
	return (
		<m.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			className="max-w-4xl mx-auto mb-8"
		>
			<div className="flex justify-between">
				{[1, 2, 3].map((step) => (
					<div
						key={step}
						className={`flex items-center ${
							currentStep >= step ? 'text-green-600' : 'text-gray-400'
						}`}
					>
						<div
							className={`w-8 h-8 rounded-full flex items-center justify-center border-2 
                ${currentStep >= step ? 'border-green-600 bg-green-50' : 'border-gray-300'}`}
						>
							{step}
						</div>
						{step < 3 && (
							<div
								className={`flex-1 h-1 mx-4 ${currentStep > step ? 'bg-green-600' : 'bg-gray-300'}`}
							/>
						)}
					</div>
				))}
			</div>
		</m.div>
	);
}
