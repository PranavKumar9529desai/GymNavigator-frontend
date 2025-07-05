/**
 * Common status variants for consistent styling across components
 */

// Badge variants for different status types
export type StatusVariantType = "secondary" | "outline" | "destructive" | "default" | "success" | null | undefined;

export type StatusType = 'active' | 'pending' | 'inactive';

// Badge variants mapping for use with the Badge component
export const statusBadgeVariants: Record<StatusType, StatusVariantType> = {
  active: 'success',
  pending: 'outline', 
  inactive: 'destructive',
};

// CSS class mapping for table cells or other components
export const statusColorClasses: Record<StatusType, { bg: string, text: string }> = {
  active: { bg: 'bg-green-100', text: 'text-green-800' },
  pending: { bg: 'bg-yellow-100', text: 'text-yellow-800' },
  inactive: { bg: 'bg-red-100', text: 'text-red-800' },
};

// Status display labels (capitalized)
export const statusLabels: Record<StatusType, string> = {
  active: 'Active',
  pending: 'Pending',
  inactive: 'Inactive',
};
