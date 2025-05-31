
export interface AmenityDefinition {
  key: string;
  name: string;
  description?: string;
}

export interface AmenityCategoryDefinition {
  key: string;
  name: string;
  description?: string;
  amenities: AmenityDefinition[];
}

export const PREDEFINED_AMENITY_CATEGORIES: AmenityCategoryDefinition[] = [
  {
    key: "fitness-equipment",
    name: "Fitness Equipment",
    description: "Gym equipment and workout facilities",
    amenities: [
      { key: "cardio-machines", name: "Cardio Machines", description: "Treadmills, ellipticals, bikes" },
      { key: "free-weights", name: "Free Weights", description: "Dumbbells, barbells, plates" },
      { key: "weight-machines", name: "Weight Machines", description: "Cable machines, leg press, etc." },
      { key: "functional-training", name: "Functional Training Area", description: "TRX, kettlebells, battle ropes" },
      { key: "squat-racks", name: "Squat Racks", description: "Power racks and squat stands" },
      { key: "smith-machine", name: "Smith Machine", description: "Guided barbell system" },
    ]
  },
  {
    key: "group-classes",
    name: "Group Classes",
    description: "Group fitness and training classes",
    amenities: [
      { key: "yoga-classes", name: "Yoga Classes", description: "Various yoga styles and levels" },
      { key: "pilates", name: "Pilates", description: "Mat and equipment pilates" },
      { key: "zumba", name: "Zumba", description: "Dance fitness classes" },
      { key: "spinning", name: "Spinning/Cycling", description: "Indoor cycling classes" },
      { key: "crossfit", name: "CrossFit", description: "High-intensity functional fitness" },
      { key: "martial-arts", name: "Martial Arts", description: "Boxing, kickboxing, MMA" },
      { key: "dance-classes", name: "Dance Classes", description: "Various dance styles" },
    ]
  },
  {
    key: "wellness-recovery",
    name: "Wellness & Recovery",
    description: "Health, wellness and recovery facilities",
    amenities: [
      { key: "sauna", name: "Sauna", description: "Dry heat sauna facilities" },
      { key: "steam-room", name: "Steam Room", description: "Wet steam facilities" },
      { key: "massage-therapy", name: "Massage Therapy", description: "Professional massage services" },
      { key: "physical-therapy", name: "Physical Therapy", description: "Rehabilitation services" },
      { key: "cryotherapy", name: "Cryotherapy", description: "Cold therapy treatments" },
      { key: "infrared-therapy", name: "Infrared Therapy", description: "Infrared light treatments" },
    ]
  },
  {
    key: "aquatic-facilities",
    name: "Aquatic Facilities",
    description: "Swimming and water-based activities",
    amenities: [
      { key: "swimming-pool", name: "Swimming Pool", description: "Indoor/outdoor swimming pool" },
      { key: "lap-pool", name: "Lap Pool", description: "Dedicated lanes for swimming laps" },
      { key: "hot-tub", name: "Hot Tub/Jacuzzi", description: "Heated water therapy" },
      { key: "water-aerobics", name: "Water Aerobics", description: "Aquatic fitness classes" },
      { key: "kids-pool", name: "Kids Pool", description: "Children's swimming area" },
    ]
  },
  {
    key: "family-lifestyle",
    name: "Family & Lifestyle",
    description: "Family-friendly and lifestyle amenities",
    amenities: [
      { key: "childcare", name: "Childcare", description: "On-site childcare services" },
      { key: "kids-programs", name: "Kids Programs", description: "Youth fitness and activities" },
      { key: "family-changing", name: "Family Changing Rooms", description: "Family-friendly facilities" },
      { key: "juice-bar", name: "Juice Bar", description: "Healthy drinks and smoothies" },
      { key: "pro-shop", name: "Pro Shop", description: "Fitness gear and supplements" },
      { key: "cafe", name: "Café", description: "Food and beverage services" },
    ]
  },
  {
    key: "amenities-services",
    name: "Amenities & Services",
    description: "Additional gym amenities and services",
    amenities: [
      { key: "personal-training", name: "Personal Training", description: "One-on-one fitness coaching" },
      { key: "nutrition-counseling", name: "Nutrition Counseling", description: "Dietary guidance and planning" },
      { key: "body-composition", name: "Body Composition Analysis", description: "InBody or DEXA scans" },
      { key: "24-7-access", name: "24/7 Access", description: "Round-the-clock gym access" },
      { key: "guest-passes", name: "Guest Passes", description: "Bring-a-friend privileges" },
      { key: "towel-service", name: "Towel Service", description: "Clean towels provided" },
      { key: "parking", name: "Free Parking", description: "Complimentary parking" },
      { key: "wifi", name: "Free WiFi", description: "High-speed internet access" },
      { key: "lockers", name: "Lockers", description: "Secure storage facilities" },
      { key: "showers", name: "Showers", description: "Clean shower facilities" },
    ]
  },
];

// Helper function to get all amenities as a flat array
export function getAllPredefinedAmenities(): AmenityDefinition[] {
  return PREDEFINED_AMENITY_CATEGORIES.flatMap(category => 
    category.amenities.map(amenity => ({
      ...amenity,
      categoryKey: category.key
    }))
  );
}

// Helper function to find amenity by key
export function findAmenityByKey(key: string): (AmenityDefinition & { categoryKey: string }) | undefined {
  for (const category of PREDEFINED_AMENITY_CATEGORIES) {
    const amenity = category.amenities.find(a => a.key === key);
    if (amenity) {
      return { ...amenity, categoryKey: category.key };
    }
  }
  return undefined;
}

// Helper function to find category by key
export function findCategoryByKey(key: string): AmenityCategoryDefinition | undefined {
  return PREDEFINED_AMENITY_CATEGORIES.find(cat => cat.key === key);
}
