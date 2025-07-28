'use client';

import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Dumbbell, X } from 'lucide-react';
import { useEffect, useState, useMemo, useCallback } from 'react';
import { cn } from '@/lib/utils';
import CalendarSkeleton from './CalendarSkeleton';

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = [
	'January',
	'February',
	'March',
	'April',
	'May',
	'June',
	'July',
	'August',
	'September',
	'October',
	'November',
	'December',
];

interface MonthAttendanceProps {
	attendanceDays: Date[];
}

export default function MonthAttendance({
	attendanceDays,
}: MonthAttendanceProps) {
	const [currentDate, setCurrentDate] = useState(new Date());
	const [progress, setProgress] = useState(0);

	// Use the attendanceDays prop directly - no loading state needed
	const gymAttendanceDays: Date[] = attendanceDays || [];

	// Create a map of gym days for faster lookups
	const gymDaysMap = useMemo(() => {
		const map = new Map<string, boolean>();
		for (const date of gymAttendanceDays) {
			// Normalize the date for consistent key generation
			const normalizedDate = new Date(
				date.getFullYear(),
				date.getMonth(),
				date.getDate(),
			);
			map.set(
				`${normalizedDate.getFullYear()}-${normalizedDate.getMonth()}-${normalizedDate.getDate()}`,
				true,
			);
		}
		return map;
	}, [gymAttendanceDays]);

	// Memoize today's date to avoid recreation on every render
	const today = useMemo(() => {
		const now = new Date();
		// Normalize to start of day for consistent comparison
		return new Date(now.getFullYear(), now.getMonth(), now.getDate());
	}, []);

	// Progress calculation - memoized to avoid recalculation on each render
	useMemo(() => {
		// Progress calculation logic
		const year = currentDate.getFullYear();
		const month = currentDate.getMonth();
		const daysInMonth = new Date(year, month + 1, 0).getDate();

		// Count non-Sunday days (available workout days)
		let availableWorkoutDays = 0;
		for (let day = 1; day <= daysInMonth; day++) {
			const date = new Date(year, month, day);
			if (date.getDay() !== 0) {
				// Skip Sundays
				availableWorkoutDays++;
			}
		}

		// Count attended days (excluding Sundays)
		const attendedDays = gymAttendanceDays.filter((date) => {
			// Normalize the attendance date for comparison
			const normalizedAttendanceDate = new Date(
				date.getFullYear(),
				date.getMonth(),
				date.getDate(),
			);
			return (
				normalizedAttendanceDate.getMonth() === currentDate.getMonth() &&
				normalizedAttendanceDate.getFullYear() === currentDate.getFullYear() &&
				normalizedAttendanceDate.getDay() !== 0 // Exclude Sundays
			);
		}).length;

		// Calculate progress percentage
		const calculatedProgress =
			availableWorkoutDays > 0
				? Math.round((attendedDays / availableWorkoutDays) * 100)
				: 0;

		setProgress(calculatedProgress);
	}, [currentDate, gymAttendanceDays]);

	// Optimized helper functions with memoization
	const isToday = useCallback(
		(date: Date) => {
			// Normalize both dates for comparison
			const normalizedDate = new Date(
				date.getFullYear(),
				date.getMonth(),
				date.getDate(),
			);
			return (
				normalizedDate.getDate() === today.getDate() &&
				normalizedDate.getMonth() === today.getMonth() &&
				normalizedDate.getFullYear() === today.getFullYear()
			);
		},
		[today],
	);

	const isGymDay = useCallback(
		(date: Date) => {
			// Normalize the date for consistent key generation
			const normalizedDate = new Date(
				date.getFullYear(),
				date.getMonth(),
				date.getDate(),
			);
			const key = `${normalizedDate.getFullYear()}-${normalizedDate.getMonth()}-${normalizedDate.getDate()}`;
			return gymDaysMap.has(key);
		},
		[gymDaysMap],
	);

	const isMissedDay = useCallback(
		(date: Date) => {
			// Normalize the date for comparison
			const normalizedDate = new Date(
				date.getFullYear(),
				date.getMonth(),
				date.getDate(),
			);
			return (
				normalizedDate < today &&
				!isGymDay(date) &&
				normalizedDate.getDay() !== 0
			);
		},
		[today, isGymDay],
	);

	// Memoize days in month calculation to prevent recalculation on every render
	const daysInMonth = useMemo(() => {
		const year = currentDate.getFullYear();
		const month = currentDate.getMonth();
		const firstDay = new Date(year, month, 1).getDay();
		const daysInMonth = new Date(year, month + 1, 0).getDate();

		const days = [];
		for (let i = 0; i < firstDay; i++) {
			days.push(null);
		}
		for (let i = 1; i <= daysInMonth; i++) {
			days.push(new Date(year, month, i));
		}
		return days;
	}, [currentDate]);

	const _addMonths = (date: Date, months: number) => {
		const newDate = new Date(date);
		newDate.setMonth(newDate.getMonth() + months);
		return newDate;
	};

	// Memoize day class calculation for better performance
	const getDayClasses = useCallback(
		(date: Date) => {
			const isSunday = date.getDay() === 0;
			const isGymAttendance = isGymDay(date);
			const isTodayDate = isToday(date);
			const isMissed = isMissedDay(date);

			return cn(
				'flex flex-col items-center justify-center',
				'w-12 h-12 md:w-14 md:h-14 rounded-xl',
				'text-center relative',
				'transition-transform',
				'hover:scale-105',
				'cursor-default',
				{
					'bg-gradient-to-br from-green-400 to-green-500 text-white shadow-md shadow-green-200/50 dark:shadow-green-900/50':
						isGymAttendance,
					'bg-gradient-to-br from-blue-400 to-blue-600 text-white shadow-md shadow-blue-200/50 dark:shadow-blue-900/50':
						isTodayDate && !isGymAttendance,
					'bg-gradient-to-br from-red-100 to-red-200 dark:from-red-900/50 dark:to-red-800/50':
						isMissed,
					'bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800/50 dark:to-gray-700/50 text-gray-400 dark:text-gray-600':
						isSunday,
				},
			);
		},
		[isGymDay, isToday, isMissedDay],
	);

	// Memoize day rendering
	const renderDay = useCallback(
		(date: Date | null) => {
			if (!date) return <div className="w-12 h-12 md:w-14 md:h-14" />;

			const showGymIcon = isGymDay(date) && date.getDay() !== 0;
			const showMissedIcon = isMissedDay(date);

			return (
				<div className={getDayClasses(date)}>
					<span className="text-base md:text-lg font-semibold">
						{date.getDate()}
					</span>
					{showGymIcon && <Dumbbell className="w-4 h-4 md:w-5 md:h-5" />}
					{showMissedIcon && (
						<X className="w-4 h-4 md:w-5 md:h-5 text-red-500" />
					)}
				</div>
			);
		},
		[getDayClasses, isGymDay, isMissedDay],
	);

	// Memoize navigation handler functions
	const handlePrevMonth = useCallback(() => {
		setCurrentDate((prev) => {
			const newDate = new Date(prev);
			newDate.setMonth(newDate.getMonth() - 1);
			return newDate;
		});
	}, []);

	const handleNextMonth = useCallback(() => {
		setCurrentDate((prev) => {
			const newDate = new Date(prev);
			newDate.setMonth(newDate.getMonth() + 1);
			return newDate;
		});
	}, []);

	// Memoize calendar headers
	const calendarHeaders = useMemo(() => {
		return DAYS.map((day) => (
			<div
				key={day}
				className="text-center font-semibold text-sm sm:text-base text-gray-600 dark:text-gray-400"
			>
				{day}
			</div>
		));
	}, []);

	// Memoize calendar days rendering
	const calendarDays = useMemo(() => {
		return daysInMonth.map((date, index) => {
			// Skip animations for better performance
			return (
				<div
					className="inline-flex justify-center"
					key={date ? date.toString() : `empty-${index}`}
				>
					{renderDay(date)}
				</div>
			);
		});
	}, [daysInMonth, renderDay]);

	return (
		<div className="w-full max-w-4xl mx-auto space-y-6 will-change-transform">
			{/* Header Section */}
			<div className="flex flex-col items-center space-y-4">
				<div className="w-full flex items-center justify-between px-4 sm:justify-center sm:space-x-8">
					<Button
						variant="outline"
						size="icon"
						className="rounded-full hover:bg-gray-100/80 dark:hover:bg-gray-800/80"
						onClick={handlePrevMonth}
					>
						<ChevronLeft className="h-5 w-5" />
					</Button>
					<div className="flex flex-col items-center">
						<span className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-gray-100 dark:to-gray-400 bg-clip-text text-transparent">
							{MONTHS[currentDate.getMonth()]} {currentDate.getFullYear()}
						</span>
					</div>
					<Button
						variant="outline"
						size="icon"
						className="rounded-full hover:bg-gray-100/80 dark:hover:bg-gray-800/80"
						onClick={handleNextMonth}
					>
						<ChevronRight className="h-5 w-5" />
					</Button>
				</div>
			</div>

			{/* Calendar Grid */}
			<div className="px-2 sm:px-4">
				<div className="grid grid-cols-7 gap-2 sm:gap-4 mb-4">
					{calendarHeaders}
				</div>
				<div className="grid grid-cols-7 gap-3 sm:gap-3">{calendarDays}</div>
			</div>

			{/* Legend and Progress */}
			<div className="mt-8 flex flex-col space-y-6 sm:flex-row sm:space-y-0 justify-between items-center p-4 rounded-xl bg-gray-50/50 dark:bg-gray-800/50">
				{/* Legend items */}
				<div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-4 sm:gap-6">
					<div className="flex items-center space-x-3">
						<div className="w-5 h-5 rounded-lg bg-gradient-to-br from-green-400 to-green-500 shadow-md shadow-green-200/50 dark:shadow-green-900/50" />
						<span className="text-sm font-medium text-gray-700 dark:text-gray-300">
							Gym Day
						</span>
					</div>
					<div className="flex items-center space-x-3">
						<div className="w-5 h-5 rounded-md bg-blue-500 shadow-md shadow-blue-200 dark:shadow-blue-900" />
						<span className="text-sm font-medium text-gray-700 dark:text-gray-300">
							Today
						</span>
					</div>
					<div className="flex items-center space-x-3">
						<div className="w-5 h-5 rounded-md bg-red-100 dark:bg-red-900/50 shadow-md shadow-red-200 dark:shadow-red-900" />
						<span className="text-sm font-medium text-gray-700 dark:text-gray-300">
							Missed
						</span>
					</div>
					<div className="flex items-center space-x-3">
						<div className="w-5 h-5 rounded-md bg-gray-100 dark:bg-gray-800/50 shadow-md shadow-gray-200 dark:shadow-gray-900" />
						<span className="text-sm font-medium text-gray-700 dark:text-gray-300">
							Off Day
						</span>
					</div>
				</div>

				{/* Progress Circle - Static version with no animations */}
				<div className="relative w-24 h-24 sm:w-32 sm:h-32">
					{/* Progress circle with gradient */}
					<svg
						className="w-full h-full transform -rotate-90"
						aria-label={`Monthly attendance progress: ${progress}% of workout days completed`}
						viewBox="0 0 100 100"
					>
						<title>Monthly Attendance Progress</title>
						<defs>
							<linearGradient
								id="progress-gradient"
								x1="0%"
								y1="0%"
								x2="100%"
								y2="100%"
							>
								<stop offset="0%" stopColor="#4ade80" />
								<stop offset="100%" stopColor="#22c55e" />
							</linearGradient>
						</defs>
						{/* Background circle */}
						<circle
							cx="50"
							cy="50"
							r="40"
							fill="none"
							stroke="currentColor"
							strokeWidth="8"
							className="text-gray-200 dark:text-gray-800"
						/>
						{/* Progress circle - static, no transitions */}
						<circle
							cx="50"
							cy="50"
							r="40"
							fill="none"
							stroke="url(#progress-gradient)"
							strokeWidth="8"
							strokeLinecap="round"
							strokeDasharray={`${(progress / 100) * 251.2} 251.2`}
							strokeDashoffset="0"
						/>
					</svg>
					<div className="absolute inset-0 flex items-center justify-center">
						<span className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-green-500 to-green-700 bg-clip-text text-transparent">
							{progress}%
						</span>
					</div>
				</div>
			</div>
		</div>
	);
}
