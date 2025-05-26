'use client';

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import Image from "next/image";

interface ReviewChangesProps {
  data: {
    gym_name: string;
    gym_logo: string;
    address: string;
    phone_number: string;
    Email: string;
  };
  logoPreview: string | null;
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ReviewChanges({
  data,
  logoPreview,
  isOpen,
  onConfirm,
  onCancel,
}: ReviewChangesProps) {
  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onCancel}> {/* Use onOpenChange to close dialog */} 
      <DialogContent className="sm:max-w-[600px] p-6 rounded-lg shadow-lg">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center text-gray-900">Review Your Gym Details</DialogTitle>
          <DialogDescription className="text-center text-gray-600 mt-2">
            Please review the details before creating the gym.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4 space-y-4">
          <div className="flex items-center border-b border-gray-100 py-3">
            <span className="text-gray-600 font-medium w-32 shrink-0">Gym Name:</span>
            <span className="text-gray-900 ml-4 truncate text-left flex-grow">{data.gym_name}</span>
          </div>
          <div className="flex items-center border-b border-gray-100 py-3">
            <span className="text-gray-600 font-medium w-32 shrink-0">Address:</span>
            <span className="text-gray-900 ml-4 truncate text-left flex-grow">{data.address}</span>
          </div>
          <div className="flex items-center border-b border-gray-100 py-3">
            <span className="text-gray-600 font-medium w-32 shrink-0">Phone:</span>
            <span className="text-gray-900 ml-4 truncate text-left flex-grow">{data.phone_number}</span>
          </div>
          <div className="flex items-center border-b border-gray-100 py-3">
            <span className="text-gray-600 font-medium w-32 shrink-0">Email:</span>
            <span className="text-gray-900 ml-4 truncate text-left flex-grow">{data.Email}</span>
          </div>
          {logoPreview && (
            <div className="mt-4 flex gap-10">
              <p className="text-gray-600 font-medium mb-2 text-left  flex items-center">Gym Logo</p>
              <div className="max-w-[150px] rounded-lg   overflow-hidden">
                 <Image
                    src={logoPreview}
                    alt="Gym Logo"
                    width={120}
                    height={120}
                    objectFit="contain"
                 />
              </div>
            </div>
          )}
        </div>
        <DialogFooter className="flex flex-col sm:flex-row sm:justify-end gap-3 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            className="w-full sm:w-auto border-gray-300 text-gray-700 hover:bg-gray-100"
          >
            Edit Again
          </Button>
          <Button
            type="button"
            onClick={onConfirm}
            className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white"
          >
            Create Gym
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
