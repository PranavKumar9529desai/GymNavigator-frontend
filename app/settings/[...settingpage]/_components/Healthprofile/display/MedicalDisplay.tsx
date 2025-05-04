import { UserHealthprofile, Selection } from "../_actions/get-client-healthprofie";

interface MedicalDisplayProps {
  data: UserHealthprofile['Medical'];
}

// Helper to display selection arrays or strings (reusable or adapt from DietaryDisplay)
function renderSelection(selection: Selection[] | string | undefined, otherValue?: string): string {
  if (!selection) return 'N/A';
  if (typeof selection === 'string') {
    // Attempt to parse if it looks like JSON, otherwise display as string
    try {
      const parsed = JSON.parse(selection);
      if (Array.isArray(parsed)) {
        return parsed.map(item => item.name).join(', ') + (otherValue ? `, ${otherValue}` : '');
      }
    } catch (e) { /* Ignore parsing error, treat as plain string */ }
    return selection + (otherValue ? `, ${otherValue}` : '');
  }
  if (Array.isArray(selection)) {
    const names = selection.filter(item => item.selected).map(item => item.name).join(', ');
    return names + (otherValue ? `, ${otherValue}` : '');
  }
  return 'N/A';
}

export default function MedicalDisplay({ data }: MedicalDisplayProps) {
  return (
    <div className="space-y-3">
      <p>
        <strong>Allergies:</strong> {renderSelection(data.allergies, data.otherAllergy)}
      </p>
      <p>
        <strong>Medical Conditions:</strong> {renderSelection(data.medicalConditions, data.otherMedicalCondition)}
      </p>
    </div>
  );
}