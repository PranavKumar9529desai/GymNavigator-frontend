import ViewTrainersList from '@/app/dashboard/owner/trainers/viewtrainers/viewTrainers';
import { getTrainerAssociatedWithGym } from './GetTrainerAssociatedWithGym';
export default async function Page() {
	const trainers: TrainerType[] | [] = await getTrainerAssociatedWithGym();

	return (
		<>
			<ViewTrainersList Trainers={trainers} />
		</>
	);
}
