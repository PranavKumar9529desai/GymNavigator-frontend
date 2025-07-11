"use client";

import { Card, CardContent } from "@/components/ui/card";

export function LoadingSkeleton() {
  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header skeleton */}
      <div className="flex items-center gap-4 mb-6">
        <div className="w-8 h-8 bg-slate-200 rounded animate-pulse" />
        <div className="h-8 w-64 bg-slate-200 rounded animate-pulse" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left side skeleton - User Profile */}
        <Card>
          <CardContent className="p-6 space-y-4">
            <div className="h-6 w-48 bg-slate-200 rounded animate-pulse" />
            <div className="space-y-3">
              <div className="h-4 w-full bg-slate-200 rounded animate-pulse" />
              <div className="h-4 w-3/4 bg-slate-200 rounded animate-pulse" />
              <div className="h-4 w-1/2 bg-slate-200 rounded animate-pulse" />
            </div>
          </CardContent>
        </Card>

        {/* Right side skeleton - Diet Plans */}
        <Card>
          <CardContent className="p-6 space-y-4">
            <div className="h-6 w-48 bg-slate-200 rounded animate-pulse" />
            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="p-4 border rounded-lg space-y-2">
                  <div className="h-5 w-3/4 bg-slate-200 rounded animate-pulse" />
                  <div className="h-4 w-full bg-slate-200 rounded animate-pulse" />
                  <div className="h-4 w-1/2 bg-slate-200 rounded animate-pulse" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
