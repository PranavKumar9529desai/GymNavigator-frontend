import { UserHealthprofile } from "../_actions/get-client-healthprofie";

interface ReligiousDisplayProps {
  data: UserHealthprofile['Religious'];
}

export default function ReligiousDisplay({ data }: ReligiousDisplayProps) {
  return (
    <div className="space-y-3">
      <p>
        <strong>Preference:</strong> {data.religiousPreference || 'N/A'}
        {data.religiousPreference === 'Other' && data.otherReligiousPreference ? ` (${data.otherReligiousPreference})` : ''}
      </p>
    </div>
  );
}