import { GetOnBoardingUser } from './GetOnBoardingUser';
import OnboardedUsers from './OnbordedUsers';

export default async function Page() {
  // Fetch data at the server level
  const response = await GetOnBoardingUser();

  // Transform the data
  const transformedUsers =
    response?.users.map((user) => ({
      id: user.id,
      name: user.name,
      startDate: user.startDate ? new Date(user.startDate) : null,
      endDate: user.endDate ? new Date(user.endDate) : null,
    })) ?? [];

  return <OnboardedUsers initialUsers={transformedUsers} />;
}
