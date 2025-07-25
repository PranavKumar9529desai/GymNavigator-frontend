import Image from 'next/image';
import Link from 'next/link';
import type { Rolestype } from '@/types/next-auth';

import NotOnboardedImage from './_assests/not-onboarded.png';
export default function NotOnboarded({ role }: { role: Rolestype }) {
	return (
		<div className="space-y-10 sm:space-y-10">
			<div
				className="text-center text-lg font-['latin'] font-semibold
        text-red-600"
			>
				<span className="px-4 py-2 text-2xl font-semibold sm:text-3xl ">
					You're not onboarded yet!
				</span>
			</div>
			<div className="relative w-full max-w-sm h-80  mx-auto sm:h-96">
				<Image
					src={NotOnboardedImage}
					alt="not-onbaorded-image"
					className="object-cover object-center"
					fill
				/>
			</div>
			<div className="flex justify-center">
				<Link
					href={`/onboarding/${role}`}
					className="inline-block bg-green-600 hover:bg-green-700 text-white font-bold rounded-full px-5 py-2 shadow-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2 text-base tracking-wide drop-shadow-md border border-green-700"
				>
					Onboard Now
				</Link>
			</div>
		</div>
	);
}
