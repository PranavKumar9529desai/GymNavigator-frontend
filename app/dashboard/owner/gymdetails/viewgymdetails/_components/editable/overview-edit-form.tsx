"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import type { GymData } from "../../types/gym-types";
import { useState, useEffect, useTransition } from 'react';
import { updateGymOverview } from "../../_actions/submit-gym-tabs-form";
import { toast } from "sonner";

interface OverviewEditFormProps {
  data: GymData;
  onDataChange: (data: GymData) => void;
  onSave?: () => void;
}

export function OverviewEditForm({ data, onDataChange, onSave }: OverviewEditFormProps) {
  const [formData, setFormData] = useState<GymData>(data);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    setFormData(data);
  }, [data]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData((prev: GymData) => ({
      ...prev,
      [id]: value,
    }));
    onDataChange({
      ...formData,
      [id]: value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    startTransition(async () => {
      try {
        const overviewData = {
          gym_name: formData.gym_name || '',
          gym_logo: formData.gym_logo || '',
          description: formData.description || ''
        };
        
        await updateGymOverview(overviewData);
        toast.success("Overview updated successfully!");
        onSave?.();
      } catch (error) {
        console.error('Error updating overview:', error);
        toast.error("Failed to update overview. Please try again.");
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="gym_name">Gym Name</Label>
        <Input id="gym_name" value={formData.gym_name || ''} onChange={handleInputChange} placeholder="Enter gym name" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="gym_logo">Logo Url</Label>
        <Input id="gym_logo" value={formData.gym_logo || ''} onChange={handleInputChange} placeholder="Enter logo Url" maxLength={3} />
      </div>
       <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea id="description" value={formData.description || ''} onChange={handleInputChange} placeholder="Enter gym description" />
      </div>
      
      <div className="flex gap-2 pt-4">
        <Button type="submit" disabled={isPending} className="flex-1">
          {isPending ? "Saving..." : "Save Overview"}
        </Button>
      </div>

      {/* Add other relevant overview fields here */}
    </form>
  );
} 