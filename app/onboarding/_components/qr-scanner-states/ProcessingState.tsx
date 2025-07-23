'use client';
import { QrCode } from 'lucide-react';

export function ProcessingState() {
	return (
		<div className="flex items-center justify-center bg-background/95 backdrop-blur-sm p-4">
			<div className="w-full max-w-sm mx-auto">
				<div className="space-y-6">
					<div className="flex items-center justify-center space-x-3 mb-6">
						<div className="animate-spin">
							<QrCode className="w-7 h-7 text-primary" />
						</div>
						<h2 className="text-xl font-semibold text-foreground">Processing QR Code</h2>
					</div>
					
					<div className="relative rounded-xl overflow-hidden bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 border border-border/50 shadow-lg">
						<div className="flex flex-col items-center justify-center p-10 space-y-6">
							{/* Enhanced Loading Spinner */}
							<div className="relative">
								<div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
								<div className="absolute inset-0 w-12 h-12 border-4 border-transparent border-r-primary/40 rounded-full animate-spin-slow" />
							</div>
							
							{/* Animated Text */}
							<div className="text-center space-y-2">
								<p className="text-base font-medium text-foreground animate-pulse">
									Processing your request...
								</p>
								<p className="text-sm text-muted-foreground">
									Please wait while we verify your QR code
								</p>
							</div>

							{/* Progress Dots */}
							<div className="flex space-x-2">
								{[0, 1, 2].map((i) => (
									<div
										 key={ i as number } 
										className="w-2 h-2 bg-primary rounded-full animate-bounce"
										style={{ animationDelay: `${i * 0.2}s` }}
									/>
								))}
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
