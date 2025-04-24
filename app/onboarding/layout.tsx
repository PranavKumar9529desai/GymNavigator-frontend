import Image from 'next/image';
import { GradientBackground } from '../../components/theme/GradientBackground';

export default function OnboardingLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<GradientBackground>
			<main className="min-h-screen w-full">
				<div className="container mx-auto px-4 py-8">
					<div className="flex flex-col items-center space-y-6 mb-8 sm:flex-row sm:space-y-0 sm:space-x-4 sm:justify-center">
						<div className="relative h-16 w-16 sm:h-20 sm:w-20">
							<Image
								src="/android-chrome-512x512.png"
								alt="GymNavigator Logo"
								fill
								priority
								className="object-contain"
							/>
						</div>
						<div className="text-center sm:text-left">
							<h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
								<span className="text-white">Gym</span>
								<span className="bg-gradient-to-r from-blue-500 to-blue-700 bg-clip-text text-transparent">
									Navigator
								</span>
							</h1>
							<p className="text-white/90 text-sm mt-1">
								Your Ultimate Gym Management Solution
							</p>
						</div>
					</div>
					{children}
				</div>
			</main>
		</GradientBackground>
	);
}
