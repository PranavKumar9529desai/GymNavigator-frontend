import axios, { type AxiosInstance, type AxiosResponse, type AxiosError } from 'axios';
import type { ApiResult, ApiError, ApiConfig } from './types';

// Default API configuration
const defaultConfig: ApiConfig = {
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8787',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
};

// Error handler for API responses
const handleApiError = (error: AxiosError): ApiResult<never> => {
  if (error.response) {
    // Server responded with error status
    const status = error.response.status;
    const data = error.response.data as Record<string, unknown>;
    
    return {
      success: false,
      error: {
        code: `HTTP_${status}`,
        message: (data?.message as string) || (data?.error as string) || `HTTP ${status} error`,
      },
    };
  }
  
  if (error.request) {
    // Network error
    return {
      success: false,
      error: {
        code: 'NETWORK_ERROR',
        message: 'Network error - please check your connection',
      },
    };
  }
  
  // Other error
  return {
    success: false,
    error: {
      code: 'UNKNOWN_ERROR',
      message: error.message || 'An unknown error occurred',
    },
  };
};

// Create API client instance
const createApiClient = (config: Partial<ApiConfig> = {}): AxiosInstance => {
  const apiClient = axios.create({
    ...defaultConfig,
    ...config,
  });

  // Request interceptor for logging and auth headers
  apiClient.interceptors.request.use(
    (config) => {
      // Add auth token if available
      if (typeof window !== 'undefined') {
        const token = localStorage.getItem('auth-token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      }
      
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  // Response interceptor for error handling
  apiClient.interceptors.response.use(
    (response: AxiosResponse) => {
      return response;
    },
    (error: AxiosError) => {
      const apiError = handleApiError(error);
      console.error('API Error:', apiError);
      return Promise.reject(apiError);
    }
  );

  return apiClient;
};

// Export the default API client
export const apiClient = createApiClient();

// Helper function to make typed API calls
export const apiCall = async <T>(
  method: 'GET' | 'POST' | 'PUT' | 'DELETE',
  url: string,
  data?: Record<string, unknown>
): Promise<ApiResult<T>> => {
  try {
    const response = await apiClient.request({
      method,
      url,
      data,
    });
    
    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    return error as ApiResult<T>;
  }
};

// Export types for use in other files
export type { ApiResult, ApiError, ApiConfig }; 