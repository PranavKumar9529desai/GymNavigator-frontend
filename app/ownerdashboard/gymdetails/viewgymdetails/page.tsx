export const dynamic = 'force-dynamic';
import ViewGymDetails from './viewgymdetails';
import FetchGymDetailsSA from './GetGymDetails';

export default async function Page() {
  const gymDetails = await FetchGymDetailsSA();
  return <ViewGymDetails gymDetails={gymDetails} />;
}
