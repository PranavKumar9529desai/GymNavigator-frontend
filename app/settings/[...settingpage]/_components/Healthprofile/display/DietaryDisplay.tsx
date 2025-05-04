import { UserHealthprofile, Selection } from "../_actions/get-client-healthprofie";

interface DietaryDisplayProps {
  data: UserHealthprofile['Dietary'];
}

// Helper to display selection arrays or strings
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

// Helper to display non-veg days
function renderNonVegDays(days: UserHealthprofile['Dietary']['nonVegDays']): string {
    if (!days) return 'N/A';
    if (typeof days === 'string') {
         try {
            const parsed = JSON.parse(days);
            if (Array.isArray(parsed)) {
                return parsed.filter(d => d.selected).map(d => d.day).join(', ') || 'None';
            }
         } catch(e) { /* Ignore */ }
         return days; // Return as string if not parsable array
    }
    if (Array.isArray(days)) {
        return days.filter(d => d.selected).map(d => d.day).join(', ') || 'None';
    }
    return 'N/A';
}


export default function DietaryDisplay({ data }: DietaryDisplayProps) {
  return (
    <div className="space-y-3">
      <p>
        <strong>Preference:</strong> {data.dietaryPreference || 'N/A'}
        {data.dietaryPreference === 'Other' && data.otherDietaryPreference ? ` (${data.otherDietaryPreference})` : ''}
      </p>
      <p>
        <strong>Restrictions:</strong> {renderSelection(data.dietaryRestrictions, data.otherDietaryRestrictions)}
      </p>
       <p>
        <strong>Non-Veg Days:</strong> {renderNonVegDays(data.nonVegDays)}
      </p>
      <p><strong>Meal Times:</strong> {data.MealTimes || 'N/A'}</p>
      {data.mealTimings && <p><strong>Specific Timings:</strong> {data.mealTimings}</p>}

    </div>
  );
}