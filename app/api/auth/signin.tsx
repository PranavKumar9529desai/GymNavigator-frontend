import SignIn from "@/components/common/Auth/Signin";
import React from "react";
export default async function signin() {
  return (
    <>
      <div className="w-screen  h-screen  justify-center items-center ">
        <SignIn />
      </div>
    </>
  );
}
