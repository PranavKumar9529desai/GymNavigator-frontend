import Link from 'next/link';

export default function Home() {
	return (
		<>
			<main className="flex min-h-screen flex-col items-center justify-between p-24">
				<h1 className="text-4xl font-bold">
					Welcome to GymNavigator
					<Link href="/healthprofileform" className="text-blue-400 ">
						{' '}
						healthprofile
					</Link>
				</h1>
			</main>
		</>
	);
}
