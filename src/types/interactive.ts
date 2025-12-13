// ============================================
// Interactive Features Types for FlexPro v2
// ============================================

// ========== Chat Types ==========
export interface Message {
  id: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  is_read: boolean;
  created_at: string;
  updated_at: string;
}

export interface ChatUser {
  id: string;
  name: string;
  avatar?: string;
  lastMessage?: Message;
  unreadCount: number;
}

export interface ChatConversation {
  otherUser: ChatUser;
  messages: Message[];
  hasMore: boolean;
  lastMessageDate?: string;
}

// ========== Diet Templates Types ==========
export interface DietTemplate {
  id: string;
  coach_id: string;
  name: string;
  description?: string;
  diet_data: any[]; // DietItem array
  diet_rest_data?: any[]; // DietItem array for rest days
  is_public: boolean;
  created_at: string;
  updated_at: string;
}

// ========== Workout Logs Types ==========
export interface WorkoutLog {
  id: string;
  user_id: string;
  workout_date: string;
  exercise_name: string;
  set_number: number;
  reps_performed?: number;
  weight_used?: number;
  rpe?: number; // 1-10 scale
  notes?: string;
  completed: boolean;
  created_at: string;
  updated_at: string;
}

export interface WorkoutSession {
  date: string;
  exercises: WorkoutLog[];
  totalSets: number;
  completedSets: number;
  duration?: number; // in minutes
}

export interface ActiveWorkoutSet {
  exerciseName: string;
  setNumber: number;
  plannedReps: number;
  plannedWeight?: number;
  actualReps?: number;
  actualWeight?: number;
  rpe?: number;
  completed: boolean;
  notes?: string;
}

// ========== Progress Photos Types ==========
export interface ProgressPhoto {
  id: string;
  user_id: string;
  photo_url: string;
  photo_date: string;
  pose_type: 'front' | 'back' | 'side' | 'other';
  weight?: number;
  height?: number;
  body_fat_percentage?: number;
  notes?: string;
  is_private: boolean;
  created_at: string;
  updated_at: string;
}

export interface PhotoComparison {
  before: ProgressPhoto;
  after: ProgressPhoto;
  weightChange?: number;
  dateDifference: number; // in days
}

// ========== Chat Hook Types ==========
export interface UseChatReturn {
  messages: Message[];
  isLoading: boolean;
  error: string | null;
  sendMessage: (content: string) => Promise<void>;
  markAsRead: () => Promise<void>;
  loadMore: () => void;
  hasMore: boolean;
  isTyping: boolean;
  setTyping: (typing: boolean) => void;
}

// ========== Workout Log Hook Types ==========
export interface UseWorkoutLogReturn {
  logs: WorkoutLog[];
  sessions: WorkoutSession[];
  saveLog: (log: Omit<WorkoutLog, 'id' | 'created_at' | 'updated_at'>) => Promise<void>;
  saveSession: (session: WorkoutSession) => Promise<void>;
  getLogsForDate: (date: string) => WorkoutLog[];
  getLogsForExercise: (exerciseName: string) => WorkoutLog[];
  isLoading: boolean;
  error: string | null;
}

// ========== Progress Photos Hook Types ==========
export interface UseProgressPhotosReturn {
  photos: ProgressPhoto[];
  uploadPhoto: (file: File, metadata: Partial<ProgressPhoto>) => Promise<void>;
  deletePhoto: (photoId: string) => Promise<void>;
  getPhotosByDateRange: (startDate: string, endDate: string) => ProgressPhoto[];
  getComparisons: () => PhotoComparison[];
  isLoading: boolean;
  error: string | null;
}

// ========== Diet Templates Hook Types ==========
export interface UseDietTemplatesReturn {
  templates: DietTemplate[];
  saveTemplate: (template: Omit<DietTemplate, 'id' | 'coach_id' | 'created_at' | 'updated_at'>) => Promise<void>;
  loadTemplate: (templateId: string) => Promise<DietTemplate>;
  deleteTemplate: (templateId: string) => Promise<void>;
  isLoading: boolean;
  error: string | null;
}

// ========== Real-time Subscription Types ==========
export interface RealtimeMessage {
  type: 'INSERT' | 'UPDATE' | 'DELETE';
  table: string;
  record: Message;
  old_record?: Message;
}

export interface RealtimeWorkoutLog {
  type: 'INSERT' | 'UPDATE' | 'DELETE';
  table: string;
  record: WorkoutLog;
  old_record?: WorkoutLog;
}

// ========== UI Component Props ==========
export interface ChatWindowProps {
  otherUser: ChatUser;
  isOpen: boolean;
  onClose: () => void;
  className?: string;
}

export interface ActiveWorkoutModeProps {
  workoutPlan: any; // UserPlans['workouts']
  onSaveSession: (session: WorkoutSession) => Promise<void>;
  onLogUpdate: (logs: WorkoutLog[]) => void;
}

export interface GalleryPanelProps {
  userId: string;
  isCoach?: boolean;
  className?: string;
}

export interface DietTemplateManagerProps {
  currentDiet: any[]; // DietItem[]
  currentDietRest?: any[]; // DietItem[]
  onLoadTemplate: (template: DietTemplate) => void;
  className?: string;
}

// ========== API Response Types ==========
export interface PaginatedMessages extends PaginatedResponse<Message> {
  hasMore: boolean;
}

export interface PaginatedWorkoutLogs extends PaginatedResponse<WorkoutLog> {
  startDate?: string;
  endDate?: string;
}

// ========== Utility Types ==========
export type MessageStatus = 'sending' | 'sent' | 'delivered' | 'read';
export type WorkoutLogStatus = 'planned' | 'in_progress' | 'completed' | 'skipped';

export interface OptimisticMessage extends Omit<Message, 'id' | 'created_at' | 'updated_at'> {
  id: string; // Temporary ID
  status: MessageStatus;
  created_at: string;
}

export interface WorkoutSetInput {
  reps?: number;
  weight?: number;
  rpe?: number;
  notes?: string;
  completed: boolean;
}