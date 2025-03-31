import { Card, CardContent } from '@/components/ui/card';
import { Star } from 'lucide-react';
export default function TestimonialCard({
	quote,
	author,
	role,
}: {
	quote: string;
	author: string;
	role: string;
}) {
	return (
		<Card className="bg-gray-800 border-none">
			<CardContent className="p-6">
				<div className="flex mb-4">
					{[1, 2, 3, 4, 5].map((star) => (
						<Star key={star} className="h-5 w-5 text-yellow-400 fill-current" />
					))}
				</div>
				<p className="text-gray-300 mb-4">{quote}</p>
				<div>
					<p className="font-semibold">{author}</p>
					<p className="text-sm text-gray-400">{role}</p>
				</div>
			</CardContent>
		</Card>
	);
}
