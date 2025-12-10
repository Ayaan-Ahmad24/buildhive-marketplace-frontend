// import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios';

// // Base URL for all API requests
// const BASE_URL = 'http://localhost:3000';

// // Create axios instance with default configuration
// const api: AxiosInstance = axios.create({
//   baseURL: BASE_URL,
//   timeout: 30000,
//   headers: {
//     'Content-Type': 'application/json',
//   },
// });

// // Request interceptor - Add authentication token to every request
// api.interceptors.request.use(
//   (config: InternalAxiosRequestConfig) => {
//     const token = localStorage.getItem('authToken');
//     if (token && config.headers) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error: AxiosError) => {
//     return Promise.reject(error);
//   }
// );

// // Response interceptor - Handle errors globally
// api.interceptors.response.use(
//   (response) => response,
//   (error: AxiosError) => {
//     if (error.response?.status === 401) {
//       // Token expired or invalid - redirect to login
//       localStorage.removeItem('authToken');
//       localStorage.removeItem('userId');
//       localStorage.removeItem('userRole');
//       window.location.href = '/signin';
//     }
//     return Promise.reject(error);
//   }
// );

// export default api;





import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios';
import { tokenStorage } from '../utils/cookies';

// Base URL for all API requests
const BASE_URL = 'http://localhost:3000';

// Create axios instance with default configuration
const api: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - Add authentication token to every request
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = tokenStorage.getToken();
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('🔑 [API] Added auth token to request:', config.url);
    } else {
      console.log('📤 [API] Request without auth token:', config.url);
    }
    return config;
  },
  (error: AxiosError) => {
    console.error('❌ [API] Request error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor - Handle errors globally
api.interceptors.response.use(
  (response) => {
    console.log('✅ [API] Response success:', response.config.url, response.status);
    return response;
  },
  (error: AxiosError) => {
    console.error('❌ [API] Response error:', error.config?.url, error.response?.status);
    if (error.response?.status === 401) {
      console.warn('🚪 [API] 401 Unauthorized - Clearing auth and redirecting to signin');
      // Token expired or invalid - redirect to login
      tokenStorage.clear();
      document.cookie = 'user_role=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC';
      document.cookie = 'refresh_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC';
      document.cookie = 'user_data=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC';
      window.location.href = '/signin';
    }
    return Promise.reject(error);
  }
);

export default api;