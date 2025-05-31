export interface GymData {
  // Basic Info
  name?: string
  owner?: string
  email?: string
  phone?: string
  website?: string
  logo?: string
  description?: string
  established?: string

  // Stats
  members?: string
  staff?: string
  capacity?: string

  // Operating Hours
  operatingHours?: {
    monday: { open: string; close: string; closed: boolean }
    tuesday: { open: string; close: string; closed: boolean }
    wednesday: { open: string; close: string; closed: boolean }
    thursday: { open: string; close: string; closed: boolean }
    friday: { open: string; close: string; closed: boolean }
    saturday: { open: string; close: string; closed: boolean }
    sunday: { open: string; close: string; closed: boolean }
  }

  // Location
  location?: GymLocation

  // Social Media
  socialMedia?: {
    facebook: string
    instagram: string
    twitter: string
    youtube: string
  }

  // Add properties from FetchGymDetailsSA result
  gym_name: string;
  gym_logo: string;
  address: string;
  phone_number: string;
  Email: string;
  gymauthtoken: string;

  // New fields
  amenities?: Record<string, string[]>; // categoryKey -> array of amenity keys
  fitnessPlans?: FitnessPlan[];
}

export interface GymLocation {
  lat?: number;
  lng?: number;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country?: string;
}

export interface FitnessPlan {
  id?: number; // Optional for new plans
  name: string;
  description: string;
  price: string;
  duration: string;
  features: string[];
  isFeatured?: boolean;
  color?: string; // For plan theming (hex color code)
  icon?: string; // For plan icons (icon name)
  popular?: boolean; // Alternative to isFeatured
  maxMembers?: number; // Capacity limit
  sortOrder?: number; // For custom ordering of plans
  benefits?: string[]; // Additional benefits separate from features
}

export interface PricingFormData {
  plans: FitnessPlan[];
  additionalServices: AdditionalService[];
}

export interface AdditionalService {
    name: string;
    price: string;
    duration: string;
    description?: string;
}

// API Types for amenities communication
export interface UpdateAmenitiesRequest {
  amenities: string[]; // Array of amenity keys
}

export interface UpdateAmenitiesResponse {
  msg: string;
}

// Database response types
export interface GymAmenityFromDB {
  id: number;
  amenity: {
    id: number;
    name: string;
    description?: string;
    amenityType: {
      id: number;
      name: string;
      description?: string;
    };
  };
}

export interface StaffMember {
  id: string
  name: string
  role: string
  email: string
  phone: string
  specialization: string
  experience: string
}

export interface Equipment {
  id: string
  name: string
  category: string
  quantity: number
  status: "working" | "maintenance" | "broken"
  lastMaintenance: string
}

// Re-export amenity types from constants
export type { AmenityCategoryDefinition as AmenityCategory } from "@/lib/constants/amenities";
