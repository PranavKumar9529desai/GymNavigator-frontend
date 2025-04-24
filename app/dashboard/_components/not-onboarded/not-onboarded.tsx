import Image from 'next/image';
import Link from 'next/link';
import NotOnboardedImage from './_assests/not-onboarded.png';
export default function NotOnboarded() {
	return (
		<div className="space-y-4">
			<div className="relative w-full max-w-sm h-80  mx-auto">
				<Image
					src={NotOnboardedImage}
					alt="not-onbaorded-image"
					className="object-cover object-center"
					fill
				/>
			</div>
			<div
				className="text-center text-lg font-['latin'] font-semibold
        text-red-600"
			>
				<span className="px-4 py-2 ">You're not onboarded yet!</span>
			</div>
			<div className="text-center bg-green-500 text-white w-60 rounded-lg px--4 py-2 mx-auto ">
				<Link type="link" className="text-base" href="/onboarding/client">
					Click here to get Onboarded
				</Link>
			</div>
		</div>
	);
}
