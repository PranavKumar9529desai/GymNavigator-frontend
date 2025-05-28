"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { GymData } from "../types/gym-types";
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
    setFormData(prev => ({
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
        <Label htmlFor="gym_logo">Logo Initials</Label>
        <Input id="gym_logo" value={formData.gym_logo || ''} onChange={handleInputChange} placeholder="Enter logo initials" maxLength={3} />
      </div>
       <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea id="description" value={formData.description || ''} onChange={handleInputChange} placeholder="Enter gym description" />
      </div>
       <div className="space-y-2">
        <Label htmlFor="established">Established Year</Label>
        <Input id="established" value={formData.established || ''} onChange={handleInputChange} placeholder="Enter established year" />
      </div>
       <div className="space-y-2">
        <Label htmlFor="members">Total Members</Label>
        <Input id="members" value={formData.members || ''} onChange={handleInputChange} placeholder="Enter total members" />
      </div>
       <div className="space-y-2">
        <Label htmlFor="staff">Staff Members</Label>
        <Input id="staff" value={formData.staff || ''} onChange={handleInputChange} placeholder="Enter number of staff" />
      </div>
       <div className="space-y-2">
        <Label htmlFor="capacity">Capacity</Label>
        <Input id="capacity" value={formData.capacity || ''} onChange={handleInputChange} placeholder="Enter gym capacity" />
      </div>

      {/* Add other relevant overview fields here */}
    </div>
  );
} 