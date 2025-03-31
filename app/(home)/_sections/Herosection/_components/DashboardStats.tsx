'use client';

import { GradientCard } from '@/components/theme/GradientCard';
import { gymTheme } from '@/styles/theme';
import { m } from 'framer-motion';
import { Activity, Dumbbell, UserCheck, UserCog, Users } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function DashboardStats() {
	const [isClient, setIsClient] = useState(false);

	useEffect(() => {
		setIsClient(true);
	}, []);

	if (!isClient) {
		return <div className="w-[600px] h-[600px]" />; // Loading state
	}

	const dashboardCards = [
		{
			icon: Users,
			title: 'Onboarded Users',
			value: '1,847',
			color: gymTheme.colors.gradients.primaryBlue,
			growth: '+22%',
		},
		{
			icon: UserCheck,
			title: "Today's Attendance",
			value: '234',
			color: gymTheme.colors.gradients.greenCard,
			growth: '+18%',
		},
		{
			icon: UserCog,
			title: 'Trainer Dashboard',
			value: '16',
			color: gymTheme.colors.gradients.purpleCard,
			growth: '+5%',
		},
		{
			icon: Activity,
			title: 'Active Users',
			value: '1,392',
			color: gymTheme.colors.gradients.orangeCard,
			growth: '+15%',
		},
	];

	return (
		<m.div
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			className="relative w-[600px] h-[600px] perspective-1000"
		>
			{/* Dashboard Cards */}
			<div className="grid grid-cols-2 gap-6">
				{dashboardCards.map((card, i) => (
					<GradientCard
						key={card.title}
						icon={card.icon}
						title={card.title}
						value={card.value}
						growth={card.growth}
						color={card.color}
						index={i}
					/>
				))}
			</div>

			{/* Single floating badge for minimal animation */}
			<div className="absolute inset-0 pointer-events-none">
				<m.div
					className="absolute top-1/2 left-1/2"
					initial={{ opacity: 0 }}
					animate={{
						opacity: [0, 1, 0],
						scale: [0.5, 1, 0.5],
					}}
					transition={{
						duration: 3,
						repeat: Number.POSITIVE_INFINITY,
						repeatType: 'reverse',
					}}
				>
					<div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 flex items-center justify-center">
						<Dumbbell className="w-4 h-4 text-white" />
					</div>
				</m.div>
			</div>
		</m.div>
	);
}
