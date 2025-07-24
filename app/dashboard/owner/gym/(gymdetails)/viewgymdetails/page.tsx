import { GymHeader } from './_components/gym-header';
import { GymTabs } from './_components/tabs/gym-tabs';
import { ViewGymDetailsClient } from './_components/view-gym-details-client';
import FetchGymDetailsSA from './_actions/GetGymDetails';
import { getAllGymTabData } from './_actions/get-gym-tab-data';
import type { GymData } from './types/gym-types';
import { Suspense } from 'react';
import Loading from './loading';
import { unstable_ViewTransition as ViewTransition } from 'react';

// Helper to format address object to string
interface AddressObj {
	street?: string;
	city?: string;
	state?: string;
	postalCode?: string;
	country?: string;
}
function formatAddress(addressObj: AddressObj | null | undefined) {
	if (!addressObj) return '';
	const { street, city, state, postalCode, country } = addressObj;
	return [street, city, state, postalCode, country].filter(Boolean).join(', ');
}

export default async function GymLayout() {
	// Server-side data fetching
	const [gymDetails, gymTabData] = await Promise.all([
		FetchGymDetailsSA(),
		getAllGymTabData(),
	]);

	console.log('Gym Details from the ViewGymdeatails Route', gymDetails);
	console.log('Gym Details from the location tab is ', gymTabData?.location);

	// Convert GymInfo to GymData format
	const convertedGymData: GymData | null = gymDetails
		? {
				gym_name: gymDetails.gym_name,
				gym_logo: gymDetails.gym_logo,
				address:
					typeof gymDetails.address === 'object'
						? formatAddress(gymDetails.address)
						: gymDetails.address,
				phone_number: gymDetails.phone_number,
				Email: gymDetails.Email,
				gymauthtoken: gymDetails.gymauthtoken,
				// Initialize other optional fields
				amenities: {},
				fitnessPlans: [],
			}
		: null;

	// Handle error states
	if (!gymDetails && !gymTabData) {
		return (
			<div className="min-h-screen p-2 md:p-6">
				<div className="mx-auto max-w-6xl">
					<div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
						<p className="text-red-800">
							Error loading gym data. Please try again later.
						</p>
					</div>
				</div>
			</div>
		);
	}

	return (
		// <Suspense fallback={< Loading />}>

		<div className="min-h-screen p-2 md:p-6">
			<div className="mx-auto max-w-6xl">
				{/* Pass data to client component for edit functionality */}
				<ViewGymDetailsClient
					gymData={convertedGymData}
					gymTabData={gymTabData}
				/>

				{gymDetails && <GymHeader gymData={convertedGymData} />}

				{/* Enhanced Tabs Section */}
				<div className="">
					<GymTabs
						overviewData={gymTabData?.overview}
						amenitiesData={gymTabData?.amenities}
						locationData={gymTabData?.location}
						pricingData={gymTabData?.pricing}
					/>
				</div>
			</div>
		</div>
		// </Suspense>
	);
}
