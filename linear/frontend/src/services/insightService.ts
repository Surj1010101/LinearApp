import api from './api';
import type { ApiResponse, Insight } from '../types';

export const insightService = {
  /** Request an AI-generated wellbeing insight this will be done through api key from ai */
  generate: () => api.post<ApiResponse<Insight>>('/insights/generate'),

  /**Fetch previous insights */
  getAll: () => api.get<ApiResponse<Insight[]>>('/insights'),
};
