import { UserHealthprofile } from "../_actions/get-client-healthprofie";

interface GeneralDisplayProps {
  data: UserHealthprofile['General'];
}

export default function GeneralDisplay({ data }: GeneralDisplayProps) {
  return (
    <div className="space-y-3">
      <p><strong>Gender:</strong> {data.gender || 'N/A'}</p>
      <p><strong>Age:</strong> {data.age || 'N/A'}</p>
      <p>
        <strong>Height:</strong> {data.heightValue || 'N/A'} {data.heightUnit || ''}
      </p>
      <p>
        <strong>Weight:</strong> {data.weightValue || 'N/A'} {data.weightUnit || ''}
      </p>
      {/* Add BMI calculation/display if needed */}
    </div>
  );
}