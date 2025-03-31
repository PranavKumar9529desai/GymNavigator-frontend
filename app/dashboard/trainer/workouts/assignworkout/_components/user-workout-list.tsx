'use client';

import Link from 'next/link';
import type { AssignedUser } from '../../../assignedusers/GetuserassignedTotrainers';

interface Props {
	users: AssignedUser[];
}

export default function UserWorkoutList({ users }: Props) {
	return (
		<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
			{users.map((user) => (
				<Link
					key={user.id}
					href={`/dashboard/trainer/workouts/assignworkout/${user.id}`}
					className="block"
				>
					<div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
						<div className="flex items-center space-x-4">
							<div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
								<span className="text-xl text-gray-600">{user.name[0]}</span>
							</div>
							<div>
								<h3 className="font-medium">{user.name}</h3>
								<p className="text-sm text-gray-600">{user.email}</p>
							</div>
						</div>

						{user.HealthProfile && (
							<div className="mt-4 pt-4 border-t">
								<div className="grid grid-cols-2 gap-2 text-sm">
									<div>
										<span className="text-gray-600">Goal:</span>
										<p className="font-medium">
											{user.HealthProfile.goal || 'Not specified'}
										</p>
									</div>
									<div>
										<span className="text-gray-600">Status:</span>
										<p
											className={`font-medium ${
												user.membershipStatus === 'active'
													? 'text-green-600'
													: 'text-red-600'
											}`}
										>
											{user.membershipStatus}
										</p>
									</div>
								</div>
							</div>
						)}
					</div>
				</Link>
			))}
		</div>
	);
}
