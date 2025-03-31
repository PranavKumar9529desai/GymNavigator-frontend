import ErrorScreen from '@/components/extras/ErrorScreen';
import React from 'react';
import GetTrainerStats from './(common)/GetTrainerstats';
import TrainerStats from './(common)/components/TrainerStats';

export default async function Page() {
	const trainerData = await GetTrainerStats();

	if ('error' in trainerData) {
		return <ErrorScreen error={trainerData.error} />;
	}

	return <TrainerStats data={trainerData} />;
}
