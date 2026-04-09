import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { ApiResponse } from '@/types';

class ApiService {
  private api: AxiosInstance;
  private mockEnabled: boolean;

  constructor() {
    this.mockEnabled = import.meta.env.VITE_ENABLE_MOCK_API === 'true';
    
    this.api = axios.create({
      baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api',
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    // Request interceptor
    this.api.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('auth_token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor
    this.api.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;

        // Handle 401 - Unauthorized
        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;

          try {
            const refreshToken = localStorage.getItem('refresh_token');
            if (refreshToken) {
              const response = await this.post('/auth/refresh', { refreshToken });
              const { token } = response.data;
              
              localStorage.setItem('auth_token', token);
              originalRequest.headers.Authorization = `Bearer ${token}`;
              
              return this.api(originalRequest);
            }
          } catch (refreshError) {
            // Refresh failed, logout user
            localStorage.removeItem('auth_token');
            localStorage.removeItem('refresh_token');
            window.location.href = '/login';
            return Promise.reject(refreshError);
          }
        }

        // Handle 403 - Email not confirmed
        if (error.response?.status === 403 && error.response.data?.error === 'Email not confirmed') {
          const accountData = localStorage.getItem('account_data');
          const username = accountData ? JSON.parse(accountData).username : '';
          window.location.href = `/confirm-email?username=${encodeURIComponent(username)}`;
          return Promise.reject(error);
        }

        return Promise.reject(error);
      }
    );
  }

  // Generic request methods
  async get<T>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<ApiResponse<T>>> {
    return this.api.get(url, config);
  }

  async post<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<AxiosResponse<ApiResponse<T>>> {
    return this.api.post(url, data, config);
  }

  async put<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<AxiosResponse<ApiResponse<T>>> {
    return this.api.put(url, data, config);
  }

  async delete<T>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<ApiResponse<T>>> {
    return this.api.delete(url, config);
  }

  async patch<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<AxiosResponse<ApiResponse<T>>> {
    return this.api.patch(url, data, config);
  }

  // Simulated delay for mock API
  protected async mockDelay(ms: number = 500): Promise<void> {
    if (this.mockEnabled) {
      await new Promise(resolve => setTimeout(resolve, ms));
    }
  }

  // Mock response wrapper
  protected mockResponse<T>(data: T, success: boolean = true, message?: string): ApiResponse<T> {
    return {
      success,
      data: success ? data : undefined,
      message,
      error: success ? undefined : message,
    };
  }

  // Check if mock mode is enabled
  isMockEnabled(): boolean {
    return this.mockEnabled;
  }
}

export default new ApiService();