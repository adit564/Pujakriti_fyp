import axios, { AxiosResponse, AxiosError } from "axios";

const apiUrl = 'http://localhost:8081/api/auth'; // adjust if needed

export interface AuthResponse {
  token: string; // Token is optional for signup success message
  name: string;
  email: string;
  role: string;
  user_Id: number;
  message: string;
}

interface ErrorResponse {
  message: string;
}

const handleRequest = async (promise: Promise<AxiosResponse>): Promise<AxiosResponse> => {
  try {
    return await promise;
  } catch (error: any) {
    throw error; // Re-throw the caught error directly
  }
};

export const login = async (email: string, password: string): Promise<AuthResponse> => {
  const response = await handleRequest(axios.post(`${apiUrl}/login`, { email, password }));
  return response.data;
};

export const signup = async (
  name: string,
  email: string,
  password: string,
  phone: string
): Promise<AuthResponse> => {
  const response = await handleRequest(axios.post(`${apiUrl}/signup`, {
    name,
    email,
    password,
    phone,
  }));
  return response.data;
};

export const verifyEmail = async (token: string) => {
  const response = await fetch(`/api/auth/verify-email?token=${token}`);
  if (!response.ok) {
    const error = await response.text();
    throw new Error(error);
  }
  return response.text();
};

export const forgotPassword = async (email: string): Promise<any> => {
  const response = await handleRequest(axios.post(`${apiUrl}/forgot-password`, { email }));
  return response.data; 
};

export const resetPassword = async (token: string, newPassword: string): Promise<any> => {
  const response = await handleRequest(axios.post(`${apiUrl}/reset-password`, { token, newPassword }));
  return response.data; // Or handle based on your backend response
};