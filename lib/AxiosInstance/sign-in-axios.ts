import axios, { type AxiosInstance } from "axios";

export const SigninReqConfig = async (): Promise<AxiosInstance> => {
  const SigninAxios: AxiosInstance = await axios.create({
    baseURL: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/login`,
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    timeout: 10000, // 10 second timeout
  });

  // Optional: Add response interceptor for common error handling
  SigninAxios.interceptors.response.use(
    (response) => response,
    (error) => {
      console.error("API request failed:", error);
      return Promise.reject(error);
    }
  );

  return SigninAxios;
};
