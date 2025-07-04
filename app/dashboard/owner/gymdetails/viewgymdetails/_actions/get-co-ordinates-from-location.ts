import { useState, useCallback } from 'react';

export type AddressInput = {
	address?: string;
	city?: string;
	state?: string;
	zipCode?: string;
	country?: string;
};

export type Coordinates = {
	lat: number;
	lng: number;
};

export function useGetCoordinatesFromLocation() {
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const getCoordinates = useCallback(
		async (addressData: AddressInput): Promise<Coordinates | null> => {
			setLoading(true);
			setError(null);

			try {
				// Build the query string from the address components
				const addressParts = [
					addressData.address,
					addressData.city,
					addressData.state,
					addressData.zipCode,
					addressData.country,
				].filter(Boolean);

				if (addressParts.length === 0) {
					throw new Error('At least one address field is required');
				}

				const query = addressParts.join(', ');

				// Use Nominatim geocoding API to get coordinates from address
				const response = await fetch(
					`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&addressdetails=1&limit=1`,
					{
						headers: {
							Accept: 'application/json',
						},
					},
				);

				if (!response.ok) {
					throw new Error('Failed to fetch coordinates');
				}

				const data = await response.json();
				console.log(
					'Geocoding response from get-co-ordinates-from-location.ts',
					data,
				);

				if (!data || data.length === 0) {
					throw new Error('No coordinates found for the provided address');
				}

				const result = data[0];
				const lat = Number.parseFloat(result.lat);
				const lng = Number.parseFloat(result.lon);

				if (Number.isNaN(lat) || Number.isNaN(lng)) {
					throw new Error('Invalid coordinates received');
				}

				return {
					lat,
					lng,
				};
			} catch (err: unknown) {
				console.error('Geocoding error:', err);
				setError(
					err instanceof Error
						? err.message
						: 'Unknown error occurred while geocoding',
				);
				return null;
			} finally {
				setLoading(false);
			}
		},
		[],
	);

	return { getCoordinates, loading, error };
}
