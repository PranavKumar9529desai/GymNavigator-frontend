'use client';

import { m } from 'framer-motion';
import { ArrowRight, Dumbbell, Search } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import type { Excercisetype } from '../actions/getSIngleMuscle';
import { useExercises } from './hooks/useExercises';

const containerVariants = {
	hidden: { opacity: 0, y: 20 },
	visible: {
		opacity: 1,
		y: 0,
		transition: {
			duration: 0.5,
			staggerChildren: 0.1,
		},
	},
};

const itemVariants = {
	hidden: { opacity: 0, y: 20 },
	visible: {
		opacity: 1,
		y: 0,
	},
};

interface SingleMusclesProps {
	initialExercises: Excercisetype[];
	muscleName: string;
}

export const SingleMuscles = ({
	initialExercises,
	muscleName,
}: SingleMusclesProps) => {
	const { data: exercises = initialExercises } = useExercises(muscleName);

	const filteredExercises = exercises.filter(
		(exercise) =>
			exercise?.MuscleGroup?.name?.toLowerCase() === muscleName?.toLowerCase(),
	);

	return (
		<m.div
			initial="hidden"
			animate="visible"
			variants={containerVariants}
			className="min-h-screen bg-gray-50/50"
		>
			{/* Header Section */}
			<div className="relative overflow-hidden bg-white border-b border-gray-100">
				<div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-50/50" />
				<div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
					<m.div
						variants={itemVariants}
						className="flex flex-col items-center text-center space-y-6"
					>
						<div className="inline-flex items-center px-4 py-1.5 bg-blue-50 text-blue-700 rounded-full text-sm font-medium">
							<Dumbbell className="w-4 h-4 mr-2" />
							Workout Guide
						</div>
						<h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 tracking-tight max-w-4xl">
							<span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent break-words whitespace-normal">
								{muscleName?.charAt(0)?.toUpperCase() + muscleName?.slice(1)}{' '}
								Exercises
							</span>
						</h1>
						<p className="text-gray-600 text-lg sm:text-xl max-w-2xl">
							Discover professional-grade exercises designed to target and
							strengthen your {muscleName?.toLowerCase()} muscles effectively.
						</p>
					</m.div>
				</div>
			</div>

			{/* Content Section */}
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
				<RecommenedExcercise Excercises={filteredExercises} />
			</div>
		</m.div>
	);
};

const RecommenedExcercise = ({
	Excercises,
}: {
	Excercises: Excercisetype[];
}) => {
	const [searchQuery, setSearchQuery] = useState('');
	const [difficultyFilter, setDifficultyFilter] = useState<string>('');

	const difficultyOptions = [
		{ value: 'Beginner', icon: '🟢', color: 'emerald' },
		{ value: 'Intermediate', icon: '🟡', color: 'yellow' },
		{ value: 'Advanced', icon: '🔴', color: 'red' },
	];

	const filteredExercises = Excercises.filter((exercise) => {
		const matchesSearch = exercise.name
			.toLowerCase()
			.includes(searchQuery.toLowerCase());
		const matchesDifficulty =
			!difficultyFilter ||
			(exercise.instructions.length > 500 && difficultyFilter === 'Advanced') ||
			(exercise.instructions.length > 200 &&
				difficultyFilter === 'Intermediate') ||
			(exercise.instructions.length <= 200 && difficultyFilter === 'Beginner');

		return matchesSearch && matchesDifficulty;
	});

	return (
		<m.div variants={containerVariants} className="space-y-8">
			{/* Search and Filter Section */}
			<div className="bg-white rounded-2xl shadow-sm border border-gray-100">
				<div className="p-6">
					<div className="flex flex-col sm:flex-row gap-4">
						{/* Search Input */}
						<div className="relative flex-1">
							<Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
							<input
								type="text"
								placeholder="Search exercises..."
								value={searchQuery}
								onChange={(e) => setSearchQuery(e.target.value)}
								className="w-full pl-12 pr-4 py-3 text-base border border-gray-200 rounded-xl 
                         focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
							/>
						</div>

						{/* Difficulty Filter */}
						<div className="flex items-center gap-4">
							<span className="text-sm text-gray-600 font-medium whitespace-nowrap">
								Difficulty:
							</span>
							<div className="flex gap-2">
								{difficultyOptions.map((option) => (
									<button
										key={option.value}
										onClick={() =>
											setDifficultyFilter(
												difficultyFilter === option.value ? '' : option.value,
											)
										}
										type="button"
										className={`inline-flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium
                      transition-all duration-200 border
                      ${
												difficultyFilter === option.value
													? 'bg-blue-50 border-blue-200 text-blue-700'
													: 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
											}`}
									>
										<span>{option.icon}</span>
										<span className="hidden sm:inline">{option.value}</span>
									</button>
								))}
							</div>
						</div>
					</div>
				</div>
			</div>

			{/* Exercise Grid */}
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
				{filteredExercises.map((exercise) => (
					<m.div
						key={`${exercise.name}-${exercise.MuscleGroup.id}`}
						variants={itemVariants}
						className="h-full"
					>
						<ExcerciseCard
							name={exercise.name}
							img={exercise.img}
							instructions={exercise.instructions}
						/>
					</m.div>
				))}
			</div>
		</m.div>
	);
};

const ExcerciseCard = ({
	name,
	img,
	instructions,
}: {
	name: string;
	img: string;
	instructions: string;
}) => {
	const pathname = usePathname();
	const router = useRouter();
	const difficulty =
		instructions.length > 500
			? 'Advanced'
			: instructions.length > 200
				? 'Intermediate'
				: 'Beginner';

	const difficultyColors = {
		Beginner: 'bg-emerald-50 text-emerald-700',
		Intermediate: 'bg-yellow-50 text-yellow-700',
		Advanced: 'bg-red-50 text-red-700',
	};

	return (
		<div
			className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md 
                 transition-all duration-300 border border-gray-100 h-full flex flex-col"
		>
			<div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
				<img
					src={img}
					alt={`${name} exercise`}
					className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
				/>
				<div
					className={`absolute bottom-3 right-3 px-3 py-1.5 text-sm font-medium rounded-full 
                        ${difficultyColors[difficulty as keyof typeof difficultyColors]}`}
				>
					{difficulty}
				</div>
			</div>
			<div className="p-5 flex flex-col flex-1 justify-between">
				<h3 className="text-lg font-semibold text-gray-900 mb-4 line-clamp-1">
					{name}
				</h3>
				<button
					type="button"
					onClick={() => router.push(`${pathname}/${name}`)}
					className="inline-flex items-center justify-between px-4 py-2.5 text-sm font-medium
                   text-white bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl
                   hover:from-blue-700 hover:to-indigo-700 transition-all duration-300
                   shadow-sm hover:shadow group"
				>
					<span>View Details</span>
					<ArrowRight className="w-4 h-4 ml-2 transition-transform duration-300 group-hover:translate-x-1" />
				</button>
			</div>
		</div>
	);
};
