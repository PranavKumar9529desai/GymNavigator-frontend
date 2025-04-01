"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CheckCircle } from "lucide-react";
import { useRouter } from "next/navigation";

interface SuccessStateProps {
  message: string;
  gymName: string;
}

export function SuccessState({ message, gymName }: SuccessStateProps) {
  const router = useRouter();

  return (
    <div className="flex items-center justify-center min-h-[70vh]">
      <Card className="w-full max-w-md border-2 border-green-500 shadow-lg">
        <CardHeader className="text-center">
          <div className="mx-auto w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mb-4 animate-pulse">
            <CheckCircle className="h-12 w-12 text-green-500 animate-bounce" />
          </div>
          <CardTitle className="text-2xl font-bold text-green-700">
            Successfully Enrolled!
          </CardTitle>
          <CardDescription className="text-base mt-2">
            {message}
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center px-6">
          <p className="font-medium">
            You are now connected to{" "}
            <span className="font-bold">{gymName}</span>
          </p>
          <p className="mt-2 text-sm text-gray-600">
            You can now access all the features available for your role.
          </p>
        </CardContent>
        <CardFooter className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button
            onClick={() => router.push("/dashboard")}
            className="w-full sm:w-auto bg-green-600 hover:bg-green-700"
            size="lg"
          >
            Go to Dashboard
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
