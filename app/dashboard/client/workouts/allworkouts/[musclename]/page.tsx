import { Suspense } from 'react';
import { SingleMuscles } from './_components/singleMuscle';
import { getSingleMuscle } from './actions/getSIngleMuscle';
import Loading from './loading';
export default async function Page({
	params,
}: {
	params: Promise<{ musclename: string }>; // Proper Next.js 15 page params type;
}) {
	// Decode the URL parameter and remove any potential encoding artifacts
	const { musclename } = await params;
	const muscleName = musclename
		.split(' ')
		.map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
		.join(' ');

	const exercises = await getSingleMuscle(muscleName);

	return (
		<main aria-labelledby="page-title">
			<header className="sr-only border-4 border-red-400">
				<h1 id="page-title">{muscleName}</h1>
			</header>

			<Suspense fallback={<Loading />}>
				<SingleMuscles exercises={exercises} muscleName={muscleName} />
			</Suspense>
		</main>
	);
}
