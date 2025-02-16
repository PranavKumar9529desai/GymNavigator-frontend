import ViewTrainersList from '@/app/ownerdashboard/trainers/viewtrainers/viewTrainers';
import { getTrainerAssociatedWithGym } from './GetTrainerAssociatedWithGym';
export default async function Page() {
  const trainers: TrainerType[] | [] = await getTrainerAssociatedWithGym();

  return (
    <>
      <ViewTrainersList Trainers={trainers} />
    </>
  );
}
