import { Utensils } from 'lucide-react';

export const DietNotAssigned = () => {
	return (
		<div className="w-full">
			<div className="relative mb-6 rounded-2xl overflow-hidden">
				<div className="bg-gradient-to-r from-yellow-500 to-amber-600 p-6">
					<div className="flex items-center gap-3 mb-2">
						<div className="bg-white/20 p-2 rounded-full">
							<Utensils className="w-5 h-5 text-white" />
						</div>
						<h2 className="text-2xl font-bold text-white">Diet Plan Missing</h2>
					</div>
					<p className="text-yellow-100">
						You don't have a diet plan assigned yet
					</p>
				</div>

				{/* Decorative wave */}
				<div className="absolute bottom-0 left-0 right-0">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 1440 80"
						className="w-full h-6"
						aria-hidden="true"
						role="img"
					>
						<title>Decorative wave pattern</title>
						<path
							fill="#ffffff"
							fillOpacity="1"
							d="M0,32L80,42.7C160,53,320,75,480,74.7C640,75,800,53,960,42.7C1120,32,1280,32,1360,32L1440,32L1440,80L1360,80C1280,80,1120,80,960,80C800,80,640,80,480,80C320,80,160,80,80,80L0,80Z"
						/>
					</svg>
				</div>
			</div>

			<div className="bg-white rounded-xl border border-gray-100 p-6">
				<div className="text-center">
					<div className="w-16 h-16 bg-yellow-100 mx-auto mb-4 rounded-full flex items-center justify-center">
						<Utensils className="w-8 h-8 text-yellow-600" />
					</div>
					<h3 className="text-xl font-medium text-gray-900 mb-2">
						No Diet Plan Assigned
					</h3>
					<p className="text-gray-600 mb-6">
						You don't have a diet plan assigned yet. Your trainer needs to
						assign a diet plan for you to see your meals here.
					</p>
					<p className="text-sm text-gray-500">
						Contact your trainer to get a personalized diet plan assigned to
						your profile.
					</p>
				</div>
			</div>
		</div>
	);
};
