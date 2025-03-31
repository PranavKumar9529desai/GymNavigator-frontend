import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { type RefObject, useEffect, useState } from 'react';
import type { WorkoutPlan } from '../../_actions/generate-ai-workout';

interface WeeklyScheduleTabsProps {
	plan: WorkoutPlan;
	activeTab: string;
	setActiveTab: (tab: string) => void;
	tabsRef: RefObject<HTMLDivElement | null>;
	scrollTabs: (direction: 'left' | 'right') => void;
}

export default function WeeklyScheduleTabs({
	plan,
	activeTab,
	setActiveTab,
	tabsRef,
	scrollTabs,
}: WeeklyScheduleTabsProps) {
	// Track if scrolling is possible
	const [canScrollLeft, setCanScrollLeft] = useState(false);
	const [canScrollRight, setCanScrollRight] = useState(false);

	// Check scroll position on mount and when content changes
	useEffect(() => {
		const checkScrollPosition = () => {
			if (tabsRef.current) {
				const { scrollLeft, scrollWidth, clientWidth } = tabsRef.current;
				setCanScrollLeft(scrollLeft > 0);
				setCanScrollRight(scrollLeft + clientWidth < scrollWidth);
			}
		};

		checkScrollPosition();

		// Set up scroll event listener to update scroll buttons state
		const currentTabsRef = tabsRef.current;
		if (currentTabsRef) {
			currentTabsRef.addEventListener('scroll', checkScrollPosition);
			return () =>
				currentTabsRef.removeEventListener('scroll', checkScrollPosition);
		}
	}, [tabsRef]);

	// Directly use the parent component's scrollTabs function
	const handleScrollLeft = () => scrollTabs('left');
	const handleScrollRight = () => scrollTabs('right');

	return (
		<div className="relative">
			<div className="flex items-center justify-between mb-2 pb-2 border-b">
				<h3 className="font-medium text-base sm:text-lg">Weekly Schedule</h3>
				<div className="flex items-center gap-1">
					<Button
						type="button"
						variant="ghost"
						size="icon"
						onClick={handleScrollLeft}
						className={`h-8 w-8 rounded-full ${
							canScrollLeft
								? 'text-indigo-700 hover:bg-indigo-50 dark:hover:bg-indigo-900/20'
								: 'text-gray-400 cursor-not-allowed'
						}`}
						disabled={!canScrollLeft}
					>
						<ChevronLeft className="h-4 w-4" />
					</Button>
					<Button
						type="button"
						variant="ghost"
						size="icon"
						onClick={handleScrollRight}
						className={`h-8 w-8 rounded-full ${
							canScrollRight
								? 'text-indigo-700 hover:bg-indigo-50 dark:hover:bg-indigo-900/20'
								: 'text-gray-400 cursor-not-allowed'
						}`}
						disabled={!canScrollRight}
					>
						<ChevronRight className="h-4 w-4" />
					</Button>
				</div>
			</div>

			<div className="w-full relative">
				{/* Fade indicators for scrollable content */}
				<div className="absolute left-0 top-0 bottom-0 w-6 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
				<div className="absolute right-0 top-0 bottom-0 w-6 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />

				<div className="w-full overflow-x-auto pb-3 scrollbar-hide">
					<div
						ref={tabsRef}
						className="flex gap-2 pb-1 min-w-full px-2"
						style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
					>
						{plan.schedules.map((schedule) => (
							<button
								key={schedule.dayOfWeek}
								type="button"
								onClick={() => setActiveTab(schedule.dayOfWeek)}
								className={`flex flex-col items-center justify-center min-h-[5rem] min-w-[5rem] w-[5rem] sm:h-24 sm:w-24 rounded-xl text-sm transition-all ${
									activeTab === schedule.dayOfWeek
										? 'bg-indigo-500/10 dark:bg-indigo-500/20 shadow-sm border-0'
										: 'bg-white dark:bg-gray-900 hover:bg-indigo-50 dark:hover:bg-indigo-900/10 border border-gray-200 dark:border-gray-800'
								}`}
							>
								<div
									className={`flex items-center justify-center w-8 h-8 rounded-full mb-1.5 text-white ${
										activeTab === schedule.dayOfWeek
											? 'bg-indigo-600 shadow-md'
											: 'bg-indigo-500/80'
									}`}
								>
									{schedule.dayOfWeek.slice(0, 1)}
								</div>
								<span
									className={`font-medium ${activeTab === schedule.dayOfWeek ? 'text-indigo-700 dark:text-indigo-300' : ''}`}
								>
									{schedule.dayOfWeek.slice(0, 3)}
								</span>
								<span className="text-xs mt-0.5 max-w-full px-1 truncate opacity-80">
									{schedule.muscleTarget.split(' ')[0]}
								</span>
							</button>
						))}
					</div>
				</div>

				{/* Page indicator dots */}
				<div className="flex justify-center gap-1 mt-1">
					{plan.schedules.map((schedule, index) => (
						<span
							key={`dot-${schedule.dayOfWeek + index}`}
							className={`h-1.5 rounded-full transition-all ${
								activeTab === schedule.dayOfWeek
									? 'w-4 bg-indigo-600'
									: 'w-1.5 bg-gray-300 dark:bg-gray-700'
							}`}
							aria-hidden="true"
						/>
					))}
				</div>
			</div>
		</div>
	);
}
