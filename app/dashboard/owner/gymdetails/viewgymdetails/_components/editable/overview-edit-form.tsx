"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { GymData } from "../../types/gym-types";
import { useState, useEffect } from 'react';

interface OverviewEditFormProps {
  data: GymData;
  onDataChange: (data: GymData) => void;
}

export function OverviewEditForm({ data, onDataChange }: OverviewEditFormProps) {
  const [formData, setFormData] = useState<GymData>(data);

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

  return (
    <div className="space-y-4">
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
     

      {/* Add other relevant overview fields here */}
    </div>
  );
} 