'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import type { GymData, GymLocation } from '../../types/gym-types';
import { useState, useEffect, useTransition } from 'react';
import { useGetLocationFromCoordinates } from '../../_actions/get-location-from-coordinates';
import { useGetCoordinatesFromLocation } from '../../_actions/get-co-ordinates-from-location';
import { MapPin } from 'lucide-react';
import { updateGymLocation } from '../../_actions/submit-gym-tabs-form';
import { toast } from 'sonner';

interface LocationEditFormProps {
	data: GymData;
	onDataChange: (data: GymData) => void;
	onSave?: () => void;
}

export function LocationEditForm({
	data,
	onDataChange,
	onSave,
}: LocationEditFormProps) {
	const [locationFormData, setLocationFormData] = useState<GymLocation>({
		street: data.location?.street || '',
		city: data.location?.city || '',
		state: data.location?.state || '',
		postalCode: data.location?.postalCode || '',
		country: data.location?.country || '',
		latitude: data.location?.latitude,
		longitude: data.location?.longitude,
	});
	console.log('data is in the locatio tab is', data);
	console.log('the location data is', locationFormData);
	const [isPending, startTransition] = useTransition();

	const {
		getAddress,
		loading: geoLoading,
		error: geoError,
	} = useGetLocationFromCoordinates() as {
		getAddress: (
			lat: number,
			lng: number,
		) => Promise<{
			address?: string;
			city?: string;
			state?: string;
			zipCode?: string;
			country?: string;
		} | null>;
		loading: boolean;
		error: string | Error | undefined;
	};
	const {
		getCoordinates,
		loading: coordLoading,
		error: coordError,
	} = useGetCoordinatesFromLocation();

	// Effect to update form state when initial data changes
	useEffect(() => {
		setLocationFormData({
			street: data.location?.street || '',
			city: data.location?.city || '',
			state: data.location?.state || '',
			postalCode: data.location?.postalCode || '',
			country: data.location?.country || '',
			latitude: data.location?.latitude,
			longitude: data.location?.longitude,
		});
	}, [data.location]);

	const updateLocation = async (
		latitude: number,
		longitude: number,
		_fromSearch = false,
	) => {
		// The updateLocation function now only handles state update and reverse geocoding
		// The map-related logic has been removed based on the user's request to remove the map.
		const _updatedLocation: GymLocation = {
			...locationFormData,
			latitude,
			longitude,
		};
		// setLocationFormData(updatedLocation); // Update state after reverse geocoding
		// onDataChange({ ...data, location: updatedLocation }); // Call onDataChange after reverse geocoding

		if (
			latitude !== undefined &&
			longitude !== undefined &&
			typeof getAddress === 'function'
		) {
			const result = await getAddress(latitude, longitude);
			if (result) {
				const updatedLocationWithAddress: GymLocation = {
					...locationFormData,
					latitude,
					longitude,
					street: result.address || '',
					city: result.city || '',
					state: result.state || '',
					postalCode: result.zipCode || '',
					country: result.country || '',
				};
				console.log('using the inline version');
				setLocationFormData(updatedLocationWithAddress);
				onDataChange({ ...data, location: updatedLocationWithAddress });
			} else if (geoError) {
				// Check if geoError is an Error object before accessing message
				console.error(
					'Geocoding error:',
					geoError instanceof Error ? geoError.message : String(geoError),
				);
			}
		} else if (!(typeof getAddress === 'function')) {
			console.error('getAddress function is not available');
		}
		// }
	};

	// Keep handleInputChange for manual address field updates, though fields are removed from JSX now
	const handleInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const { id, value } = e.target;
		const updatedLocation: GymLocation = {
			...locationFormData,
			[id]: value,
		};
		setLocationFormData(updatedLocation);
		onDataChange({ ...data, location: updatedLocation });

		// Auto-geocode when enough address info is provided
		const hasAddressInfo =
			updatedLocation.street ||
			updatedLocation.city ||
			updatedLocation.postalCode;
		if (hasAddressInfo && !coordLoading) {
			try {
				const coordinates = await getCoordinates({
					address: updatedLocation.street,
					city: updatedLocation.city,
					state: updatedLocation.state,
					zipCode: updatedLocation.postalCode,
					country: updatedLocation.country,
				});

				if (coordinates) {
					const locationWithCoords: GymLocation = {
						...updatedLocation,
						latitude: coordinates.lat,
						longitude: coordinates.lng,
					};
					setLocationFormData(locationWithCoords);
					onDataChange({ ...data, location: locationWithCoords });
				}
			} catch (error) {
				console.error('Error getting coordinates:', error);
				// Continue without coordinates - let the user manually use the location button if needed
			}
		}
	};

	// Add handler for "Use my current location" button
	const handleUseMyLocationClick = () => {
		if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(
				async (position) => {
					const { latitude, longitude } = position.coords;
					console.log('Geolocation successful:', latitude, longitude);
					// Use the existing updateLocation function to trigger reverse geocoding
					// Pass false for fromSearch as this is not from the map search
					await updateLocation(latitude, longitude, false);
				},
				(error) => {
					console.error('Geolocation error:', error);
					// Handle geolocation errors, maybe update a state to show a message to the user
					// You might want to add a separate state for geolocation errors vs geocoding errors
				},
			);
		} else {
			console.error('Geolocation is not supported by this browser.');
			// Handle case where geolocation is not supported
		}
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		startTransition(async () => {
			try {
				let finalLocationData = { ...locationFormData };

				// If we don't have coordinates but have address info, try to geocode
				if (
					(!finalLocationData.latitude || !finalLocationData.longitude) &&
					(finalLocationData.street ||
						finalLocationData.city ||
						finalLocationData.postalCode)
				) {
					console.log(
						'Missing coordinates, attempting to geocode before submit...',
					);

					const coordinates = await getCoordinates({
						address: finalLocationData.street,
						city: finalLocationData.city,
						state: finalLocationData.state,
						zipCode: finalLocationData.postalCode,
						country: finalLocationData.country,
					});

					if (coordinates) {
						finalLocationData = {
							...finalLocationData,
							latitude: coordinates.lat,
							longitude: coordinates.lng,
						};
						// Update the form state with the new coordinates
						setLocationFormData(finalLocationData);
						onDataChange({ ...data, location: finalLocationData });
					} else {
						// If geocoding fails, show an error and don't submit
						toast.error(
							"Could not find coordinates for the provided address. Please check the address or use 'Use my current location'.",
						);
						return;
					}
				}

				// Before constructing LocationData, check for latitude/longitude
				if (
					finalLocationData.latitude === undefined ||
					finalLocationData.longitude === undefined
				) {
					toast.error(
						"Latitude and longitude are required. Please provide a valid address or use 'Use my current location'.",
					);
					return;
				}
				const LocationData = {
					street: finalLocationData.street || '',
					city: finalLocationData.city || '',
					state: finalLocationData.state || '',
					postalCode: finalLocationData.postalCode || '',
					country: finalLocationData.country || 'india',
					latitude: finalLocationData.latitude as number,
					longitude: finalLocationData.longitude as number,
				};

				await updateGymLocation(LocationData);
				toast.success('Location updated successfully!');
				onSave?.();
			} catch (error) {
				console.error('Error updating location:', error);
				toast.error('Failed to update location. Please try again.');
			}
		});
	};

	return (
		<form onSubmit={handleSubmit} className="space-y-4">
			{/* Map container - Removed */}
			{/* <div ref={mapContainerRef} style={{ height: '400px', width: '100%' }} className="rounded-md z-0"></div> */}

			{/* Address fields - Make visible */}
			<div className="space-y-2">
				<Label htmlFor="street">Street Address</Label>
				<Input
					id="street"
					value={locationFormData.street || ''}
					onChange={handleInputChange}
					placeholder="Enter street address"
				/>
			</div>
			<div className="space-y-2">
				<Label htmlFor="city">City</Label>
				<Input
					id="city"
					value={locationFormData.city || ''}
					onChange={handleInputChange}
					placeholder="Enter city"
				/>
			</div>
			<div className="space-y-2">
				<Label htmlFor="state">State</Label>
				<Input
					id="state"
					value={locationFormData.state || ''}
					onChange={handleInputChange}
					placeholder="Enter state"
				/>
			</div>
			<div className="space-y-2">
				<Label htmlFor="postalCode">Postal Code</Label>
				<Input
					id="postalCode"
					value={locationFormData.postalCode || ''}
					onChange={handleInputChange}
					placeholder="Enter postal code"
				/>
			</div>
			<div className="space-y-2">
				<Label htmlFor="country">Country</Label>
				<Input
					id="country"
					value={locationFormData.country || ''}
					onChange={handleInputChange}
					placeholder="Enter country"
				/>
			</div>
			{/* Add "Use my current location" button */}
			<div className="w-full  flex justify-center">
				<Button
					type="button"
					onClick={handleUseMyLocationClick}
					className=" text-white bg-blue-600 max-w-[200px] border"
				>
					<MapPin className="h-4 w-4" />
					Use my current Location
				</Button>
			</div>
			{/* Optionally show lat/lng if present */}
			{locationFormData.latitude !== undefined &&
				locationFormData.longitude !== undefined && (
					<div className="text-sm text-gray-600">
						Lat: {locationFormData.latitude.toFixed(6)}, Lng:{' '}
						{locationFormData.longitude.toFixed(6)}
					</div>
				)}
			{geoLoading && <div className="text-blue-600">Fetching address...</div>}
			{coordLoading && (
				<div className="text-blue-600">Finding coordinates...</div>
			)}
			{geoError && (
				<div className="text-red-600">
					Error fetching address:{' '}
					{geoError instanceof Error ? geoError.message : String(geoError)}
				</div>
			)}
			{coordError && (
				<div className="text-red-600">
					Error finding coordinates: {coordError}
				</div>
			)}

			<div className="flex gap-2 pt-4">
				<Button type="submit" disabled={isPending} className="flex-1">
					{isPending ? 'Saving...' : 'Save Location'}
				</Button>
			</div>
		</form>
	);
}
