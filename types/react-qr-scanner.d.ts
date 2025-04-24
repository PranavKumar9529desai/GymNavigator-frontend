declare module '@yudiel/react-qr-scanner' {
	export interface Result {
		getText(): string;
	}

	export interface ScannerProps {
		onResult: (result: Result) => void | Promise<void>;
		onError?: (error: Error) => void;
	}

	export const Scanner: React.ComponentType<ScannerProps>;
}
