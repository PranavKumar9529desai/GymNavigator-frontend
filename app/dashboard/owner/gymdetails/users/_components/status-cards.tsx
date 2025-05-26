import { CheckCircle2, Clock, XCircle } from "lucide-react";
import { EnrollmentStatus } from "../types";

export const statusStyles: Record<EnrollmentStatus, { bg: string, text: string, border: string }> = {
	active: {
		bg: 'bg-green-100 dark:bg-green-900/20',
		text: 'text-green-800 dark:text-green-400',
		border: 'border-green-200 dark:border-green-800'
	},
	pending: {
		bg: 'bg-yellow-100 dark:bg-yellow-900/20',
		text: 'text-yellow-800 dark:text-yellow-400',
		border: 'border-yellow-200 dark:border-yellow-800'
	},
	inactive: {
		bg: 'bg-red-100 dark:bg-red-900/20',
		text: 'text-red-800 dark:text-red-400',
		border: 'border-red-200 dark:border-red-800'
	},
};


export const statusIcons = {
	active: CheckCircle2,
	pending: Clock,
	inactive: XCircle,
};

