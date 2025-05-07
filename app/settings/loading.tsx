import SettingsHeader from "./SettingsHeader";
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="max-w-4xl mx-auto px-4 pb-20 md:pb-6">
      <SettingsHeader title="Settings" />
      <div className="py-6 space-y-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton 
            key={`settings-skeleton-${i}`}
            className="h-[64px] w-full bg-gray-100"
          />
        ))}
      </div>
    </div>
  );
}
