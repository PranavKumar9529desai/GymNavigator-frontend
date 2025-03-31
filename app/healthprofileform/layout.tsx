import Image from 'next/image';

export default function HealtProfileFormLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<main className="min-h-screen">
			<div className="container mx-auto px-4 pt-6">
				<div className="flex flex-col items-center justify-center mb-10 sm:flex-row sm:gap-4">
					<div className="relative h-20 w-20 mb-4 sm:mb-0">
						<Image
							src="/android-chrome-512x512.png"
							alt="GymNavigator Logo"
							fill
							priority
							className="object-contain drop-shadow-md"
						/>
					</div>
					<div className="flex flex-col items-center sm:items-start">
						<h1 className="text-3xl font-extrabold tracking-tight drop-shadow-sm">
							<span className="font-black text-gray-800">Gym</span>
							<span className="bg-gradient-to-r from-blue-500 to-blue-700 bg-clip-text text-transparent font-black">
								Navigator
							</span>
						</h1>
						<span className="text-gray-500 text-sm mt-1 italic">
							Your Ultimate Gym Management Solution
						</span>
					</div>
				</div>
			</div>
			<div className="container mx-auto px-4">{children}</div>
		</main>
	);
}
