const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Types
export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  profile: {
    age?: number;
    location?: string;
    lifestyle: 'sedentary' | 'moderate' | 'active';
    householdSize: number;
  };
  carbonFootprint: {
    total: number;
    baseline: number;
    target: number;
    lastCalculated: string;
  };
  preferences: {
    units: 'metric' | 'imperial';
    notifications: {
      email: boolean;
      push: boolean;
    };
    privacy: {
      shareData: boolean;
      publicProfile: boolean;
    };
  };
  createdAt: string;
  updatedAt: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface SignupData {
  name: string;
  email: string;
  password: string;
  profile?: {
    age?: number;
    location?: string;
    lifestyle?: 'sedentary' | 'moderate' | 'active';
    householdSize?: number;
  };
}

export interface AuthResponse {
  message: string;
  token: string;
  user: User;
}

export interface Activity {
  id: string;
  category: string;
  subcategory: string;
  title: string;
  description?: string;
  date: string;
  carbonFootprint: {
    value: number;
    unit: 'kg' | 'tons';
  };
  data?: any;
  location?: any;
  tags?: string[];
  isRecurring: boolean;
  status: 'active' | 'completed' | 'cancelled';
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Goal {
  id: string;
  title: string;
  description?: string;
  category: string;
  target: {
    value: number;
    unit: string;
    timeframe: string;
  };
  current: {
    value: number;
    lastUpdated: string;
  };
  progressPercentage: number;
  startDate: string;
  endDate: string;
  daysRemaining: number;
  isOverdue: boolean;
  status: 'active' | 'completed' | 'paused' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'critical';
  difficulty: 'easy' | 'moderate' | 'hard' | 'expert';
  milestones: any[];
  tags?: string[];
  isPublic: boolean;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  category: string;
  type: string;
  criteria: any;
  icon: string;
  badge: string;
  points: number;
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  isUnlocked: boolean;
  unlockedAt?: string;
  progress: {
    current: number;
    required: number;
    percentage: number;
  };
  metadata?: any;
  tags?: string[];
  isHidden: boolean;
  isExpired: boolean;
  createdAt: string;
  updatedAt: string;
}

// Utility functions
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

const handleResponse = async (response: Response) => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
  }
  return response.json();
};

// API functions
export const api = {
  // Authentication
  async login(data: LoginData): Promise<AuthResponse> {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const result = await handleResponse(response);
    localStorage.setItem('token', result.token);
    localStorage.setItem('user', JSON.stringify(result.user));
    return result;
  },

  async signup(data: SignupData): Promise<AuthResponse> {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const result = await handleResponse(response);
    localStorage.setItem('token', result.token);
    localStorage.setItem('user', JSON.stringify(result.user));
    return result;
  },

  async logout(): Promise<void> {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    await fetch(`${API_BASE_URL}/auth/logout`, {
      method: 'POST',
      headers: getAuthHeaders(),
    });
  },

  async getCurrentUser(): Promise<User> {
    const response = await fetch(`${API_BASE_URL}/auth/me`, {
      headers: getAuthHeaders(),
    });
    const result = await handleResponse(response);
    localStorage.setItem('user', JSON.stringify(result.user));
    return result.user;
  },

  // User management
  async updateProfile(data: Partial<User>): Promise<{ message: string; user: User }> {
    const response = await fetch(`${API_BASE_URL}/users/profile`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    const result = await handleResponse(response);
    localStorage.setItem('user', JSON.stringify(result.user));
    return result;
  },

  async getUserStats(): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/users/stats`, {
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },

  async updatePreferences(data: any): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/users/preferences`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  },

  // Activities
  async createActivity(data: Partial<Activity>): Promise<{ message: string; activity: Activity }> {
    const response = await fetch(`${API_BASE_URL}/activities`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  },

  async getActivities(params?: {
    page?: number;
    limit?: number;
    category?: string;
    startDate?: string;
    endDate?: string;
  }): Promise<{ activities: Activity[]; pagination: any }> {
    const searchParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) searchParams.append(key, value.toString());
      });
    }
    
    const response = await fetch(`${API_BASE_URL}/activities?${searchParams}`, {
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },

  async getActivity(id: string): Promise<{ activity: Activity }> {
    const response = await fetch(`${API_BASE_URL}/activities/${id}`, {
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },

  async updateActivity(id: string, data: Partial<Activity>): Promise<{ message: string; activity: Activity }> {
    const response = await fetch(`${API_BASE_URL}/activities/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  },

  async deleteActivity(id: string): Promise<{ message: string }> {
    const response = await fetch(`${API_BASE_URL}/activities/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },

  async getActivityStats(params?: { startDate?: string; endDate?: string }): Promise<any> {
    const searchParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) searchParams.append(key, value);
      });
    }
    
    const response = await fetch(`${API_BASE_URL}/activities/stats?${searchParams}`, {
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },

  // Goals
  async createGoal(data: Partial<Goal>): Promise<{ message: string; goal: Goal }> {
    const response = await fetch(`${API_BASE_URL}/goals`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  },

  async getGoals(params?: {
    status?: string;
    category?: string;
    page?: number;
    limit?: number;
  }): Promise<{ goals: Goal[]; pagination: any }> {
    const searchParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) searchParams.append(key, value.toString());
      });
    }
    
    const response = await fetch(`${API_BASE_URL}/goals?${searchParams}`, {
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },

  async getGoal(id: string): Promise<{ goal: Goal }> {
    const response = await fetch(`${API_BASE_URL}/goals/${id}`, {
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },

  async updateGoal(id: string, data: Partial<Goal>): Promise<{ message: string; goal: Goal }> {
    const response = await fetch(`${API_BASE_URL}/goals/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  },

  async updateGoalProgress(id: string, value: number): Promise<{ message: string; goal: Goal }> {
    const response = await fetch(`${API_BASE_URL}/goals/${id}/progress`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify({ value }),
    });
    return handleResponse(response);
  },

  async deleteGoal(id: string): Promise<{ message: string }> {
    const response = await fetch(`${API_BASE_URL}/goals/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },

  async getGoalStats(): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/goals/stats/overview`, {
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },

  // Achievements
  async getAchievements(params?: {
    status?: string;
    category?: string;
    page?: number;
    limit?: number;
  }): Promise<{ achievements: Achievement[]; pagination: any }> {
    const searchParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) searchParams.append(key, value.toString());
      });
    }
    
    const response = await fetch(`${API_BASE_URL}/achievements?${searchParams}`, {
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },

  async getUnlockedAchievements(): Promise<{ achievements: Achievement[] }> {
    const response = await fetch(`${API_BASE_URL}/achievements/unlocked`, {
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },

  async getAvailableAchievements(): Promise<{ achievements: Achievement[] }> {
    const response = await fetch(`${API_BASE_URL}/achievements/available`, {
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },

  async checkAchievements(): Promise<{ message: string; newlyUnlocked: Achievement[]; totalUnlocked: number }> {
    const response = await fetch(`${API_BASE_URL}/achievements/check`, {
      method: 'POST',
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },

  async getAchievementStats(): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/achievements/stats/overview`, {
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },

  // Insights (AI)
  async getInsightsOverview(timeframe?: number): Promise<any> {
    const searchParams = new URLSearchParams();
    if (timeframe) searchParams.append('timeframe', timeframe.toString());
    
    const response = await fetch(`${API_BASE_URL}/insights/overview?${searchParams}`, {
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },

  async getCustomAnalysis(question: string, timeframe?: number): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/insights/analyze`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ question, timeframe }),
    });
    return handleResponse(response);
  },

  async getRecommendations(category?: string): Promise<any> {
    const searchParams = new URLSearchParams();
    if (category) searchParams.append('category', category);
    
    const response = await fetch(`${API_BASE_URL}/insights/recommendations?${searchParams}`, {
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },

  // AI Insights
  async getInsights(): Promise<{ insights: any[] }> {
    const response = await fetch(`${API_BASE_URL}/insights`, {
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },

  async generateInsights(): Promise<{ message: string }> {
    const response = await fetch(`${API_BASE_URL}/insights/generate`, {
      method: 'POST',
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },

  async getAnalytics(): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/analytics`, {
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },
};

// Auth utilities
export const auth = {
  isAuthenticated: (): boolean => {
    return !!localStorage.getItem('token');
  },

  getToken: (): string | null => {
    return localStorage.getItem('token');
  },

  getUser: (): User | null => {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },

  setUser: (user: User): void => {
    localStorage.setItem('user', JSON.stringify(user));
  },

  clearAuth: (): void => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },
};

export default api; 