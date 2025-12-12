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
  DataContextType
} from '../types/index';
import {
  fetchUsers as fetchUsersRemote,
  fetchTemplates as fetchTemplatesRemote,
  upsertUser as upsertUserRemote,
  removeUser as removeUserRemote,
  upsertTemplate as upsertTemplateRemote,
  removeTemplate as removeTemplateRemote,
  isSupabaseReady,
  fetchClientsByCoach,
  fetchWorkoutPlansByCoach,
  upsertClient,
  upsertWorkoutPlan,
  deleteClient,
  deleteWorkoutPlan
} from '../lib/supabaseApi';
import { useAuth } from './AuthContext';
import { useUI } from './UIContext';

const STORAGE_KEY = 'flexProMaxData_v15';
const ROLE_KEY = 'flexRole';
const ACCOUNT_KEY = 'flexAccountId';

const DataContext = createContext<DataContextType | undefined>(undefined);

// Helper functions
const makeId = (): string => `u-${Date.now()}-${Math.floor(Math.random() * 1e6)}`;

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

  // Initialize state - use lazy initialization to avoid calling getInitialUsers/getInitialTemplates on every render
  const [users, setUsers] = useState<User[]>(() => isSupabaseReady ? [] : getInitialUsers());
  const [templates, setTemplates] = useState<Template[]>(() => isSupabaseReady ? [] : getInitialTemplates());
  const [activeUserId, setActiveUserId] = useState<UserId | null>(null);
  const [currentRole, setCurrentRole] = useState<Role>(() => {
    const saved = localStorage.getItem(ROLE_KEY) as Role | null;
    return saved === 'coach' || saved === 'client' ? saved : 'coach';
  });
  const [currentAccountId, setCurrentAccountId] = useState<UserId | null>(() => {
    const saved = localStorage.getItem(ACCOUNT_KEY);
    return saved ? (saved as UserId) : null;
  });

  const isFirstRender = useRef<boolean>(true);

  // Fetch data from Supabase (primary source)
  const refreshData = useCallback(async () => {
    if (!isSupabaseReady) return;
    const coachId = auth?.user?.id;
    if (!coachId) return;

    try {
      const [clientsResponse, plansResponse, templatesResponse] = await Promise.all([
        fetchClientsByCoach(coachId),
        fetchWorkoutPlansByCoach(coachId),
        fetchTemplatesRemote(coachId)
      ]);

      // Handle clients
      const remoteClients = clientsResponse.data || [];
      const remotePlans = plansResponse.data || [];
      const remoteTemplates = templatesResponse.data || [];

      if (clientsResponse.error) {
        if (import.meta.env.DEV) {
          console.error('fetchClientsByCoach error', clientsResponse.error);
        }
      }

      if (plansResponse.error) {
        if (import.meta.env.DEV) {
          console.error('fetchWorkoutPlansByCoach error', plansResponse.error);
        }
      }

      if (templatesResponse.error) {
        if (import.meta.env.DEV) {
          console.error('fetchTemplates error', templatesResponse.error);
        }
      }

      const planMap = new Map(remotePlans.map(p => [p.client_id, p]));
      const mappedUsers = remoteClients.map(c => mapClientToUser(c, planMap.get(c.id)));

      if (mappedUsers.length > 0) {
        setUsers(mappedUsers);
        // Cache in localStorage as backup
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify({ users: mappedUsers, templates: remoteTemplates || [] }));
        } catch (e) {
          if (import.meta.env.DEV) console.warn('Failed to backup to localStorage', e);
        }
      } else {
        const legacyUsersResponse = await fetchUsersRemote(coachId);
        const legacyUsers = legacyUsersResponse.data || [];
        if (legacyUsers.length > 0) {
          const migrated = legacyUsers.map(u => migrateUser(u));
          setUsers(migrated);
          try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify({ users: migrated, templates: remoteTemplates || [] }));
          } catch (e) {
            if (import.meta.env.DEV) console.warn('Failed to backup to localStorage', e);
          }
        } else {
          const localUsers = getInitialUsers();
          const localTemplates = getInitialTemplates();
          setUsers(localUsers);
          setTemplates(localTemplates);
        }
      }

      if (remoteTemplates.length > 0) {
        setTemplates(remoteTemplates);
      } else {
        const localTemplates = getInitialTemplates();
        setTemplates(localTemplates);
      }
    } catch (e) {
      if (import.meta.env.DEV) console.error('Supabase fetch error, falling back to localStorage', e);
      const localUsers = getInitialUsers();
      const localTemplates = getInitialTemplates();
      if (localUsers.length > 0 || localTemplates.length > 0) {
        setUsers(localUsers);
        setTemplates(localTemplates);
        toast.error('خطا در اتصال به سرور. از داده‌های محلی استفاده می‌شود.');
      }
    }
  }, [auth?.user?.id, getInitialUsers, getInitialTemplates]);

  // Load data on mount and when auth changes
  useEffect(() => {
    if (!isSupabaseReady) {
      return;
    }
    const timer = setTimeout(() => {
    refreshData();
    }, 0);
    return () => clearTimeout(timer);
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

  // Save to localStorage (only if Supabase is not ready, and after first render)
  useEffect(() => {
    if (isSupabaseReady) return;
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    const timeoutId = setTimeout(() => {
      try {
        const data = JSON.stringify({ users, templates });
        localStorage.setItem(STORAGE_KEY, data);
      } catch (e) {
        console.error('خطا در ذخیره داده‌ها:', e);
      }
    }, 500);

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

  const syncUserToSupabase = useCallback(
    (user: User) => {
      if (!isSupabaseReady) return;
      const coachId = auth?.user?.id;
      if (!coachId) return;
      const clientPayload = clientPayloadFromUser(user, coachId);
      const planPayload = workoutPlanPayloadFromUser(user, coachId);
      
      // Type assertions for required fields
      if (clientPayload.id && clientPayload.coach_id) {
        upsertClient(clientPayload as Partial<Client> & { id: string; coach_id: string }).catch(err => {
          if (import.meta.env.DEV) console.error('supabase client upsert', err);
        });
      }
      
      if (planPayload.id && planPayload.coach_id && planPayload.client_id && planPayload.plan_data) {
        upsertWorkoutPlan(planPayload as Partial<WorkoutPlanFromDB> & { 
          id: string; 
          coach_id: string; 
          client_id: string; 
          plan_data: UserPlans 
        }).catch(err => {
          if (import.meta.env.DEV) console.error('supabase plan upsert', err);
        });
      }
      
      upsertUserRemote({ ...user, coach_id: coachId }).catch(err => {
        if (import.meta.env.DEV) console.error('supabase user upsert', err);
      });
    },
    [auth?.user?.id]
  );

  const saveUser = useCallback(
    (userData: UserInput) => {
      if (!hasPermission('manageUsers', userData.id ?? null)) {
        toast.error('دسترسی مربی لازم است');
        return;
      }
      const userId = userData.id ?? Date.now();
      const newUser = migrateUser({ ...userData, id: userId });

      setUsers(prev => {
        const idx = prev.findIndex(u => u.id === newUser.id);
        if (idx > -1) {
          const updated = [...prev];
          updated[idx] = { ...prev[idx], ...newUser };
          return updated;
        }
        return [...prev, newUser];
      });

      syncUserToSupabase(newUser);
      toast.success('اطلاعات با موفقیت ذخیره شد');
    },
    [hasPermission, syncUserToSupabase]
  );

  const updateActiveUser = useCallback(
    (u: User) => {
      setUsers(prev => prev.map(user => (user.id === u.id ? u : user)));
      syncUserToSupabase(u);
    },
    [syncUserToSupabase]
  );

  const deleteUser = useCallback(
    (id: UserId) => {
      if (!hasPermission('manageUsers', id)) {
        toast.error('دسترسی مربی لازم است');
        return;
      }
      Swal.fire({
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
      }).then((result) => {
        if (result.isConfirmed) {
          setUsers(prev => prev.filter(u => u.id !== id));
          if (isSupabaseReady) {
            const coachId = auth?.user?.id;
            const planId = planIdForClient(String(id));
            Promise.all([
              deleteWorkoutPlan(planId),
              deleteClient(String(id)),
              removeUserRemote(id, coachId)
            ]).then(([planRes, clientRes, userRes]) => {
              if (planRes.error && import.meta.env.DEV) {
                console.error('supabase delete plan', planRes.error);
              }
              if (clientRes.error && import.meta.env.DEV) {
                console.error('supabase delete client', clientRes.error);
              }
              if (userRes.error && import.meta.env.DEV) {
                console.error('supabase delete user', userRes.error);
              }
            });
          }
          if (activeUserId === id) setActiveUserId(null);
          Swal.fire({
            title: 'حذف شد!',
            icon: 'success',
            timer: 1500,
            showConfirmButton: false,
            background: theme === 'dark' ? '#1e293b' : '#fff',
            color: theme === 'dark' ? '#fff' : '#000'
          });
        }
      });
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
      if (isSupabaseReady) {
        const coachId = auth?.user?.id;
        upsertTemplateRemote({ ...newTemplate, coach_id: coachId }).then(response => {
          if (response.error && import.meta.env.DEV) {
            console.error('supabase upsert template', response.error);
          }
        });
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
      if (isSupabaseReady) {
        const coachId = auth?.user?.id;
        removeTemplateRemote(id, coachId).then(response => {
          if (response.error && import.meta.env.DEV) {
            console.error('supabase delete template', response.error);
          }
        });
      }
      toast.success('الگو حذف شد');
    },
    [hasPermission, auth?.user?.id]
  );

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
    const data = JSON.stringify({ users, templates }, null, 2);
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

  // Clear data on logout
  useEffect(() => {
    if (auth?.user) return;
    const timer = setTimeout(() => {
      setUsers([]);
      setTemplates([]);
      setActiveUserId(null);
    }, 0);
    return () => clearTimeout(timer);
  }, [auth?.user]);

  return (
    <DataContext.Provider
      value={{
        users,
        activeUser,
        templates,
        currentRole,
        currentAccountId,
        setCurrentRole,
        setCurrentAccountId,
        setActiveUserId,
        hasPermission,
        saveUser,
        deleteUser,
        updateActiveUser,
        saveTemplate,
        deleteTemplate,
        logoutUser,
        resetSystem,
        backupData,
        restoreData,
        refreshData
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

