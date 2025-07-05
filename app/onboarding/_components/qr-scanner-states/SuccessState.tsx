'use client';
import { CheckCircle2, ArrowRight } from 'lucide-react';

export function SuccessState() {
	return (
		<div className="flex items-center justify-center bg-background/95 backdrop-blur-sm p-4">
			<div className="w-full max-w-sm mx-auto">
				<div className="space-y-6">
					{/* Success Header */}
					<div className="flex items-center justify-center space-x-3 mb-6">
						<div className="relative">
							<CheckCircle2 className="w-8 h-8 text-green-500" />
							<div className="absolute inset-0 w-8 h-8 bg-green-500/20 rounded-full animate-ping" />
						</div>
						<h2 className="text-xl font-semibold text-foreground">QR Code Scanned!</h2>
					</div>
					
					{/* Success Card */}
					<div className="relative rounded-xl overflow-hidden bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 border border-green-200 dark:border-green-800 shadow-lg">
						{/* Animated Background Pattern */}
						<div className="absolute inset-0 opacity-20">
							<div className="absolute top-4 right-4 w-8 h-8 bg-green-400 rounded-full animate-pulse" />
							<div className="absolute bottom-4 left-4 w-6 h-6 bg-emerald-400 rounded-full animate-pulse delay-1000" />
						</div>

						<div className="relative flex flex-col items-center justify-center p-10 space-y-6">
							{/* Success Icon with Animation */}
							<div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center">
								<CheckCircle2 className="w-8 h-8 text-green-600 dark:text-green-400" />
							</div>
							
							{/* Success Message */}
							<div className="text-center space-y-3">
								<h3 className="text-lg font-semibold text-green-700 dark:text-green-300">
									Successfully Verified!
								</h3>
								<p className="text-sm text-green-600 dark:text-green-400">
									Redirecting to gym enrollment...
								</p>
							</div>

							{/* Redirect Indicator */}
							<div className="flex items-center space-x-2 text-green-600 dark:text-green-400">
								<span className="text-xs font-medium">Taking you there</span>
								<div className="animate-bounce">
									<ArrowRight className="w-4 h-4" />
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
