export interface User {
    UserID: number;
    Name: string;
    Password?: string;
    Phone: string;
    Email: string;
    Role: 'ADMIN' | 'USER';
    CreatedAt: string;
    IsActive: boolean;
    isEmailVerified: boolean;
  }
  
  export interface AdminUser {
    userId: number;
    name: string;
    phone: string;
    email: string;
    role: 'ADMIN' | 'USER';
    isActive: boolean;
    isEmailVerified: boolean;
  }