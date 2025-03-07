import AuthTokenSubmission from '@/app/(common)/selectgym/[gymid]/AuthTokenSubmission';
import React from 'react';

export default async function page(props: { params: Promise<{ gymid: string }> }) {
  const params = await props.params;
  console.log('gymid is ', params.gymid);
  return (
    <div>
      <AuthTokenSubmission />
    </div>
  );
}
