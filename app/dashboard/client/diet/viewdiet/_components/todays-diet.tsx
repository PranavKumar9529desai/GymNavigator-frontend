import { Suspense } from 'react';
import DietLoading from '../../loading';
import { fetchTodaysDiet } from '../_actions/get-todays-diet';

export default async function TodaysDiet() {
  const { meals } = await fetchTodaysDiet();

  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-4">Today's Diet Plan</h2>
      <div className="space-y-4">
        {meals.map((meal) => (
          <div key={`${meal.type}-${meal.timing}`} className="border-b pb-4">
            <h3 className="text-lg font-medium text-gray-800">
              {meal.type} - {meal.timing}
            </h3>
            <ul className="mt-2 list-disc list-inside">
              {meal.items.map((item) => (
                <li key={`${meal.type}-${item}`} className="text-gray-600">
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
