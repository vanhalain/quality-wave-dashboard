
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { supabase } from "@/integrations/supabase/client";

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
  updateUserProfile: (updates: Partial<User>) => Promise<{ success: boolean; message?: string }>;
  setUser: (user: User | null) => void;
  changeUserRole: (userId: number, newRole: UserRole) => Promise<{ success: boolean; message?: string }>;
  resetUserPassword: (email: string) => Promise<{ success: boolean; message?: string }>;
  setUserPassword: (userId: number, newPassword: string) => Promise<{ success: boolean; message?: string }>;
}

// Mock users data for demonstration
const mockUsers = [
  {
    id: 1,
    email: 'admin@acquality.com',
    role: 'admin' as UserRole,
    name: 'Admin User',
    status: 'active' as const,
  },
  {
    id: 2,
    email: 'quality@acquality.com',
    role: 'quality_controller' as UserRole,
    name: 'Quality Controller',
    status: 'active' as const,
  },
  {
    id: 3,
    email: 'manager@acquality.com',
    role: 'manager' as UserRole,
    name: 'Team Manager',
    status: 'active' as const,
  },
];

// This is a mock implementation - in a real app, you would connect to your backend
export const useAuth = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      login: async (email: string, password: string) => {
        // Mock authentication - replace with actual API call
        const mockUser = mockUsers.find(
          (u) => u.email === email && password === 'password'
        );
        
        if (mockUser) {
          set({
            user: mockUser,
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
      updateUserProfile: async (updates) => {
        const { user } = get();
        if (!user) {
          return { success: false, message: 'User not authenticated' };
        }

        // In a real application, this would be an API call to update the user's profile
        set({
          user: {
            ...user,
            ...updates,
          },
        });

        return { success: true, message: 'Profile updated successfully' };
      },
      setUser: (user) => {
        set({ user });
      },
      changeUserRole: async (userId, newRole) => {
        // In a real application, this would be an API call to update a user's role
        // This is a mock implementation for demonstration
        const userToUpdate = mockUsers.find(u => u.id === userId);
        if (userToUpdate) {
          userToUpdate.role = newRole;
          return { success: true, message: 'Role updated successfully' };
        }
        return { success: false, message: 'User not found' };
      },
      resetUserPassword: async (email) => {
        // In a real application, this would be an API call to reset a user's password
        // For now, we'll just simulate success for any email that exists in our mock data
        const userExists = mockUsers.some(u => u.email === email);
        
        if (userExists) {
          // In a real application with Supabase, you would use something like:
          // await supabase.auth.resetPasswordForEmail(email);
          
          return { 
            success: true, 
            message: 'Password reset email sent successfully' 
          };
        }
        
        return { 
          success: false, 
          message: 'User with this email not found' 
        };
      },
      setUserPassword: async (userId, newPassword) => {
        // In a real application, this would be an API call to directly set a user's password
        // For now, we'll just simulate success for any user ID that exists in our mock data
        const userExists = mockUsers.some(u => u.id === userId);
        
        if (userExists) {
          // In a real application with Supabase, you would use something like:
          // await supabase.auth.admin.updateUserById(userId, { password: newPassword });
          
          return { 
            success: true, 
            message: 'Password updated successfully' 
          };
        }
        
        return { 
          success: false, 
          message: 'User not found' 
        };
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
