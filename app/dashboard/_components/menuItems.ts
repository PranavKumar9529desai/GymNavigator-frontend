// Icon names are used as strings instead of importing all icons
// This reduces the bundle size and improves performance
// The actual icons are dynamically imported in the Sidebar component

export interface SubItem {
	name: string;
	link: string;
	label: string;
	iconName: string; // Added iconName property
}

export interface MenuItem {
	name: string;
	iconName: string;
	label: string;
	subItems?: SubItem[];
	link?: string;
}

export const OwnerDashboardMenuItems: MenuItem[] = [
	{
		name: 'Gym',
		iconName: 'Building2',
		label: 'gymDetails',
		subItems: [
			{
				name: 'View Details',
				link: '/dashboard/owner/gymdetails/viewgymdetails',
				label: 'viewGymDetails',
				iconName: 'Eye',
			},
		],
	},
	{
		name: 'Trainers',
		iconName: 'UserCheck',
		label: 'trainers',
		subItems: [
			{
				name: 'View Trainers',
				link: '/dashboard/owner/trainers/viewtrainers',
				label: 'viewTrainers',
				iconName: 'Eye',
			},
			{
				name: 'Assign Trainers',
				link: '/dashboard/owner/trainers/userstrainersassignment',
				label: 'userstrainersassignment',
				iconName: 'UserPlus',
			},
		],
	},
	{
		name: 'On-boarding',
		label: 'Onboarding',
		iconName: 'ClipboardList',
		link: '/dashboard/owner/onboarding/onboarding',
		subItems: [
			{
				name: 'Onboarding Users',
				label: 'onboarded users',
				link: '/dashboard/owner/onboarding/onboardedusers',
				iconName: 'Users',
			},
			{
				name: 'Onboarding QR',
				label: 'onboarding QR',
				link: '/dashboard/owner/onboarding/onboardingqr',
				iconName: 'QrCode',
			},
		],
	},
	{
		name: 'Attendance',
		iconName: 'CalendarCheck',
		label: 'attendance',
		subItems: [
			{
				name: "Today's Attendance",
				link: '/dashboard/owner/attendance/todaysattendance',
				label: 'todaysAttendance',
				iconName: 'ListChecks',
			},
			{
				name: 'Show QR',
				link: '/dashboard/owner/attendance/showqr',
				label: 'showQR',
				iconName: 'QrCode',
			},
		],
	},
];

export const TrainerDashboardMenuItems: MenuItem[] = [
	{
		name: 'Assigned Users',
		label: 'assignedusers',
		iconName: 'Users',
		link: '/dashboard/trainer/assignedusers',
		
	},
	{
		name: 'Workouts',
		label: 'workouts',
		iconName: 'Dumbbell',
		link: '/dashboard/trainer/workouts',
		subItems: [
			{
				name: 'Create Workouts',
				label: 'createworkout',
				link: '/dashboard/trainer/workouts/createworkout',
				iconName: 'Plus',
			},
			{
				name: 'Assign Workout',
				label: 'assignworkout',
				link: '/dashboard/trainer/workouts/assignworkout',
				iconName: 'UserPlus',
			},
		],
	},
	{
		name: 'Diet',
		label: 'diet',
		iconName: 'UtensilsCrossed',
		link: '/dashboard/trainer/diet',
		subItems: [
			{
				name: 'Create Diet plan',
				label: 'createdietplan',
				link: '/dashboard/trainer/diet/createdietplan',
				iconName: 'Plus',
			},
			{
				name: 'Assign Diet plan',
				label: 'assigndietplan',
				link: '/dashboard/trainer/diet/dietassignedusers',
				iconName: 'UserPlus',
			},
		],
	},
	{
		name: 'Attendance',
		iconName: 'CalendarCheck',
		label: 'attendance',
		link: '/dashboard/trainer/attendance',
		subItems: [
			{
				name: "Today's Attendance",
				label: 'todaysattendance',
				link: '/dashboard/trainer/attendance/todaysattendance',
				iconName: 'ListChecks',
			},
			{
				name: 'Show QR',
				label: 'showqr',
				link: '/dashboard/trainer/attendance/showqr',
				iconName: 'QrCode',
			},
		],
	},
];

export const ClientDashboardMenuItems: MenuItem[] = [
	{
		name: 'Home',
		label: 'home',
		iconName: 'Home',
		subItems: [
			{
				name: 'Gym',
				label: 'gym',
				link: '/dashboard/client/home/gym',
				iconName: 'Building2',
			},
			{
				name: 'Dashboard',
				label: 'dashboard',
				link: '/dashboard/client/home/dashboard',
				iconName: 'Home',
			},
		],
	},
	{
		name: 'Workouts',
		label: 'workouts',
		iconName: 'Dumbbell',
		link: '/dashboard/client/workouts',
		subItems: [
			{
				name: 'My Workouts',
				label: 'myworkouts',
				link: '/dashboard/client/workouts/myworkouts',
				iconName: 'Eye',
			},
			{
				name: 'All Workouts',
				label: 'allworkouts',
				link: '/dashboard/client/workouts/allworkouts',
				iconName: 'Dumbbell',
			},
		],
	},
	{
		name: 'Diet',
		label: 'diet',
		iconName: 'UtensilsCrossed',
		link: '/dashboard/client/diet',
		subItems: [
			{
				name: 'View Diet',
				label: 'viewdiet',
				link: '/dashboard/client/diet/viewdiet',
				iconName: 'Eye',
			},
			{
				name: 'Grocery List',
				label: 'grocerylist',
				link: '/dashboard/client/diet/grocerylist',
				iconName: 'ShoppingBasket',
			},
			{
				name: 'Eating Out Guide',
				label: 'eatingoutguide',
				link: '/dashboard/client/diet/eatingoutguide',
				iconName: 'MapPin',
			},
		],
	},
	{
		name: 'Attendance',
		iconName: 'CalendarCheck',
		label: 'attendance',
		link: '/dashboard/client/attendance',
		subItems: [
			{
				name: 'View Attendance',
				label: 'viewattendance',
				link: '/dashboard/client/attendance/viewattendance',
				iconName: 'Eye',
			},
			{
				name: 'Mark Attendance',
				label: 'markattendance',
				link: '/dashboard/client/attendance/markattendance',
				iconName: 'ClipboardCheck',
			},
		],
	},
];
