import axios, { type AxiosInstance } from 'axios';

export const SigninReqConfig = async (): Promise<AxiosInstance> => {
  const SigninAxios: AxiosInstance = await axios.create({
    baseURL: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/login`,
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    timeout: 10000, // 10 second timeout
  });

  // Enhanced response interceptor with better error handling
  SigninAxios.interceptors.response.use(
    (response) => response,
    (error) => {
      console.error('API request failed:', error);

      // Preserve original axios error structure for status code checks
      if (error.response?.status === 404) {
        // Keep original structure for 404s so the status check works
        return Promise.reject(error);
      }

      // Format other errors with consistent structure
      const errorResponse = error.response?.data;
      const formattedError = {
        success: false,
        error: {
          code: errorResponse?.error || 'SERVER_ERROR',
          message: errorResponse?.message || error.message || 'Unknown error occurred',
        },
      };

      return Promise.reject(formattedError);
    },
  );

  return SigninAxios;
};
