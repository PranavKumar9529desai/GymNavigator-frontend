'use client';

import SelectRole from '@/components/common/SelectRole';

// Prevent static generation
export const dynamic = 'force-dynamic';

export default function SelectRolePage() {
  return (
    <div className="min-h-screen bg-gray-950 relative">
      <SelectRole />
    </div>
  );
}
