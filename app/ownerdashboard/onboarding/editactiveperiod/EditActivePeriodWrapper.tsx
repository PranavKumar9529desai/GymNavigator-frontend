'use client';
import { useSearchParams } from 'next/navigation';
import { UserValidityPeriod } from './UserValidPeriod';

export default function EditActivePeriodWrapper() {
  const searchParams = useSearchParams();
  const userid = searchParams.get('userid') || '';
  const username = searchParams.get('username') || '';
  const startdate = searchParams.get('startdate');
  const enddate = searchParams.get('enddate');

  return (
    <UserValidityPeriod
      userId={userid}
      userName={username}
      userImage="https://randomuser.me/api/portraits"
      initialStartDate={startdate ? new Date(startdate) : undefined}
      initialEndDate={enddate ? new Date(enddate) : undefined}
    />
  );
}
