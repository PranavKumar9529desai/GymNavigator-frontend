// API Response Types for GymNavigator Backend

export type Rolestype = 'owner' | 'trainer' | 'client';

export interface GymInfo {
  id: string;
  gym_name: string;
}

export interface BaseUser {
  id: string | number;
  name: string;
  email: string;
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
  [key: string]: unknown;
}

export interface SignUpRequest {
  name: string;
  email: string;
  password: string;
  role: Rolestype;
  [key: string]: unknown;
}

export interface GoogleSignUpRequest {
  name: string;
  email: string;
  role: Rolestype;
  [key: string]: unknown;
}

export interface EmailCheckRequest {
  email: string;
  [key: string]: unknown;
}

// Environment configuration
export interface ApiConfig {
  baseURL: string;
  timeout: number;
  headers: Record<string, string>;
} 