import axios from 'axios';

const API_BASE_URL = 'http://localhost:8081/api/auth'; //  your backend API URL

// Custom Axios instance for admin authentication
const adminAuthAxios = axios.create({
    baseURL: API_BASE_URL,
});

// Request interceptor to include the JWT token
adminAuthAxios.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('adminToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Admin login function
export const loginAdmin = async (email: string, password: string) => {
    try {
        const response = await adminAuthAxios.post('/login', { email, password });
        return response.data;
    } catch (error: any) {
        throw error.response?.data || { message: 'Login failed' };
    }
};

// Admin forgot password function
  export const forgotPasswordAdmin = async (email: string) => {
      try {
          const response = await adminAuthAxios.post('/forgot-password', { email });
          return response.data;
      } catch (error: any) {
          throw error.response?.data || { message: 'Forgot password failed' };
      }
  };

// Example of a protected API call (for demonstration)
export const getAdminData = async (endpoint: string) => {
    try {
        const response = await adminAuthAxios.get(endpoint);
        return response.data;
    } catch (error: any) {
        throw error.response?.data || { message: 'Failed to fetch data' };
    }
};