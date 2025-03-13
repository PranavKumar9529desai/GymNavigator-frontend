import { getRestaurantGuides } from './_actions/get-restaurant-guides';
import { RestaurantGuide } from './_components/restaurant-guide';

export default async function EatingOutGuidePage() {
  const guides = await getRestaurantGuides();

  return (
    <div className="py-8">
      <h1 className="text-3xl font-bold">Eating Out Guide</h1>
      <div className="mt-6">
        {guides.map((guide) => (
          <RestaurantGuide
            key={guide.type}
            restaurantType={guide.type}
            recommendations={guide.recommendations}
          />
        ))}
      </div>
    </div>
  );
}
