import { GradientBackground } from "@/components/theme/GradientBackground";
import { GradientText } from "@/components/theme/GradientText";
import { gymTheme } from "@/styles/theme";
import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";

interface SelectGymLayoutProps {
	children: ReactNode;
}

export default function SelectGymLayout({ children }: SelectGymLayoutProps) {
	return (
		<GradientBackground className="min-h-screen py-8 px-4">
			<div className="container mx-auto">
				{/* Header with Logo and Title */}
				<header className="flex flex-col sm:flex-row items-center justify-center sm:justify-start gap-4 mb-12">
					<Link href="/" className="flex items-center gap-3">
						<div className="relative w-12 h-12 overflow-hidden rounded-lg border border-white/20 shadow-lg">
							<Image
								src="/public/apple-touch-icon.png"
								alt="GymNavigator Logo"
								fill
								sizes="48px"
								className="object-cover"
								priority
							/>
						</div>
						<div className="flex flex-col">
							<span
								className={`font-bold text-xl ${gymTheme.colors.text.primary}`}
							>
								Gym<GradientText>Navigator</GradientText>
							</span>
							<span className={`text-sm ${gymTheme.colors.text.muted}`}>
								Select your gym
							</span>
						</div>
					</Link>
				</header>

				{/* Main content */}
				<main className="bg-black/30 backdrop-blur-md rounded-2xl border border-white/10 p-6 sm:p-8 shadow-xl max-w-4xl mx-auto">
					{children}
				</main>

				{/* Footer */}
				<footer className="mt-12 text-center">
					<p className={`text-sm ${gymTheme.colors.text.muted}`}>
						© {new Date().getFullYear()} GymNavigator. All rights reserved.
					</p>
				</footer>
			</div>
		</GradientBackground>
	);
}

export const metadata = {
	title: "Select Gym | GymNavigator",
	description: "Choose a gym to continue with GymNavigator",
};
