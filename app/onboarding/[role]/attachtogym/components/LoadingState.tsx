'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

export function LoadingState() {
  return (
    <div className="flex items-center justify-center min-h-[70vh]">
      <Card className="w-full max-w-md shadow-lg border border-blue-200">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-blue-700">Connecting to Gym</CardTitle>
          <CardDescription className="text-base">
            Please wait while we verify your gym enrollment...
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center py-8">
          <div className="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center mb-4">
            <Loader2 className="h-12 w-12 animate-spin text-blue-500" />
          </div>
          <p className="mt-4 text-sm text-gray-500">
            This may take a moment
          </p>
          <div className="w-full max-w-xs mt-6 bg-gray-200 rounded-full h-2 overflow-hidden">
            <div className="bg-blue-500 h-2 animate-pulse" style={{ width: '75%' }}></div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 