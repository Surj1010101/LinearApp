/** User profile */
export interface User {
  id: string;
  email: string;
  name: string;
  age?: number;
  fitnessLevel?: 'beginner' | 'intermediate' | 'advanced';
  workPattern?: 'remote' | 'hybrid' | 'office';
  goals?: string[];
  avatarUrl?: string;
  createdAt: string;
}

/** Auth state exposed by AuthContext */
export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
}

/** Sentiment result from NLP analysis */
export type Sentiment = 'positive' | 'neutral' | 'negative';

/** Daily wellbeing check-in (matches BE API contract) */
export interface CheckIn {
  id: string;
  userId: string;
  mood: number;
  energy: number;
  stress: number;
  hoursWorked: number;
  screenTime?: number;
  waterGlasses?: number;
  mealsEaten?: number;
  setting: 'home' | 'office';
  freeText?: string;
  sentiment?: Sentiment;
  sentimentScore?: number;
  keywords?: string[];
  createdAt: string;
}

/** Legacy mood-only entry (kept for backward compat) */
export interface MoodEntry {
  id: string;
  userId: string;
  mood: number;
  note?: string;
  createdAt: string;
}

/** Exercise intensity levels */
export type Intensity = 'low' | 'moderate' | 'high';

/** Exercise category from ML model */
export type ExerciseCategory =
  | 'stretching'
  | 'light_cardio'
  | 'moderate'
  | 'strength'
  | 'yoga_mindfulness'
  | 'rest';

/** AI-generated exercise recommendation */
export interface Recommendation {
  id: string;
  userId: string;
  checkinId?: string;
  exerciseCategory: ExerciseCategory;
  exerciseName: string;
  exerciseDescription?: string;
  durationMins: number;
  intensity: Intensity;
  nutritionTip: string;
  confidence: number;
  ruleOverride: boolean;
  disclaimer: string;
  imageUrl?: string;
  createdAt: string;
}

/** Dashboard weekly summary */
export interface DashboardSummary {
  moodAvg: number;
  energyAvg: number;
  stressAvg: number;
  exerciseCount: number;
  streak: number;
  checkinCount: number;
}

/** Single data point for trend charts */
export interface TrendPoint {
  date: string;
  value: number;
}

/** Wellbeing insight returned by the AI service */
export interface Insight {
  id: string;
  userId: string;
  summary: string;
  suggestions: string[];
  source: 'ai' | 'local';
  generatedAt: string;
}

/** Generic API response wrapper */
export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}
