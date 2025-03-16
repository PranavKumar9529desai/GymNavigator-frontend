import { SigninReqConfig } from "./sign-in-axios";

// Define the standard API response format from backend
export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}

// Define the standardized result format for frontend
export interface ApiResult<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
  };
}

// Define auth-specific types
export type Rolestype = "owner" | "trainer" | "client";

export interface SigninResponseType {
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: Rolestype;
    gym_id?: string | null;
    gym?: {
      id: number;
      name: string;
    } | null;
  };
}

export interface UserInfoResponse {
  role: Rolestype;
}

/**
 * Authentication API client with typed methods for all login-related operations
 */
export const authClient = {
  /**
   * Sign in with email and password
   */
  signInWithCredentials: async (
    email: string,
    password: string
  ): Promise<ApiResult<SigninResponseType>> => {
    try {
      const axiosInstance = await SigninReqConfig();
      const response = await axiosInstance.get("/login", {
        params: { email, password },
      });

      const apiResponse = response.data as ApiResponse<SigninResponseType>;

      if (!apiResponse.success) {
        return {
          success: false,
          error: {
            code: apiResponse.error || "UNKNOWN_ERROR",
            message: apiResponse.message || "Unknown error occurred",
          },
        };
      }

      return {
        success: true,
        data: apiResponse.data,
      };
    } catch (error: unknown) {
      // The error is already formatted by the axios interceptor
      return error as ApiResult<never>;
    }
  },

  /**
   * Sign in with Google
   */
  signInWithGoogle: async (
    email: string
  ): Promise<ApiResult<SigninResponseType>> => {
    try {
      const axiosInstance = await SigninReqConfig();
      const response = await axiosInstance.get("/google", {
        params: { email },
      });

      const apiResponse = response.data as ApiResponse<SigninResponseType>;

      if (!apiResponse.success) {
        return {
          success: false,
          error: {
            code: apiResponse.error || "UNKNOWN_ERROR",
            message: apiResponse.message || "Unknown error occurred",
          },
        };
      }

      return {
        success: true,
        data: apiResponse.data,
      };
    } catch (error: unknown) {
      // The error is already formatted by the axios interceptor
      return error as ApiResult<never>;
    }
  },

  /**
   * Get user information by email
   */
  getUserInfo: async (email: string): Promise<ApiResult<UserInfoResponse>> => {
    try {
      const axiosInstance = await SigninReqConfig();
      const response = await axiosInstance.get("/getuserinfo", {
        params: { email },
      });

      const apiResponse = response.data as ApiResponse<UserInfoResponse>;

      if (!apiResponse.success) {
        return {
          success: false,
          error: {
            code: apiResponse.error || "UNKNOWN_ERROR",
            message: apiResponse.message || "Unknown error occurred",
          },
        };
      }

      return {
        success: true,
        data: apiResponse.data,
      };
    } catch (error: unknown) {
      // Handle 404 differently - user not found is sometimes an expected result
      if (
        error &&
        typeof error === "object" &&
        "response" in error &&
        error.response &&
        typeof error.response === "object" &&
        "status" in error.response &&
        error.response.status === 404
      ) {
        return {
          success: false,
          error: {
            code: "USER_NOT_FOUND",
            message: "User not found",
          },
        };
      }

      // The error is already formatted by the axios interceptor
      return error as ApiResult<never>;
    }
  },
};
