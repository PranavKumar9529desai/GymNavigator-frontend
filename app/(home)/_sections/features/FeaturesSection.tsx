import { FlipCard } from './FlipCard';

const features = [
	{
		title: 'Smart QR Attendance',
		description:
			'Revolutionary QR-based attendance system. Generate daily unique codes for seamless check-ins and automated tracking.',
	},
	{
		title: 'Personalized Diet',
		description:
			'Custom nutrition plans tailored to individual goals. Track meals and get real-time recommendations for optimal results.',
	},
	{
		title: 'Trainer Assignment Hub',
		description:
			'Effortlessly manage trainer-member relationships. Streamline communications and track progress in real-time.',
	},
	{
		title: 'Personalized Fitness Journey',
		description:
			'Custom workout plans and diet charts tailored to each member. Track progress and adjust goals dynamically.',
	},
	{
		title: 'Advanced Analytics',
		description:
			'Comprehensive insights into attendance patterns, member engagement, and business performance metrics.',
	},
	{
		title: 'Member Portal',
		description:
			'Empower members with easy access to workouts, diet plans, and attendance history through a dedicated portal.',
	},
];

export default function FeaturesSection() {
	return (
		<section className="py-24 bg-gradient-to-b from-gray-950 to-black relative overflow-hidden">
			<div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:50px]" />
			<div className="container mx-auto px-4 relative z-10">
				<div className="text-center mb-20">
					<h2 className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-violet-500 to-fuchsia-500 mb-6">
						Powerful Features
					</h2>
					<p className="text-lg text-zinc-400 max-w-2xl mx-auto">
						Experience the future of gym management with our comprehensive suite
						of features
					</p>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
					{features.map((feature, idx) => (
						<FlipCard
							key={idx as number}
							title={feature.title}
							description={feature.description}
						/>
					))}
				</div>
			</div>

			<div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-transparent to-transparent pointer-events-none" />
		</section>
	);
}
