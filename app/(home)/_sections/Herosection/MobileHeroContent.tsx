import { m } from 'framer-motion';
import { ArrowRight, Dumbbell, Sparkles, UserCheck, Users } from 'lucide-react';
import CustomButton from '../../_component/CustomButton';
import MobileHeroContent from './MobileHeroContent';

export default function Herosection() {
	const isMobile = window.innerWidth <= 768;

	return (
		<section className="relative overflow-hidden">
			{isMobile ? (
				<MobileHeroContent />
			) : (
				<>
					{/* Desktop-specific background elements */}
					<div className="absolute inset-0 overflow-hidden">
						<div className="absolute w-[500px] h-[500px] rounded-full bg-blue-500/10 blur-3xl animate-pulse top-[-250px] left-[-250px]" />
						<div className="absolute w-[500px] h-[500px] rounded-full bg-indigo-500/10 blur-3xl animate-pulse bottom-[-250px] right-[-250px]" />
						<m.div
							initial={{ opacity: 0 }}
							animate={{ opacity: [0.1, 0.3, 0.1] }}
							transition={{ duration: 5, repeat: Number.POSITIVE_INFINITY }}
							className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"
						/>
					</div>

					<m.div className="space-y-6 text-center relative z-10 py-8">
						{/* Title and Description */}
						<div className="space-y-4 max-w-2xl mx-auto px-4">
							<m.div
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ delay: 0.3, duration: 0.8 }}
							>
								<h1 className="text-4xl sm:text-5xl font-bold leading-tight tracking-tight">
									<span className="block mb-2 text-white/90">Elevate Your</span>
									<span className="bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 bg-clip-text text-transparent inline-block animate-gradient">
										Gym Management
									</span>
								</h1>
							</m.div>
							<m.p
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								transition={{ delay: 0.6, duration: 0.8 }}
								className="text-base text-gray-300 leading-relaxed mt-4 px-4"
							>
								Streamline operations, enhance member experience, and drive
								growth with our sophisticated management suite.
							</m.p>
						</div>

						{/* Stats Cards */}
						<m.div
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							transition={{ delay: 0.5 }}
							className="grid grid-cols-2 gap-3 mx-4"
						>
							{[
								{ label: 'Partner Gyms', value: '10+', icon: Users },
								{ label: 'Active Members', value: '100+', icon: UserCheck },
							].map((stat, i) => (
								<m.div
									key={stat.label}
									initial={{ opacity: 0, y: 20 }}
									animate={{ opacity: 1, y: 0 }}
									transition={{ delay: i * 0.2 + 0.5 }}
									className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10"
								>
									<stat.icon className="w-6 h-6 text-blue-400 mb-2" />
									<p className="text-2xl font-bold text-white">{stat.value}</p>
									<p className="text-sm text-gray-400">{stat.label}</p>
								</m.div>
							))}
						</m.div>

						{/* Feature Tags */}
						<m.div
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							transition={{ delay: 0.7 }}
							className="flex flex-wrap gap-2 justify-center px-4"
						>
							{['Easy Setup', '24/7 Support', 'Secure'].map((feature, i) => (
								<m.span
									key={feature}
									initial={{ opacity: 0, scale: 0.9 }}
									animate={{ opacity: 1, scale: 1 }}
									transition={{ delay: i * 0.1 + 0.7 }}
									className="bg-blue-500/10 text-blue-300 text-sm px-3 py-1 rounded-full border border-blue-500/20 flex items-center gap-1"
								>
									<Sparkles className="w-3 h-3" />
									{feature}
								</m.span>
							))}
						</m.div>

						{/* CTA Buttons */}
						<div className="px-4">
							<CustomButton className="w-full text-lg py-3 mb-3" />
							<m.button
								whileTap={{ scale: 0.98 }}
								className="w-full px-6 py-3 rounded-full border border-gray-700 text-gray-300 flex items-center justify-center gap-2 hover:bg-white/5 transition-all"
							>
								Watch Demo
								<ArrowRight className="w-4 h-4" />
							</m.button>
						</div>
					</m.div>

					{/* Floating Elements */}
					<div className="absolute inset-0 pointer-events-none">
						{[...Array(3)].map((_, i) => (
							<m.div
								key={`desktop-float-${i as number}`}
								className="absolute"
								initial={{ opacity: 0, scale: 0 }}
								animate={{
									opacity: [0, 1, 0],
									scale: [0.5, 1, 0.5],
									x: Math.sin(i * 45) * 100,
									y: Math.cos(i * 45) * 100,
								}}
								transition={{
									duration: 3,
									delay: i * 0.5,
									repeat: Number.POSITIVE_INFINITY,
									repeatType: 'reverse',
								}}
							>
								<div className="w-6 h-6 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 flex items-center justify-center">
									<Dumbbell className="w-3 h-3 text-white" />
								</div>
							</m.div>
						))}
					</div>
				</>
			)}
		</section>
	);
}
