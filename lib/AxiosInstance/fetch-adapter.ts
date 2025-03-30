/**
 * Axios-like fetch adapter for Edge compatibility
 * 
 * This adapter provides an axios-like interface (get, post, etc.) but uses
 * the native fetch API under the hood, making it compatible with Edge runtimes.
 */

// Define headers interfaces to be compatible with axios
export type AxiosHeaderValue = string | string[] | number | boolean | null;

export interface RawAxiosHeaders {
  [key: string]: AxiosHeaderValue | undefined;
}

export interface AxiosRequestHeaders extends RawAxiosHeaders {
  [key: string]: AxiosHeaderValue | undefined;
  Accept?: AxiosHeaderValue;
  Authorization?: AxiosHeaderValue;
  "Content-Length"?: AxiosHeaderValue;
  "Content-Encoding"?: AxiosHeaderValue;
  "User-Agent"?: AxiosHeaderValue;
}

// Type definitions to match axios's interface
export interface AxiosRequestConfig {
  baseURL?: string;
  headers?: AxiosRequestHeaders;
  timeout?: number;
  [key: string]: any;
}

// Define headers interface to be compatible with axios
export interface AxiosResponseHeaders {
  [key: string]: string | undefined;
  "Content-Type"?: string;
  "Content-Length"?: string;
  "Content-Encoding"?: string;
  Server?: string;
  "Cache-Control"?: string;
}

export interface AxiosResponse<T = any, D = any> {
  data: T;
  status: number;
  statusText: string;
  headers: AxiosResponseHeaders;
  config: AxiosRequestConfig;
}

export interface AxiosError<T = any> {
  response?: AxiosResponse<T>;
  message: string;
  config: AxiosRequestConfig;
  code?: string;
  request?: any;
}

export interface AxiosInstance {
  get<T = any>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>>;
  post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>>;
  put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>>;
  delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>>;
  patch<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>>;
}

export interface AxiosStatic {
  create(config?: AxiosRequestConfig): AxiosInstance;
}

/**
 * Create a fetch-based axios-like instance
 */
export const create = (defaultConfig: AxiosRequestConfig = {}): AxiosInstance => {
  // Default headers
  const defaultHeaders: AxiosRequestHeaders = {
    'Content-Type': 'application/json',
    ...(defaultConfig.headers || {}),
  };

  // Helper to build the full URL
  const buildUrl = (url: string): string => {
    if (url.startsWith('http')) return url;
    return `${defaultConfig.baseURL || ''}${url.startsWith('/') ? url : `/${url}`}`;
  };

  // Helper to merge configs
  const mergeConfig = (config: AxiosRequestConfig = {}): AxiosRequestConfig => ({
    ...defaultConfig,
    ...config,
    headers: {
      ...defaultHeaders,
      ...(config.headers || {}),
    },
  });

  // Helper to convert Headers to AxiosResponseHeaders
  const convertHeaders = (headers: Headers): AxiosResponseHeaders => {
    const result: AxiosResponseHeaders = {};
    headers.forEach((value, key) => {
      result[key] = value;
    });
    return result;
  };

  // Helper to handle the fetch response
  const handleResponse = async <T>(response: Response, config: AxiosRequestConfig): Promise<AxiosResponse<T>> => {
    // Prepare the response object
    const axiosResponse: AxiosResponse<T> = {
      data: {} as T,
      status: response.status,
      statusText: response.statusText,
      headers: convertHeaders(response.headers),
      config,
    };

    try {
      // Try to parse as JSON
      axiosResponse.data = await response.json();
    } catch (e) {
      // If not JSON, get as text
      axiosResponse.data = await response.text() as unknown as T;
    }

    // If the response is not ok, throw an error
    if (!response.ok) {
      // Create a proper AxiosError object with all required properties
      const error: AxiosError<T> = {
        response: axiosResponse,
        message: `Request failed with status code ${response.status}`,
        config,
        code: response.status.toString(),
      };
      throw error;
    }

    return axiosResponse;
  };

  // The axios-like instance
  const instance: AxiosInstance = {
    get: async <T>(url: string, config: AxiosRequestConfig = {}): Promise<AxiosResponse<T>> => {
      const mergedConfig = mergeConfig(config);
      const fullUrl = buildUrl(url);

      const response = await fetch(fullUrl, {
        method: 'GET',
        headers: mergedConfig.headers as Record<string, string>,
      });

      return handleResponse<T>(response, mergedConfig);
    },

    post: async <T>(url: string, data?: any, config: AxiosRequestConfig = {}): Promise<AxiosResponse<T>> => {
      const mergedConfig = mergeConfig(config);
      const fullUrl = buildUrl(url);

      const response = await fetch(fullUrl, {
        method: 'POST',
        headers: mergedConfig.headers as Record<string, string>,
        body: data ? JSON.stringify(data) : undefined,
      });

      return handleResponse<T>(response, mergedConfig);
    },

    put: async <T>(url: string, data?: any, config: AxiosRequestConfig = {}): Promise<AxiosResponse<T>> => {
      const mergedConfig = mergeConfig(config);
      const fullUrl = buildUrl(url);

      const response = await fetch(fullUrl, {
        method: 'PUT',
        headers: mergedConfig.headers as Record<string, string>,
        body: data ? JSON.stringify(data) : undefined,
      });

      return handleResponse<T>(response, mergedConfig);
    },

    delete: async <T>(url: string, config: AxiosRequestConfig = {}): Promise<AxiosResponse<T>> => {
      const mergedConfig = mergeConfig(config);
      const fullUrl = buildUrl(url);

      const response = await fetch(fullUrl, {
        method: 'DELETE',
        headers: mergedConfig.headers as Record<string, string>,
      });

      return handleResponse<T>(response, mergedConfig);
    },

    patch: async <T>(url: string, data?: any, config: AxiosRequestConfig = {}): Promise<AxiosResponse<T>> => {
      const mergedConfig = mergeConfig(config);
      const fullUrl = buildUrl(url);

      const response = await fetch(fullUrl, {
        method: 'PATCH',
        headers: mergedConfig.headers as Record<string, string>,
        body: data ? JSON.stringify(data) : undefined,
      });

      return handleResponse<T>(response, mergedConfig);
    },
  };

  return instance;
};

// Create an axios-like object with a create method
export const axios: AxiosStatic = {
  create,
};

export default axios; 