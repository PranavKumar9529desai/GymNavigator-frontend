declare module 'sonner' {
	interface ToasterProps {
		richColors?: boolean;
		theme?: 'light' | 'dark' | 'system';
		position?:
			| 'top-left'
			| 'top-right'
			| 'bottom-left'
			| 'bottom-right'
			| 'top-center'
			| 'bottom-center';
		closeButton?: boolean;
		duration?: number;
	}

	export const Toaster: React.FC<ToasterProps>;
	export const toast: {
		(message: string): void;
		success: (
			message: string,
			options?: {
				description?: string;
				action?: {
					label: string;
					onClick: () => void;
				};
			},
		) => void;
		loading: (
			message: string,
			options?: {
				description?: string;
				action?: {
					label: string;
					onClick: () => void;
				};
			},
		) => void;
		error: (
			message: string,
			options?: {
				description?: string;
				action?: {
					label: string;
					onClick: () => void;
				};
			},
		) => void;
		warning: (
			message: string,
			options?: {
				description?: string;
				action?: {
					label: string;
					onClick: () => void;
				};
			},
		) => void;
		info: (
			message: string,
			options?: {
				description?: string;
				action?: {
					label: string;
					onClick: () => void;
				};
			},
		) => void;
		dismiss: () => void;
	};
}
