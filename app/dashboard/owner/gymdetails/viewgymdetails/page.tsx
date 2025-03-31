export const dynamic = 'force-dynamic';
import FetchGymDetailsSA from './GetGymDetails';
import ViewGymDetails from './viewgymdetails';

export default async function Page() {
	const gymDetails = await FetchGymDetailsSA();
	return <ViewGymDetails gymDetails={gymDetails} />;
}
