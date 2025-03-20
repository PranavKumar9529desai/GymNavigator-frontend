import { Moon, Sparkles } from "lucide-react";

export const RestDay = () => {
	return (
		<div className="w-full">
			{/* Header Section with Gradient Background */}
			<div className="relative mb-6 rounded-2xl overflow-hidden">
				<div className="bg-gradient-to-r from-purple-500 to-indigo-600 p-6">
					<div className="flex items-center gap-3 mb-2">
						<div className="bg-white/20 p-2 rounded-full">
							<Moon className="w-5 h-5 text-white" />
						</div>
						<h2 className="text-2xl font-bold text-white">Rest Day</h2>
					</div>
					<p className="text-purple-100">Take time to recover and recharge for your next workout</p>
					
					{/* Rest Day Benefits */}
					<div className="flex flex-wrap gap-4 mt-4">
						<div className="bg-white/10 rounded-lg px-3 py-2 text-white flex items-center gap-2">
							<Sparkles className="w-4 h-4" />
							<span>Muscle Recovery</span>
						</div>
						<div className="bg-white/10 rounded-lg px-3 py-2 text-white flex items-center gap-2">
							<Sparkles className="w-4 h-4" />
							<span>Energy Replenishment</span>
						</div>
					</div>
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

			{/* Rest Day Content */}
			<div className="bg-white rounded-xl border border-gray-100 p-6">
				<div className="text-center">
					<div className="bg-purple-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
						<Moon className="w-8 h-8 text-purple-600" />
					</div>
					<h3 className="text-xl font-semibold text-gray-900 mb-2">Enjoy Your Rest Day</h3>
					<p className="text-gray-600 mb-4">
						Rest days are essential for muscle recovery and overall fitness progress. 
						Use this time to focus on:
					</p>
					<ul className="text-left space-y-2 text-gray-600 mb-6">
						<li className="flex items-center gap-2">
							<span className="w-2 h-2 bg-purple-500 rounded-full"></span>
							Proper nutrition and hydration
						</li>
						<li className="flex items-center gap-2">
							<span className="w-2 h-2 bg-purple-500 rounded-full"></span>
							Quality sleep (7-9 hours)
						</li>
						<li className="flex items-center gap-2">
							<span className="w-2 h-2 bg-purple-500 rounded-full"></span>
							Light stretching or mobility work
						</li>
						<li className="flex items-center gap-2">
							<span className="w-2 h-2 bg-purple-500 rounded-full"></span>
							Stress management and relaxation
						</li>
					</ul>
					<p className="text-sm text-gray-500">
						Your next workout will be even more effective after proper rest!
					</p>
				</div>
			</div>
		</div>
	);
}; 