'use client';

import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Dumbbell, X } from 'lucide-react';
import { useEffect, useState } from 'react';
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

export default function MonthAttendance({ attendanceDays }: MonthAttendanceProps) {
	const [currentDate, setCurrentDate] = useState(new Date());
	const [progress, setProgress] = useState(0);

	// Use the attendanceDays prop directly - no loading state needed
	const gymAttendanceDays: Date[] = attendanceDays || [];

	useEffect(() => {
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
		const attendedDays = gymAttendanceDays.filter(
			(date) =>
				date.getMonth() === currentDate.getMonth() &&
				date.getFullYear() === currentDate.getFullYear() &&
				date.getDay() !== 0, // Exclude Sundays
		).length;

		// Calculate progress percentage
		const calculatedProgress =
			availableWorkoutDays > 0
				? Math.round((attendedDays / availableWorkoutDays) * 100)
				: 0;

		// Only update progress if it has changed
		if (calculatedProgress !== progress) {
			setProgress(calculatedProgress);
		}
	}, [currentDate, gymAttendanceDays, progress]);

	const isToday = (date: Date) => {
		const today = new Date();
		return (
			date.getDate() === today.getDate() &&
			date.getMonth() === today.getMonth() &&
			date.getFullYear() === today.getFullYear()
		);
	};

	const isGymDay = (date: Date) => {
		return gymAttendanceDays.some(
			(gymDate) =>
				gymDate.getDate() === date.getDate() &&
				gymDate.getMonth() === date.getMonth() &&
				gymDate.getFullYear() === date.getFullYear(),
		);
	};

	const isMissedDay = (date: Date) => {
		const today = new Date();
		return (
			date < today && !isGymDay(date) && date.getDay() !== 0 && date <= today
		);
	};

	const getDaysInMonth = (date: Date) => {
		const year = date.getFullYear();
		const month = date.getMonth();
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
	};

	const addMonths = (date: Date, months: number) => {
		const newDate = new Date(date);
		newDate.setMonth(newDate.getMonth() + months);
		return newDate;
	};

	const getDayClasses = (date: Date) => {
		const isSunday = date.getDay() === 0;
		const isGymAttendance = isGymDay(date);

		return `
      flex flex-col items-center justify-center
      w-12 h-12 md:w-14 md:h-14 rounded-xl
      text-center relative
      transition-all duration-300 ease-in-out
      backdrop-blur-sm
      hover:scale-105 hover:shadow-lg
      cursor-default
      ${
				isGymAttendance
					? 'bg-gradient-to-br from-green-400 to-green-500 text-white shadow-lg shadow-green-200/50 dark:shadow-green-900/50'
					: ''
			}
      ${
				isToday(date) && !isGymAttendance
					? 'bg-gradient-to-br from-blue-400 to-blue-600 text-white shadow-lg shadow-blue-200/50 dark:shadow-blue-900/50'
					: ''
			}
      ${
				isMissedDay(date)
					? 'bg-gradient-to-br from-red-100 to-red-200 dark:from-red-900/50 dark:to-red-800/50'
					: ''
			}
      ${
				isSunday
					? 'bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800/50 dark:to-gray-700/50 text-gray-400 dark:text-gray-600'
					: ''
			}
    `;
	};

	const renderDay = (date: Date | null) => {
		if (!date) return <div className="w-12 h-12 md:w-14 md:h-14" />;

		return (
			<div key={date.toString()} className={getDayClasses(date)}>
				<span className="text-base md:text-lg font-semibold">
					{date.getDate()}
				</span>
				{isGymDay(date) && date.getDay() !== 0 && (
					<Dumbbell className="w-4 h-4 md:w-5 md:h-5 animate-pulse" />
				)}
				{isMissedDay(date) && (
					<X className="w-4 h-4 md:w-5 md:h-5 text-red-500" />
				)}
			</div>
		);
	};

	return (
		<div className="w-full max-w-4xl mx-auto space-y-6">
			{/* Header Section */}
			<div className="flex flex-col items-center space-y-4">
				<div className="w-full flex items-center justify-between px-4 sm:justify-center sm:space-x-8">
					<Button
						variant="outline"
						size="icon"
						className="rounded-full hover:bg-gray-100/80 dark:hover:bg-gray-800/80 transition-all duration-300"
						onClick={() => setCurrentDate(addMonths(currentDate, -1))}
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
						className="rounded-full hover:bg-gray-100/80 dark:hover:bg-gray-800/80 transition-all duration-300"
						onClick={() => setCurrentDate(addMonths(currentDate, 1))}
					>
						<ChevronRight className="h-5 w-5" />
					</Button>
				</div>
			</div>

			{/* Calendar Grid */}
			<div className="px-2 sm:px-4">
				<div className="grid grid-cols-7 gap-2 sm:gap-4 mb-4">
					{DAYS.map((day) => (
						<div
							key={day}
							className="text-center font-semibold text-sm sm:text-base text-gray-600 dark:text-gray-400"
						>
							{day}
						</div>
					))}
				</div>
				<div className="grid grid-cols-7 gap-3 sm:gap-3">
					{getDaysInMonth(currentDate).map((date, index) => (
						<div
							className="inline-flex justify-center animate-fadeIn"
							key={index as number}
							style={{ animationDelay: `${index * 20}ms` }}
						>
							{renderDay(date)}
						</div>
					))}
				</div>
			</div>

			{/* Legend and Progress */}
			<div className="mt-8 flex flex-col space-y-6 sm:flex-row sm:space-y-0 justify-between items-center p-4 rounded-xl bg-gray-50/50 dark:bg-gray-800/50 backdrop-blur-sm">
				<div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-4 sm:gap-6">
					<div className="flex items-center space-x-3 transition-transform hover:scale-105">
						<div className="w-5 h-5 rounded-lg bg-gradient-to-br from-green-400 to-green-500 shadow-lg shadow-green-200/50 dark:shadow-green-900/50" />
						<span className="text-sm font-medium text-gray-700 dark:text-gray-300">
							Gym Day
						</span>
					</div>
					<div className="flex items-center space-x-3 transition-transform hover:scale-105">
						<div className="w-5 h-5 rounded-md bg-blue-500 shadow-lg shadow-blue-200 dark:shadow-blue-900" />
						<span className="text-sm font-medium text-gray-700 dark:text-gray-300">
							Today
						</span>
					</div>
					<div className="flex items-center space-x-3 transition-transform hover:scale-105">
						<div className="w-5 h-5 rounded-md bg-red-100 dark:bg-red-900/50 shadow-lg shadow-red-200 dark:shadow-red-900" />
						<span className="text-sm font-medium text-gray-700 dark:text-gray-300">
							Missed
						</span>
					</div>
					<div className="flex items-center space-x-3 transition-transform hover:scale-105">
						<div className="w-5 h-5 rounded-md bg-gray-100 dark:bg-gray-800/50 shadow-lg shadow-gray-200 dark:shadow-gray-900" />
						<span className="text-sm font-medium text-gray-700 dark:text-gray-300">
							Off Day
						</span>
					</div>
				</div>

				{/* Progress Circle */}
				<div className="relative w-24 h-24 sm:w-32 sm:h-32 transform hover:scale-105 transition-transform">
					{/* Progress circle with gradient */}
					{/* biome-ignore lint/a11y/noSvgWithoutTitle: <explanation> */}
					<svg className="w-full h-full transform -rotate-90">
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
						<circle
							cx="50%"
							cy="50%"
							r="45%"
							fill="none"
							stroke="currentColor"
							strokeWidth="8"
							className="text-gray-200 dark:text-gray-800"
						/>
						<circle
							cx="50%"
							cy="50%"
							r="45%"
							fill="none"
							stroke="url(#progress-gradient)"
							strokeWidth="8"
							strokeLinecap="round"
							strokeDasharray={`${progress * 2.827}, 282.743`}
							className="transition-all duration-1000 ease-in-out"
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
