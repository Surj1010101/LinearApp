import api from './api';
import type { ApiResponse, Recommendation } from '../types';

export const recommendationService = {
  /** Get today's AI-generated recommendation like u say or add (exercise + nutrition tip) */
  getToday: () =>
    api.get<ApiResponse<Recommendation>>('/recommendations/today'),

  /** Request an alternative recommendation for example if u say something like ("show me something else") */
  getAlternative: () =>
    api.post<ApiResponse<Recommendation>>('/recommendations/alternative'),
};
