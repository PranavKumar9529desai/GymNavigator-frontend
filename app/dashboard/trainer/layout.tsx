import type React from "react";
import { auth } from "../../(auth)/auth";
import Image from 'next/image';
import Link from 'next/link';
import NotOnboardedImage from '../_components/not-onboarded/_assests/not-onboarded.png';

export default async function layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  const IsMemberOfGym = !!session?.gym;

  return <>{IsMemberOfGym ? children : <NotMemberOfGym />}</>;
}
const NotMemberOfGym = () => {
  return (
    <div className="flex flex-col items-center justify-center h-[80vh] space-y-4">
			<div className="relative w-full max-w-sm h-80  mx-auto">
				<Image
					src={NotOnboardedImage}
					alt="not-member-image"
					className="object-cover object-center"
					fill
				/>
			</div>
			<div
				className="text-center text-lg font-['latin'] font-semibold
        text-red-600"
			>
				<span className="px-4 py-2 ">You're not a member of a gym yet!</span>
			</div>
			<div className="text-center bg-green-500 text-white w-60 rounded-lg px--4 py-2 mx-auto ">
				<Link type="link" className="text-base" href="/onboarding/client">
					Click here to get Onboarded
				</Link>
			</div>
		</div>
  );
};
