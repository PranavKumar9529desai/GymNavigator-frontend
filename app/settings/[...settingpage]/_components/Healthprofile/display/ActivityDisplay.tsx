import { UserHealthprofile } from "../_actions/get-client-healthprofie";

interface ActivityDisplayProps {
  data: UserHealthprofile['Activity'];
}

export default function ActivityDisplay({ data }: ActivityDisplayProps) {
  return (
    <div className="space-y-3">
      <p><strong>Activity Level:</strong> {data.activityLevel || 'N/A'}</p>
      {/* Add TDEE display if available/calculated */}
    </div>
  );
}