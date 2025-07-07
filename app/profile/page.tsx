import { UserProfileClient } from "../dashboard/trainer/assignedusers/[id]/_components/user-profile-client";
import { getUserProfile } from "../dashboard/trainer/assignedusers/[id]/_action/get-user-profile-for-trainer";

export default function ProfilePage() {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-2xl font-bold mb-4">Profile Page</h1>
      <p className="text-gray-600">This is the profile page.</p>
      {/* Add more profile-related content here */}
    </div>
  );
}