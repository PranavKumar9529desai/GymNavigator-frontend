import GymDomImage from "@/app/assests/gymd.webp";
import type { Metadata } from "next";
import Image from "next/image";
import type React from "react";

export const metadata: Metadata = {
  openGraph: {
    title: "GymNavigator",
    description: "Professional gym management solution",
    images: [
      {
        url: GymDomImage.src,
        width: 1200,
        height: 630,
        alt: "GymNavigator Preview",
      },
    ],
    type: "website",
  },
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900 via-black to-gray-950">
      <div className="min-h-screen flex flex-col items-center">
        {/* Logo Section */}
        <div className="w-full flex justify-center py-6">
          <div className="relative h-14 w-14 md:h-20 md:w-20">
            <Image 
              src="/android-chrome-512x512.png" 
              alt="GymNavigator Logo" 
              fill 
              priority 
              className="object-contain"
            />
          </div>
        </div>
        
        <div className="flex flex-1 w-full">
          {/* Left side - Auth Form */}
          <div className="lg:w-1/2 sm:w-full flex items-center justify-center p-8 bg-transparent">
            <div className="w-full max-w-md relative z-10">{children}</div>
          </div>

          {/* Right side - Branding */}
          <div className="hidden lg:flex w-1/2 flex-col items-center justify-center p-8">
            <div className="max-w-xl text-center space-y-6">
              <div className="relative w-full aspect-square max-w-[450px] mx-auto">
                <div className="absolute inset-0 bg-blue-400/20 opacity-50 rounded-full blur-3xl" />
                <div className="relative z-10 w-full h-full flex items-center justify-center">
                  <Image
                    src="/android-chrome-512x512.png"
                    alt="GymNavigator Logo"
                    height={300}
                    width={300}
                    className="p-6"
                    priority
                  />
                </div>
              </div>

              <div className="space-y-2">
                <h2 className="text-3xl font-bold text-white">
                  Welcome to <span className="text-blue-400">GymNavigator</span>
                </h2>
                <p className="text-base text-gray-300">
                  Your ultimate platform for fitness tracking and workout management
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Background effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute w-[500px] h-[500px] rounded-full bg-blue-500/10 blur-3xl -top-[250px] -left-[250px]" />
        <div className="absolute w-[400px] h-[400px] rounded-full bg-indigo-500/10 blur-3xl -bottom-[200px] -right-[200px]" />
      </div>
    </main>
  );
}
