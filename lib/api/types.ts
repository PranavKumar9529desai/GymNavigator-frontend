// API Response Types for GymNavigator Backend

export type Rolestype = 'owner' | 'trainer' | 'client';

export interface GymInfo {
  id: string;
  gym_name: string;
}

export interface UserData {
  id: string;
  name: string;
  email: string;
  role: Rolestype;
  gym_id?: string | null;
  gym?: GymInfo | null;
}

export interface LoginResponseData {
  token: string;
  user: UserData;
}

export interface UserInfoResponse {
  exists: boolean;
  role?: Rolestype;
}

export interface SigninResponseType {
  token: string;
  user: UserData;
}

export interface ApiError {
  code: string;
  message: string;
}

export interface ApiResult<T> {
  success: boolean;
  message?: string;
  data?: T;
  error?: ApiError;
}

// Backend API Request Types
export interface SignInRequest {
  email: string;
  password: string;
}

export interface SignUpRequest {
  name: string;
  email: string;
  password: string;
  role: Rolestype;
}

export interface GoogleSignUpRequest {
  name: string;
  email: string;
  role: Rolestype;
}

export interface EmailCheckRequest {
  email: string;
}

// Environment configuration
export interface ApiConfig {
  baseURL: string;
  timeout: number;
  headers: Record<string, string>;
} 