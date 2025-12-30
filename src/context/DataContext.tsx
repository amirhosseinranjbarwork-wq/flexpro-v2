/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { toast } from 'react-hot-toast';
import Swal from 'sweetalert2';
import type {
  User,
  UserInput,
  UserId,
  Template,
  Role,
  PermissionAction,
  Client,
  WorkoutPlanFromDB,
  UserPlans,
  DataContextType,
  ProgramRequest
} from '../types/index';
// Supabase removed - using local API
import {
  searchFoods,
  searchExercises,
  getAllFoods,
  getAllExercises,
  getFoodCategories,
  getMuscleGroups,
  getExerciseTypes
} from '../lib/database';
// Supabase removed - using local API instead
// All remote functions are now handled via API service
import { useAuth } from './AuthContext';
import { useUI } from './UIContext';

const STORAGE_KEY = 'flexProMaxData_v15';
const ROLE_KEY = 'flexRole';
const ACCOUNT_KEY = 'flexAccountId';
const ACTIVE_USER_KEY = 'flexActiveUserId';
const SELECTED_CLIENT_KEY = 'flexSelectedClientId';

const DataContext = createContext<DataContextType | undefined>(undefined);

// Helper functions
/**
 * Generate a valid UUID v4 string for local user records
 * Uses crypto.randomUUID() for consistency with Supabase API
 */
const makeId = (): string => {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    try {
      return crypto.randomUUID();
    } catch (err) {
      // Fallback only for legacy environments (though unlikely in modern browsers)
      console.warn('UUID generation failed, using fallback:', err);
    }
  }
  // Fallback for compatibility with very old environments
  return `u-${Date.now()}-${Math.floor(Math.random() * 1e6)}`;
};

const migrateUser = (input: UserInput): User => {
  const user: User = {
    ...input,
    id: input.id ?? makeId(),
    plans: input.plans ?? { workouts: {}, diet: [], dietRest: [], supps: [], prog: [] },
    measurements: input.measurements ?? {},
    financial: input.financial ?? { startDate: '', duration: 1, amount: 0 },
    injuries: input.injuries ?? [],
    medicalConditions: input.medicalConditions ?? []
  };

  if (!user.plans.workouts) user.plans.workouts = {};
  for (let i = 1; i <= 7; i++) {
    if (!user.plans.workouts[i]) user.plans.workouts[i] = [];
  }
  if (!user.plans.diet) user.plans.diet = [];
  if (!user.plans.dietRest) {
    user.plans.dietRest = user.plans.diet && user.plans.diet.length > 0
      ? user.plans.diet.map(item => ({ ...item }))
      : [];
  }
  if (!user.plans.supps) user.plans.supps = [];
  if (!user.plans.prog) user.plans.prog = [];
  if (!user.measurements) user.measurements = {};
  if (!user.financial) user.financial = { startDate: '', duration: 1, amount: 0 };
  if (!user.injuries) user.injuries = [];
  if (!user.medicalConditions) user.medicalConditions = [];
  return user;
};

const planIdForClient = (clientId: string) => `${clientId}-plan`;

const clientPayloadFromUser = (user: User, coachId: string): Partial<Client> => ({
  id: String(user.id),
  coach_id: coachId,
  full_name: user.name,
  gender: user.gender,
  age: user.age ? String(user.age) : undefined,
  height: user.height ? String(user.height) : undefined,
  weight: user.weight ? String(user.weight) : undefined,
  goal: user.nutritionGoals ? String(user.nutritionGoals) : undefined,
  notes: user.notes,
  profile_data: { ...user, plans: user.plans }
});

const workoutPlanPayloadFromUser = (user: User, coachId: string): Partial<WorkoutPlanFromDB> => ({
  id: planIdForClient(String(user.id)),
  coach_id: coachId,
  client_id: String(user.id),
  plan_data: user.plans,
  title: 'برنامه تمرینی',
  description: user.notes
});

export const mapClientToUser = (client: Client, plan?: WorkoutPlanFromDB): User => {
  const profile = client.profile_data as UserInput | undefined;
  const defaultPlans: UserPlans = {
    workouts: {},
    diet: [],
    dietRest: [],
    supps: [],
    prog: []
  };
  const merged: UserInput = {
    ...(profile ?? {}),
    id: client.id,
    name: client.full_name ?? profile?.name ?? '',
    gender: client.gender ?? profile?.gender,
    age: client.age ?? profile?.age,
    height: client.height ?? profile?.height,
    weight: client.weight ?? profile?.weight,
    notes: client.notes ?? profile?.notes,
    nutritionGoals: profile?.nutritionGoals,
    plans: plan?.plan_data ?? profile?.plans ?? defaultPlans
  };
  return migrateUser(merged);
};

// Export helper functions
export { migrateUser, planIdForClient, clientPayloadFromUser, workoutPlanPayloadFromUser };

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const auth = useAuth();
  const { theme } = useUI();

  const getInitialUsers = useCallback((): User[] => {
    try {
      const savedData = localStorage.getItem(STORAGE_KEY);
      if (savedData) {
        const parsed = JSON.parse(savedData);
        if (parsed.users && Array.isArray(parsed.users)) {
          return parsed.users.map(migrateUser);
        }
      }
    } catch (e) {
      console.error('خطا در خواندن کاربران:', e);
    }
    return [];
  }, []);

  const getInitialTemplates = useCallback((): Template[] => {
    try {
      const savedData = localStorage.getItem(STORAGE_KEY);
      if (savedData) {
        const parsed = JSON.parse(savedData);
        if (parsed.templates && Array.isArray(parsed.templates)) {
          return parsed.templates;
        }
      }
    } catch (e) {
      console.error('خطا در خواندن الگوها:', e);
    }
    return [];
  }, []);

  const [users, setUsers] = useState<User[]>(() => getInitialUsers());
  const [templates, setTemplates] = useState<Template[]>(() => getInitialTemplates());
  const [requests, setRequests] = useState<ProgramRequest[]>([]);
  const [activeUserId, setActiveUserId] = useState<UserId | null>(() => {
    const saved = localStorage.getItem(ACTIVE_USER_KEY);
    return saved ? (saved as UserId) : null;
  });
  const [currentRole, setCurrentRole] = useState<Role>(() => {
    const saved = localStorage.getItem(ROLE_KEY) as Role | null;
    return saved === 'coach' || saved === 'client' ? saved : 'coach';
  });
  const [currentAccountId, setCurrentAccountId] = useState<UserId | null>(() => {
    const saved = localStorage.getItem(ACCOUNT_KEY);
    return saved ? (saved as UserId) : null;
  });

  const [selectedClientId, setSelectedClientIdState] = useState<UserId | null>(() => {
    const saved = localStorage.getItem(SELECTED_CLIENT_KEY);
    return saved ? (saved as UserId) : null;
  });

  const setSelectedClientId = useCallback((id: UserId | null) => {
    setSelectedClientIdState(id);
    if (id) {
      localStorage.setItem(SELECTED_CLIENT_KEY, String(id));
    } else {
      localStorage.removeItem(SELECTED_CLIENT_KEY);
    }
  }, []);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const _isFirstRender = useRef<boolean>(true);

  // Fetch data from Supabase (single source of truth)
  const refreshData = useCallback(async () => {
    if (!auth?.user?.id) {
      setUsers(getInitialUsers());
      setTemplates(getInitialTemplates());
      setRequests([]);
      return;
    }

    // Load from localStorage (offline mode)
    try {
      const cached = localStorage.getItem(STORAGE_KEY);
      if (cached) {
        const data = JSON.parse(cached);
        if (data.users) setUsers(data.users);
        if (data.templates) setTemplates(data.templates);
        if (data.requests) setRequests(data.requests);
      } else {
        // Initialize with default data
        setUsers(getInitialUsers());
        setTemplates(getInitialTemplates());
        setRequests([]);
      }
    } catch (error) {
      console.error('Error loading data from localStorage:', error);
      setUsers(getInitialUsers());
      setTemplates(getInitialTemplates());
      setRequests([]);
    }
  }, [auth?.user?.id]);

  // Load data when user is authenticated
  useEffect(() => {
    if (auth?.user?.id) {
      refreshData();
    } else {
      // Clear data when not authenticated
      setUsers([]);
      setTemplates([]);
      setRequests([]);
    }
  }, [auth?.user?.id, refreshData]);

  // Save role and account ID to localStorage
  useEffect(() => {
    localStorage.setItem(ROLE_KEY, currentRole);
    if (currentAccountId != null) {
      localStorage.setItem(ACCOUNT_KEY, String(currentAccountId));
    } else {
      localStorage.removeItem(ACCOUNT_KEY);
    }
  }, [currentRole, currentAccountId]);

  // Save active user ID to localStorage
  useEffect(() => {
    if (activeUserId != null) {
      localStorage.setItem(ACTIVE_USER_KEY, String(activeUserId));
    } else {
      localStorage.removeItem(ACTIVE_USER_KEY);
    }
  }, [activeUserId]);

  // Cache data for offline mode (only when online)
  useEffect(() => {
    if (users.length === 0 && templates.length === 0) return;

    const timeoutId = setTimeout(() => {
      try {
        const cacheData = {
          users,
          templates,
          timestamp: Date.now()
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(cacheData));
      } catch (e) {
        console.warn('Failed to cache data for offline mode:', e);
      }
    }, 1000); // Debounced caching

    return () => clearTimeout(timeoutId);
  }, [users, templates]);

  const activeUser = useMemo(() => {
    if (activeUserId == null) return null;
    const targetId = String(activeUserId);
    return users.find(u => String(u.id) === targetId) || null;
  }, [users, activeUserId]);

  const hasPermission = useCallback(
    (action: PermissionAction, targetUserId: UserId | null = null) => {
      if (currentRole === 'coach') return true;
      const isSelf = targetUserId === currentAccountId || targetUserId === activeUserId;
      switch (action) {
        case 'manageUsers':
        case 'restoreBackup':
        case 'resetSystem':
        case 'editProgram':
          return false;
        case 'viewProgram':
        case 'viewProgress':
        case 'printProgram':
        case 'logProgress':
          return isSelf;
        default:
          return false;
      }
    },
    [currentRole, currentAccountId, activeUserId]
  );

  // Sync user to localStorage (offline mode)
  const syncUserToLocal = useCallback(
    (user: User) => {
      // Save to localStorage
      try {
        const cached = localStorage.getItem(STORAGE_KEY);
        const data = cached ? JSON.parse(cached) : { users: [], templates: [], requests: [] };
        const userIndex = data.users.findIndex((u: User) => u.id === user.id);
        if (userIndex >= 0) {
          data.users[userIndex] = user;
        } else {
          data.users.push(user);
        }
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      } catch (err) {
        if (import.meta.env.DEV) console.error('Error saving user to localStorage:', err);
      }
    },
    []
  );

  const saveUser = useCallback(
    async (userData: UserInput) => {
      if (!hasPermission('manageUsers', userData.id ?? null)) {
        toast.error('دسترسی مربی لازم است');
        return;
      }

      // In local mode (when auth is disabled), use a default coach ID
      const coachId = auth?.user?.id || 'local_coach_' + Date.now();

      try {
        const userId = userData.id ?? makeId();
        const newUser = migrateUser({ ...userData, id: userId });

        // Update local state first for better UX
        setUsers(prev => {
          const idx = prev.findIndex(u => u.id === newUser.id);
          let updatedUsers;
          if (idx > -1) {
            const updated = [...prev];
            updated[idx] = newUser;
            updatedUsers = updated;
          } else {
            updatedUsers = [...prev, newUser];
          }

          // Immediately save to localStorage to persist across page refreshes
          try {
            const cacheData = {
              users: updatedUsers,
              templates,
              requests,
              timestamp: Date.now()
            };
            localStorage.setItem(STORAGE_KEY, JSON.stringify(cacheData));
          } catch (e) {
            console.warn('Failed to save user to localStorage:', e);
          }

          return updatedUsers;
        });

        // Save to localStorage (offline mode)
        try {
          const cached = localStorage.getItem(STORAGE_KEY);
          const data = cached ? JSON.parse(cached) : { users: [], templates: [], requests: [] };
          const userIndex = data.users.findIndex((u: User) => u.id === newUser.id);
          if (userIndex >= 0) {
            data.users[userIndex] = newUser;
          } else {
            data.users.push(newUser);
          }
          localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
        } catch (err) {
          console.error('Error saving to localStorage:', err);
        }

        toast.success('اطلاعات با موفقیت ذخیره شد');
      } catch (error) {
        console.error('Failed to save user:', error);
        toast.error('خطا در ذخیره اطلاعات');
        // Revert local state on critical error - only if user was already in the list
        const userId = userData.id ?? makeId();
        setUsers(prev => {
          const idx = prev.findIndex(u => u.id === userId);
          if (idx > -1) {
            // User was already in the list, remove it
            return prev.filter(u => u.id !== userId);
          }
          // User was new, don't revert
          return prev;
        });
        throw error; // Re-throw to let caller handle it
      }
    },
    [hasPermission, auth?.user?.id, users.length]
  );

  const updateActiveUser = useCallback(
    (u: User) => {
      setUsers(prev => prev.map(user => (user.id === u.id ? u : user)));
      syncUserToSupabase(u);
    },
    [syncUserToSupabase]
  );

  // Wrapper functions for compatibility
  const addUser = useCallback(
    async (userData: UserInput) => {
      await saveUser(userData);
    },
    [saveUser]
  );

  const updateUser = useCallback(
    async (userId: UserId, userData: UserInput) => {
      await saveUser({ ...userData, id: userId });
    },
    [saveUser]
  );

  const deleteUser = useCallback(
    async (id: UserId) => {
      if (!hasPermission('manageUsers', id)) {
        toast.error('دسترسی مربی لازم است');
        return;
      }

      const result = await Swal.fire({
        title: 'آیا مطمئن هستید؟',
        text: 'اطلاعات این شاگرد غیرقابل بازگشت خواهد بود!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#ef4444',
        cancelButtonColor: '#64748b',
        confirmButtonText: 'بله، حذف کن',
        cancelButtonText: 'لغو',
        background: theme === 'dark' ? '#1e293b' : '#fff',
        color: theme === 'dark' ? '#fff' : '#000'
      });

      if (result.isConfirmed) {
        try {
          // Update local state immediately for better UX
          setUsers(prev => prev.filter(u => u.id !== id));
          if (activeUserId === id) setActiveUserId(null);

          // Remove from localStorage (offline mode)
          try {
            const cached = localStorage.getItem(STORAGE_KEY);
            if (cached) {
              const data = JSON.parse(cached);
              data.users = data.users.filter((u: User) => u.id !== id);
              localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
            }
          } catch (err) {
            console.error('Error removing user from localStorage:', err);
          }

          toast.success('شاگرد با موفقیت حذف شد');
        } catch (error) {
          console.error('Failed to delete user:', error);
          toast.error('خطا در حذف شاگرد');
          // Revert local state on error
          await refreshData();
        }
      }
    },
    [hasPermission, theme, auth?.user?.id, activeUserId]
  );

  const saveTemplate = useCallback(
    (name: string, workout: User['plans']['workouts'][number]) => {
      if (!hasPermission('editProgram')) {
        toast.error('دسترسی مربی لازم است');
        return;
      }
      const newTemplate: Template = { id: Date.now(), name, workout };
      setTemplates(prev => [...prev, newTemplate]);
      // Save to localStorage (offline mode)
      try {
        const cached = localStorage.getItem(STORAGE_KEY);
        const data = cached ? JSON.parse(cached) : { users: [], templates: [], requests: [] };
        data.templates.push(newTemplate);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      } catch (err) {
        console.error('Error saving template to localStorage:', err);
      }
      toast.success('الگو ذخیره شد');
    },
    [hasPermission, auth?.user?.id]
  );

  const deleteTemplate = useCallback(
    (id: UserId) => {
      if (!hasPermission('editProgram')) {
        toast.error('دسترسی مربی لازم است');
        return;
      }
      setTemplates(prev => prev.filter(t => t.id !== id));
      // Remove from localStorage (offline mode)
      try {
        const cached = localStorage.getItem(STORAGE_KEY);
        if (cached) {
          const data = JSON.parse(cached);
          data.templates = data.templates.filter((t: Template) => t.id !== id);
          localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
        }
      } catch (err) {
        console.error('Error removing template from localStorage:', err);
      }
      toast.success('الگو حذف شد');
    },
    [hasPermission, auth?.user?.id]
  );

  const acceptRequest = useCallback(async (req: ProgramRequest) => {
    if (!auth?.user?.id) return;

    try {
      // Update request status in localStorage (offline mode)
      try {
        const cached = localStorage.getItem(STORAGE_KEY);
        if (cached) {
          const data = JSON.parse(cached);
          const requestIndex = data.requests.findIndex((r: ProgramRequest) => r.id === req.id);
          if (requestIndex >= 0) {
            data.requests[requestIndex] = { ...data.requests[requestIndex], status: 'accepted' };
            localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
          }
        }
      } catch (err) {
        console.error('Error updating request:', err);
        toast.error('خطا در تأیید درخواست');
        return;
      }

      // Create user from request data
      if (req.client_data) {
        const clientData = req.client_data as Record<string, unknown>;
        const clientName = String(req.client_name || clientData.name || 'شاگرد');

        const newUserData: UserInput = {
          name: clientName,
          id: req.client_id,
          coach_id: auth.user.id,
          gender: typeof clientData.gender === 'string' ? clientData.gender : undefined,
          age: typeof clientData.age === 'number' ? Number(clientData.age) : undefined,
          height: typeof clientData.height === 'number' ? Number(clientData.height) : undefined,
          weight: typeof clientData.weight === 'number' ? Number(clientData.weight) : undefined,
          phone: typeof clientData.phone === 'string' ? clientData.phone : undefined,
          email: typeof clientData.email === 'string' ? clientData.email : undefined,
          plans: { workouts: {}, diet: [], dietRest: [], supps: [], prog: [] }
        };

        // Add user to local state immediately
        const newUser = migrateUser(newUserData);
        setUsers(prev => {
          const idx = prev.findIndex(u => u.id === newUser.id);
          if (idx > -1) {
            const updated = [...prev];
            updated[idx] = newUser;
            return updated;
          }
          return [...prev, newUser];
        });

        // Save to localStorage (offline mode)
        await saveUser(newUserData);
                id: req.client_id,
                coach_id: auth.user.id,
                updated_at: new Date().toISOString()
              } as Record<string, unknown>, { onConflict: 'id' })
              .then(result => {
                if (result.error && import.meta.env.DEV) {
                  console.warn('update client profile coach_id error', result.error);
                }
              });
          }
        }
      }

      // Update requests list
      setRequests(prev => prev.filter(r => r.id !== req.id));

      toast.success('درخواست تأیید شد و شاگرد اضافه شد');
    } catch (error) {
      console.error('Error accepting request:', error);
      toast.error('خطا در تأیید درخواست');
    }
  }, [auth?.user?.id, saveUser]);

  const rejectRequest = useCallback(async (req: ProgramRequest) => {
    if (!auth?.user?.id) return;

    try {
      // Update request status in localStorage (offline mode)
      try {
        const cached = localStorage.getItem(STORAGE_KEY);
        if (cached) {
          const data = JSON.parse(cached);
          const requestIndex = data.requests.findIndex((r: ProgramRequest) => r.id === req.id);
          if (requestIndex >= 0) {
            data.requests[requestIndex] = { ...data.requests[requestIndex], status: 'rejected' };
            localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
          }
        }
      } catch (err) {
        console.error('Error updating request:', err);
        toast.error('خطا در رد درخواست');
        return;
      }

      setRequests(prev => prev.map(r => (r.id === req.id ? { ...r, status: 'rejected' } : r)));
      toast.success('درخواست رد شد');
    } catch (error) {
      console.error('Error rejecting request:', error);
      toast.error('خطا در رد درخواست');
    }
  }, [auth?.user?.id]);

  const deleteRequest = useCallback(async (requestId: string) => {
    try {
      // Remove from localStorage (offline mode)
      try {
        const cached = localStorage.getItem(STORAGE_KEY);
        if (cached) {
          const data = JSON.parse(cached);
          data.requests = data.requests.filter((r: ProgramRequest) => r.id !== requestId);
          localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
        }
      } catch (err) {
        console.error('Error deleting request:', err);
        toast.error('خطا در حذف درخواست');
        return;
      }

      setRequests(prev => prev.filter(r => r.id !== requestId));
      toast.success('درخواست حذف شد');
    } catch (error) {
      console.error('Error deleting request:', error);
      toast.error('خطا در حذف درخواست');
    }
  }, []);

  const logoutUser = useCallback(() => {
    setActiveUserId(null);
    toast.success('ورزشکار فعال خارج شد');
  }, []);

  const resetSystem = useCallback(() => {
    Swal.fire({
      title: 'بازنشانی کارخانه؟',
      text: 'تمام اطلاعات پاک می‌شود!',
      icon: 'error',
      showCancelButton: true,
      confirmButtonText: 'بله، ریست کن',
      cancelButtonText: 'لغو'
    }).then((res) => {
      if (res.isConfirmed) {
        localStorage.removeItem(STORAGE_KEY);
        localStorage.removeItem('flexTheme');
        window.location.reload();
      }
    });
  }, []);

  const backupData = useCallback(() => {
    if (!hasPermission('restoreBackup')) {
      toast.error('دسترسی لازم است');
      return;
    }
    const data = JSON.stringify({ users, templates, requests }, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `flexpro_backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('پشتیبان‌گیری انجام شد');
  }, [users, templates, hasPermission]);

  const restoreData = useCallback(
    (file: File) => {
      if (!hasPermission('restoreBackup')) {
        toast.error('دسترسی لازم است');
        return;
      }
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = JSON.parse(e.target?.result as string);
          if (data.users && Array.isArray(data.users)) {
            setUsers(data.users.map(migrateUser));
          }
          if (data.templates && Array.isArray(data.templates)) {
            setTemplates(data.templates);
          }
          toast.success('داده‌ها بازگردانی شدند');
        } catch (err) {
          toast.error('خطا در خواندن فایل');
          console.error(err);
        }
      };
      reader.readAsText(file);
    },
    [hasPermission]
  );

  // Clear data on logout - only when user was logged in and now is not
  const [wasLoggedIn, setWasLoggedIn] = useState(!!auth?.user);
  useEffect(() => {
    const isLoggedIn = !!auth?.user;
    if (wasLoggedIn && !isLoggedIn) {
      // User just logged out - clear data
      const timer = setTimeout(() => {
        setUsers([]);
        setTemplates([]);
        setActiveUserId(null);
      }, 0);
      return () => clearTimeout(timer);
    }
    setWasLoggedIn(isLoggedIn);
  }, [auth?.user, wasLoggedIn]);

  return (
    <DataContext.Provider
      value={{
        users,
        setUsers,
        requests,
        activeUser,
        activeUserId,
        selectedClientId,
        selectedUser: selectedClientId,
        setSelectedUser: setSelectedClientId,
        templates,
        currentRole,
        currentAccountId,
        setCurrentRole,
        setCurrentAccountId,
        setSelectedClientId,
        setActiveUserId,
        hasPermission,
        saveUser,
        addUser,
        updateUser,
        deleteUser,
        acceptRequest,
        rejectRequest,
        deleteRequest,
        updateActiveUser,
        saveTemplate,
        deleteTemplate,
        logoutUser,
        resetSystem,
        backupData,
        restoreData,
        refreshData,
        // New database functions
        searchFoods,
        searchExercises,
        getAllFoods,
        getAllExercises,
        getFoodCategories,
        getMuscleGroups,
        getExerciseTypes
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within DataProvider');
  }
  return context;
};

