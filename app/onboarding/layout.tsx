import Image from 'next/image';
import { GradientBackground } from '../../components/theme/GradientBackground';

export default function OnboardingLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (

		<div className='p-10 my-20'>

			{children}
		</div>
		// <GradientBackground className='flex h-screen w-full justify-center items-center'>
		// 	</GradientBackground>
	);
}
