import { getGymDetails } from './_actions/get-gym-details';
import { GymDetails } from './_components/gym-details';

export default async function GymPage() {
  const data = await getGymDetails();
  
  if (!data) {
    return (
      <div className="p-4">
        <div className="text-center py-8">
          <h2 className="text-xl font-semibold text-muted-foreground">
            Unable to load gym details
          </h2>
          <p className="text-muted-foreground">
            Please try refreshing the page or contact support if the issue persists.
          </p>
        </div>
      </div>
    );
  }
  
  return <GymDetails data={data} />;
}
