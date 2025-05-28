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
  location?: {
    address: string
    city: string
    state: string
    zipCode: string
    neighborhood: string
    parking: string
    publicTransit: string
  }

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
}

export interface FitnessPlan {
  id: string
  name: string
  description: string
  duration: string
  price: string
  features: string[]
  popular: boolean
}

export interface Amenity {
  id: string
  name: string
  category: "equipment" | "facility" | "service"
  description: string
  quantity?: string
  available: boolean
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
