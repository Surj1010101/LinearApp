import api from './api';
import type { ApiResponse, MoodEntry } from '../types';

export interface CreateMoodPayload {
  mood: number;
  note?: string;
}

export const moodService = {
  /** this toCreate a new mood check-in */
  create: (payload: CreateMoodPayload) =>
    api.post<ApiResponse<MoodEntry>>('/moods', payload),

  /** Fetch all mood entries for the authenticated user */
  getAll: () => api.get<ApiResponse<MoodEntry[]>>('/moods'),

  /** Fetch a single mood entry by id */
  getById: (id: string) => api.get<ApiResponse<MoodEntry>>(`/moods/${id}`),
};
