/**
 * API SERVICE LAYER - Complete Local Backend Integration
 * All communication with FastAPI SQLite backend
 */

// ============================================================================
// TYPES
// ============================================================================

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  full_name: string;
  role?: 'client' | 'coach' | 'admin';
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
  user: User;
}

export interface User {
  id: string;
  email: string;
  full_name: string;
  role: string;
  created_at: string;
}

export interface Exercise {
  id: string;
  name: string;
  category: string;
  primary_muscles: string[];
  secondary_muscles: string[];
  equipment: string[];
  difficulty: string;
  description: string;
  instructions?: string;
  default_sets?: number;
  default_reps?: number;
  default_rest?: number;
  rpe?: number;
  tempo?: string;
  tags?: string[];
}

export interface Food {
  id: string;
  name: string;
  category: string;
  serving_size: number;
  serving_unit: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  benefits?: string;
  tags?: string[];
}

export interface Supplement {
  id: string;
  name: string;
  category: string;
  standard_dose: number;
  dose_unit: string;
  timing: string;
  evidence_level: string;
  benefits: string;
  instructions?: string;
  tags?: string[];
}

export interface WorkoutProgram {
  id?: string;
  user_id?: string;
  name: string;
  description?: string;
  goal_type: string;
  duration: number;
  difficulty: string;
  weekly_schedule: any; // JSON
  created_at?: string;
  updated_at?: string;
}

export interface ApiError {
  detail: string;
  status?: number;
}

// ============================================================================
// CONFIGURATION
// ============================================================================

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
const API_VERSION = '/api/v1';
const BASE_URL = `${API_BASE_URL}${API_VERSION}`;

// ============================================================================
// HTTP CLIENT
// ============================================================================

class ApiClient {
  private baseUrl: string;
  private token: string | null = null;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
    this.loadToken();
  }

  private loadToken() {
    this.token = localStorage.getItem('auth_token');
  }

  private saveToken(token: string) {
    this.token = token;
    localStorage.setItem('auth_token', token);
  }

  private clearToken() {
    this.token = null;
    localStorage.removeItem('auth_token');
  }

  private getHeaders(): Record<string, string> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    return headers;
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      let errorDetail = `HTTP Error ${response.status}`;
      
      try {
        const errorData = await response.json();
        errorDetail = errorData.detail || errorData.message || errorDetail;
      } catch {
        // If JSON parsing fails, use status text
        errorDetail = response.statusText || errorDetail;
      }

      throw {
        detail: errorDetail,
        status: response.status
      } as ApiError;
    }

    // Handle 204 No Content
    if (response.status === 204) {
      return {} as T;
    }

    try {
      return await response.json();
    } catch {
      return {} as T;
    }
  }

  async get<T>(endpoint: string, params?: Record<string, any>): Promise<T> {
    try {
      const url = new URL(`${this.baseUrl}${endpoint}`);
      
      if (params) {
        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            url.searchParams.append(key, String(value));
          }
        });
      }

      const response = await fetch(url.toString(), {
        method: 'GET',
        headers: this.getHeaders(),
      });

      return this.handleResponse<T>(response);
    } catch (error) {
      if ((error as any).detail) {
        throw error;
      }
      throw {
        detail: 'Connection to local server failed. Please ensure the backend is running.',
        status: 0
      } as ApiError;
    }
  }

  async post<T>(endpoint: string, data?: any): Promise<T> {
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: data ? JSON.stringify(data) : undefined,
      });

      return this.handleResponse<T>(response);
    } catch (error) {
      if ((error as any).detail) {
        throw error;
      }
      throw {
        detail: 'Connection to local server failed. Please ensure the backend is running.',
        status: 0
      } as ApiError;
    }
  }

  async put<T>(endpoint: string, data?: any): Promise<T> {
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method: 'PUT',
        headers: this.getHeaders(),
        body: data ? JSON.stringify(data) : undefined,
      });

      return this.handleResponse<T>(response);
    } catch (error) {
      if ((error as any).detail) {
        throw error;
      }
      throw {
        detail: 'Connection to local server failed. Please ensure the backend is running.',
        status: 0
      } as ApiError;
    }
  }

  async delete<T>(endpoint: string): Promise<T> {
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method: 'DELETE',
        headers: this.getHeaders(),
      });

      return this.handleResponse<T>(response);
    } catch (error) {
      if ((error as any).detail) {
        throw error;
      }
      throw {
        detail: 'Connection to local server failed. Please ensure the backend is running.',
        status: 0
      } as ApiError;
    }
  }

  // Authentication helpers
  setToken(token: string) {
    this.saveToken(token);
  }

  logout() {
    this.clearToken();
  }

  isAuthenticated(): boolean {
    return !!this.token;
  }
}

// ============================================================================
// API INSTANCE
// ============================================================================

const apiClient = new ApiClient(BASE_URL);

// ============================================================================
// AUTH API
// ============================================================================

export const authApi = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const formData = new URLSearchParams();
    formData.append('username', credentials.email);
    formData.append('password', credentials.password);

    try {
      const response = await fetch(`${BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formData.toString(),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw {
          detail: errorData.detail || 'Login failed',
          status: response.status
        } as ApiError;
      }

      const data = await response.json();
      apiClient.setToken(data.access_token);
      return data;
    } catch (error) {
      if ((error as any).detail) {
        throw error;
      }
      throw {
        detail: 'Connection to local server failed. Please ensure the backend is running.',
        status: 0
      } as ApiError;
    }
  },

  async register(data: RegisterData): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>('/auth/register', data);
    if (response.access_token) {
      apiClient.setToken(response.access_token);
    }
    return response;
  },

  async getCurrentUser(): Promise<User> {
    return apiClient.get<User>('/auth/me');
  },

  logout() {
    apiClient.logout();
  },

  isAuthenticated(): boolean {
    return apiClient.isAuthenticated();
  }
};

// ============================================================================
// EXERCISES API
// ============================================================================

export const exercisesApi = {
  async getAll(params?: {
    category?: string;
    difficulty?: string;
    equipment?: string;
    muscle_group?: string;
    search?: string;
    skip?: number;
    limit?: number;
  }): Promise<Exercise[]> {
    return apiClient.get<Exercise[]>('/exercises', params);
  },

  async getById(id: string): Promise<Exercise> {
    return apiClient.get<Exercise>(`/exercises/${id}`);
  },

  async create(exercise: Partial<Exercise>): Promise<Exercise> {
    return apiClient.post<Exercise>('/exercises', exercise);
  },

  async update(id: string, exercise: Partial<Exercise>): Promise<Exercise> {
    return apiClient.put<Exercise>(`/exercises/${id}`, exercise);
  },

  async delete(id: string): Promise<void> {
    return apiClient.delete<void>(`/exercises/${id}`);
  }
};

// ============================================================================
// FOODS API
// ============================================================================

export const foodsApi = {
  async getAll(params?: {
    category?: string;
    search?: string;
    skip?: number;
    limit?: number;
  }): Promise<Food[]> {
    return apiClient.get<Food[]>('/foods', params);
  },

  async getById(id: string): Promise<Food> {
    return apiClient.get<Food>(`/foods/${id}`);
  },

  async create(food: Partial<Food>): Promise<Food> {
    return apiClient.post<Food>('/foods', food);
  },

  async update(id: string, food: Partial<Food>): Promise<Food> {
    return apiClient.put<Food>(`/foods/${id}`, food);
  },

  async delete(id: string): Promise<void> {
    return apiClient.delete<void>(`/foods/${id}`);
  }
};

// ============================================================================
// SUPPLEMENTS API
// ============================================================================

export const supplementsApi = {
  async getAll(params?: {
    category?: string;
    evidence_level?: string;
    search?: string;
    skip?: number;
    limit?: number;
  }): Promise<Supplement[]> {
    return apiClient.get<Supplement[]>('/supplements', params);
  },

  async getById(id: string): Promise<Supplement> {
    return apiClient.get<Supplement>(`/supplements/${id}`);
  },

  async create(supplement: Partial<Supplement>): Promise<Supplement> {
    return apiClient.post<Supplement>('/supplements', supplement);
  },

  async update(id: string, supplement: Partial<Supplement>): Promise<Supplement> {
    return apiClient.put<Supplement>(`/supplements/${id}`, supplement);
  },

  async delete(id: string): Promise<void> {
    return apiClient.delete<void>(`/supplements/${id}`);
  }
};

// ============================================================================
// WORKOUTS API
// ============================================================================

export const workoutsApi = {
  async getAll(params?: {
    user_id?: string;
    skip?: number;
    limit?: number;
  }): Promise<WorkoutProgram[]> {
    return apiClient.get<WorkoutProgram[]>('/workouts', params);
  },

  async getById(id: string): Promise<WorkoutProgram> {
    return apiClient.get<WorkoutProgram>(`/workouts/${id}`);
  },

  async create(workout: Partial<WorkoutProgram>): Promise<WorkoutProgram> {
    return apiClient.post<WorkoutProgram>('/workouts', workout);
  },

  async update(id: string, workout: Partial<WorkoutProgram>): Promise<WorkoutProgram> {
    return apiClient.put<WorkoutProgram>(`/workouts/${id}`, workout);
  },

  async delete(id: string): Promise<void> {
    return apiClient.delete<void>(`/workouts/${id}`);
  }
};

// ============================================================================
// HEALTH CHECK
// ============================================================================

export const healthApi = {
  async check(): Promise<{ status: string; message: string }> {
    return apiClient.get<{ status: string; message: string }>('/health');
  }
};

// ============================================================================
// DEFAULT EXPORT
// ============================================================================

export default {
  auth: authApi,
  exercises: exercisesApi,
  foods: foodsApi,
  supplements: supplementsApi,
  workouts: workoutsApi,
  health: healthApi
};
