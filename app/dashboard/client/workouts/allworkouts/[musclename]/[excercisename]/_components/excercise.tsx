'use client';

import { useQuery } from '@tanstack/react-query';
import { BookMarked, Heart, Share2, Target } from 'lucide-react';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import {
	type Exercise,
	GetExcerciseDetails,
} from '../actions/get-excercise-details';

export const SingleWorkout = () => {
	const { excercisename = '', musclename = '' } = useParams<{
		excercisename: string;
		musclename: string;
	}>();

	const [isLiked, setIsLiked] = useState(false);

	const { data: exercise, error } = useQuery<Exercise, Error>({
		queryKey: ['exercise', musclename, excercisename],
		queryFn: () => GetExcerciseDetails(musclename, excercisename),
		enabled: !!musclename && !!excercisename,
	});

	if (error) {
		return (
			<div className="flex items-center justify-center min-h-[60vh] bg-red-50 mx-4 rounded-2xl animate-fade-in">
				<div className="text-center space-y-4 p-8">
					<div className="w-16 h-16 mx-auto bg-red-100 rounded-full flex items-center justify-center">
						<span className="text-2xl" role="img" aria-label="warning">
							⚠️
						</span>
					</div>
					<h2 className="text-2xl font-bold text-red-500">
						Exercise Not Found
					</h2>
					<p className="text-gray-600 max-w-md">
						We couldn't load this exercise. Please try again or choose a
						different one.
					</p>
				</div>
			</div>
		);
	}

	if (!exercise) {
		return null;
	}

	const videoId = exercise.video_url?.split('/').pop() || '';

	return (
		<article className="max-w-7xl mx-auto px-4 py-8">
			<div className="space-y-6 lg:space-y-12 animate-fade-in">
				{/* Exercise Header */}
				<header className="space-y-6 mb-8 lg:mb-12">
					<h1 className="text-3xl sm:text-4xl lg:text-6xl font-extrabold text-center bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
						{exercise.name}
					</h1>

					<div className="flex flex-wrap justify-center items-center gap-4">
						<div className="flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-full">
							<Target className="w-4 h-4 text-blue-500" />
							<span className="text-blue-700 font-medium">{musclename}</span>
						</div>
						<div className="flex gap-3">
							<button
								type="button"
								aria-label="Share exercise"
								className="p-2 hover:bg-gray-100 rounded-full transition-colors"
							>
								<Share2 className="w-5 h-5 text-gray-600" />
							</button>
							<button
								type="button"
								aria-label="Bookmark exercise"
								className="p-2 hover:bg-gray-100 rounded-full transition-colors"
							>
								<BookMarked className="w-5 h-5 text-gray-600" />
							</button>
							<button
								type="button"
								aria-label={isLiked ? 'Unlike exercise' : 'Like exercise'}
								onClick={() => setIsLiked(!isLiked)}
								className="p-2 hover:bg-gray-100 rounded-full transition-colors"
							>
								<Heart
									className={`w-5 h-5 ${isLiked ? 'text-red-500 fill-red-500' : 'text-gray-600'}`}
								/>
							</button>
						</div>
					</div>
				</header>

				{/* Video Section */}
				<section className="relative rounded-2xl overflow-hidden shadow-2xl bg-gray-900">
					<LazyVideo videoId={videoId} />
				</section>

				{/* Exercise Details */}
				<section className="mt-8 lg:mt-16">
					<ExerciseDescription
						img={exercise.muscle_image}
						instruction={exercise.instructions}
						muscleName={exercise.muscle_group}
					/>
				</section>
			</div>
		</article>
	);
};

const LazyVideo = ({ videoId }: { videoId: string }) => {
	const [isIntersecting, setIsIntersecting] = useState(false);
	const [isLoading, setIsLoading] = useState(true);
	const videoRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const observer = new IntersectionObserver(
			([entry]) => {
				setIsIntersecting(entry.isIntersecting);
			},
			{ threshold: 0.1 },
		);

		if (videoRef.current) {
			observer.observe(videoRef.current);
		}

		return () => {
			if (videoRef.current) {
				observer.unobserve(videoRef.current);
			}
		};
	}, []);

	return (
		<div ref={videoRef} className="aspect-video w-full relative">
			{isLoading && isIntersecting && (
				<div className="absolute inset-0 bg-gray-100 animate-pulse rounded-2xl" />
			)}
			{isIntersecting && (
				<iframe
					className="w-full h-full rounded-2xl"
					src={`https://www.youtube-nocookie.com/embed/${videoId}?start=0&rel=0&modestbranding=1`}
					title="Exercise demonstration video"
					allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
					loading="lazy"
					onLoad={() => setIsLoading(false)}
					allowFullScreen
				/>
			)}
		</div>
	);
};

const ExerciseDescription = ({
	instruction,
	muscleName,
	img,
}: {
	instruction: string;
	muscleName: string;
	img: string;
}) => {
	const instructions = instruction
		.split('.')
		.map((line) =>
			line
				.replace(/^\d+\.?\s*/, '')
				.replace(/\\n/g, ' ')
				.replace(/\s+/g, ' ')
				.trim(),
		)
		.filter((line) => line.length > 0);

	return (
		<div className="space-y-8 lg:space-y-12">
			{/* Muscle Group Header */}
			<div className="bg-gradient-to-r from-blue-50 to-blue-100 p-6 lg:p-8 rounded-2xl">
				<div className="flex items-center justify-center gap-4">
					<Target className="w-6 lg:w-8 h-6 lg:h-8 text-blue-600" />
					<h2 className="text-2xl lg:text-3xl font-bold text-blue-900">
						{muscleName.toUpperCase()}
					</h2>
				</div>
			</div>

			<div className="lg:grid lg:grid-cols-2 gap-8 lg:gap-12">
				{/* Muscle Image */}
				<figure className="relative group mb-8 lg:mb-0">
					<div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-2xl" />
					<div className="relative aspect-[4/3] w-full">
						<Image
							src={img}
							alt={`Diagram showing ${muscleName} muscle group`}
							fill
							className="rounded-2xl object-cover shadow-lg"
							sizes="(max-width: 768px) 100vw, 50vw"
							priority={false}
						/>
					</div>
				</figure>

				{/* Instructions */}
				<div className="space-y-6">
					<h3 className="text-xl lg:text-2xl font-bold text-gray-900 mb-6 lg:mb-8">
						Step-by-Step Guide
					</h3>
					<ol className="space-y-4">
						{instructions.map((line, index) => (
							<li
								key={`instruction-${line.substring(0, 20)}-${index}`}
								className="flex gap-4 p-4 rounded-xl hover:bg-gray-50 transition-colors"
							>
								<span className="flex-shrink-0 w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold">
									{index + 1}
								</span>
								<p className="text-gray-700 leading-relaxed">{line}</p>
							</li>
						))}
					</ol>
				</div>
			</div>

			{/* Footer */}
			<footer className="text-center py-8 lg:py-12">
				<div className="inline-flex items-center gap-2 px-6 py-3 bg-blue-50 rounded-full text-blue-600 font-medium">
					<Heart className="w-4 h-4" />
					<span>Subscribe to GymNavigator for more content</span>
				</div>
			</footer>
		</div>
	);
};
