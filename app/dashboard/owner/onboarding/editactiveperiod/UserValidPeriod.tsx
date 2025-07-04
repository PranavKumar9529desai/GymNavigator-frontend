'use client';

import { UpdateUserActivePeriod } from '@/app/dashboard/owner/onboarding/editactiveperiod/actions/updateActivePeriod';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '@/components/ui/popover';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { addMonths, format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';
import { Toaster, toast } from 'react-hot-toast';
import Swal from 'sweetalert2';
import { validateUserValidity } from './actions/typecheck';
import { queryClient } from '@/lib/getQueryClient';

interface UserValidityPeriodProps {
	userId: string;
	userName: string;
	userImage?: string;
	initialStartDate?: Date;
	initialEndDate?: Date;
}

export function UserValidityPeriod({
	userId,
	userName,
	userImage,
	initialStartDate,
	initialEndDate,
}: UserValidityPeriodProps) {
	const router = useRouter();
	const [isPending, startTransition] = useTransition();
	const [startDate, setStartDate] = useState<Date>(
		initialStartDate || new Date(),
	);
	const [endDate, setEndDate] = useState<Date>(
		initialEndDate || addMonths(new Date(), 1),
	);
	const [shift, setShift] = useState<'morning' | 'evening'>('morning');
	const defaultImage = 'https://randomuser.me/api/portraits';
	const [startDateOpen, setStartDateOpen] = useState(false);
	const [endDateOpen, setEndDateOpen] = useState(false);

	const getDefaultEndMonth = () => {
		return addMonths(startDate, 1);
	};

	const handleSubmit = () => {
		startTransition(async () => {
			const userData = {
				userId: Number(userId),
				startDate,
				endDate,
				shift,
			};

			const formatDisplayDate = (date: Date) => {
				return format(date, 'dd-MM-yyyy');
			};

			const result = await Swal.fire({
				title: 'Update Gym Session Period',
				position: 'center',
				html: `
          <div class="text-left p-4">
        <div class="border-b pb-2 mb-4">
          <h3 class="font-medium text-gray-900">Session Details</h3>
        </div>
        <div class="space-y-3">
          <div class="flex justify-between">
            <span class="text-gray-600">Start Date:</span>
            <span class="font-medium">${formatDisplayDate(startDate)}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-600">End Date:</span>
            <span class="font-medium">${formatDisplayDate(endDate)}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-600">Shift:</span>
            <span class="font-medium capitalize">${shift}</span>
          </div>
        </div>
          </div>
        `,
				icon: 'info',
				showCancelButton: true,
				confirmButtonColor: '#2563eb',
				cancelButtonColor: '#dc2626',
				confirmButtonText: 'Confirm Update',
				cancelButtonText: 'Cancel',
				customClass: {
					popup: 'rounded-lg',
					title: 'text-xl font-medium text-gray-900',
				},
			});

			if (!result.isConfirmed) {
				return;
			}

			const validationResult = await validateUserValidity(userData);

			if (validationResult.success) {
				const updateResult = await UpdateUserActivePeriod({
					userId: Number(userId),
					startDate,
					endDate,
					shift,
				});

				if (updateResult.user) {
					console.log('before toast');

					queryClient.resetQueries({ queryKey: ['onboardedUsers'] });
					toast.success(`Validity period updated for ${userName}`, {
						duration: 3000,
						position: 'top-center',
					});

					// Add delay before navigation to show the success toast
					setTimeout(() => {
						router.push('/dashboard/owner/onboarding/onboardedusers');
					}, 1500);
					router.refresh();
				} else {
					toast.error(updateResult.msg || 'Failed to update validity period');
				}
			} else {
				const errorMessages = Object.entries(validationResult.errors || {})
					.map(([field, errors]) => `${field}: ${errors?.join(', ')}`)
					.join('\n');
				toast.error(errorMessages);
			}
		});
	};

	return (
		<div className="w-full max-w-3xl mx-auto p-6 sm:p-8  rounded-xl space-y-6 sm:space-y-8 ">
			<Toaster position="top-right" />

			{/* Header Section with Avatar - Made responsive */}
			<div className="flex flex-col sm:flex-row items-center sm:items-start sm:space-x-6 pb-6 border-b border-gray-200 w-ful b">
				<Avatar className="w-24 h-24 sm:w-28 sm:h-28 ring-2 ring-gray-100 mb-4 sm:mb-0 border mx-auto">
					<AvatarImage
						src={userImage ? userImage : defaultImage}
						alt={userName}
					/>
					<AvatarFallback className="bg-blue-50 text-blue-700 text-xl font-medium  ">
						{userName
							.split(' ')
							.map((n) => n[0])
							.join('')}
					</AvatarFallback>
				</Avatar>
				<div className="text-center sm:text-left flex-grow my-auto">
					<h2 className="text-xl sm:text-2xl font-semibold text-gray-900">
						{userName}
					</h2>
					<p className="text-sm text-gray-500">Membership Details</p>
				</div>
			</div>

			{/* Form Section - Made mobile friendly */}
			<div className="space-y-6 sm:space-y-8">
				{/* Start Date - Modified for mobile */}
				<div className="flex flex-col sm:grid sm:grid-cols-3 items-start sm:items-center gap-3 sm:gap-6">
					<label
						htmlFor="startDate"
						className="text-sm font-medium text-gray-700"
					>
						Start Date
					</label>
					<div className="w-full sm:col-span-2">
						<Popover open={startDateOpen} onOpenChange={setStartDateOpen}>
							<PopoverTrigger asChild>
								<Button
									id="startDate"
									variant="outline"
									className="w-full h-12 sm:h-10 justify-start text-left font-normal hover:bg-gray-50 active:scale-[0.98] transition-transform"
								>
									<CalendarIcon className="mr-2 h-5 w-5 sm:h-4 sm:w-4 text-gray-500 " />
									{format(startDate, 'PPP')}
								</Button>
							</PopoverTrigger>
							<PopoverContent
								className="w-[calc(100vw-2rem)] sm:w-auto p-0"
								align="center"
							>
								<Calendar
									mode="single"
									selected={startDate}
									onSelect={(date) => {
										if (date) {
											setStartDate(date);
											setStartDateOpen(false); // Auto close after selection
										}
									}}
									disabled={(date) =>
										date < new Date() || date < new Date('1900-01-01')
									}
									initialFocus
									className="rounded-md border shadow-lg mx-auto bg-white"
									classNames={{
										months: 'space-y-4 sm:space-y-0',
										month: 'space-y-4',
										caption: 'flex justify-center pt-1 relative items-center',
										caption_label: 'text-sm font-medium',
										nav: 'space-x-1 flex items-center',
										table: 'w-full border-collapse space-y-1',
										head_row: 'flex justify-around',
										head_cell:
											'text-muted-foreground rounded-md w-9 font-normal text-[0.8rem]',
										row: 'flex w-full justify-around mt-2',
										cell: 'text-center text-sm p-0 relative [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20',
										day: 'h-9 w-9 p-0 font-normal aria-selected:opacity-100',
										day_selected:
											'bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground',
										day_today: 'bg-accent text-accent-foreground',
										day_outside: 'text-muted-foreground opacity-50',
										day_disabled: 'text-muted-foreground opacity-50',
										day_range_middle:
											'aria-selected:bg-accent aria-selected:text-accent-foreground',
										day_hidden: 'invisible',
									}}
								/>
							</PopoverContent>
						</Popover>
					</div>
				</div>

				{/* End Date - Modified for mobile */}
				<div className="flex flex-col sm:grid sm:grid-cols-3 items-start sm:items-center gap-3 sm:gap-6">
					<label
						htmlFor="endDate"
						className="text-sm font-medium text-gray-700"
					>
						End Date
					</label>
					<div className="w-full sm:col-span-2">
						<Popover open={endDateOpen} onOpenChange={setEndDateOpen}>
							<PopoverTrigger asChild>
								<Button
									variant="outline"
									className="w-full h-12 sm:h-10 justify-start text-left font-normal hover:bg-gray-50 active:scale-[0.98] transition-transform"
								>
									<CalendarIcon className="mr-2 h-5 w-5 sm:h-4 sm:w-4 text-gray-500" />
									{format(endDate, 'PPP')}
								</Button>
							</PopoverTrigger>
							<PopoverContent
								className="w-[calc(100vw-2rem)] sm:w-auto p-0"
								align="center"
							>
								<Calendar
									mode="single"
									selected={endDate}
									defaultMonth={getDefaultEndMonth()} // Add this line
									onSelect={(date) => {
										if (date) {
											setEndDate(date);
											setEndDateOpen(false); // Auto close after selection
										}
									}}
									disabled={(date) =>
										date <= startDate || date < new Date('1900-01-01')
									}
									initialFocus
									className="rounded-md border shadow-lg mx-auto"
									classNames={{
										months: 'space-y-4 sm:space-y-0',
										month: 'space-y-4',
										caption: 'flex justify-center pt-1 relative items-center',
										caption_label: 'text-sm font-medium',
										nav: 'space-x-1 flex items-center',
										table: 'w-full border-collapse space-y-1',
										head_row: 'flex justify-around',
										head_cell:
											'text-muted-foreground rounded-md w-9 font-normal text-[0.8rem]',
										row: 'flex w-full justify-around mt-2',
										cell: 'text-center text-sm p-0 relative [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20',
										day: 'h-9 w-9 p-0 font-normal aria-selected:opacity-100',
										day_selected:
											'bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground',
										day_today: 'bg-accent text-accent-foreground',
										day_outside: 'text-muted-foreground opacity-50',
										day_disabled: 'text-muted-foreground opacity-50',
										day_range_middle:
											'aria-selected:bg-accent aria-selected:text-accent-foreground',
										day_hidden: 'invisible',
									}}
								/>
							</PopoverContent>
						</Popover>
					</div>
				</div>

				{/* Shift Selection */}
				<div className="flex flex-col sm:grid sm:grid-cols-3 items-start sm:items-center gap-3 sm:gap-6">
					<label htmlFor="shift" className="text-sm font-medium text-gray-700">
						Shift
					</label>
					<div className="w-full sm:col-span-2">
						<Select
							onValueChange={(value: 'morning' | 'evening') => setShift(value)}
							defaultValue={shift}
						>
							<SelectTrigger className="w-full h-12 sm:h-10 hover:bg-gray-50">
								<SelectValue placeholder="Select a shift" />
							</SelectTrigger>
							<SelectContent position="popper" className="w-full">
								<SelectItem value="morning">Morning</SelectItem>
								<SelectItem value="evening">Evening</SelectItem>
							</SelectContent>
						</Select>
					</div>
				</div>
			</div>

			{/* Submit Button */}
			<div className="flex justify-center sm:justify-end pt-4">
				<Button
					className="w-full h-12 sm:h-10 bg-blue-600 hover:bg-blue-700 text-white font-medium text-lg sm:text-base 
                     active:scale-[0.98] transition-transform"
					onClick={handleSubmit}
					disabled={isPending}
				>
					{isPending ? (
						<span className="flex items-center justify-center">
							<svg
								aria-label="Loading spinner"
								className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 24 24"
							>
								<title>Loading animation</title>
								<circle
									className="opacity-25"
									cx="12"
									cy="12"
									r="10"
									stroke="currentColor"
									strokeWidth="4"
								/>
								<path
									className="opacity-75"
									fill="currentColor"
									d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
								/>
							</svg>
							Updating...
						</span>
					) : (
						'Update Membership'
					)}
				</Button>
			</div>
		</div>
	);
}
