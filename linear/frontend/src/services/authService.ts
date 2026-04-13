import api from './api';
import type { ApiResponse, User } from '../types';

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload extends LoginPayload {
  name: string;
}

export interface UpdateProfilePayload {
  name?: string;
  age?: number;
  fitnessLevel?: 'beginner' | 'intermediate' | 'advanced';
  workPattern?: 'remote' | 'hybrid' | 'office';
  goals?: string[];
}

interface AuthResponse {
  user: User;
  token: string;
}

export const authService = {
  login: (payload: LoginPayload) =>
    api.post<ApiResponse<AuthResponse>>('/auth/login', payload),

  register: (payload: RegisterPayload) =>
    api.post<ApiResponse<AuthResponse>>('/auth/register', payload),

  me: () => api.get<ApiResponse<User>>('/auth/me'),

  updateProfile: (payload: UpdateProfilePayload) =>
    api.put<ApiResponse<User>>('/users/me', payload),
};
