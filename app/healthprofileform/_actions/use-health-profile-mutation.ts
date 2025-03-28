'use server';

import { revalidatePath } from 'next/cache';
import { HealthProfileState } from '../_store/health-profile-store';
import { z } from 'zod';

const healthProfileSchema = z.object({
  gender: z.enum(['male', 'female', 'other']),
  age: z.number().min(1).max(120),
  activityLevel: z.enum(['sedentary', 'light', 'moderate', 'active', 'veryActive']),
  height: z.object({
    value: z.number().min(1),
    unit: z.enum(['cm', 'ft'])
  }),
  weight: z.object({
    value: z.number().min(1),
    unit: z.enum(['kg', 'lb'])
  }),
  targetWeight: z.object({
    value: z.number().min(1),
    unit: z.enum(['kg', 'lb'])
  }),
  medicalConditions: z.array(z.object({
    id: z.string(),
    name: z.string(),
    selected: z.boolean()
  })),
  otherMedicalCondition: z.string().optional()
});

export type HealthProfileData = z.infer<typeof healthProfileSchema>;

export async function submitHealthProfile(formData: Partial<HealthProfileState>) {
  // Extract only the required fields from the form data
  const profileData: HealthProfileData = {
    gender: formData.gender!,
    age: formData.age!,
    activityLevel: formData.activityLevel!,
    height: formData.height as { value: number, unit: 'cm' | 'ft' },
    weight: formData.weight as { value: number, unit: 'kg' | 'lb' },
    targetWeight: formData.targetWeight as { value: number, unit: 'kg' | 'lb' },
    medicalConditions: formData.medicalConditions!.filter(condition => condition.selected),
    otherMedicalCondition: formData.otherMedicalCondition
  };

  try {
    // Validate the data
    healthProfileSchema.parse(profileData);
    
    // TODO: Replace with actual API call to backend
    // Example: 
    // const response = await fetch('/api/health-profile', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(profileData),
    // });
    
    // For now, simulate a successful API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Revalidate paths that may depend on this data
    revalidatePath('/dashboard');
    revalidatePath('/healthprofileform');
    
    return { success: true };
  } catch (error) {
    console.error('Error submitting health profile:', error);
    return { success: false, error: error instanceof Error ? error.message : 'An unknown error occurred' };
  }
}
