"use client";

import { m } from "framer-motion";
import { Sparkles, UserCheck, Users } from "lucide-react";
import { useEffect, useState } from "react";

export default function MobileStats() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return <div className="h-[200px]" />; // Loading state
  }

  const mobileStats = [
    { label: "Partner Gyms", value: "10+", icon: Users },
    { label: "Active Members", value: "100+", icon: UserCheck },
  ];

  const features = ["Easy Setup", "24/7 Support", "Secure"];

  return (
    <>
      {/* Mobile Stats */}
      <div className="grid grid-cols-2 gap-3 my-8">
        {mobileStats.map((stat) => (
          <div
            key={stat.label}
            className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10"
          >
            <stat.icon className="w-6 h-6 text-blue-400 mb-2" />
            <p className="text-2xl font-bold text-white">{stat.value}</p>
            <p className="text-sm text-gray-400">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Mobile Feature Highlights */}
      <m.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-wrap gap-2 justify-center my-6"
      >
        {features.map((feature) => (
          <span
            key={feature}
            className="bg-blue-500/10 text-blue-300 text-sm px-3 py-1 rounded-full border border-blue-500/20 flex items-center gap-1"
          >
            <Sparkles className="w-3 h-3" />
            {feature}
          </span>
        ))}
      </m.div>
    </>
  );
} 