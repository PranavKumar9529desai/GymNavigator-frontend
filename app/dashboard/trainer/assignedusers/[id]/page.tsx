import { getUserProfile } from './_action/get-user-profile-for-trainer';
import { UserProfileClient } from './_components/user-profile-client';

interface PageProps {
	params: Promise<{ id: string }>;
}

export default async function UserProfilePage({ params }: PageProps) {
	const { id } = await params;
	const profileData = await getUserProfile(id);

	return <UserProfileClient profileData={profileData} />;
}
