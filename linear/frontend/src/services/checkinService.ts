import api from './api';
import type { ApiResponse, CheckIn } from '../types';

/** Payload for creating a daily check-in (matches BE POST api/checkins) */
export interface CreateCheckInPayload {
  mood: number;
  energy: number;
  stress: number;
  hoursWorked: number;
  screenTime?: number;
  waterGlasses?: number;
  mealsEaten?: number;
  setting: 'home' | 'office';
  freeText?: string;
}

export const checkinService = {
  /** Submit a daily check-in — returns the created check-in */
  create: (payload: CreateCheckInPayload) =>
    api.post<ApiResponse<CheckIn>>('/checkins', payload),

  /** Fetch all check-ins for authenticated user, U CAN also optionally filtered by date range */
  getAll: (from?: string, to?: string) => {
    const params = new URLSearchParams();
    if (from) params.append('from', from);
    if (to) params.append('to', to);
    return api.get<ApiResponse<CheckIn[]>>(`/checkins?${params.toString()}`);
  },

  /** Fetch a single check-in by id */
  getById: (id: string) =>
    api.get<ApiResponse<CheckIn>>(`/checkins/${id}`),
};
