"use client";
import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] p-6">
      <div className="w-16 h-16 flex items-center justify-center mb-4 animate-spin">
        <Loader2 className="w-12 h-12 text-blue-500" aria-label="Loading spinner" />
      </div>
      <div className="text-lg font-semibold text-slate-700 mb-1">Setting up your gym...</div>
      <div className="text-sm text-slate-500">Please wait while we create your gym profile.</div>
    </div>
  );
} 