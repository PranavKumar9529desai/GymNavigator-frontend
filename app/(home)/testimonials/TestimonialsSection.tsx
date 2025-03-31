import { Sparkles } from 'lucide-react';
import { InfiniteMovingCards } from './InfiniteMovingCards';

const profileAvatarSrc =
	'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48Y2lyY2xlIGN4PSIyMCIgY3k9IjIwIiByPSIyMCIgZmlsbD0iIzFFNDBBRiIvPjxjaXJjbGUgY3g9IjIwIiBjeT0iMTUiIHI9IjciIGZpbGw9IiM2MEE1RkEiLz48cGF0aCBkPSJNOCAzNS41QzggMzUuNSAxMSAyNSAyMCAyNUMyOSAyNSAzMiAzNS41IDMyIDM1LjUiIHN0cm9rZT0iIzYwQTVGQSIgc3Ryb2tlV2lkdGg9IjMiLz48L3N2Zz4=';

const testimonials = [
	{
		image: profileAvatarSrc,
		quote:
			"GymNavigator transformed our daily operations. From QR attendance to AI-powered diet plans, we've seen 200% membership growth in just 6 months!",
		author: 'Arjun Patel',
		role: 'Founder, Shakti Fitness Hub',
		location: 'Mumbai',
		rating: 5,
		growth: '200%',
	},
	{
		image: profileAvatarSrc,
		quote:
			'Perfect example of digital transformation. Our trainers now focus on members instead of paperwork. Member satisfaction is at an all-time high!',
		author: 'Priya Reddy',
		role: 'Director, FitIndia Studios',
		location: 'Bangalore',
		rating: 5,
		growth: '150%',
	},
	{
		image: profileAvatarSrc,
		quote:
			"AI-driven analytics took our gym's performance to new heights. Revenue increased by 80% within the first quarter of implementation.",
		author: 'Kabir Singh',
		role: 'CEO, PowerFlex Gyms',
		location: 'Delhi',
		rating: 5,
		growth: '80%',
	},
	{
		image: profileAvatarSrc,
		quote:
			'Personalized diet plans and workout tracking doubled our member success rate. The automated progress updates keep members motivated!',
		author: 'Meera Desai',
		role: 'Nutritionist & Owner',
		location: 'Pune',
		rating: 5,
		growth: '120%',
	},
	{
		image: profileAvatarSrc,
		quote:
			'Cloud-based management system helped unite our multi-branch gyms seamlessly. Managing multiple locations has never been easier.',
		author: 'Rajesh Malhotra',
		role: 'Chain Owner, StrongLife',
		location: 'Hyderabad',
		rating: 5,
		growth: '175%',
	},
];

export default function TestimonialsSection() {
	return (
		<section className="py-12 sm:py-24 bg-gradient-to-b from-black to-gray-950 relative overflow-hidden">
			<div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:50px]" />
			<div className="container mx-auto px-4 relative z-10">
				<div className="text-center mb-10 sm:mb-20">
					<div className="inline-flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full bg-blue-500/10 border border-blue-500/20 mb-4">
						<Sparkles className="w-3 h-3 sm:w-4 sm:h-4 text-blue-400" />
						<span className="text-xs sm:text-sm text-blue-400">
							Success Stories
						</span>
					</div>
					<h2 className="text-3xl sm:text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 mb-4 sm:mb-6">
						Transforming Fitness Business Across India
					</h2>
					<p className="text-base sm:text-lg text-zinc-400 max-w-2xl mx-auto px-4">
						Join the community of successful gym owners who revolutionized their
						business with GymNavigator
					</p>
				</div>

				<div className="relative h-[400px] sm:h-[500px] w-full overflow-hidden rounded-lg sm:rounded-xl">
					<div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent z-20 pointer-events-none" />
					<InfiniteMovingCards
						items={testimonials}
						direction="right"
						speed="slow"
					/>
				</div>
			</div>
		</section>
	);
}
