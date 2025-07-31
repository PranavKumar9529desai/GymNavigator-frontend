import type { Metadata } from 'next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export const metadata: Metadata = {
	title: 'Privacy Policy | GymNavigator',
	description: 'Privacy Policy for GymNavigator - Your Ultimate Gym Management Solution',
};

export default function PrivacyPage() {
	return (
		<div className="min-h-screen bg-gradient-to-br from-blue-50/30 via-white to-indigo-50/20 p-4">
			<div className="container mx-auto max-w-4xl py-8">
				<Card className="border-blue-100 bg-white/80 backdrop-blur-sm">
					<CardHeader>
						<CardTitle className="text-2xl font-bold text-slate-800">
							Privacy Policy
						</CardTitle>
						<p className="text-slate-600">
							Last updated: {new Date().toLocaleDateString()}
						</p>
					</CardHeader>
					<CardContent className="space-y-6 text-slate-700">
						<section>
							<h2 className="text-lg font-semibold text-slate-800 mb-3">
								1. Information We Collect
							</h2>
							<p className="text-sm leading-relaxed">
								We collect information you provide directly to us, such as when you create an account, complete your profile, or communicate with us. This may include your name, email address, phone number, gym membership details, and fitness-related information.
							</p>
						</section>

						<section>
							<h2 className="text-lg font-semibold text-slate-800 mb-3">
								2. How We Use Your Information
							</h2>
							<p className="text-sm leading-relaxed">
								We use the information we collect to provide, maintain, and improve our services, communicate with you, and personalize your experience. This includes managing your gym membership, tracking your fitness progress, and connecting you with trainers.
							</p>
						</section>

						<section>
							<h2 className="text-lg font-semibold text-slate-800 mb-3">
								3. Information Sharing
							</h2>
							<p className="text-sm leading-relaxed">
								We do not sell, trade, or otherwise transfer your personal information to third parties without your consent, except as described in this policy. We may share information with your gym, trainers, or service providers who assist us in operating our platform.
							</p>
						</section>

						<section>
							<h2 className="text-lg font-semibold text-slate-800 mb-3">
								4. Data Security
							</h2>
							<p className="text-sm leading-relaxed">
								We implement appropriate security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the internet is 100% secure.
							</p>
						</section>

						<section>
							<h2 className="text-lg font-semibold text-slate-800 mb-3">
								5. Data Retention
							</h2>
							<p className="text-sm leading-relaxed">
								We retain your personal information for as long as necessary to provide our services and fulfill the purposes outlined in this policy. You may request deletion of your account and associated data at any time.
							</p>
						</section>

						<section>
							<h2 className="text-lg font-semibold text-slate-800 mb-3">
								6. Your Rights
							</h2>
							<p className="text-sm leading-relaxed">
								You have the right to access, update, or delete your personal information. You may also opt out of certain communications and request a copy of your data. Contact us to exercise these rights.
							</p>
						</section>

						<section>
							<h2 className="text-lg font-semibold text-slate-800 mb-3">
								7. Cookies and Tracking
							</h2>
							<p className="text-sm leading-relaxed">
								We use cookies and similar technologies to enhance your experience, analyze usage patterns, and provide personalized content. You can control cookie settings through your browser preferences.
							</p>
						</section>

						<section>
							<h2 className="text-lg font-semibold text-slate-800 mb-3">
								8. Third-Party Services
							</h2>
							<p className="text-sm leading-relaxed">
								Our platform may integrate with third-party services such as payment processors and analytics providers. These services have their own privacy policies, and we encourage you to review them.
							</p>
						</section>

						<section>
							<h2 className="text-lg font-semibold text-slate-800 mb-3">
								9. Children's Privacy
							</h2>
							<p className="text-sm leading-relaxed">
								Our services are not intended for children under 13 years of age. We do not knowingly collect personal information from children under 13. If you believe we have collected such information, please contact us.
							</p>
						</section>

						<section>
							<h2 className="text-lg font-semibold text-slate-800 mb-3">
								10. Changes to This Policy
							</h2>
							<p className="text-sm leading-relaxed">
								We may update this privacy policy from time to time. We will notify you of any material changes by posting the new policy on our website and updating the "Last updated" date.
							</p>
						</section>

						<section>
							<h2 className="text-lg font-semibold text-slate-800 mb-3">
								11. Contact Us
							</h2>
							<p className="text-sm leading-relaxed">
								If you have any questions about this privacy policy or our data practices, please contact us at privacy@gymnavigator.com.
							</p>
						</section>
					</CardContent>
				</Card>
			</div>
		</div>
	);
} 