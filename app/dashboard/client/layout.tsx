import { auth } from "@/app/(auth)/auth";
import { queryClient } from "@/lib/queryClient";
import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import Link from "next/link";
import type React from "react";
import NotOnboarded from "../_components/not-onboarded/not-onboarded";
import { getIsWorkoutAndDietAssignedStatus } from "./_actions/get-isworkoutanddietassigned-status";
import ClientLayout from "./_components/ClientLayout";
import DashboardTopBar from "../_components/DashboardTopBar";
import { Rolestype } from "@/types/next-auth";

export const dynamic = "force-dynamic";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  const IsOnboarded = !!session?.gym;
  console.log("session is ", session);
  console.log("IsOnboarded ", IsOnboarded);

  return (
    <div className="min-h-screen">
      <ClientLayout>{IsOnboarded ? children :
        <div className=" mt-10 sm:h-screen sm:mt-0 ">
          <NotOnboarded role={session?.role as Rolestype} />

        </div>
      }

      </ClientLayout>
    </div>
  );
}
