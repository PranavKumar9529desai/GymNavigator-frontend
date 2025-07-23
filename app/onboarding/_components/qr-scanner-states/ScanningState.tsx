'use client';
import { QrCode, Camera, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

interface ScanningStateProps {
	videoRef: React.RefObject<HTMLVideoElement | null>;
	zoomLevel: number;
}

export function ScanningState({ videoRef, zoomLevel }: ScanningStateProps) {
	return (
		<div className="flex items-center justify-center bg-background/95 backdrop-blur-sm p-4">
			<div className="w-full max-w-sm mx-auto">
				<motion.div 
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					className="space-y-6"
				>
					{/* Scanner Header */}
					<motion.div 
						className="flex items-center justify-center space-x-3 mb-6"
						initial={{ y: -10 }}
						animate={{ y: 0 }}
					>
						<motion.div
							animate={{ 
								scale: [1, 1.1, 1],
								rotate: [0, 5, -5, 0] 
							}}
							transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY }}
						>
							<QrCode className="w-7 h-7 text-primary" />
						</motion.div>
						<h2 className="text-xl font-semibold text-foreground">Scan Gym QR Code</h2>
					</motion.div>

					{/* Video Scanner Container */}
					<motion.div 
						className="relative rounded-xl overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 border border-border shadow-xl"
						initial={{ scale: 0.95 }}
						animate={{ scale: 1 }}
						transition={{ delay: 0.2 }}
					>
						{/* Scanning Overlay with Animation */}
						<div className="absolute inset-0 z-20 pointer-events-none">
							{/* Corner Brackets */}
							{[
								{ top: '1rem', left: '1rem', rotate: '0deg' },
								{ top: '1rem', right: '1rem', rotate: '90deg' },
								{ bottom: '1rem', right: '1rem', rotate: '180deg' },
								{ bottom: '1rem', left: '1rem', rotate: '270deg' }
							].map((corner, i) => (
								<motion.div
									key={i}
									className="absolute w-6 h-6 border-l-2 border-t-2 border-primary"
									style={{ 
										...corner,
										transform: `rotate(${corner.rotate})` 
									}}
									initial={{ opacity: 0, scale: 0.8 }}
									animate={{ opacity: 1, scale: 1 }}
									transition={{ delay: 0.3 + i * 0.1 }}
								/>
							))}

							{/* Scanning Line */}
							<motion.div
								className="absolute left-4 right-4 h-0.5 bg-gradient-to-r from-transparent via-primary to-transparent"
								animate={{ top: ['20%', '80%', '20%'] }}
								transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
							/>

							{/* Pulse Effect */}
							<motion.div
								className="absolute inset-4 border border-primary/30 rounded-lg"
								animate={{ 
									scale: [1, 1.02, 1],
									opacity: [0.3, 0.6, 0.3] 
								}}
								transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
							/>
						</div>

						{/* Video Element */}
						<video 
							ref={videoRef} 
							className="w-full h-auto"
							style={{ minHeight: '280px' }}
							playsInline
							muted
						/>

						{/* Status Indicators */}
						<motion.div 
							className="absolute top-3 left-3 z-30"
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							transition={{ delay: 0.5 }}
						>
							<div className="flex items-center space-x-2 bg-black/60 backdrop-blur-sm rounded-full px-3 py-1.5">
								<motion.div
									className="w-2 h-2 bg-green-400 rounded-full"
									animate={{ opacity: [0.5, 1, 0.5] }}
									transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}
								/>
								<span className="text-xs text-white font-medium">Live</span>
							</div>
						</motion.div>

						{/* Zoom Indicator */}
						{zoomLevel !== 1.0 && (
							<motion.div 
								className="absolute top-3 right-3 z-30"
								initial={{ opacity: 0, scale: 0.8 }}
								animate={{ opacity: 1, scale: 1 }}
								transition={{ delay: 0.6 }}
							>
								<div className="flex items-center space-x-1 bg-black/60 backdrop-blur-sm rounded-full px-3 py-1.5">
									<Zap className="w-3 h-3 text-yellow-400" />
									<span className="text-xs text-white font-medium">{zoomLevel}x</span>
								</div>
							</motion.div>
						)}
					</motion.div>

					{/* Instructions */}
					<motion.div 
						className="space-y-4"
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						transition={{ delay: 0.7 }}
					>
						<div className="text-center">
							<p className="text-sm text-muted-foreground leading-relaxed">
								Position the QR code within the scanning area for automatic detection
							</p>
						</div>

						{/* Enhanced Tips */}
						<motion.div 
							className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4"
							whileHover={{ scale: 1.02 }}
							transition={{ type: "spring", stiffness: 300 }}
						>
							<div className="flex items-start space-x-3">
								<Camera className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
								<div className="space-y-2">
									<h4 className="text-sm font-medium text-blue-700 dark:text-blue-300">
										Scanning Tips
									</h4>
									<ul className="text-xs text-blue-600 dark:text-blue-400 space-y-1">
										<li>• Ensure good lighting conditions</li>
										<li>• Hold device steady while scanning</li>
										<li>• Keep QR code within the corner brackets</li>
										{zoomLevel !== 1.0 && (
											<li className="flex items-center space-x-1">
												<Zap className="w-3 h-3" />
												<span>Zoom: {zoomLevel}x active</span>
											</li>
										)}
									</ul>
								</div>
							</div>
						</motion.div>
					</motion.div>
				</motion.div>
			</div>
		</div>
	);
}
