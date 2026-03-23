import api from './api';
import type { ApiResponse, DashboardSummary, TrendPoint } from '../types';

export const dashboardService = {
  /**Get weekly summary stats (avg mood, streak, exercise count) */
  getSummary: (period: 'week' | 'month' = 'week') =>
    api.get<ApiResponse<DashboardSummary>>(`/dashboard/summary?period=${period}`),

  /** Get trend data for a metric over N days (for line charts) */
  getTrends: (metric: 'mood' | 'energy' | 'stress' = 'mood', days: number = 7) =>
    api.get<ApiResponse<TrendPoint[]>>(`/dashboard/trends?metric=${metric}&days=${days}`),
};
