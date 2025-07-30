import { apiCall } from './client';
import type {
  ApiResult,
  SignInRequest,
  SignUpRequest,
  GoogleSignUpRequest,
  EmailCheckRequest,
  LoginResponseData,
  UserInfoResponse,
  SigninResponseType,
} from './types';

// Auth API endpoints
export const authApi = {
  // Sign in with credentials
  async signIn(credentials: SignInRequest): Promise<ApiResult<LoginResponseData>> {
    return apiCall('POST', '/login', credentials);
  },

  // Sign up with credentials
  async signUp(userData: SignUpRequest): Promise<ApiResult<LoginResponseData>> {
    return apiCall('POST', '/createaccount', userData);
  },

  // Google sign in
  async googleSignIn(email: string): Promise<ApiResult<SigninResponseType>> {
    return apiCall('GET', `/google?email=${encodeURIComponent(email)}`);
  },

  // Google sign up
  async googleSignUp(userData: GoogleSignUpRequest, role: string): Promise<ApiResult<LoginResponseData>> {
    return apiCall('POST', `/google/${role}`, userData);
  },

  // Check if user exists
  async checkUserExists(email: string): Promise<ApiResult<boolean>> {
    const result = await apiCall<{ exists: boolean }>('POST', '/isexists', { email });
    
    if (result.success && result.data) {
      return {
        success: true,
        data: result.data.exists,
      };
    }
    
    return {
      success: false,
      error: result.error || {
        code: 'CHECK_FAILED',
        message: 'Failed to check user existence',
      },
    };
  },

  // Get user info by email
  async getUserByEmail(email: string): Promise<ApiResult<UserInfoResponse>> {
    return apiCall('GET', `/getuserinfo?email=${encodeURIComponent(email)}`);
  },
};

// Export individual functions for backward compatibility
export const {
  signIn,
  signUp,
  googleSignIn,
  googleSignUp,
  checkUserExists,
  getUserByEmail,
} = authApi; 