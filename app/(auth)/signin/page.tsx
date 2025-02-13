import SignIn from '@/components/common/Auth/Signin';
import React from 'react';

export default async function Page() {
  // const session = await auth();
  // console.log("session information is this", session);
  return (
    <>
      <SignIn />
    </>
  );
}
