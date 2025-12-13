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
  deleteWorkoutPlan,
  fetchRequestsByCoach,
  updateRequestStatus,
  deleteProgramRequest
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

  const [users, setUsers] = useState<User[]>(() => getInitialUsers());
  const [templates, setTemplates] = useState<Template[]>(() => getInitialTemplates());
  const [requests, setRequests] = useState<ProgramRequest[]>([]);
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

  // Fetch data from Supabase (single source of truth)
  const refreshData = useCallback(async () => {
    if (!auth?.user?.id) {
      setUsers(getInitialUsers());
      setTemplates(getInitialTemplates());
      setRequests([]);
      return;
    }

    if (!isSupabaseReady) {
      setUsers(getInitialUsers());
      setTemplates(getInitialTemplates());
      setRequests([]);
      return;
    }

    const coachId = auth.user.id;

    try {
      const [clientsResponse, plansResponse, templatesResponse, requestsResponse] = await Promise.all([
        fetchClientsByCoach(coachId),
        fetchWorkoutPlansByCoach(coachId),
        fetchTemplatesRemote(coachId),
        fetchRequestsByCoach(coachId)
      ]);

      // Handle errors gracefully
      if (clientsResponse.error) {
        console.error('Failed to fetch clients:', clientsResponse.error);
      }
      if (plansResponse.error) {
        console.error('Failed to fetch workout plans:', plansResponse.error);
      }
      if (templatesResponse.error) {
        console.error('Failed to fetch templates:', templatesResponse.error);
      }
      if (requestsResponse.error) {
        console.error('Failed to fetch requests:', requestsResponse.error);
      }

      // Process data
      const remoteClients = clientsResponse.data || [];
      const remotePlans = plansResponse.data || [];
      const remoteTemplates = templatesResponse.data || [];
      const remoteRequests = requestsResponse.data || [];

      // Map clients to users with their plans
      const planMap = new Map(remotePlans.map(p => [p.client_id, p]));
      const mappedUsers = remoteClients.map(c => mapClientToUser(c, planMap.get(c.id)));

      // Update state
      setUsers(mappedUsers);
      setTemplates(remoteTemplates);
      setRequests(remoteRequests);

      // Cache successful data for offline mode (optional enhancement)
      try {
        const cacheData = {
          users: mappedUsers,
          templates: remoteTemplates,
          requests: remoteRequests,
          timestamp: Date.now()
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(cacheData));
      } catch (e) {
        console.warn('Failed to cache data:', e);
      }

    } catch (error) {
      console.error('Critical error fetching data from Supabase:', error);
      toast.error('خطا در بارگذاری داده‌ها از سرور');

      // Attempt to load from cache as last resort
      try {
        const cached = localStorage.getItem(STORAGE_KEY);
        if (cached) {
          const parsed = JSON.parse(cached);
          if (parsed.users) setUsers(parsed.users.map(migrateUser));
          if (parsed.templates) setTemplates(parsed.templates);
          if (parsed.requests) setRequests(parsed.requests);
          toast.warning('داده‌های ذخیره‌شده محلی بارگذاری شد');
        }
      } catch (cacheError) {
        console.error('Failed to load cached data:', cacheError);
      }
    }
  }, [auth?.user?.id]);

  // Load data when Supabase is ready and user is authenticated
  useEffect(() => {
    if (isSupabaseReady && auth?.user?.id) {
      refreshData();
    } else {
      // Clear data when offline or not authenticated
      setUsers([]);
      setTemplates([]);
      setRequests([]);
    }
  }, [isSupabaseReady, auth?.user?.id, refreshData]);

  // Save role and account ID to localStorage
  useEffect(() => {
    localStorage.setItem(ROLE_KEY, currentRole);
    if (currentAccountId != null) {
      localStorage.setItem(ACCOUNT_KEY, String(currentAccountId));
    } else {
      localStorage.removeItem(ACCOUNT_KEY);
    }
  }, [currentRole, currentAccountId]);

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
  }, [users, templates, isSupabaseReady]);

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
    async (userData: UserInput) => {
      // #region agent log
      fetch('http://127.0.0.1:7243/ingest/ec06820d-8d44-4cc6-8efe-2fb418aa5d14', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId: 'debug-session',
          runId: 'run1',
          hypothesisId: 'H1',
          location: 'DataContext.tsx:saveUser:start',
          message: 'saveUser called',
          data: {
            userId: userData.id ?? null,
            coachId: auth?.user?.id ?? null,
            hasPermission: hasPermission('manageUsers', userData.id ?? null)
          },
          timestamp: Date.now()
        })
      }).catch(() => {});
      // #endregion

      if (!hasPermission('manageUsers', userData.id ?? null)) {
        toast.error('دسترسی مربی لازم است');
        return;
      }

      if (!auth?.user?.id) {
        toast.error('اتصال به حساب کاربری برقرار نیست');
        return;
      }

      try {
        const coachId = auth.user.id;
        const userId = userData.id ?? makeId();
        const newUser = migrateUser({ ...userData, id: userId });

        // Update local state first for better UX
        setUsers(prev => {
          const idx = prev.findIndex(u => u.id === newUser.id);
          if (idx > -1) {
            const updated = [...prev];
            updated[idx] = newUser;
            return updated;
          }
          return [...prev, newUser];
        });

        if (isSupabaseReady) {
          const clientPayload = clientPayloadFromUser(newUser, coachId);
          const workoutPayload = workoutPlanPayloadFromUser(newUser, coachId);

          const results = await Promise.allSettled([
            upsertClient(clientPayload as Client),
            upsertWorkoutPlan(workoutPayload as WorkoutPlanFromDB)
          ]);

          // Check for errors and log them, but don't revert local state
          results.forEach((result, index) => {
            if (result.status === 'rejected') {
              console.error(`Failed to save ${index === 0 ? 'client' : 'workout plan'}:`, result.reason);
            }
          });
        }

        // #region agent log
        fetch('http://127.0.0.1:7243/ingest/ec06820d-8d44-4cc6-8efe-2fb418aa5d14', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            sessionId: 'debug-session',
            runId: 'run1',
            hypothesisId: 'H1',
            location: 'DataContext.tsx:saveUser:afterSupabase',
            message: 'saveUser after supabase ops',
            data: {
              usersCount: users.length + 1,
              supabaseReady: isSupabaseReady
            },
            timestamp: Date.now()
          })
        }).catch(() => {});
        // #endregion

        toast.success('اطلاعات با موفقیت ذخیره شد');
      } catch (error) {
        console.error('Failed to save user:', error);
        toast.error('خطا در ذخیره اطلاعات');
        // Revert local state on critical error
        setUsers(prev => prev.filter(u => u.id !== userData.id));
      }
    },
    [hasPermission, auth?.user?.id, isSupabaseReady, users.length]
  );

  const updateActiveUser = useCallback(
    (u: User) => {
      setUsers(prev => prev.map(user => (user.id === u.id ? u : user)));
      syncUserToSupabase(u);
    },
    [syncUserToSupabase]
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

          // Delete from Supabase
          if (isSupabaseReady && auth?.user?.id) {
            const coachId = auth.user.id;
            const planId = planIdForClient(String(id));

            const [planRes, clientRes] = await Promise.all([
              deleteWorkoutPlan(planId),
              deleteClient(String(id))
            ]);

            if (planRes.error) {
              console.error('Failed to delete workout plan:', planRes.error);
            }
            if (clientRes.error) {
              console.error('Failed to delete client:', clientRes.error);
            }

            toast.success('شاگرد با موفقیت حذف شد');
          }
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

  const acceptRequest = useCallback(async (req: ProgramRequest) => {
    if (!auth?.user?.id) return;

    try {
      // Update request status
      const res = await updateRequestStatus(req.id, 'accepted', undefined, req);
      if (res.error) {
        toast.error('خطا در تأیید درخواست (سرور)');
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

        // Save to Supabase
        await saveUser(newUserData);

        // Update client and profile tables
        if (isSupabaseReady) {
          await upsertClient({
            id: req.client_id,
            coach_id: auth.user.id,
            full_name: clientName,
            profile_data: newUserData,
            profile_completed: true
          }).catch(err => {
            if (import.meta.env.DEV) console.warn('upsertClient error', err);
          });

          const { supabase } = await import('../lib/supabaseClient');
          await supabase
            .from('profiles')
            .upsert({
              id: req.client_id,
              coach_id: auth.user.id,
              updated_at: new Date().toISOString()
            }, { onConflict: 'id' })
            .catch(err => {
              if (import.meta.env.DEV) console.warn('update client profile coach_id error', err);
            });
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
      const res = await updateRequestStatus(req.id, 'rejected', undefined, req);
      if (res.error) {
        toast.error('خطا در رد درخواست (سرور)');
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
      const res = await deleteProgramRequest(requestId);
      if (res.error) {
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
        requests,
        activeUser,
        activeUserId,
        templates,
        currentRole,
        currentAccountId,
        setCurrentRole,
        setCurrentAccountId,
        setActiveUserId,
        hasPermission,
        saveUser,
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

