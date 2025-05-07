import { UserHealthprofile } from "../_actions/get-client-healthprofie";

interface GeneralDisplayProps {
  data: UserHealthprofile['General'];
}

export default function GeneralDisplay({ data }: GeneralDisplayProps) {
  return (
    <div className="space-y-6">
      <div className="flex flex-col py-2 border-b border-gray-100">
        <span className="text-sm text-gray-500 mb-1">Gender</span>
        <span className="text-base font-medium">{data.gender || 'Not specified'}</span>
      </div>
      
      <div className="flex flex-col py-2 border-b border-gray-100">
        <span className="text-sm text-gray-500 mb-1">Age</span>
        <span className="text-base font-medium">{data.age || 'Not specified'}</span>
      </div>
      
      <div className="flex flex-col py-2 border-b border-gray-100">
        <span className="text-sm text-gray-500 mb-1">Height</span>
        <span className="text-base font-medium">
          {data.heightValue ? `${data.heightValue} ${data.heightUnit || ''}` : 'Not specified'}
        </span>
      </div>
      
      <div className="flex flex-col py-2 border-b border-gray-100">
        <span className="text-sm text-gray-500 mb-1">Weight</span>
        <span className="text-base font-medium">
          {data.weightValue ? `${data.weightValue} ${data.weightUnit || ''}` : 'Not specified'}
        </span>
      </div>
    </div>
  );
}