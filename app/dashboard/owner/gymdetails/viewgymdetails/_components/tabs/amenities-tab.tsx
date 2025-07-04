'use client';

import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from '@/components/ui/tooltip';
import { motion, AnimatePresence } from 'framer-motion';
import {
	Check,
	Dumbbell,
	Users,
	Heart,
	Waves,
	Baby,
	Star,
	Edit3,
	Filter,
	Search,
	ChevronDown,
	Calendar,
	Clock,
	MapPin,
	Info,
} from 'lucide-react';
import {
	PREDEFINED_AMENITY_CATEGORIES,
	type AmenityCategoryDefinition,
} from '@/lib/constants/amenities';
import { useState, useMemo } from 'react';
import { Input } from '@/components/ui/input';

interface AmenitiesTabProps {
	categories?: AmenityCategoryDefinition[];
	selectedAmenities?: Record<string, string[]>; // categoryKey -> array of amenity keys
	onEdit?: (updatedAmenities: Record<string, string[]>) => void;
}

export function AmenitiesTab({
	categories = PREDEFINED_AMENITY_CATEGORIES,
	selectedAmenities,
	onEdit,
}: AmenitiesTabProps) {
	const [searchQuery, setSearchQuery] = useState('');
	const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
	const [viewMode, setViewMode] = useState<'grid' | 'compact'>('grid');

	// If selectedAmenities is not provided, show all amenities as selected
	const allSelected = !selectedAmenities;

	// Category icons mapping
	const getCategoryIcon = (categoryKey: string) => {
		const iconMap = {
			'fitness-equipment': Dumbbell,
			'group-classes': Users,
			'wellness-recovery': Heart,
			'aquatic-facilities': Waves,
			'family-lifestyle': Baby,
			'amenities-services': Star,
		};
		return iconMap[categoryKey as keyof typeof iconMap] || Star;
	};

	// Category color mapping
	const getCategoryColor = (categoryKey: string) => {
		const colorMap = {
			'fitness-equipment': 'from-blue-500 to-blue-600',
			'group-classes': 'from-purple-500 to-purple-600',
			'wellness-recovery': 'from-green-500 to-green-600',
			'aquatic-facilities': 'from-cyan-500 to-cyan-600',
			'family-lifestyle': 'from-pink-500 to-pink-600',
			'amenities-services': 'from-orange-500 to-orange-600',
		};
		return (
			colorMap[categoryKey as keyof typeof colorMap] ||
			'from-gray-500 to-gray-600'
		);
	};

	// Filter categories and amenities based on search
	const filteredCategories = useMemo(() => {
		if (!searchQuery && !selectedCategory) return categories;

		return categories
			.map((category) => {
				if (selectedCategory && category.key !== selectedCategory) return null;

				const filteredAmenities = category.amenities.filter(
					(amenity) =>
						amenity.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
						amenity.description
							?.toLowerCase()
							.includes(searchQuery.toLowerCase()),
				);

				if (filteredAmenities.length === 0 && searchQuery) return null;

				return {
					...category,
					amenities: searchQuery ? filteredAmenities : category.amenities,
				};
			})
			.filter(Boolean) as AmenityCategoryDefinition[];
	}, [categories, searchQuery, selectedCategory]);

	// Calculate availability stats
	const getAvailabilityStats = (category: AmenityCategoryDefinition) => {
		if (allSelected)
			return {
				available: category.amenities.length,
				total: category.amenities.length,
			};

		const availableInCategory = selectedAmenities?.[category.key] || [];
		return {
			available: availableInCategory.length,
			total: category.amenities.length,
		};
	};

	return (
		<TooltipProvider>
			<div className="space-y-6">
				{/* Header with Search and Filters */}
				<div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
					<div className="space-y-1">
						<h2 className="text-2xl font-bold tracking-tight">Gym Amenities</h2>
						<p className="text-sm text-muted-foreground">
							Facilities and services currently offered by this gym
						</p>
					</div>

					{onEdit && (
						<Button
							onClick={() => onEdit({})}
							size="sm"
							variant="outline"
							className="self-start lg:self-auto"
						>
							<Edit3 className="w-4 h-4 mr-2" />
							Edit Amenities
						</Button>
					)}
				</div>

				{/* Search and Filter Controls */}
				<div className="flex flex-col gap-4 sm:flex-row sm:items-center">
					<div className="relative flex-1 max-w-sm">
						<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
						<Input
							placeholder="Search amenities..."
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
							className="pl-10"
						/>
					</div>

					<div className="flex items-center gap-2">
						<Filter className="w-4 h-4 text-muted-foreground" />
						<select
							value={selectedCategory || ''}
							onChange={(e) => setSelectedCategory(e.target.value || null)}
							className="px-3 py-2 border border-input bg-background rounded-md text-sm"
						>
							<option value="">All Categories</option>
							{categories.map((category) => (
								<option key={category.key} value={category.key}>
									{category.name}
								</option>
							))}
						</select>
					</div>

					<div className="flex items-center gap-1 border border-input rounded-md p-1">
						<Button
							variant={viewMode === 'grid' ? 'default' : 'ghost'}
							size="sm"
							onClick={() => setViewMode('grid')}
							className="h-8 px-3"
						>
							Grid
						</Button>
						<Button
							variant={viewMode === 'compact' ? 'default' : 'ghost'}
							size="sm"
							onClick={() => setViewMode('compact')}
							className="h-8 px-3"
						>
							Compact
						</Button>
					</div>
				</div>

				{/* Categories Grid */}
				<AnimatePresence mode="wait">
					<motion.div
						key={`${searchQuery}-${selectedCategory}-${viewMode}`}
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0, y: -20 }}
						transition={{ duration: 0.3 }}
						className={
							viewMode === 'grid'
								? 'grid gap-6 md:grid-cols-2 xl:grid-cols-3'
								: 'space-y-4'
						}
					>
						{filteredCategories.map((category, index) => {
							const IconComponent = getCategoryIcon(category.key);
							const stats = getAvailabilityStats(category);
							const availabilityPercentage =
								(stats.available / stats.total) * 100;

							return (
								<motion.div
									key={category.key}
									initial={{ opacity: 0, y: 20 }}
									animate={{ opacity: 1, y: 0 }}
									transition={{ duration: 0.3, delay: index * 0.1 }}
								>
									<Card className="h-full border-0 shadow-lg bg-gradient-to-br from-white to-gray-50/50 hover:shadow-xl transition-all duration-300 group">
										<CardHeader
											className={`bg-gradient-to-r ${getCategoryColor(category.key)} text-white relative overflow-hidden`}
										>
											<div className="absolute inset-0 bg-black/10" />
											<div className="relative flex items-center justify-between">
												<div className="flex items-center gap-3">
													<Tooltip>
														<TooltipTrigger asChild>
															<div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm hover:bg-white/30 transition-colors cursor-help">
																<IconComponent className="w-5 h-5" />
															</div>
														</TooltipTrigger>
														<TooltipContent>
															<p>{category.description}</p>
														</TooltipContent>
													</Tooltip>
													<div>
														<h3 className="font-bold text-lg">
															{category.name}
														</h3>
														<p className="text-white/80 text-sm">
															{category.description}
														</p>
													</div>
												</div>

												<div className="text-right">
													<motion.div
														className="text-2xl font-bold"
														initial={{ scale: 0.5 }}
														animate={{ scale: 1 }}
														transition={{
															type: 'spring',
															stiffness: 300,
															damping: 20,
															delay: index * 0.1,
														}}
													>
														{stats.available}
													</motion.div>
													<div className="text-white/80 text-xs">available</div>
												</div>
											</div>

											{/* Availability Indicator */}
											<div className="mt-3">
												<div className="flex items-center justify-between text-sm text-white/80 mb-1">
													<span>Available Amenities</span>
													<span>
														{stats.available} of {stats.total}
													</span>
												</div>
												<Progress
													value={availabilityPercentage}
													className="h-2 bg-white/20 [&>div]:transition-all [&>div]:duration-500"
												/>
											</div>
										</CardHeader>

										<CardContent className="p-6">
											<div
												className={
													viewMode === 'grid'
														? 'space-y-3'
														: 'grid grid-cols-2 gap-2'
												}
											>
												{category.amenities.map((amenity, amenityIndex) => {
													const isSelected =
														allSelected ||
														(selectedAmenities?.[category.key]?.includes(
															amenity.key,
														) ??
															false);

													return (
														<motion.div
															key={amenity.key}
															initial={{ opacity: 0, x: -20 }}
															animate={{ opacity: 1, x: 0 }}
															transition={{
																duration: 0.2,
																delay: amenityIndex * 0.05,
															}}
															className={`flex items-center gap-3 p-3 rounded-lg transition-all duration-200 hover:shadow-md group ${
																isSelected
																	? 'bg-green-50 border border-green-200 shadow-sm hover:bg-green-100'
																	: 'bg-gray-50 border border-gray-200 opacity-60 hover:opacity-80'
															} ${viewMode === 'compact' ? 'text-sm' : ''}`}
														>
															<div
																className={`flex-shrink-0 w-2 h-2 rounded-full ${
																	isSelected ? 'bg-green-500' : 'bg-gray-300'
																}`}
															/>

															<div className="flex-1 min-w-0">
																<span
																	className={`block font-medium ${
																		isSelected
																			? 'text-gray-900'
																			: 'text-gray-400 line-through'
																	}`}
																>
																	{amenity.name}
																</span>
																{viewMode === 'grid' && amenity.description && (
																	<span
																		className={`block text-xs mt-1 ${
																			isSelected
																				? 'text-gray-600'
																				: 'text-gray-400'
																		}`}
																	>
																		{amenity.description}
																	</span>
																)}
															</div>

															{isSelected && (
																<motion.div
																	initial={{ scale: 0 }}
																	animate={{ scale: 1 }}
																	transition={{
																		type: 'spring',
																		stiffness: 500,
																		damping: 30,
																	}}
																>
																	<Badge
																		variant="secondary"
																		className="bg-green-100 text-green-700 border-green-200"
																	>
																		<Check className="w-3 h-3 mr-1" />
																		Available
																	</Badge>
																</motion.div>
															)}
														</motion.div>
													);
												})}
											</div>
										</CardContent>
									</Card>
								</motion.div>
							);
						})}
					</motion.div>
				</AnimatePresence>

				{/* Empty State */}
				{filteredCategories.length === 0 && (
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						className="text-center py-12"
					>
						<div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
							<Search className="w-8 h-8 text-gray-400" />
						</div>
						<h3 className="text-lg font-medium text-gray-900 mb-2">
							No amenities found
						</h3>
						<p className="text-gray-500 max-w-sm mx-auto">
							Try adjusting your search query or category filter to find what
							you're looking for.
						</p>
						<Button
							variant="outline"
							onClick={() => {
								setSearchQuery('');
								setSelectedCategory(null);
							}}
							className="mt-4"
						>
							Clear filters
						</Button>
					</motion.div>
				)}

				{/* Summary Stats */}
				{filteredCategories.length > 0 && !searchQuery && !selectedCategory && (
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.5 }}
						className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-xl p-6"
					>
						<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
							<div className="text-center">
								<div className="text-2xl font-bold text-blue-600">
									{categories.length}
								</div>
								<div className="text-sm text-blue-700">Categories</div>
							</div>
							<div className="text-center">
								<div className="text-2xl font-bold text-purple-600">
									{categories.reduce(
										(acc, cat) => acc + cat.amenities.length,
										0,
									)}
								</div>
								<div className="text-sm text-purple-700">Total Amenities</div>
							</div>
							<div className="text-center">
								<div className="text-2xl font-bold text-green-600">
									{allSelected
										? categories.reduce(
												(acc, cat) => acc + cat.amenities.length,
												0,
											)
										: Object.values(selectedAmenities || {}).reduce(
												(acc, arr) => acc + arr.length,
												0,
											)}
								</div>
								<div className="text-sm text-green-700">Offered</div>
							</div>
							<div className="text-center">
								<div className="text-2xl font-bold text-orange-600">
									{allSelected
										? 0
										: categories.reduce(
												(acc, cat) => acc + cat.amenities.length,
												0,
											) -
											Object.values(selectedAmenities || {}).reduce(
												(acc, arr) => acc + arr.length,
												0,
											)}
								</div>
								<div className="text-sm text-orange-700">Not Offered</div>
							</div>
						</div>
					</motion.div>
				)}
			</div>
		</TooltipProvider>
	);
}
