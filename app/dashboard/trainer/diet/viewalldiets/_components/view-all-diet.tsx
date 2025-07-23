'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
	Search,
	Plus,
	MoreVertical,
	Edit,
	Trash2,
	Users,
	Calendar,
	Target,
	TrendingUp,
	Copy,
	Eye,
	Star,
	Download,
	ChevronDown,
	ChevronUp,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import type { ViewDietPlan } from '../_action/get-all-view-diets';

interface DietManagementProps {
	dietPlans: ViewDietPlan[];
}

export default function DietManagement({ dietPlans }: DietManagementProps) {
	const router = useRouter();
	const [searchTerm, setSearchTerm] = useState('');
	const [selectedStatus, setSelectedStatus] = useState('all');
	const [_viewMode, _setViewMode] = useState('grid');

	const filteredDiets = dietPlans.filter((diet) => {
		const matchesSearch =
			diet.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
			diet.description?.toLowerCase().includes(searchTerm.toLowerCase());
		const matchesStatus =
			selectedStatus === 'all' || diet.status === selectedStatus;

		return matchesSearch && matchesStatus;
	});

	const statuses = ['all', 'active', 'draft', 'archived'];

	const handleCreateDiet = () => {
		router.push('/dashboard/trainer/diet/createdietplan');
	};

	const getStatusColor = (status: string) => {
		switch (status) {
			case 'active':
				return 'bg-green-100 text-green-700 border-green-200';
			case 'draft':
				return 'bg-amber-100 text-amber-700 border-amber-200';
			case 'archived':
				return 'bg-slate-100 text-slate-700 border-slate-200';
			default:
				return 'bg-slate-100 text-slate-700 border-slate-200';
		}
	};

	const MacroBar = ({
		label,
		percentage,
	}: { label: string; percentage: number }) => (
		<div className="space-y-1">
			<div className="flex justify-between text-xs">
				<span className="text-slate-600">{label}</span>
				<span className="font-medium text-slate-800">{percentage}%</span>
			</div>
			<Progress value={percentage} className="h-2 bg-slate-100" />
		</div>
	);

	const DietCard = ({ diet }: { diet: ViewDietPlan }) => {
		const [expanded, setExpanded] = useState(false);
		return (
			<Card className="group hover:shadow-md transition-all duration-200 border border-slate-100 hover:border-blue-200 bg-white">
				<CardHeader className="pb-3 p-4">
					<div className="flex items-start justify-between">
						<div className="space-y-2 flex-1">
							<div className="flex items-center gap-3">
								<div className="w-8 h-8 rounded-lg bg-gradient-to-r from-blue-400 to-indigo-400 flex items-center justify-center">
									<Target className="h-4 w-4 text-white" />
								</div>
								<CardTitle className="text-lg leading-tight text-slate-800">
									{diet.name}
								</CardTitle>
							</div>
							<Badge
								className={`text-xs ${getStatusColor(diet.status)}`}
								variant="secondary"
							>
								{diet.status.toUpperCase()}
							</Badge>
						</div>
						<button
							type="button"
							onClick={() => setExpanded((v) => !v)}
							onKeyDown={(e) =>
								(e.key === 'Enter' || e.key === ' ') && setExpanded((v) => !v)
							}
							aria-expanded={expanded}
							aria-label={expanded ? 'Collapse meal list' : 'Expand meal list'}
							className="ml-2 p-2 rounded-full hover:bg-blue-50/50 focus:outline-none focus:ring-2 focus:ring-blue-300"
							tabIndex={0}
						>
							{expanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
						</button>
					</div>
				</CardHeader>
				<CardContent className="space-y-4 p-4 pt-0">
					<p className="text-sm text-slate-600 line-clamp-2">
						{diet.description}
					</p>

					<div className="grid grid-cols-3 gap-3 text-sm">
						<div className="flex flex-col items-center p-2 bg-blue-50/50 rounded-lg">
							<Target className="h-4 w-4 text-blue-600 mb-1" />
							<span className="font-medium text-slate-800">
								{diet.totalCalories}
							</span>
							<span className="text-xs text-slate-500">kcal</span>
						</div>
						<div className="flex flex-col items-center p-2 bg-green-50/50 rounded-lg">
							<Users className="h-4 w-4 text-green-600 mb-1" />
							<span className="font-medium text-slate-800">
								{diet.assignedMembers}
							</span>
							<span className="text-xs text-slate-500">members</span>
						</div>
						<div className="flex flex-col items-center p-2 bg-purple-50/50 rounded-lg">
							<Calendar className="h-4 w-4 text-purple-600 mb-1" />
							<span className="font-medium text-slate-800">
								{diet.mealsCount}
							</span>
							<span className="text-xs text-slate-500">meals</span>
						</div>
					</div>

					<div className="space-y-3">
						<h4 className="text-sm font-medium text-slate-700">
							Macronutrients
						</h4>
						<div className="space-y-2">
							<MacroBar label="Protein" percentage={diet.macros.protein} />
							<MacroBar label="Carbs" percentage={diet.macros.carbs} />
							<MacroBar label="Fats" percentage={diet.macros.fats} />
						</div>
					</div>

					{expanded && (
						<div className="pt-4 border-t border-slate-100">
							<h4 className="text-xs font-semibold text-blue-700 mb-2 flex items-center gap-2 uppercase tracking-wide">
								Meals in this diet
							</h4>
							{diet.meals.length === 0 ? (
								<div className="text-xs text-slate-500">
									No meals in this diet plan.
								</div>
							) : (
								<ul className="space-y-2">
									{diet.meals.map((meal) => (
										<li
											key={meal.id}
											className="bg-blue-50/40 rounded p-2 flex flex-col gap-1"
										>
											<div className="flex items-center gap-2">
												<span className="font-medium text-slate-800 text-sm">
													{meal.name}
												</span>
												<span className="text-xs text-blue-600 bg-blue-100 rounded px-2 py-0.5 ml-2">
													{meal.mealTime}
												</span>
												<span className="text-xs text-slate-600 ml-auto">
													{meal.calories} kcal
												</span>
											</div>
											{meal.instructions && (
												<div className="text-xs text-slate-500 mt-1">
													{meal.instructions}
												</div>
											)}
										</li>
									))}
								</ul>
							)}
						</div>
					)}

					<div className="flex items-center justify-between pt-3 border-t border-slate-100">
						<div className="flex items-center gap-2">
							<Avatar className="h-6 w-6">
								<AvatarImage src={diet.creator.avatar || '/placeholder.svg'} />
								<AvatarFallback className="text-xs bg-blue-100 text-blue-700">
									{diet.creator.name
										.split(' ')
										.map((n) => n[0])
										.join('')}
								</AvatarFallback>
							</Avatar>
							<span className="text-xs text-slate-600">
								{diet.creator.name}
							</span>
						</div>
						<div className="flex items-center gap-1">
							<Calendar className="h-3 w-3 text-slate-400" />
							<span className="text-xs text-slate-500">{diet.createdDate}</span>
						</div>
					</div>
				</CardContent>
			</Card>
		);
	};

	return (
		<div className="mx-auto p-2 sm:p-6 space-y-6">
			{/* Header */}
			<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
				<div className="space-y-1">
					<h1 className="text-2xl font-bold text-slate-800">Diet Management</h1>
					<p className="text-slate-600">
						Manage and monitor all diet plans in your gym
					</p>
				</div>
				<Button
					type="button"
					onClick={handleCreateDiet}
					className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-sm"
				>
					<Plus className="h-4 w-4 mr-2" />
					Create New Diet
				</Button>
			</div>

			{/* Stats Overview */}
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
				<Card className="border-blue-100 hover:border-blue-200 transition-colors">
					<CardContent className="p-3">
						<div className="flex items-center gap-3">
							<div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-400 to-indigo-400 flex items-center justify-center">
								<Target className="h-5 w-5 text-white" />
							</div>
							<div>
								<p className="text-sm text-slate-600">Total Diets</p>
								<p className="text-xl font-bold text-slate-800">
									{dietPlans.length}
								</p>
							</div>
						</div>
					</CardContent>
				</Card>
				<Card className="border-green-100 hover:border-green-200 transition-colors">
					<CardContent className="p-3">
						<div className="flex items-center gap-3">
							<div className="w-10 h-10 rounded-full bg-gradient-to-r from-green-400 to-emerald-400 flex items-center justify-center">
								<Users className="h-5 w-5 text-white" />
							</div>
							<div>
								<p className="text-sm text-slate-600">Active Members</p>
								<p className="text-xl font-bold text-slate-800">
									{dietPlans.reduce(
										(sum, diet) => sum + diet.assignedMembers,
										0,
									)}
								</p>
							</div>
						</div>
					</CardContent>
				</Card>
				<Card className="border-purple-100 hover:border-purple-200 transition-colors">
					<CardContent className="p-3">
						<div className="flex items-center gap-3">
							<div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-400 to-indigo-400 flex items-center justify-center">
								<Calendar className="h-5 w-5 text-white" />
							</div>
							<div>
								<p className="text-sm text-slate-600">Total Meals</p>
								<p className="text-xl font-bold text-slate-800">
									{dietPlans.reduce((sum, diet) => sum + diet.mealsCount, 0)}
								</p>
							</div>
						</div>
					</CardContent>
				</Card>
				<Card className="border-amber-100 hover:border-amber-200 transition-colors">
					<CardContent className="p-3">
						<div className="flex items-center gap-3">
							<div className="w-10 h-10 rounded-full bg-gradient-to-r from-amber-400 to-orange-400 flex items-center justify-center">
								<TrendingUp className="h-5 w-5 text-white" />
							</div>
							<div>
								<p className="text-sm text-slate-600">Avg Calories</p>
								<p className="text-xl font-bold text-slate-800">
									{dietPlans.length > 0
										? Math.round(
												dietPlans.reduce(
													(sum, diet) => sum + diet.totalCalories,
													0,
												) / dietPlans.length,
											)
										: 0}
								</p>
							</div>
						</div>
					</CardContent>
				</Card>
			</div>

			{/* Filters and Search */}
			<Card className="border-slate-100">
				<CardContent className="p-3">
					<div className="flex flex-col sm:flex-row gap-3">
						<div className="relative flex-1">
							<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
							<Input
								placeholder="Search diets by name or description..."
								value={searchTerm}
								onChange={(e) => setSearchTerm(e.target.value)}
								className="pl-10 border-slate-200 focus:border-blue-400 focus:ring-blue-400"
							/>
						</div>
						<Select value={selectedStatus} onValueChange={setSelectedStatus}>
							<SelectTrigger className="w-full sm:w-36 border-slate-200 focus:border-blue-400 focus:ring-blue-400">
								<SelectValue placeholder="Status" />
							</SelectTrigger>
							<SelectContent>
								{statuses.map((status) => (
									<SelectItem key={status} value={status}>
										{status === 'all'
											? 'All Status'
											: status.charAt(0).toUpperCase() + status.slice(1)}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>
				</CardContent>
			</Card>

			{/* Diet Grid */}
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 items-start">
				{filteredDiets.map((diet) => (
					<DietCard key={diet.id} diet={diet} />
				))}
			</div>

			{filteredDiets.length === 0 && (
				<Card className="border-slate-100">
					<CardContent className="p-12 text-center">
						<div className="w-16 h-16 rounded-full bg-gradient-to-r from-blue-100 to-indigo-100 flex items-center justify-center mx-auto mb-4">
							<Target className="h-8 w-8 text-blue-600" />
						</div>
						<h3 className="text-lg font-semibold text-slate-800 mb-2">
							No diets found
						</h3>
						<p className="text-slate-600 mb-6">
							Try adjusting your search criteria or create a new diet plan.
						</p>
						<Button
							type="button"
							onClick={handleCreateDiet}
							className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white"
						>
							<Plus className="h-4 w-4 mr-2" />
							Create New Diet
						</Button>
					</CardContent>
				</Card>
			)}
		</div>
	);
}
