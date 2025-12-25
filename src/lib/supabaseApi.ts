import { exercises } from '../data/exercises';
import { foods } from '../data/foods';

// --- MOCK DATA ---
const MOCK_PROFILE = {
  id: 'local-admin-id',
  first_name: 'Local',
  last_name: 'Developer',
  role: 'coach',
  is_super_admin: true,
  coach_code: 'DEV-MODE'
};

const MOCK_CLIENTS = [
  { id: 'client-1', first_name: 'Ali', last_name: 'Rezaei', role: 'client', email: 'client@test.com' },
  { id: 'client-2', first_name: 'Sara', last_name: 'Tehrani', role: 'client', email: 'sara@test.com' },
  { id: 'client-3', first_name: 'Mehdi', last_name: 'Ahmadi', role: 'client', email: 'mehdi@test.com' }
];

const mock = (data: any) => Promise.resolve({ data, error: null });

// --- API REPLACEMENTS ---

// Users API
export const fetchUsers = async (_coachId?: string) => mock([]);
export const upsertUser = async (_data?: unknown) => mock({});
export const removeUser = async (_id?: string) => mock(true);

// Templates API
export const fetchTemplates = async (_coachId?: string) => mock([]);
export const upsertTemplate = async () => mock({});
export const removeTemplate = async () => mock(true);

// Utility
export const ensureSupabaseReady = async () => true;
export const isSupabaseReady = true;

// Clients API
export const fetchClientsByCoach = async (_coachId?: string) => mock(MOCK_CLIENTS);
export const fetchClients = async () => mock(MOCK_CLIENTS);
export const fetchClientById = async (_clientId?: string) => mock(MOCK_CLIENTS[0]);
export const upsertClient = async (_data?: unknown) => mock({});
export const updateClient = async (_id?: string, _data?: unknown) => mock({});
export const deleteClient = async (_id?: string) => mock(true);

// Workout Plans API
export const fetchWorkoutPlansByCoach = async (_coachId?: string) => mock([]);
export const fetchWorkoutPlansByClient = async (_clientId?: string) => mock([]);
export const upsertWorkoutPlan = async (_data?: unknown) => mock({});
export const deleteWorkoutPlan = async (_id?: string) => mock(true);

// Coach Code API
export const getOrCreateCoachCode = async (_userId?: string) => 'DEV-MODE';
export const findCoachByCode = async (_code?: string) => mock({ id: 'coach-1', full_name: 'مربی آزمایشی' });

// Program Requests API
export const fetchRequestsByCoach = async (_coachId?: string) => mock([]);
export const fetchRequestsByClient = async (_clientId?: string) => mock([]);
export const createProgramRequest = async (_data?: unknown) => mock({ id: 'request-1' });
export const updateRequestStatus = async (_id?: string, _status?: string) => mock(true);
export const deleteProgramRequest = async (_id?: string) => mock(true);
export const deleteProgramRequestLocally = async () => mock(true);

// Profile API
export const getProfile = async () => mock(MOCK_PROFILE);
export const updateProfile = async () => mock(MOCK_PROFILE);
export const checkUsernameAvailability = async () => true;

// Library Data (Using your local files)
export const fetchExercises = async () => exercises || [];
export const fetchFoods = async () => foods || [];

// Plans
export const fetchDietPlansByCoach = async () => mock([]);
export const createWorkoutPlan = async () => mock({ id: 'new-plan' });
export const createDietPlan = async () => mock({ id: 'new-diet' });
export const assignPlanToClient = async () => mock(true);

// Storage
export const uploadFile = async () => 'https://via.placeholder.com/150';
export const getPublicUrl = () => 'https://via.placeholder.com/150';

// Disable direct access
export const supabase = null;


