import axios from "axios";

const apiUrl = 'http://localhost:8081/api/auth'; // adjust if needed

export interface AuthResponse {
  token: string;
  name: string;
  email: string;
  roles: string[];
}



export const login = async (email: string, password: string): Promise<AuthResponse> => {
  const response = await axios.post(`${apiUrl}/login`, { email, password });
  
  return response.data;
};

export const signup = async (
    name: string,
    email: string,
    password: string,
    phone: string
  ): Promise<AuthResponse> => {
    const response = await axios.post(`${apiUrl}/signup`, {
      name,
      email,
      password,
      phone,
    });
    return response.data;
  };
  