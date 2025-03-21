'use server';

// Define the user data type
export interface UserData {
  id: string;
  name: string;
  email: string;
  healthProfile?: {
    height?: number;
    weight?: number;
    age?: number;
    gender?: string;
    fitnessLevel?: string;
    goals?: string[];
    medicalConditions?: string[];
    dietPreferences?: string[];
    allergies?: string[];
  };
  createdAt: string;
  updatedAt: string;
}

// API response type
interface ApiResponse {
  success: boolean;
  message: string;
  data?: UserData;
}

export async function getUserById(userId: string): Promise<ApiResponse> {
  try {
    // Mock data for demonstration purposes
    // In a real application, you would fetch from API or database
    const userData: UserData = {
      id: userId,
      name: "John Doe",
      email: "john.doe@example.com",
      healthProfile: {
        height: 178,
        weight: 75,
        age: 32,
        gender: "Male",
        fitnessLevel: "Intermediate",
        goals: ["Weight loss", "Muscle gain"],
        medicalConditions: ["None"],
        dietPreferences: ["Mediterranean"],
        allergies: ["Peanuts"],
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    return {
      success: true,
      message: "User data retrieved successfully",
      data: userData,
    };
  } catch (error) {
    console.error("Error fetching user data:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to fetch user data",
    };
  }
} 