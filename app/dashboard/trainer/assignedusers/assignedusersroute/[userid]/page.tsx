import { Suspense } from 'react';
import { getUserCompleteInfo } from './_actions/get-user-assigned-by-id';
import { UserProfileComponent } from './_components/UserProfileComponent';
import Loading from './loading';

export default async function AssignedUserPage({
	params,
}: {
	params: Promise<{ userid: string }>;
}) {
	const { userid } = await params;

	const user = await getUserCompleteInfo(userid);

	return (
		<div className="container mx-auto py-6 px-4">
			<Suspense fallback={<Loading />}>
				<UserProfileComponent user={user} />
			</Suspense>
		</div>
	);
}
