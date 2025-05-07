import { UserHealthprofile } from "../_actions/get-client-healthprofie";

interface ActivityDisplayProps {
  data: UserHealthprofile['Activity'];
}

export default function ActivityDisplay({ data }: ActivityDisplayProps) {
  return (
    <div className="space-y-6">
      <div className="flex flex-col py-2 border-b border-gray-100">
        <span className="text-sm text-gray-500 mb-1">Activity Level</span>
        <span className="text-base font-medium">{data.activityLevel || 'Not specified'}</span>
      </div>
      
      {/* Additional activity information could be added here */}
    </div>
  );
}