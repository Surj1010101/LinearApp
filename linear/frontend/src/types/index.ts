
/** Mood check-in entry */
export interface MoodEntry {
  id: string;
  userId: string;
  mood: number;          
  note?: string;
  createdAt: string;     
}

/** User profile */
export interface User {
  id: string;
  email: string;
  name: string;
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

/** Wellbeing insight returned by the ai service */
export interface Insight {
  id: string;
  userId: string;
  summary: string;
  suggestions: string[];
  generatedAt: string;
}

/** Generic API response wrapper */
export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}
