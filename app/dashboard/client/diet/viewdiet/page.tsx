import { Suspense } from 'react';
import DietLoading from '../loading';
import TodaysDiet from './_components/todays-diet';

export default function ViewDietPage() {
  return (
    <Suspense fallback={<DietLoading />}>
      <TodaysDiet />
    </Suspense>
  );
}
