'use client';
import { Button } from '@/components/ui/button';
import { m } from 'framer-motion';
import { ArrowLeft, RefreshCcw, XCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface AuthTokenWrongProps {
	onRetry: () => void;
}

const AuthTokenWrong = ({ onRetry }: AuthTokenWrongProps) => {
	const router = useRouter();

	return (
		<m.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			className="text-center p-6"
		>
			<div className="mb-6">
				<XCircle className="h-16 w-16 text-red-500 mx-auto" />
			</div>

			<h3 className="text-xl font-semibold text-gray-900 mb-3">
				Authentication Failed
			</h3>

			<p className="text-gray-600 mb-8">
				The authentication token you entered is incorrect. Please try again or
				select another gym.
			</p>

			<div className="space-y-3">
				<Button
					onClick={onRetry}
					className="w-full bg-blue-600 hover:bg-blue-700 text-white py-6"
				>
					<RefreshCcw className="w-5 h-5 mr-2" />
					Try Again
				</Button>

				<Button
					onClick={() => router.push('/selectgym')}
					variant="outline"
					className="w-full border-gray-300 py-6"
				>
					<ArrowLeft className="w-5 h-5 mr-2" />
					Select Another Gym
				</Button>
			</div>
		</m.div>
	);
};

export default AuthTokenWrong;
