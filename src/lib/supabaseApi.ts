/**
 * DEPRECATED: Supabase API has been removed
 * This file exists only to prevent import errors during migration
 * All functionality has been migrated to local API (src/services/api.ts)
 */

// Stub exports to prevent import errors
export const isSupabaseReady = false;

export async function ensureSupabaseReady(): Promise<boolean> {
  return false;
}

// Stub functions
export const fetchUsers = async () => Promise.resolve([]);
export const upsertUser = async () => Promise.resolve({});
export const removeUser = async () => Promise.resolve(true);
export const fetchTemplates = async () => Promise.resolve([]);
export const upsertTemplate = async () => Promise.resolve({});
export const removeTemplate = async () => Promise.resolve(true);
export const fetchClientsByCoach = async () => Promise.resolve([]);
export const fetchClients = async () => Promise.resolve([]);
export const fetchClientById = async () => Promise.resolve(null);
export const upsertClient = async () => Promise.resolve({});
export const updateClient = async () => Promise.resolve({});
export const deleteClient = async () => Promise.resolve(true);
export const fetchWorkoutPlansByCoach = async () => Promise.resolve([]);
export const fetchWorkoutPlansByClient = async () => Promise.resolve([]);
export const upsertWorkoutPlan = async () => Promise.resolve({});
export const deleteWorkoutPlan = async () => Promise.resolve(true);
export const getOrCreateCoachCode = async () => 'LOCAL-MODE';
export const findCoachByCode = async () => Promise.resolve(null);
export const fetchRequestsByCoach = async () => Promise.resolve([]);
export const fetchRequestsByClient = async () => Promise.resolve([]);
export const createProgramRequest = async () => Promise.resolve({ id: 'request-1' });
export const updateRequestStatus = async () => Promise.resolve(true);
export const deleteProgramRequest = async () => Promise.resolve(true);
export const deleteProgramRequestLocally = async () => Promise.resolve(true);
export const getProfile = async () => Promise.resolve(null);
export const updateProfile = async () => Promise.resolve(null);
export const checkUsernameAvailability = async () => Promise.resolve(true);
export const fetchExercises = async () => Promise.resolve([]);
export const fetchFoods = async () => Promise.resolve([]);
export const fetchDietPlansByCoach = async () => Promise.resolve([]);
export const createWorkoutPlan = async () => Promise.resolve({ id: 'new-plan' });
export const createDietPlan = async () => Promise.resolve({ id: 'new-diet' });
export const assignPlanToClient = async () => Promise.resolve(true);
export const uploadFile = async () => Promise.resolve('https://via.placeholder.com/150');
export const getPublicUrl = () => 'https://via.placeholder.com/150';

