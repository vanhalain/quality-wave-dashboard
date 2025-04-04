
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type UserRole = 'admin' | 'quality_controller' | 'manager';

export interface User {
  id: number;
  email: string;
  role: UserRole;
  name: string;
  status: 'active' | 'inactive';
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
}

// This is a mock implementation - in a real app, you would connect to your backend
export const useAuth = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      login: async (email: string, password: string) => {
        // Mock authentication - replace with actual API call
        if (email === 'admin@acquality.com' && password === 'password') {
          set({
            user: {
              id: 1,
              email: 'admin@acquality.com',
              role: 'admin',
              name: 'Admin User',
              status: 'active',
            },
            token: 'mock-jwt-token',
            isAuthenticated: true,
          });
          return { success: true };
        }
        
        return { 
          success: false, 
          message: 'Invalid email or password'
        };
      },
      logout: () => {
        set({
          user: null,
          token: null,
          isAuthenticated: false,
        });
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ 
        user: state.user, 
        token: state.token, 
        isAuthenticated: state.isAuthenticated
      }),
    }
  )
);
