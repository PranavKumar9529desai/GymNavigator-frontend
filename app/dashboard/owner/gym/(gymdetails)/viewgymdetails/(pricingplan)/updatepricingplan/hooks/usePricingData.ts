import { useCallback, useEffect, useState } from 'react';
import type { GymData } from '../../../types/gym-types';
import { fetchGymDetails, fetchPricingData } from '../api/pricing';

export function usePricingData() {
	const [gymData, setGymData] = useState<GymData | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	const fetchData = useCallback(async () => {
		setLoading(true);
		setError(null);
		try {
			const [gymDetails, pricing] = await Promise.all([
				fetchGymDetails(),
				fetchPricingData(),
			]);
			if (!gymDetails) {
				setError('Failed to fetch gym details');
				setGymData(null);
				return;
			}
			setGymData({
				...gymDetails,
				fitnessPlans: pricing.pricingPlans || [],
				amenities: gymDetails.amenities || {},
			});
			if (pricing.error) {
				setError(pricing.error);
			}
		} catch (_err) {
			setError('An unexpected error occurred');
			setGymData(null);
		} finally {
			setLoading(false);
		}
	}, []);

	useEffect(() => {
		fetchData();
	}, [fetchData]);

	return {
		gymData,
		setGymData,
		loading,
		error,
		refetch: fetchData,
	};
}
