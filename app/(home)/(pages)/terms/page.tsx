import type { Metadata } from 'next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export const metadata: Metadata = {
	title: 'Terms of Service | GymNavigator',
	description: 'Terms of Service for GymNavigator - Your Ultimate Gym Management Solution',
};

export default function TermsPage() {
	return (
		<div className="min-h-screen bg-gradient-to-br from-blue-50/30 via-white to-indigo-50/20 p-4">
			<div className="container mx-auto max-w-4xl py-8">
				<Card className="border-blue-100 bg-white/80 backdrop-blur-sm">
					<CardHeader>
						<CardTitle className="text-2xl font-bold text-slate-800">
							Terms of Service
						</CardTitle>
						<p className="text-slate-600">
							Last updated: {new Date().toLocaleDateString()}
						</p>
					</CardHeader>
					<CardContent className="space-y-6 text-slate-700">
						<section>
							<h2 className="text-lg font-semibold text-slate-800 mb-3">
								1. Acceptance of Terms
							</h2>
							<p className="text-sm leading-relaxed">
								By accessing and using GymNavigator, you accept and agree to be bound by the terms and provision of this agreement.
							</p>
						</section>

						<section>
							<h2 className="text-lg font-semibold text-slate-800 mb-3">
								2. Use License
							</h2>
							<p className="text-sm leading-relaxed">
								Permission is granted to temporarily download one copy of GymNavigator for personal, non-commercial transitory viewing only.
							</p>
						</section>

						<section>
							<h2 className="text-lg font-semibold text-slate-800 mb-3">
								3. Disclaimer
							</h2>
							<p className="text-sm leading-relaxed">
								The materials on GymNavigator are provided on an 'as is' basis. GymNavigator makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
							</p>
						</section>

						<section>
							<h2 className="text-lg font-semibold text-slate-800 mb-3">
								4. Limitations
							</h2>
							<p className="text-sm leading-relaxed">
								In no event shall GymNavigator or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on GymNavigator, even if GymNavigator or a GymNavigator authorized representative has been notified orally or in writing of the possibility of such damage.
							</p>
						</section>

						<section>
							<h2 className="text-lg font-semibold text-slate-800 mb-3">
								5. Accuracy of Materials
							</h2>
							<p className="text-sm leading-relaxed">
								The materials appearing on GymNavigator could include technical, typographical, or photographic errors. GymNavigator does not warrant that any of the materials on its website are accurate, complete or current.
							</p>
						</section>

						<section>
							<h2 className="text-lg font-semibold text-slate-800 mb-3">
								6. Links
							</h2>
							<p className="text-sm leading-relaxed">
								GymNavigator has not reviewed all of the sites linked to its website and is not responsible for the contents of any such linked site. The inclusion of any link does not imply endorsement by GymNavigator of the site.
							</p>
						</section>

						<section>
							<h2 className="text-lg font-semibold text-slate-800 mb-3">
								7. Modifications
							</h2>
							<p className="text-sm leading-relaxed">
								GymNavigator may revise these terms of service for its website at any time without notice. By using this website you are agreeing to be bound by the then current version of these Terms of Service.
							</p>
						</section>

						<section>
							<h2 className="text-lg font-semibold text-slate-800 mb-3">
								8. Governing Law
							</h2>
							<p className="text-sm leading-relaxed">
								These terms and conditions are governed by and construed in accordance with the laws and you irrevocably submit to the exclusive jurisdiction of the courts in that location.
							</p>
						</section>
					</CardContent>
				</Card>
			</div>
		</div>
	);
} 