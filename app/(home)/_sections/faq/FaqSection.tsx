'use client';
import { m } from 'framer-motion';
import { Minus, Plus } from 'lucide-react';
import { useState } from 'react';

const faqs = [
	{
		question: 'How can I create a gym?',
		answer:
			"Log in as an owner, then create a gym using the gym creation form. This will set up your gym's profile and management dashboard.",
	},
	{
		question: 'How do I onboard users?',
		answer:
			"Users sign in to the clients portal. As an owner, you'll display your gym's onboarding QR code. Users scan this code and appear in your onboarding users section. You'll then need to set their active period, after which they can access their client portal.",
	},
	{
		question: 'How will users mark attendance?',
		answer:
			"Display the attendance QR code at your gym. Users can scan this through their client portal's QR scanner in the attendance section, which automatically marks their attendance for the day.",
	},
	{
		question: 'How do I assign trainers to users?',
		answer:
			"In the trainer section, use the 'Assign Trainer' component to pair users with their designated trainers. This creates the trainer-client relationship in the system.",
	},
	{
		question: 'How can I assign personalized workouts and diets?',
		answer:
			'Once trainers are assigned to users, they can access their clients through the trainer portal. Trainers can then create and assign personalized workout plans and diet schedules, which will be visible to clients in their portal.',
	},
];

export default function FaqSection() {
	const [activeIndex, setActiveIndex] = useState<number | null>(null);

	return (
		<section className="py-24 bg-gradient-to-b from-black to-gray-900">
			<div className="container mx-auto px-4">
				<m.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6 }}
					className="text-center mb-16"
				>
					<h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">
						Frequently Asked Questions
					</h2>
					<p className="text-gray-400 text-lg">
						Everything you need to know about managing your gym
					</p>
				</m.div>

				<div className="max-w-3xl mx-auto">
					{faqs.map((faq, index) => (
						<m.div
							key={index as number}
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ delay: index * 0.1 }}
							className="mb-4"
						>
							<button
								type="button"
								onClick={() =>
									setActiveIndex(activeIndex === index ? null : index)
								}
								className="w-full bg-gradient-to-r from-gray-900 to-gray-800 p-6 rounded-lg border border-gray-700 hover:border-blue-500 transition-all duration-300 flex items-center justify-between group"
							>
								<span className="text-lg font-semibold text-left text-white group-hover:text-blue-400">
									{faq.question}
								</span>
								<m.div
									animate={{ rotate: activeIndex === index ? 180 : 0 }}
									transition={{ duration: 0.3 }}
									className="text-blue-500"
								>
									{activeIndex === index ? (
										<Minus className="w-5 h-5" />
									) : (
										<Plus className="w-5 h-5" />
									)}
								</m.div>
							</button>
							<m.div
								initial={{ height: 0, opacity: 0 }}
								animate={{
									height: activeIndex === index ? 'auto' : 0,
									opacity: activeIndex === index ? 1 : 0,
								}}
								transition={{ duration: 0.3 }}
								className="overflow-hidden"
							>
								<div className="p-6 bg-gray-800/50 rounded-b-lg border-x border-b border-gray-700">
									<p className="text-gray-300 leading-relaxed">{faq.answer}</p>
								</div>
							</m.div>
						</m.div>
					))}
				</div>
			</div>
		</section>
	);
}
