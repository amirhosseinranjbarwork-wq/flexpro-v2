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
export const fetchUsers = async () => mock([]);
export const upsertUser = async () => mock({});
export const removeUser = async () => mock(true);

// Templates API
export const fetchTemplates = async () => mock([]);
export const upsertTemplate = async () => mock({});
export const removeTemplate = async () => mock(true);

// Utility
export const ensureSupabaseReady = async () => true;
export const isSupabaseReady = true;

// Clients API
export const fetchClientsByCoach = async () => mock(MOCK_CLIENTS);
export const fetchClients = async () => mock(MOCK_CLIENTS);
export const fetchClientById = async () => mock(MOCK_CLIENTS[0]);
export const upsertClient = async () => mock({});
export const updateClient = async () => mock({});
export const deleteClient = async () => mock(true);

// Workout Plans API
export const fetchWorkoutPlansByCoach = async () => mock([]);
export const fetchWorkoutPlansByClient = async () => mock([]);
export const upsertWorkoutPlan = async () => mock({});
export const deleteWorkoutPlan = async () => mock(true);

// Coach Code API
export const getOrCreateCoachCode = async () => 'DEV-MODE';
export const findCoachByCode = async () => mock({ id: 'coach-1', full_name: 'مربی آزمایشی' });

// Program Requests API
export const fetchRequestsByCoach = async () => mock([]);
export const fetchRequestsByClient = async () => mock([]);
export const createProgramRequest = async () => mock({ id: 'request-1' });
export const updateRequestStatus = async () => mock(true);
export const deleteProgramRequest = async () => mock(true);
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


