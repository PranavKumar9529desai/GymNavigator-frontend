import { Button } from '@/components/ui/button';
import { m } from 'framer-motion';
import { Plus } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import GymImage from './gym.png';
export default function NoGymDetails() {
	const router = useRouter();

	return (
		<div className="container mx-auto px-4 py-8">
			<h1 className="text-3xl font-bold text-gray-900 mb-6 w-full text-center">
				Gym Details
			</h1>
			<div className="relative h-[500px] w-full overflow-hidden rounded-lg bg-white shadow-lg">
				{/* Blurred Background Image */}
				<div className="absolute inset-0">
					<Image
						src={GymImage}
						alt="Gym Preview"
						fill
						className="object-cover blur-[2px]"
					/>
					{/* Add dark overlay */}
					<div className="absolute inset-0 bg-black/50" />
				</div>

				{/* Content Overlay */}
				<m.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					className="relative z-10 h-full flex flex-col items-center justify-center text-white p-6"
				>
					<h2 className="text-3xl font-bold mb-4 text-center text-white">
						Your Gym Profile Awaits
					</h2>
					<p className="text-lg mb-8 text-center max-w-md text-white/90">
						Create your gym profile to manage members, track progress, and grow
						your business
					</p>
					<Button
						onClick={() => router.push('/ownerdashboard/gymdetails/creategym')}
						className="bg-white text-indigo-700 hover:bg-gray-100 font-semibold px-6 py-3 rounded-lg flex items-center gap-2"
					>
						<Plus className="w-5 h-5" />
						Create Gym Profile
					</Button>
				</m.div>

				{/* Bottom Gradient Overlay */}
				<div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black/60 to-transparent" />
			</div>
		</div>
	);
}
