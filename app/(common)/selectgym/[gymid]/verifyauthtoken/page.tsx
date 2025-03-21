import { notFound } from 'next/navigation';
import { fetchGymById } from '../../[gymid]/_actions/fetch-gym-by-id';
import { AuthTokenForm } from './_components/auth-token-form';

// Prevent static generation
export const dynamic = 'force-dynamic';

export default async function VerifyAuthTokenPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const gym = await fetchGymById((await params).id);

  if (!gym) {
    notFound();
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="w-full max-w-lg">
        <h1 className="text-2xl font-bold text-center mb-8">Verify Gym Access</h1>
        <AuthTokenForm gym={gym} />
      </div>
    </div>
  );
}
