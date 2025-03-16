import { BackgroundBeams } from "@/components/extras/beams";
import { cn } from "@/lib/utils";
import { gymTheme } from "@/styles/theme";
import { type MotionProps, m } from "framer-motion";

interface GradientBackgroundProps extends React.HTMLAttributes<HTMLDivElement> {
	showBeams?: boolean;
	beamOpacity?: number;
	children: React.ReactNode;
	motionProps?: MotionProps;
}

export function GradientBackground({
	showBeams = true,
	beamOpacity = 0.2,
	children,
	className,
	motionProps,
	...props
}: GradientBackgroundProps) {
	return (
		<section
			className={cn(
				"relative min-h-[95vh] flex items-center overflow-hidden bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))]",
				gymTheme.colors.gradients.heroBackground,
				className,
			)}
			{...props}
		>
			{/* Mobile background elements */}
			<div className="absolute inset-0 overflow-hidden lg:hidden">
				<div className="absolute w-[300px] h-[300px] rounded-full bg-blue-500/10 blur-3xl animate-pulse top-[-150px] left-[-150px]" />
				<div className="absolute w-[300px] h-[300px] rounded-full bg-indigo-500/10 blur-3xl animate-pulse bottom-[-150px] right-[-150px]" />
				<m.div
					initial={{ opacity: 0 }}
					animate={{ opacity: [0.1, 0.3, 0.1] }}
					transition={{ duration: 5, repeat: Number.POSITIVE_INFINITY }}
					className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"
				/>
			</div>

			{children}

			{showBeams && (
				<BackgroundBeams className={`opacity-${beamOpacity * 100}`} />
			)}
		</section>
	);
}
