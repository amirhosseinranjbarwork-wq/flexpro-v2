// ============================================
// Centralized Type Definitions for FlexPro v2
// ============================================

// ========== Core Types ==========
export type UserId = string | number;

export type Role = 'coach' | 'client';

export type Gender = 'male' | 'female' | string;

export type SleepQuality = 'excellent' | 'good' | 'fair' | 'poor' | string;

export type Level = 'beginner' | 'intermediate' | 'advanced' | 'pro' | string;

export type TabKey = 
  | 'users' 
  | 'requests' 
  | 'clientInfo' 
  | 'training' 
  | 'nutrition' 
  | 'supplements' 
  | 'progress' 
  | 'coachProfile';

export type PermissionAction =
  | 'manageUsers'
  | 'editProgram'
  | 'viewProgram'
  | 'viewProgress'
  | 'logProgress'
  | 'printProgram'
  | 'restoreBackup'
  | 'resetSystem';

// ========== Workout Types ==========
export type WorkoutMode = 'resist' | 'cardio' | 'corrective' | 'warmup' | 'cooldown';

export type WorkoutSystemType =
  | 'normal'
  | 'superset'
  | 'triset'
  | 'giantset'
  | 'dropset'
  | 'pyramid'
  | 'restpause'
  | 'german-volume'
  | 'fst7'
  | '5x5'
  | 'cluster'
  | 'myorep'
  | 'tempo'
  | 'isometric'
  | 'negatives'
  | '21s'
  | 'nasm-corrective';

export interface WorkoutItem {
  type?: WorkoutSystemType;
  mode?: WorkoutMode;
  name: string;
  name2?: string;
  name3?: string;
  name4?: string;
  sets?: string | number;
  reps?: string | number;
  rest?: string | number;
  restUnit?: 's' | 'm';
  duration?: string | number;
  intensity?: string;
  dropCount?: string | number;
  restPauseTime?: string | number;
  tempo?: string;
  holdTime?: string | number;
  note?: string;
  nasmPhase?: string;
}

// ========== Nutrition Types ==========
export interface DietItem {
  meal: string;
  name: string;
  amount: number;
  unit: string;
  c: number;   // کالری
  p: number;   // پروتئین
  ch: number;  // کربوهیدرات
  f: number;   // چربی
}

export interface SupplementItem {
  name: string;
  dose?: string;
  time?: string;
  note?: string;
}

export interface ProgressItem {
  date: string;
  weight: string | number;
  bf?: string | number;
  note?: string;
}

// ========== User Plans ==========
export interface UserPlans {
  workouts: Record<number, WorkoutItem[]>;
  diet: DietItem[];
  dietRest: DietItem[];
  supps: SupplementItem[];
  prog: ProgressItem[];
}

// ========== User Profile Types ==========
export interface FinancialInfo {
  startDate: string;
  duration: number;
  amount: number | string;
  subscription_end_date?: string;
  is_active?: boolean;
}

export interface Measurements {
  neck?: string;
  hip?: string;
  thigh?: string;
  arm?: string;
  waist?: string;
  wrist?: string;
  calf?: string;
  chest?: string;
  shoulder?: string;
}

export interface User {
  id: UserId;
  coach_id?: string;
  name: string;
  phone?: string;
  age?: string | number;
  gender?: Gender;
  height?: string | number;
  weight?: string | number;
  activity?: string;
  injuries?: string[];
  notes?: string;
  exp?: string | number;
  level?: Level;
  job?: string;
  allergy?: string;
  days?: string | number;
  sleep?: SleepQuality;
  smoke?: string;
  alcohol?: string;
  caffeine?: string;
  financial?: FinancialInfo;
  measurements?: Measurements;
  email?: string;
  address?: string;
  education?: string;
  maritalStatus?: string;
  medicalConditions?: string[];
  medications?: string;
  dietType?: string;
  nutritionGoals?: string;
  waterIntake?: string;
  mealFrequency?: string;
  foodPreferences?: string[];
  targetWeight?: string | number;
  bodyFat?: string | number;
  plans: UserPlans;
}

export type UserInput = Omit<User, 'id'> & { id?: UserId };
export type ProfileData = Partial<UserInput>;

// ========== Template Types ==========
export interface Template {
  id: UserId;
  name: string;
  workout: WorkoutItem[];
  coach_id?: string;
}

// ========== Print Types ==========
export type PrintType = 'training' | 'nutrition' | 'supplements' | 'profile';

export interface PrintData {
  html: string;
  title: string;
  type: 'program' | 'client-report' | 'progress';
}

// ========== Supabase Database Types ==========
export interface Client {
  id: string;
  coach_id: string; // UUID from profiles table
  full_name: string;
  gender?: string;
  age?: string;
  height?: string;
  weight?: string;
  goal?: string;
  notes?: string;
  profile_data?: ProfileData;
  profile_completed?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface WorkoutPlanFromDB {
  id: string;
  coach_id: string; // UUID from profiles table
  client_id: string; // References clients.id
  title?: string;
  description?: string;
  plan_data: UserPlans;
  created_at?: string;
  updated_at?: string;
}

export interface ProgramRequest {
  id: string;
  client_id: string;
  client_name?: string;
  coach_id: string; // Coach code (text)
  coach_code: string;
  request_type: 'training' | 'diet' | 'supplements' | 'all';
  status: 'pending' | 'accepted' | 'rejected' | 'completed';
  client_data?: Record<string, unknown>;
  coach_response?: string;
  created_at?: string;
  updated_at?: string;
}

// ========== Context Types ==========
// Note: Interface method parameters are intentionally unused in type definitions
export interface AppContextType {
  users: User[];
  activeUser: User | null;
  selectedClientId: UserId | null;
  currentTab: TabKey;
  theme: 'light' | 'dark';
  currentRole: Role;
  currentAccountId: UserId | null;
  setCurrentRole: (role: Role) => void;
  setCurrentAccountId: (id: UserId | null) => void;
  setSelectedClientId: (id: UserId | null) => void;
  hasPermission: (action: PermissionAction, targetUserId?: UserId | null) => boolean;
  templates: Template[];
  setActiveUserId: (id: UserId | null) => void;
  setCurrentTab: (tab: TabKey) => void;
  saveUser: (user: UserInput) => void;
  deleteUser: (id: UserId) => void;
  updateActiveUser: (user: User) => void;
  saveTemplate: (name: string, workout: WorkoutItem[]) => void;
  deleteTemplate: (id: UserId) => void;
  toggleTheme: () => void;
  logoutUser: () => void;
  backupData: () => void;
  restoreData: (file: File) => void;
  resetSystem: () => void;
  printData: PrintData | null;
  handlePrintPreview: (type: PrintType, user?: User, html?: string) => void;
  closePrintModal: () => void;
  downloadPDF: () => Promise<void> | void;
}

// ========== Context Types (continued) ==========
export interface DataContextType {
  users: User[];
  requests: ProgramRequest[];
  activeUser: User | null;
  activeUserId: UserId | null;
  selectedClientId: UserId | null;
  templates: Template[];
  currentRole: Role;
  currentAccountId: UserId | null;
  setCurrentRole: (role: Role) => void;
  setCurrentAccountId: (id: UserId | null) => void;
  setSelectedClientId: (id: UserId | null) => void;
  setActiveUserId: (id: UserId | null) => void;
  hasPermission: (action: PermissionAction, targetUserId?: UserId | null) => boolean;
  saveUser: (user: UserInput) => Promise<void>;
  deleteUser: (id: UserId) => Promise<void>;
  acceptRequest: (request: ProgramRequest) => Promise<void>;
  rejectRequest: (request: ProgramRequest) => Promise<void>;
  deleteRequest: (requestId: string) => Promise<void>;
  updateActiveUser: (user: User) => void;
  saveTemplate: (name: string, workout: User['plans']['workouts'][number]) => void;
  deleteTemplate: (id: UserId) => void;
  logoutUser: () => void;
  resetSystem: () => void;
  backupData: () => void;
  restoreData: (file: File) => void;
  refreshData: () => Promise<void>;
  // New database functions
  searchFoods: (query: string, category?: string, limit?: number, offset?: number) => Promise<any>;
  searchExercises: (query: string, muscleGroup?: string, type?: string, limit?: number, offset?: number) => Promise<any>;
  getAllFoods: () => Promise<any>;
  getAllExercises: () => Promise<any>;
  getFoodCategories: () => Promise<string[]>;
  getMuscleGroups: () => Promise<string[]>;
  getExerciseTypes: () => Promise<string[]>;
}

// ========== API Response Types ==========
export interface ApiResponse<T> {
  data: T | null;
  error: Error | null;
}

export interface ApiError {
  message: string;
  code?: string;
  details?: unknown;
}

