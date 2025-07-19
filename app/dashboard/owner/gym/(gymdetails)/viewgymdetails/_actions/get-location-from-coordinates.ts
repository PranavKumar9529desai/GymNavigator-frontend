import { useState, useCallback } from 'react';

export type GeocodedAddress = {
	address: string;
	city: string;
	state: string;
	zipCode: string;
	country?: string;
	district?: string;
	suburb?: string;
	county?: string;
};

export function useGetLocationFromCoordinates() {
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const getAddress = useCallback(
		async (lat: number, lng: number): Promise<GeocodedAddress | null> => {
			setLoading(true);
			setError(null);
			try {
				const response = await fetch(
					`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&addressdetails=1`,
					{
						headers: {
							Accept: 'application/json',
						},
					},
				);
				if (!response.ok) throw new Error('Failed to fetch address');
				const data = await response.json();
				console.log('the address  from the get-location-cordiantes.ts', data);
				const address = data.address || {};
				return {
					address:
						[
							address.house_number,
							address.building,
							address.road ||
								address.street ||
								address.residential ||
								address.hamlet,
						]
							.filter(Boolean)
							.join(' ') || '',
					city: address.city || address.town || address.village || '',
					state: address.state || '',
					zipCode: address.postcode || '',
					country: address.country || '',
				};
			} catch (err: unknown) {
				setError(err instanceof Error ? err.message : 'Unknown error');
				return null;
			} finally {
				setLoading(false);
			}
		},
		[],
	);

	return { getAddress, loading, error };
}
