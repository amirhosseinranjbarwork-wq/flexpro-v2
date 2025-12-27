/**
 * Local API Service
 * Centralized API client for communicating with the FastAPI backend
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export interface ApiError {
  detail: string;
  message?: string;
}

class ApiClient {
  private baseURL: string;
  private token: string | null = null;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
    // Load token from localStorage on initialization
    this.loadToken();
  }

  /**
   * Load authentication token from localStorage
   */
  private loadToken(): void {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('flexpro_token');
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          this.token = parsed.access_token || null;
        } catch {
          this.token = stored; // Fallback if stored as plain string
        }
      }
    }
  }

  /**
   * Save authentication token to localStorage
   */
  setToken(token: string): void {
    this.token = token;
    if (typeof window !== 'undefined') {
      localStorage.setItem('flexpro_token', JSON.stringify({ access_token: token }));
    }
  }

  /**
   * Clear authentication token
   */
  clearToken(): void {
    this.token = null;
    if (typeof window !== 'undefined') {
      localStorage.removeItem('flexpro_token');
    }
  }

  /**
   * Get current authentication token
   */
  getToken(): string | null {
    return this.token;
  }

  /**
   * Make an API request
   */
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    // Add authorization header if token exists
    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      // Handle non-JSON responses
      const contentType = response.headers.get('content-type');
      if (!contentType?.includes('application/json')) {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return {} as T; // Return empty object for non-JSON responses
      }

      const data = await response.json();

      if (!response.ok) {
        const error: ApiError = data;
        throw new Error(error.detail || error.message || `HTTP error! status: ${response.status}`);
      }

      return data;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('An unknown error occurred');
    }
  }

  /**
   * GET request
   */
  async get<T>(endpoint: string, params?: Record<string, string | number | undefined>): Promise<T> {
    let url = endpoint;
    if (params) {
      const searchParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          searchParams.append(key, String(value));
        }
      });
      const queryString = searchParams.toString();
      if (queryString) {
        url += `?${queryString}`;
      }
    }
    return this.request<T>(url, { method: 'GET' });
  }

  /**
   * POST request
   */
  async post<T>(endpoint: string, data?: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  /**
   * PUT request
   */
  async put<T>(endpoint: string, data?: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  /**
   * DELETE request
   */
  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }
}

// Create singleton instance
export const api = new ApiClient(API_BASE_URL);

// ============================================================================
// Authentication API
// ============================================================================

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface RegisterData {
  username: string;
  email?: string;
  password: string;
  full_name?: string;
  role?: 'coach' | 'client';
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
  user: {
    id: number;
    username: string;
    email?: string;
    full_name?: string;
    role: string;
    coach_code?: string;
    is_super_admin: number;
  };
}

export const authApi = {
  /**
   * Login user
   */
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/api/v1/auth/login', credentials);
    api.setToken(response.access_token);
    return response;
  },

  /**
   * Register new user
   */
  async register(data: RegisterData): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/api/v1/auth/register', data);
    api.setToken(response.access_token);
    return response;
  },

  /**
   * Get current user info
   */
  async getCurrentUser(): Promise<AuthResponse['user']> {
    return api.get<AuthResponse['user']>('/api/v1/auth/me');
  },

  /**
   * Logout user
   */
  logout(): void {
    api.clearToken();
  },
};

// ============================================================================
// Exercises API
// ============================================================================

export interface Exercise {
  id: number;
  exercise_id: string;
  name: string;
  category?: string;
  muscle_group?: string;
  sub_muscle_group?: string;
  equipment?: string;
  type?: string;
  difficulty?: string;
  scientific_data?: Record<string, unknown>;
}

export const exercisesApi = {
  /**
   * Get all exercises with optional filters
   */
  async getAll(filters?: {
    category?: string;
    muscle_group?: string;
    equipment?: string;
    search?: string;
  }): Promise<Exercise[]> {
    return api.get<Exercise[]>('/api/v1/exercises/', filters);
  },

  /**
   * Get exercise by ID
   */
  async getById(id: number): Promise<Exercise> {
    return api.get<Exercise>(`/api/v1/exercises/${id}`);
  },

  /**
   * Get exercise by original exercise_id
   */
  async getByExerciseId(exerciseId: string): Promise<Exercise> {
    return api.get<Exercise>(`/api/v1/exercises/by-exercise-id/${exerciseId}`);
  },
};

// ============================================================================
// Workouts API
// ============================================================================

export interface WorkoutPlan {
  id: number;
  user_id: number;
  data: Record<string, unknown>;
  plan_name?: string;
  plan_type?: string;
  created_at: string;
  updated_at: string;
}

export interface WorkoutPlanCreate {
  data: Record<string, unknown>;
  plan_name?: string;
  plan_type?: string;
}

export const workoutsApi = {
  /**
   * Get all workout plans for current user
   */
  async getAll(planType?: string): Promise<WorkoutPlan[]> {
    return api.get<WorkoutPlan[]>('/api/v1/workouts/', planType ? { plan_type: planType } : undefined);
  },

  /**
   * Get workout plan by ID
   */
  async getById(id: number): Promise<WorkoutPlan> {
    return api.get<WorkoutPlan>(`/api/v1/workouts/${id}`);
  },

  /**
   * Create new workout plan
   */
  async create(data: WorkoutPlanCreate): Promise<WorkoutPlan> {
    return api.post<WorkoutPlan>('/api/v1/workouts/', data);
  },

  /**
   * Update workout plan
   */
  async update(id: number, data: Partial<WorkoutPlanCreate>): Promise<WorkoutPlan> {
    return api.put<WorkoutPlan>(`/api/v1/workouts/${id}`, data);
  },

  /**
   * Delete workout plan
   */
  async delete(id: number): Promise<void> {
    return api.delete<void>(`/api/v1/workouts/${id}`);
  },

  /**
   * Get workout plans for a specific user (coach only)
   */
  async getByUserId(userId: number, planType?: string): Promise<WorkoutPlan[]> {
    return api.get<WorkoutPlan[]>(
      `/api/v1/workouts/user/${userId}`,
      planType ? { plan_type: planType } : undefined
    );
  },
};

// ============================================================================
// Foods API
// ============================================================================

export interface Food {
  id: number;
  food_id: string;
  name: string;
  name_en?: string;
  category?: string;
  subcategory?: string;
  calories?: number;
  macros?: Record<string, unknown>;
}

export const foodsApi = {
  /**
   * Get all foods with optional filters
   */
  async getAll(filters?: {
    category?: string;
    search?: string;
  }): Promise<Food[]> {
    return api.get<Food[]>('/api/v1/foods/', filters);
  },

  /**
   * Get food by ID
   */
  async getById(id: number): Promise<Food> {
    return api.get<Food>(`/api/v1/foods/${id}`);
  },
};


