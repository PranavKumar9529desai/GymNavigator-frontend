import Image from 'next/image';
import Link from 'next/link';
import NotOnboardedImage from './_assests/not-onboarded.png';
export default function NotOnboarded() {
	return (
		<div className="space-y-4">
			<div
				className="text-center text-lg font-['latin'] font-semibold
        text-red-600"
			>
				<span className="px-4 py-2 text-xl">You're not onboarded yet!</span>
			</div>
			<div className="relative w-full max-w-sm h-80  mx-auto">
				<Image
					src={NotOnboardedImage}
					alt="not-onbaorded-image"
					className="object-cover object-center"
					fill
				/>
			</div>
			<div className="flex justify-center">
				<Link
					href="/onboarding/client"
					className="inline-block bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold rounded-lg px-6 py-3 shadow-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2"
				>
					Get Started with Onboarding
				</Link>
			</div>
		</div>
	);
}
