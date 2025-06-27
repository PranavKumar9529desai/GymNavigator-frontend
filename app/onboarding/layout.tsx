import Image from 'next/image';
import { GradientBackground } from '../../components/theme/GradientBackground';

export default function OnboardingLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<GradientBackground className='flex h-screen w-full justify-center items-center'>

			{children}
		</GradientBackground>
	);
}
