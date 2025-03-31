'use client';
import { m } from 'framer-motion';
import { ArrowRight, Clock, Shield, Zap } from 'lucide-react';
import Link from 'next/link';
import CustomButton from '../../_component/CustomButton';

const CtaSection = () => {
	return (
		<section className="relative py-20 overflow-hidden">
			{/* Background gradient */}
			<div className="absolute inset-0 bg-gradient-to-b from-gray-900 via-blue-900/10 to-gray-900" />

			{/* Content */}
			<div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<m.div
					initial={{ opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
					transition={{ duration: 0.8 }}
					className="text-center mb-12"
				>
					<h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-blue-400 via-purple-400 to-blue-600 bg-clip-text text-transparent">
						Transform Your Gym Today
					</h2>
					<p className="text-gray-400 text-lg max-w-2xl mx-auto">
						Join thousands of successful gym owners who have revolutionized
						their business with GymDominator
					</p>
				</m.div>

				{/* Features grid */}
				<div className="grid md:grid-cols-3 gap-8 mb-12">
					{[
						{
							icon: Zap,
							title: 'Quick Setup',
							description: 'Get started in less than 5 minutes',
						},
						{
							icon: Shield,
							title: 'Secure Platform',
							description: 'Enterprise-grade security for your data',
						},
						{
							icon: Clock,
							title: '24/7 Support',
							description: 'Round-the-clock expert assistance',
						},
					].map((feature, index) => (
						<m.div
							key={index as number}
							initial={{ opacity: 0, y: 20 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true }}
							transition={{ delay: index * 0.2 }}
							className="bg-gray-800/30 backdrop-blur-sm rounded-xl p-6 border border-gray-700"
						>
							<feature.icon className="w-12 h-12 text-blue-400 mb-4" />
							<h3 className="text-xl font-semibold text-white mb-2">
								{feature.title}
							</h3>
							<p className="text-gray-400">{feature.description}</p>
						</m.div>
					))}
				</div>

				{/* CTA Buttons */}
				<m.div
					initial={{ opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
					transition={{ delay: 0.6 }}
					className="flex flex-col sm:flex-row items-center justify-center gap-4"
				>
					<CustomButton className="w-full sm:w-auto" />
					<Link
						href="/contact"
						className="text-gray-300 hover:text-white px-8 py-3 rounded-full border border-gray-700 
                     hover:border-blue-500 transition-all duration-300 flex items-center"
					>
						Schedule Demo
						<ArrowRight className="w-5 h-5 ml-2" />
					</Link>
				</m.div>
			</div>
		</section>
	);
};

export default CtaSection;
