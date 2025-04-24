'use client';

import { CheckCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import type { HealthMetrics } from '../calculate-health-data/health-data-types';

interface SuccessFormProps {
	healthMetrics?: HealthMetrics | null;
}

export default function SuccessForm({ healthMetrics }: SuccessFormProps) {
	const _router = useRouter();
	const [_countdown, _setCountdown] = useState(5);

	// Handle automatic redirection
	//   useEffect(() => {
	//     const redirectTimer = setTimeout(() => {
	//     //   router.push('/dashboard/client');
	//     }, 5000);

	//     // Countdown timer
	//     const countdownInterval = setInterval(() => {
	//       setCountdown((prev) => Math.max(0, prev - 1));
	//     }, 1000);

	//     // Cleanup on unmount
	//     return () => {
	//       clearTimeout(redirectTimer);
	//       clearInterval(countdownInterval);
	//     };
	//   }, [router]);

	return (
		<div className="flex flex-col min-h-[70vh] items-center justify-center text-center px-4">
			<div className="flex flex-col items-center max-w-md mx-auto">
				<div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-6">
					<CheckCircle className="h-14 w-14 text-green-600" />
				</div>

				<h1 className="text-3xl font-bold mb-2 text-gray-800">
					Profile Completed!
				</h1>

				<p className="text-gray-500 mb-8">
					Your health profile has been successfully saved. We'll use this
					information to customize your fitness journey.
				</p>

				{healthMetrics && (
					<div className="w-full bg-blue-50 rounded-xl p-6 mb-8">
						<h2 className="text-lg font-bold text-blue-800 mb-4">
							Your Health Metrics
						</h2>

						<div className="grid grid-cols-2 gap-4 text-left">
							<div>
								<p className="text-sm text-gray-500">BMI</p>
								<p className="text-xl font-semibold text-gray-800">
									{healthMetrics.bmi.toFixed(1)}
								</p>
								<p className="text-xs text-gray-500">
									{healthMetrics.bmiCategory}
								</p>
							</div>

							<div>
								<p className="text-sm text-gray-500">BMR</p>
								<p className="text-xl font-semibold text-gray-800">
									{Math.round(healthMetrics.bmr)} kcal
								</p>
								<p className="text-xs text-gray-500">Base metabolic rate</p>
							</div>

							<div>
								<p className="text-sm text-gray-500">TDEE</p>
								<p className="text-xl font-semibold text-gray-800">
									{Math.round(healthMetrics.tdee)} kcal
								</p>
								<p className="text-xs text-gray-500">
									Total daily energy expenditure
								</p>
							</div>

							<div>
								<p className="text-sm text-gray-500">Target Calories</p>
								<p className="text-xl font-semibold text-gray-800">
									{Math.round(healthMetrics.targetCalories)} kcal
								</p>
								<p className="text-xs text-gray-500">
									Recommended daily intake
								</p>
							</div>
						</div>

						<h3 className="text-md font-semibold text-blue-700 mt-6 mb-3">
							Macronutrient Breakdown
						</h3>

						<div className="grid grid-cols-3 gap-4 text-left">
							<div>
								<p className="text-sm text-gray-500">Protein</p>
								<p className="text-xl font-semibold text-gray-800">
									{Math.round(healthMetrics.macros.protein)}g
								</p>
								<p className="text-xs text-gray-500">
									{Math.round(
										((healthMetrics.macros.protein * 4) /
											healthMetrics.targetCalories) *
											100,
									)}
									% of diet
								</p>
							</div>

							<div>
								<p className="text-sm text-gray-500">Carbs</p>
								<p className="text-xl font-semibold text-gray-800">
									{Math.round(healthMetrics.macros.carbs)}g
								</p>
								<p className="text-xs text-gray-500">
									{Math.round(
										((healthMetrics.macros.carbs * 4) /
											healthMetrics.targetCalories) *
											100,
									)}
									% of diet
								</p>
							</div>

							<div>
								<p className="text-sm text-gray-500">Fats</p>
								<p className="text-xl font-semibold text-gray-800">
									{Math.round(healthMetrics.macros.fat)}g ? (
								</p>
								<p className="text-xs text-gray-500">
									{Math.round(
										((healthMetrics.macros.fat * 9) /
											healthMetrics.targetCalories) *
											100,
									)}
									% of diet
								</p>
							</div>
						</div>

						<div className="mt-6 pt-4 border-t border-blue-100">
							<div className="bg-blue-100 rounded-lg p-3 mb-2">
								<h3 className="text-sm font-medium text-blue-800 mb-1">
									What does this mean?
								</h3>
								<p className="text-xs text-blue-700">
									Your BMR is the number of calories your body needs at rest.
									Your TDEE factors in your activity level. We've calculated
									your target calories based on your goals, and broken them down
									into recommended macronutrients.
								</p>
							</div>
						</div>
					</div>
				)}

				{/* <div className="mt-4 w-full">
          <div className="flex items-center justify-center gap-2 p-4 border border-blue-200 rounded-lg bg-blue-50 text-blue-700">
            {countdown > 0 ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                <p>
                  Redirecting to dashboard in {countdown} second{countdown !== 1 ? 's' : ''}...
                </p>
              </>
            ) : (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                <p>Redirecting to dashboard...</p>
              </>
            )}
          </div>
        </div> */}
			</div>
		</div>
	);
}
