import AuthTokenSubmission from './AuthTokenSubmission';

// Prevent static generation for this page
export const dynamic = 'force-dynamic';

export default async function GymPage({
	params,
}: {
	params: Promise<{ gymid: string }>;
}) {
	console.log('params', await params);
	return (
		<div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
			<h1 className="text-2xl font-bold text-center mb-8">Verify Gym Access</h1>
			<AuthTokenSubmission />
		</div>
	);
}
